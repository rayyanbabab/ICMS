import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SystemService } from './system.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@icms/shared';

@ApiTags('System Architecture & Telemetry')
@Controller('system')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('permissions')
  @ApiOperation({ summary: 'Get RBAC role and permissions matrix' })
  async getRolePermissions() {
    return this.systemService.getRolePermissions();
  }

  @Get('audit-logs')
  @Roles(UserRole.SUPER_ADMIN, UserRole.RECTOR)
  @ApiOperation({ summary: 'Get security and transaction audit logs' })
  async getAuditLogs(@Query('limit') limit?: number) {
    return this.systemService.getAuditLogs({ limit: limit ? Number(limit) : undefined });
  }

  @Get('settings')
  @Roles(UserRole.SUPER_ADMIN, UserRole.RECTOR)
  @ApiOperation({ summary: 'Get institution profiles and system configurations' })
  async getSystemSettings() {
    return this.systemService.getSystemSettings();
  }

  @Get('backup')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get database backup status and snapshot list' })
  async getBackupStatus() {
    return this.systemService.getBackupStatus();
  }

  @Post('backup/create')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Trigger manual database backup snapshot' })
  async triggerBackup() {
    return this.systemService.triggerBackup();
  }
}

