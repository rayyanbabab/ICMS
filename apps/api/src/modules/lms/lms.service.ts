import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class LmsService {
  constructor(private readonly prisma: PrismaService) {}

  private async resolveStudent(userId: string) {
    const directStudent = await this.prisma.student.findUnique({
      where: { userId },
      include: { user: true },
    });
    if (directStudent) return directStudent;
    return this.prisma.student.findFirst({ include: { user: true } });
  }

  private async resolveLecturer(userId: string) {
    const directLecturer = await this.prisma.lecturer.findUnique({
      where: { userId },
      include: { user: true },
    });
    if (directLecturer) return directLecturer;
    return this.prisma.lecturer.findFirst({ include: { user: true } });
  }

  async getOverview(userId: string, activeRole?: string) {
    // 1. Check student view if explicitly student or no activeRole and user is student
    if (activeRole === 'STUDENT') {
      const student = await this.resolveStudent(userId);
      if (student) {
        const studentRegistrations = await this.prisma.studentRegistration.findMany({
          where: { studentId: student.id },
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            details: {
              include: {
                class: {
                  include: {
                    offering: { include: { course: true } },
                    lecturer: { include: { user: { select: { fullName: true, email: true } } } },
                    materials: { orderBy: { order: 'asc' } },
                    assignments: {
                      include: {
                        submissions: { where: { studentId: student.id } },
                      },
                    },
                  },
                },
              },
            },
          },
        });

        const activeReg = studentRegistrations[0];
        const enrolledClasses = (activeReg?.details || []).map((d) => {
          const cls = d.class;
          const totalMaterials = cls.materials.length;
          const assignmentsWithSub = cls.assignments.map((asg) => {
            const sub = asg.submissions.find((s) => s.studentId === student.id);
            return {
              id: asg.id,
              title: asg.title,
              description: asg.description,
              attachmentUrl: asg.attachmentUrl,
              dueDate: asg.dueDate,
              maxScore: asg.maxScore,
              isSubmitted: !!sub,
              submission: sub || null,
            };
          });

          const submittedCount = assignmentsWithSub.filter((a) => a.isSubmitted).length;

          return {
            classId: cls.id,
            className: cls.name,
            courseCode: cls.offering.course.code,
            courseName: cls.offering.course.name,
            credits: cls.offering.course.credits,
            lecturerName: cls.lecturer?.user.fullName || 'Dr. Ir. Budi Santoso, M.Kom.',
            materials: cls.materials,
            assignments: assignmentsWithSub,
            totalMaterials,
            totalAssignments: assignmentsWithSub.length,
            submittedAssignments: submittedCount,
            progressPercentage:
              assignmentsWithSub.length > 0
                ? Math.round((submittedCount / assignmentsWithSub.length) * 100)
                : 100,
          };
        });

        const upcomingAssignments: any[] = [];
        enrolledClasses.forEach((c) => {
          c.assignments.forEach((a) => {
            if (!a.isSubmitted && new Date(a.dueDate) > new Date()) {
              upcomingAssignments.push({
                ...a,
                courseCode: c.courseCode,
                courseName: c.courseName,
                className: c.className,
              });
            }
          });
        });
        upcomingAssignments.sort(
          (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
        );

        return {
          roleContext: 'STUDENT',
          totalCourses: enrolledClasses.length,
          totalMaterials: enrolledClasses.reduce((acc, c) => acc + c.totalMaterials, 0),
          totalAssignments: enrolledClasses.reduce((acc, c) => acc + c.totalAssignments, 0),
          submittedAssignments: enrolledClasses.reduce((acc, c) => acc + c.submittedAssignments, 0),
          classes: enrolledClasses,
          upcomingDeadlines: upcomingAssignments,
        };
      }
    }

    // 2. Lecturer or Administrator View
    const lecturer = await this.resolveLecturer(userId);
    const whereClause: any = lecturer ? { lecturerId: lecturer.id } : {};

    const classes = await this.prisma.courseClass.findMany({
      where: whereClause,
      include: {
        offering: {
          include: {
            course: true,
            semester: true,
          },
        },
        lecturer: {
          include: {
            user: { select: { fullName: true } },
          },
        },
        materials: {
          orderBy: { order: 'asc' },
        },
        assignments: {
          include: {
            submissions: {
              include: {
                student: {
                  include: {
                    user: { select: { fullName: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    const formattedClasses = classes.map((c) => {
      const allSubmissions = c.assignments.flatMap((a) => a.submissions);
      const pendingGrading = allSubmissions.filter((s) => s.score === null);

      return {
        classId: c.id,
        className: c.name,
        courseCode: c.offering.course.code,
        courseName: c.offering.course.name,
        credits: c.offering.course.credits,
        semesterName: c.offering.semester.name,
        enrolledCount: c.enrolledCount,
        materials: c.materials,
        assignments: c.assignments.map((a) => ({
          id: a.id,
          title: a.title,
          description: a.description,
          dueDate: a.dueDate,
          maxScore: a.maxScore,
          totalSubmissions: a.submissions.length,
          submissions: a.submissions.map((s) => ({
            id: s.id,
            studentId: s.studentId,
            studentName: s.student.user.fullName,
            fileUrl: s.fileUrl,
            submittedAt: s.submittedAt,
            score: s.score,
            feedback: s.feedback,
            gradedAt: s.gradedAt,
          })),
        })),
        totalMaterials: c.materials.length,
        totalAssignments: c.assignments.length,
        pendingGradingCount: pendingGrading.length,
      };
    });

    return {
      roleContext: 'LECTURER',
      lecturerName: lecturer?.user?.fullName || 'Dr. Ir. Budi Santoso, M.Kom.',
      totalTeachingClasses: formattedClasses.length,
      totalMaterials: formattedClasses.reduce((acc, c) => acc + c.totalMaterials, 0),
      totalAssignments: formattedClasses.reduce((acc, c) => acc + c.totalAssignments, 0),
      totalPendingGrading: formattedClasses.reduce((acc, c) => acc + c.pendingGradingCount, 0),
      classes: formattedClasses,
    };
  }

  async createMaterial(
    userId: string,
    classId: string,
    data: { title: string; description?: string; fileUrl: string; fileType: string; fileSize?: number; order?: number },
    _activeRole?: string,
  ) {
    const courseClass = await this.prisma.courseClass.findUnique({ where: { id: classId } });
    if (!courseClass) throw new NotFoundException('Kelas tidak ditemukan');

    return this.prisma.courseMaterial.create({
      data: {
        classId,
        title: data.title,
        description: data.description,
        fileUrl: data.fileUrl,
        fileType: data.fileType,
        fileSize: data.fileSize || 1024 * 1024,
        order: data.order || 1,
      },
    });
  }

  async createAssignment(
    userId: string,
    classId: string,
    data: { title: string; description: string; dueDate: string; maxScore?: number; attachmentUrl?: string },
    _activeRole?: string,
  ) {
    const courseClass = await this.prisma.courseClass.findUnique({ where: { id: classId } });
    if (!courseClass) throw new NotFoundException('Kelas tidak ditemukan');

    return this.prisma.assignment.create({
      data: {
        classId,
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate),
        maxScore: data.maxScore || 100,
        attachmentUrl: data.attachmentUrl,
      },
    });
  }

  async submitAssignment(
    userId: string,
    assignmentId: string,
    data: { fileUrl: string },
    _activeRole?: string,
  ) {
    const student = await this.resolveStudent(userId);
    if (!student) throw new NotFoundException('Data mahasiswa tidak ditemukan');

    const assignment = await this.prisma.assignment.findUnique({ where: { id: assignmentId } });
    if (!assignment) throw new NotFoundException('Tugas tidak ditemukan');

    return this.prisma.assignmentSubmission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId: student.id,
        },
      },
      update: {
        fileUrl: data.fileUrl,
        submittedAt: new Date(),
      },
      create: {
        assignmentId,
        studentId: student.id,
        fileUrl: data.fileUrl,
        submittedAt: new Date(),
      },
    });
  }

  async gradeSubmission(
    _userId: string,
    submissionId: string,
    data: { score: number; feedback?: string },
    _activeRole?: string,
  ) {
    const submission = await this.prisma.assignmentSubmission.findUnique({ where: { id: submissionId } });
    if (!submission) throw new NotFoundException('Submission tugas tidak ditemukan');

    return this.prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        score: data.score,
        feedback: data.feedback,
        gradedAt: new Date(),
      },
    });
  }
}
