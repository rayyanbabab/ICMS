import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Organization')
@Controller('organization')
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  @Get('hierarchy')
  @ApiOperation({ summary: 'Get university structure, faculties, and active academic year' })
  @SwaggerResponse({ status: 200, description: 'Organization hierarchy retrieved' })
  async getHierarchy() {
    return this.orgService.getHierarchy();
  }

  @Get('faculties')
  @ApiOperation({ summary: 'List all faculties and their study programs' })
  @SwaggerResponse({ status: 200, description: 'Faculties retrieved' })
  async getFaculties() {
    return this.orgService.getFaculties();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get live real-time counts from database' })
  @SwaggerResponse({ status: 200, description: 'Statistics retrieved' })
  async getStats() {
    return this.orgService.getStats();
  }
}

