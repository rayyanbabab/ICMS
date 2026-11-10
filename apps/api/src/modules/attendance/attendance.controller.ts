import { Controller, Get, Post, Body, Param, Headers, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Attendance')
@Controller('attendance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('today')
  @ApiOperation({ summary: 'Get active attendance sessions for today' })
  async getTodaySessions(
    @CurrentUser('sub') userId: string,
    @Headers('x-active-role') activeRole?: string,
  ) {
    return this.attendanceService.getTodaySessions(userId, activeRole);
  }

  @Post('classes/:classId/start')
  @ApiOperation({ summary: 'Start a new attendance session with QR token' })
  async startSession(
    @CurrentUser('sub') userId: string,
    @Param('classId') classId: string,
    @Body('topic') topic?: string,
    @Headers('x-active-role') activeRole?: string,
  ) {
    return this.attendanceService.startSession(classId, userId, topic, activeRole);
  }

  @Post('check-in')
  @ApiOperation({ summary: 'Student check-in using QR code or token' })
  async checkIn(
    @CurrentUser('sub') userId: string,
    @Body('qrToken') qrToken: string,
    @Body('latitude') latitude?: number,
    @Body('longitude') longitude?: number,
    @Headers('x-active-role') activeRole?: string,
  ) {
    return this.attendanceService.checkIn(qrToken, userId, latitude, longitude, activeRole);
  }
}
