import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Attendance')
@Controller('attendance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('sessions/today')
  @ApiOperation({ summary: "Get today's attendance sessions for student or lecturer" })
  async getTodaySessions(@CurrentUser('sub') userId: string) {
    return this.attendanceService.getTodaySessions(userId);
  }

  @Post('sessions/start')
  @ApiOperation({ summary: 'Lecturer starts a new attendance session with QR token' })
  async startSession(
    @CurrentUser('sub') userId: string,
    @Body('classId') classId: string,
    @Body('topic') topic?: string,
  ) {
    return this.attendanceService.startSession(classId, userId, topic);
  }

  @Post('check-in')
  @ApiOperation({ summary: 'Student checks in via QR token or geolocation' })
  async checkIn(
    @CurrentUser('sub') userId: string,
    @Body('qrToken') qrToken: string,
    @Body('latitude') latitude?: number,
    @Body('longitude') longitude?: number,
  ) {
    return this.attendanceService.checkIn(qrToken, userId, latitude, longitude);
  }

  @Get('history')
  @ApiOperation({ summary: "Get student's attendance history and percentage" })
  async getHistory(@CurrentUser('sub') userId: string) {
    return this.attendanceService.getAttendanceHistory(userId);
  }
}
