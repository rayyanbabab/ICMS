import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AcademicService } from './academic.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Academic Core')
@Controller('academic')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  @Get('courses')
  @ApiOperation({ summary: 'Get list of curriculum courses and prerequisites' })
  async getCourses() {
    return this.academicService.getCourses();
  }

  @Get('offerings')
  @ApiOperation({ summary: 'Get course offerings with classes, lecturers, and schedules' })
  async getOfferings(@Query('semesterId') semesterId?: string) {
    return this.academicService.getOfferings(semesterId);
  }

  @Get('krs/student')
  @ApiOperation({ summary: "Get authenticated student's KRS for active semester" })
  async getStudentKrs(@CurrentUser('sub') userId: string) {
    return this.academicService.getStudentKrs(userId);
  }

  @Post('krs/enroll')
  @ApiOperation({ summary: 'Enroll and submit KRS with selected class IDs' })
  async enrollKrs(
    @CurrentUser('sub') userId: string,
    @Body('classIds') classIds: string[],
  ) {
    return this.academicService.enrollKrs(userId, classIds);
  }

  @Get('krs/submissions')
  @ApiOperation({ summary: 'Get KRS approval queue for Academic Advisor or Admin' })
  async getKrsSubmissions(@CurrentUser('sub') userId: string) {
    return this.academicService.getKrsSubmissions(userId);
  }

  @Post('krs/:id/approve')
  @ApiOperation({ summary: 'Approve or reject student KRS submission' })
  async approveKrs(
    @Param('id') registrationId: string,
    @CurrentUser('sub') userId: string,
    @Body('isApproved') isApproved: boolean,
    @Body('note') note?: string,
  ) {
    return this.academicService.approveKrs(registrationId, userId, isApproved, note);
  }

  @Get('khs/student')
  @ApiOperation({ summary: "Get student's semester grades, IPS, IPK, and official transcript" })
  async getStudentKhs(@CurrentUser('sub') userId: string) {
    return this.academicService.getStudentKhs(userId);
  }
}
