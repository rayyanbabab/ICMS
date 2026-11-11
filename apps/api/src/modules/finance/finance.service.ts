import { Injectable, NotFoundException, BadRequestException, Optional } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { EventsGateway } from '../realtime/events.gateway';

@Injectable()
export class FinanceService {
  constructor(
    private readonly prisma: PrismaService,
    @Optional() private readonly eventsGateway?: EventsGateway,
  ) {}

  async getStudentInvoices(userId: string) {
    let student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        studyProgram: {
          select: { name: true, degreeLevel: true },
        },
      },
    });

    if (!student) {
      student = await this.prisma.student.findFirst({
        include: {
          studyProgram: {
            select: { name: true, degreeLevel: true },
          },
        },
      });
    }

    if (!student) {
      throw new NotFoundException('Data mahasiswa tidak ditemukan');
    }

    const invoices = await this.prisma.studentInvoice.findMany({
      where: { studentId: student.id },
      include: {
        semester: { select: { name: true, code: true } },
        items: true,
        payments: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalBilled = invoices.reduce((acc, inv) => acc + Number(inv.amount), 0);
    const totalPaid = invoices.reduce((acc, inv) => acc + Number(inv.paidAmount), 0);
    const totalOutstanding = totalBilled - totalPaid;

    return {
      student: {
        id: student.id,
        nim: student.nim,
        studyProgram: `${student.studyProgram.degreeLevel} ${student.studyProgram.name}`,
      },
      summary: {
        totalBilled,
        totalPaid,
        totalOutstanding,
        hasUnpaidInvoices: totalOutstanding > 0,
      },
      invoices: invoices.map((inv) => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        title: inv.title,
        amount: Number(inv.amount),
        paidAmount: Number(inv.paidAmount),
        status: inv.status,
        dueDate: inv.dueDate,
        paidAt: inv.paidAt,
        semesterName: inv.semester.name,
        items: inv.items.map((i) => ({
          id: i.id,
          name: i.name,
          amount: Number(i.amount),
        })),
        payments: inv.payments.map((p) => ({
          id: p.id,
          paymentMethod: p.paymentMethod,
          referenceNo: p.referenceNo,
          amount: Number(p.amount),
          status: p.status,
          paidAt: p.paidAt,
        })),
      })),
    };
  }

  async getAllInvoices(query?: { status?: string; search?: string }) {
    const whereClause: any = {};
    if (query?.status && query.status !== 'ALL') {
      whereClause.status = query.status;
    }
    if (query?.search) {
      whereClause.OR = [
        { invoiceNumber: { contains: query.search, mode: 'insensitive' } },
        { title: { contains: query.search, mode: 'insensitive' } },
        { student: { nim: { contains: query.search, mode: 'insensitive' } } },
        { student: { user: { fullName: { contains: query.search, mode: 'insensitive' } } } },
      ];
    }

    const invoices = await this.prisma.studentInvoice.findMany({
      where: whereClause,
      include: {
        student: {
          include: {
            user: { select: { fullName: true, email: true } },
            studyProgram: { select: { name: true, degreeLevel: true } },
          },
        },
        semester: { select: { name: true, code: true } },
        items: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Aggregates
    const allInvoices = await this.prisma.studentInvoice.findMany({
      select: { amount: true, paidAmount: true, status: true },
    });

    const totalRevenueTarget = allInvoices.reduce((acc, i) => acc + Number(i.amount), 0);
    const totalCollected = allInvoices.reduce((acc, i) => acc + Number(i.paidAmount), 0);
    const totalPaidCount = allInvoices.filter((i) => i.status === 'PAID').length;
    const totalUnpaidCount = allInvoices.filter((i) => i.status === 'UNPAID').length;

    return {
      stats: {
        totalRevenueTarget,
        totalCollected,
        totalOutstanding: totalRevenueTarget - totalCollected,
        collectionRate: totalRevenueTarget > 0 ? Math.round((totalCollected / totalRevenueTarget) * 100) : 0,
        totalPaidCount,
        totalUnpaidCount,
      },
      invoices: invoices.map((inv) => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        title: inv.title,
        amount: Number(inv.amount),
        paidAmount: Number(inv.paidAmount),
        status: inv.status,
        dueDate: inv.dueDate,
        paidAt: inv.paidAt,
        studentName: inv.student.user.fullName,
        studentNim: inv.student.nim,
        studyProgram: `${inv.student.studyProgram.degreeLevel} ${inv.student.studyProgram.name}`,
        semesterName: inv.semester.name,
        itemsCount: inv.items.length,
      })),
    };
  }

  async payInvoice(userId: string, invoiceId: string, data: { paymentMethod: string }) {
    const invoice = await this.prisma.studentInvoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new NotFoundException('Tagihan tidak ditemukan');
    }

    if (invoice.status === 'PAID') {
      throw new BadRequestException('Tagihan ini sudah lunas');
    }

    const refNo = `PAY-${data.paymentMethod || 'VA'}-${Date.now().toString().slice(-8)}`;

    // Create payment entry
    await this.prisma.payment.create({
      data: {
        invoiceId,
        paymentMethod: data.paymentMethod || 'VIRTUAL_ACCOUNT',
        referenceNo: refNo,
        amount: invoice.amount,
        status: 'SUCCESS',
        isVerified: true,
        paidAt: new Date(),
      },
    });

    // Update invoice status to PAID
    const updatedInvoice = await this.prisma.studentInvoice.update({
      where: { id: invoiceId },
      data: {
        status: 'PAID',
        paidAmount: invoice.amount,
        paidAt: new Date(),
      },
      include: {
        items: true,
        payments: true,
      },
    });

    // Real-time notification broadcast via WebSockets
    if (this.eventsGateway) {
      this.eventsGateway.broadcastNotification({
        id: `notif-pay-${Date.now()}`,
        title: 'Pembayaran UKT Berhasil',
        message: `Tagihan ${updatedInvoice.invoiceNumber} (${updatedInvoice.title}) sebesar Rp ${Number(updatedInvoice.amount).toLocaleString('id-ID')} telah berhasil dilunasi.`,
        category: 'KEUANGAN',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        link: '/operasional/keuangan',
      });
    }

    return {
      message: 'Pembayaran berhasil diproses dan diverifikasi secara otomatis',
      invoice: updatedInvoice,
      referenceNo: refNo,
    };
  }

  async createInvoice(data: { studentId: string; semesterId: string; title: string; dueDate: string; items: { name: string; amount: number }[] }) {
    const totalAmount = data.items.reduce((acc, it) => acc + it.amount, 0);
    const invoiceNum = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const invoice = await this.prisma.studentInvoice.create({
      data: {
        studentId: data.studentId,
        semesterId: data.semesterId,
        invoiceNumber: invoiceNum,
        title: data.title,
        amount: totalAmount,
        paidAmount: 0,
        status: 'UNPAID',
        dueDate: new Date(data.dueDate),
        items: {
          create: data.items.map((i) => ({
            name: i.name,
            amount: i.amount,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return invoice;
  }
}

