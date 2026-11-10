import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LmsService } from './lms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('LMS Digital Classroom')
@Controller('lms')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class LmsController {
  constructor(private readonly lmsService: LmsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get current user LMS overview (courses, materials, deadlines, grading queue)' })
  async getOverview(@CurrentUser('sub') userId: string) {
    return this.lmsService.getOverview(userId);
  }

  @Post('classes/:classId/materials')
  @ApiOperation({ summary: 'Upload or add new lecture material (Lecturer / Admin)' })
  async createMaterial(
    @CurrentUser('sub') userId: string,
    @Param('classId') classId: string,
    @Body() body: { title: string; description?: string; fileUrl: string; fileType: string; fileSize?: number; order?: number },
  ) {
    return this.lmsService.createMaterial(userId, classId, body);
  }

  @Post('classes/:classId/assignments')
  @ApiOperation({ summary: 'Create new assignment with deadline and max score' })
  async createAssignment(
    @CurrentUser('sub') userId: string,
    @Param('classId') classId: string,
    @Body() body: { title: string; description: string; dueDate: string; maxScore?: number; attachmentUrl?: string },
  ) {
    return this.lmsService.createAssignment(userId, classId, body);
  }

  @Post('assignments/:assignmentId/submit')
  @ApiOperation({ summary: 'Student submit homework / assignment file' })
  async submitAssignment(
    @CurrentUser('sub') userId: string,
    @Param('assignmentId') assignmentId: string,
    @Body() body: { fileUrl: string },
  ) {
    return this.lmsService.submitAssignment(userId, assignmentId, body);
  }

  @Post('submissions/:submissionId/grade')
  @ApiOperation({ summary: 'Lecturer grade assignment submission with score and feedback' })
  async gradeSubmission(
    @CurrentUser('sub') userId: string,
    @Param('submissionId') submissionId: string,
    @Body() body: { score: number; feedback?: string },
  ) {
    return this.lmsService.gradeSubmission(userId, submissionId, body);
  }
}
