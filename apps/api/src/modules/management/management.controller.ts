import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ManagementService } from './management.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Campus Management & Strategic Operations')
@Controller('management')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ManagementController {
  constructor(private readonly managementService: ManagementService) {}

  @Get('facilities')
  @ApiOperation({ summary: 'Get smart campus facilities, laboratories, and room availability' })
  async getFacilities() {
    return this.managementService.getFacilities();
  }

  @Post('facilities/:id/book')
  @ApiOperation({ summary: 'Book campus room or facility' })
  async bookFacility(
    @CurrentUser('sub') userId: string,
    @Param('id') facilityId: string,
    @Body() body: { eventName: string; date: string; startTime: string; endTime: string },
  ) {
    return this.managementService.bookFacility(userId, facilityId, body);
  }

  @Get('research')
  @ApiOperation({ summary: 'Get LPPM research proposals, grants, and Scopus publications' })
  async getResearchLPPM() {
    return this.managementService.getResearchLPPM();
  }

  @Get('student-affairs')
  @ApiOperation({ summary: 'Get student affairs, scholarships, and competition achievements' })
  async getStudentAffairs() {
    return this.managementService.getStudentAffairs();
  }

  @Get('career')
  @ApiOperation({ summary: 'Get industry vacancies, certified internships, and MBKM conversion' })
  async getCareerAndInternships() {
    return this.managementService.getCareerAndInternships();
  }

  @Get('hr')
  @ApiOperation({ summary: 'Get human resources, lecturers directory, and BKD compliance' })
  async getHumanResources() {
    return this.managementService.getHumanResources();
  }

  @Get('alumni')
  @ApiOperation({ summary: 'Get alumni directory and graduate tracer study statistics' })
  async getAlumniTracer() {
    return this.managementService.getAlumniTracer();
  }
}

