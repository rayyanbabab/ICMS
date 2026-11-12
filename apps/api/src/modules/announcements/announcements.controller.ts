import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnnouncementsService } from './announcements.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@icms/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Campus Announcements')
@Controller('announcements')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  @ApiOperation({ summary: 'Get official campus announcements with category & search filter' })
  async findAll(@Query('category') category?: string, @Query('search') search?: string) {
    return this.announcementsService.findAll({ category, search });
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.RECTOR, UserRole.ACADEMIC_ADMIN, UserRole.STUDENT_AFFAIRS_ADMIN)
  @ApiOperation({ summary: 'Publish new campus announcement (Admin / Staff)' })
  async create(
    @Body() body: { title: string; content: string; category: string; isPinned?: boolean; authorName: string },
  ) {
    return this.announcementsService.create(body);
  }
}

