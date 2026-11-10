import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class LibraryService {
  constructor(private readonly prisma: PrismaService) {}

  async getCategories() {
    return this.prisma.bookCategory.findMany({
      include: {
        _count: { select: { books: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getBooks(query?: { search?: string; categoryId?: string; isDigital?: boolean }) {
    const whereClause: any = {};
    if (query?.categoryId && query.categoryId !== 'ALL') {
      whereClause.categoryId = query.categoryId;
    }
    if (typeof query?.isDigital === 'boolean') {
      whereClause.isDigital = query.isDigital;
    }
    if (query?.search) {
      whereClause.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { author: { contains: query.search, mode: 'insensitive' } },
        { isbn: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const books = await this.prisma.book.findMany({
      where: whereClause,
      include: {
        category: true,
      },
      orderBy: { title: 'asc' },
    });

    const totalBooks = await this.prisma.book.count();
    const digitalBooks = await this.prisma.book.count({ where: { isDigital: true } });
    const availablePhysical = await this.prisma.book.aggregate({
      _sum: { availableStock: true },
    });

    return {
      stats: {
        totalTitles: totalBooks,
        digitalTitles: digitalBooks,
        availableStock: availablePhysical._sum.availableStock || 0,
      },
      books: books.map((b) => ({
        id: b.id,
        isbn: b.isbn,
        title: b.title,
        author: b.author,
        publisher: b.publisher,
        publishYear: b.publishYear,
        isDigital: b.isDigital,
        digitalUrl: b.digitalUrl,
        totalStock: b.totalStock,
        availableStock: b.availableStock,
        coverUrl: b.coverUrl,
        category: b.category.name,
      })),
    };
  }

  async getMyLoans(userId: string) {
    let member = await this.prisma.libraryMember.findUnique({
      where: { userId },
    });

    if (!member) {
      // Auto-register library member if not exists
      member = await this.prisma.libraryMember.create({
        data: {
          userId,
          memberCode: `LIB-${userId.slice(0, 8).toUpperCase()}`,
        },
      });
    }

    const loans = await this.prisma.bookLoan.findMany({
      where: { memberId: member.id },
      include: {
        book: {
          include: { category: true },
        },
      },
      orderBy: { borrowDate: 'desc' },
    });

    const activeLoans = loans.filter((l) => l.status === 'BORROWED');
    const returnedLoans = loans.filter((l) => l.status === 'RETURNED');

    return {
      memberCode: member.memberCode,
      activeLoansCount: activeLoans.length,
      returnedLoansCount: returnedLoans.length,
      loans: loans.map((l) => {
        const isOverdue = l.status === 'BORROWED' && new Date(l.dueDate) < new Date();
        return {
          id: l.id,
          bookId: l.book.id,
          title: l.book.title,
          author: l.book.author,
          category: l.book.category.name,
          coverUrl: l.book.coverUrl,
          isDigital: l.book.isDigital,
          digitalUrl: l.book.digitalUrl,
          borrowDate: l.borrowDate,
          dueDate: l.dueDate,
          returnDate: l.returnDate,
          penaltyFee: Number(l.penaltyFee),
          status: isOverdue ? 'OVERDUE' : l.status,
        };
      }),
    };
  }

  async borrowBook(userId: string, bookId: string) {
    let member = await this.prisma.libraryMember.findUnique({
      where: { userId },
    });

    if (!member) {
      member = await this.prisma.libraryMember.create({
        data: {
          userId,
          memberCode: `LIB-${userId.slice(0, 8).toUpperCase()}`,
        },
      });
    }

    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      throw new NotFoundException('Buku tidak ditemukan');
    }

    if (book.availableStock <= 0) {
      throw new BadRequestException('Stok buku sedang habis dipinjam pengguna lain');
    }

    // Check existing active loan for same book
    const existingLoan = await this.prisma.bookLoan.findFirst({
      where: {
        memberId: member.id,
        bookId,
        status: 'BORROWED',
      },
    });

    if (existingLoan) {
      throw new BadRequestException('Anda sedang meminjam buku ini');
    }

    // Decrease stock
    await this.prisma.book.update({
      where: { id: bookId },
      data: { availableStock: { decrement: 1 } },
    });

    // Create loan for 14 days
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const loan = await this.prisma.bookLoan.create({
      data: {
        bookId,
        memberId: member.id,
        borrowDate: new Date(),
        dueDate,
        status: 'BORROWED',
      },
      include: {
        book: true,
      },
    });

    return loan;
  }

  async returnBook(userId: string, loanId: string) {
    const loan = await this.prisma.bookLoan.findUnique({
      where: { id: loanId },
      include: { book: true },
    });

    if (!loan) {
      throw new NotFoundException('Data peminjaman tidak ditemukan');
    }

    if (loan.status === 'RETURNED') {
      throw new BadRequestException('Buku sudah dikembalikan sebelumnya');
    }

    // Calculate overdue fee (Rp 1.000 / day overdue)
    let penalty = 0;
    if (new Date() > new Date(loan.dueDate)) {
      const diffTime = Math.abs(new Date().getTime() - new Date(loan.dueDate).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      penalty = diffDays * 1000;
    }

    // Return book stock
    await this.prisma.book.update({
      where: { id: loan.bookId },
      data: { availableStock: { increment: 1 } },
    });

    const updated = await this.prisma.bookLoan.update({
      where: { id: loanId },
      data: {
        status: 'RETURNED',
        returnDate: new Date(),
        penaltyFee: penalty,
      },
    });

    return {
      message: 'Buku berhasil dikembalikan',
      penaltyFee: penalty,
      loan: updated,
    };
  }
}
