import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async getHierarchy() {
    const university = await this.prisma.university.findFirst({
      include: {
        campuses: true,
        faculties: {
          include: {
            studyPrograms: true,
          },
        },
      },
    });

    const activeSemester = await this.prisma.semester.findFirst({
      where: { isActive: true },
      include: {
        academicYear: true,
      },
    });

    return {
      university,
      activeSemester,
    };
  }

  async getFaculties() {
    return this.prisma.faculty.findMany({
      include: {
        studyPrograms: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async getStats() {
    const [totalUsers, totalStudents, totalLecturers, totalFaculties, totalPrograms] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.student.count(),
        this.prisma.lecturer.count(),
        this.prisma.faculty.count(),
        this.prisma.studyProgram.count(),
      ]);

    return {
      totalUsers,
      totalStudents,
      totalLecturers,
      totalFaculties,
      totalPrograms,
    };
  }
}

