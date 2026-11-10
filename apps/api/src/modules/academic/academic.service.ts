import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AcademicService {
  constructor(private readonly prisma: PrismaService) {}

  async getCourses() {
    return this.prisma.course.findMany({
      include: {
        curriculum: true,
        prerequisites: {
          include: {
            prerequisite: true,
          },
        },
      },
      orderBy: [{ semester: 'asc' }, { code: 'asc' }],
    });
  }

  async getOfferings(semesterId?: string) {
    let targetSemesterId = semesterId;
    if (!targetSemesterId) {
      const activeSem = await this.prisma.semester.findFirst({ where: { isActive: true } });
      targetSemesterId = activeSem?.id;
    }

    if (!targetSemesterId) return [];

    return this.prisma.courseOffering.findMany({
      where: { semesterId: targetSemesterId },
      include: {
        course: true,
        classes: {
          include: {
            lecturer: {
              include: { user: true },
            },
            schedules: {
              include: { classroom: true },
            },
          },
        },
      },
      orderBy: { course: { code: 'asc' } },
    });
  }

  async getStudentKrs(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        advisor: {
          include: { user: true },
        },
        studyProgram: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Data mahasiswa tidak ditemukan untuk akun ini');
    }

    const activeSemester = await this.prisma.semester.findFirst({
      where: { isActive: true },
      include: { academicYear: true },
    });

    if (!activeSemester) {
      throw new BadRequestException('Tidak ada semester akademik aktif saat ini');
    }

    const registration = await this.prisma.studentRegistration.findUnique({
      where: {
        studentId_semesterId: {
          studentId: student.id,
          semesterId: activeSemester.id,
        },
      },
      include: {
        details: {
          include: {
            class: {
              include: {
                offering: {
                  include: { course: true },
                },
                lecturer: {
                  include: { user: true },
                },
                schedules: {
                  include: { classroom: true },
                },
              },
            },
          },
        },
      },
    });

    return {
      student,
      semester: activeSemester,
      registration,
    };
  }

  async enrollKrs(userId: string, classIds: string[]) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException('Data mahasiswa tidak ditemukan');

    const activeSemester = await this.prisma.semester.findFirst({ where: { isActive: true } });
    if (!activeSemester) throw new BadRequestException('Semester aktif tidak ditemukan');

    // Retrieve target classes with their course credits and schedules
    const classes = await this.prisma.courseClass.findMany({
      where: { id: { in: classIds } },
      include: {
        offering: {
          include: { course: true },
        },
        schedules: true,
      },
    });

    if (classes.length !== classIds.length) {
      throw new BadRequestException('Sebagian kelas yang dipilih tidak valid');
    }

    // Calculate total credits
    const totalCredits = classes.reduce((sum, c) => sum + c.offering.course.credits, 0);
    const maxCredits = 24;

    if (totalCredits > maxCredits) {
      throw new BadRequestException(
        `Total SKS yang dipilih (${totalCredits} SKS) melebihi batas maksimal (${maxCredits} SKS)`,
      );
    }

    // Upsert registration
    const registration = await this.prisma.studentRegistration.upsert({
      where: {
        studentId_semesterId: {
          studentId: student.id,
          semesterId: activeSemester.id,
        },
      },
      update: {
        totalCredits,
        status: 'SUBMITTED',
        submittedAt: new Date(),
        rejectionNote: null,
      },
      create: {
        studentId: student.id,
        semesterId: activeSemester.id,
        status: 'SUBMITTED',
        totalCredits,
        maxCredits,
        submittedAt: new Date(),
      },
    });

    // Delete previous details and insert new ones
    await this.prisma.studentRegistrationDetail.deleteMany({
      where: { registrationId: registration.id },
    });

    for (const c of classes) {
      await this.prisma.studentRegistrationDetail.create({
        data: {
          registrationId: registration.id,
          classId: c.id,
        },
      });
    }

    return {
      success: true,
      registrationId: registration.id,
      totalCredits,
      status: 'SUBMITTED',
      message: 'KRS berhasil diajukan ke Dosen Pembimbing Akademik.',
    };
  }

  async getKrsSubmissions(advisorUserId?: string) {
    let advisorId: string | undefined;
    if (advisorUserId) {
      const lecturer = await this.prisma.lecturer.findUnique({ where: { userId: advisorUserId } });
      advisorId = lecturer?.id;
    }

    const where: any = {};
    if (advisorId) {
      where.student = { advisorId };
    }

    return this.prisma.studentRegistration.findMany({
      where,
      include: {
        student: {
          include: {
            user: true,
            studyProgram: true,
          },
        },
        semester: true,
        details: {
          include: {
            class: {
              include: {
                offering: {
                  include: { course: true },
                },
                lecturer: {
                  include: { user: true },
                },
              },
            },
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async approveKrs(registrationId: string, approvedByUserId: string, isApproved: boolean, note?: string) {
    const lecturer = await this.prisma.lecturer.findUnique({ where: { userId: approvedByUserId } });

    const updated = await this.prisma.studentRegistration.update({
      where: { id: registrationId },
      data: {
        status: isApproved ? 'APPROVED' : 'REJECTED',
        approvedAt: isApproved ? new Date() : null,
        approvedBy: isApproved ? (lecturer?.id || approvedByUserId) : null,
        rejectionNote: !isApproved ? (note || 'KRS ditolak oleh Dosen Pembimbing') : null,
      },
    });

    return updated;
  }

  async getStudentKhs(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        studyProgram: {
          include: { faculty: true },
        },
        advisor: {
          include: { user: true },
        },
      },
    });

    if (!student) throw new NotFoundException('Data mahasiswa tidak ditemukan');

    const registrations = await this.prisma.studentRegistration.findMany({
      where: { studentId: student.id },
      include: {
        semester: {
          include: { academicYear: true },
        },
        details: {
          include: {
            class: {
              include: {
                offering: {
                  include: { course: true },
                },
                lecturer: {
                  include: { user: true },
                },
              },
            },
          },
        },
      },
      orderBy: { semester: { startDate: 'desc' } },
    });

    // Calculate IPS and IPK
    let totalGradePointsAll = 0;
    let totalCreditsAll = 0;

    const semestersReport = registrations.map((reg) => {
      let semPoints = 0;
      let semCredits = 0;

      const items = reg.details.map((d) => {
        const credits = d.class.offering.course.credits;
        const gradePoint = d.gradePoint ?? 0;
        const totalPoint = credits * gradePoint;

        semPoints += totalPoint;
        semCredits += credits;

        return {
          detailId: d.id,
          courseCode: d.class.offering.course.code,
          courseName: d.class.offering.course.name,
          credits,
          className: d.class.name,
          lecturerName: d.class.lecturer?.user?.fullName || '-',
          scoreNumeric: d.scoreNumeric,
          gradeLetter: d.gradeLetter || 'Belum Ada',
          gradePoint,
          totalPoint,
          isPublished: d.isPublished,
        };
      });

      const ips = semCredits > 0 ? parseFloat((semPoints / semCredits).toFixed(2)) : 0;
      totalGradePointsAll += semPoints;
      totalCreditsAll += semCredits;

      return {
        registrationId: reg.id,
        semesterCode: reg.semester.code,
        semesterName: reg.semester.name,
        academicYear: reg.semester.academicYear.name,
        status: reg.status,
        semCredits,
        ips,
        items,
      };
    });

    const ipk = totalCreditsAll > 0 ? parseFloat((totalGradePointsAll / totalCreditsAll).toFixed(2)) : 0;

    return {
      student: {
        nim: student.nim,
        name: student.userId,
        currentSemester: student.currentSemester,
        studyProgram: student.studyProgram.name,
        faculty: student.studyProgram.faculty.name,
        advisorName: student.advisor?.user?.fullName || '-',
        ipk,
        totalCredits: totalCreditsAll,
      },
      semesters: semestersReport,
    };
  }
}
