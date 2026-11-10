import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Campus Finance & Invoicing')
@Controller('finance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('my-invoices')
  @ApiOperation({ summary: "Get authenticated student's invoices and payment histories" })
  async getStudentInvoices(@CurrentUser('sub') userId: string) {
    return this.financeService.getStudentInvoices(userId);
  }

  @Get('invoices')
  @ApiOperation({ summary: 'Get all student invoices and financial revenue aggregates (Admin & Leadership)' })
  async getAllInvoices(@Query() query: { status?: string; search?: string }) {
    return this.financeService.getAllInvoices(query);
  }

  @Post('invoices/:id/pay')
  @ApiOperation({ summary: 'Simulate/Process invoice payment via Virtual Account, QRIS, or Bank Transfer' })
  async payInvoice(
    @CurrentUser('sub') userId: string,
    @Param('id') invoiceId: string,
    @Body() body: { paymentMethod: string },
  ) {
    return this.financeService.payInvoice(userId, invoiceId, body);
  }

  @Post('invoices')
  @ApiOperation({ summary: 'Create new student invoice with line items (Finance Admin)' })
  async createInvoice(
    @Body() body: { studentId: string; semesterId: string; title: string; dueDate: string; items: { name: string; amount: number }[] },
  ) {
    return this.financeService.createInvoice(body);
  }
}

