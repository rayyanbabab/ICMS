import { Controller, Get, Post, Body, Param, Query, Headers, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AcademicService } from './academic.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@icms/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Academic Core')
@Controller('academic')
@UseGuards(JwtAuthGuard, RolesGuard)
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
  async getStudentKrs(
    @CurrentUser('sub') userId: string,
    @Headers('x-active-role') activeRole?: string,
  ) {
    return this.academicService.getStudentKrs(userId, activeRole);
  }

  @Post('krs/enroll')
  @ApiOperation({ summary: 'Enroll and submit KRS with selected class IDs' })
  async enrollKrs(
    @CurrentUser('sub') userId: string,
    @Body('classIds') classIds: string[],
    @Headers('x-active-role') activeRole?: string,
  ) {
    return this.academicService.enrollKrs(userId, classIds, activeRole);
  }

  @Get('krs/submissions')
  @Roles(UserRole.LECTURER, UserRole.ACADEMIC_ADMIN, UserRole.SUPER_ADMIN, UserRole.HEAD_OF_PROGRAM, UserRole.DEAN, UserRole.RECTOR)
  @ApiOperation({ summary: 'Get KRS approval queue for Academic Advisor or Admin' })
  async getKrsSubmissions(
    @CurrentUser('sub') userId: string,
    @Headers('x-active-role') activeRole?: string,
  ) {
    return this.academicService.getKrsSubmissions(userId, activeRole);
  }

  @Post('krs/:id/approve')
  @Roles(UserRole.LECTURER, UserRole.ACADEMIC_ADMIN, UserRole.SUPER_ADMIN, UserRole.HEAD_OF_PROGRAM)
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
  async getStudentKhs(
    @CurrentUser('sub') userId: string,
    @Headers('x-active-role') activeRole?: string,
  ) {
    return this.academicService.getStudentKhs(userId, activeRole);
  }

  @Post('khs/grade')
  @Roles(UserRole.LECTURER, UserRole.ACADEMIC_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update or input student course grade by Lecturer or Admin' })
  async updateStudentGrades(
    @Body() body: { detailId: string; scoreNumeric: number; gradeLetter: string; gradePoint: number },
  ) {
    return this.academicService.updateStudentGrades(
      body.detailId,
      body.scoreNumeric,
      body.gradeLetter,
      body.gradePoint,
    );
  }

  @Get('schedules')
  @ApiOperation({ summary: 'Get weekly class schedule for authenticated user (student or lecturer)' })
  async getWeeklySchedule(@CurrentUser('sub') userId: string) {
    return this.academicService.getWeeklySchedule(userId);
  }

  @Get('calendar')
  @ApiOperation({ summary: 'Get university academic calendar milestones and timeline' })
  async getAcademicCalendar() {
    return this.academicService.getAcademicCalendar();
  }

  @Get('exams')
  @ApiOperation({ summary: 'Get midterm and final exams with questions for CBT simulator' })
  async getExams(@CurrentUser('sub') userId: string) {
    return this.academicService.getExams(userId);
  }

  @Post('exams/:id/submit')
  @ApiOperation({ summary: 'Submit CBT exam answers and get instant evaluation score' })
  async submitExam(
    @CurrentUser('sub') userId: string,
    @Param('id') examId: string,
    @Body('answers') answers: Record<string, number>,
  ) {
    return this.academicService.submitExam(userId, examId, answers);
  }

  @Get('curricula')
  @ApiOperation({ summary: 'Get list of OBE curricula and Capaian Pembelajaran' })
  async getCurricula() {
    return this.academicService.getCurricula();
  }

  @Get('letters')
  @ApiOperation({ summary: 'Get student official administrative letters and verifications' })
  async getAdministrationLetters(
    @CurrentUser('sub') userId: string,
    @Headers('x-active-role') activeRole?: string,
  ) {
    return this.academicService.getAdministrationLetters(userId, activeRole);
  }

  @Post('letters/request')
  @ApiOperation({ summary: 'Request official student letter (Aktif Kuliah, Izin Riset, Magang)' })
  async requestLetter(
    @CurrentUser('sub') userId: string,
    @Body() body: { type: string; purpose: string; recipientAgency?: string },
    @Headers('x-active-role') activeRole?: string,
  ) {
    return this.academicService.requestLetter(userId, body, activeRole);
  }

  @Post('letters/:id/approve')
  @ApiOperation({ summary: 'BAAK or Admin approve student official letter' })
  async approveLetter(
    @Param('id') letterId: string,
    @Body('isApproved') isApproved: boolean,
  ) {
    return this.academicService.approveLetter(letterId, isApproved);
  }
}
