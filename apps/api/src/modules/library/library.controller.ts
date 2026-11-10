import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LibraryService } from './library.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Digital Library')
@Controller('library')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Get all library book categories with book counts' })
  async getCategories() {
    return this.libraryService.getCategories();
  }

  @Get('books')
  @ApiOperation({ summary: 'Search and filter library book catalog' })
  async getBooks(
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('isDigital') isDigital?: string,
  ) {
    const isDig = isDigital === 'true' ? true : isDigital === 'false' ? false : undefined;
    return this.libraryService.getBooks({ search, categoryId, isDigital: isDig });
  }

  @Get('my-loans')
  @ApiOperation({ summary: "Get current user's active and returned book loans" })
  async getMyLoans(@CurrentUser('sub') userId: string) {
    return this.libraryService.getMyLoans(userId);
  }

  @Post('books/:id/borrow')
  @ApiOperation({ summary: 'Borrow a physical or digital library book' })
  async borrowBook(
    @CurrentUser('sub') userId: string,
    @Param('id') bookId: string,
  ) {
    return this.libraryService.borrowBook(userId, bookId);
  }

  @Post('loans/:id/return')
  @ApiOperation({ summary: 'Return a borrowed book and compute penalties if any' })
  async returnBook(
    @CurrentUser('sub') userId: string,
    @Param('id') loanId: string,
  ) {
    return this.libraryService.returnBook(userId, loanId);
  }
}

