import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@icms/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Campus Finance & Invoicing')
@Controller('finance')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('my-invoices')
  @ApiOperation({ summary: "Get authenticated student's invoices and payment histories" })
  async getStudentInvoices(@CurrentUser('sub') userId: string) {
    return this.financeService.getStudentInvoices(userId);
  }

  @Get('invoices')
  @Roles(UserRole.FINANCE_ADMIN, UserRole.SUPER_ADMIN, UserRole.RECTOR, UserRole.VICE_RECTOR)
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
  @Roles(UserRole.FINANCE_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create new student invoice with line items (Finance Admin)' })
  async createInvoice(
    @Body() body: { studentId: string; semesterId: string; title: string; dueDate: string; items: { name: string; amount: number }[] },
  ) {
    return this.financeService.createInvoice(body);
  }
}

