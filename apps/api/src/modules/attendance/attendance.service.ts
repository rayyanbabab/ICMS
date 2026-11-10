import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async getTodaySessions(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if user is a lecturer
    const lecturer = await this.prisma.lecturer.findUnique({ where: { userId } });

    if (lecturer) {
      return this.prisma.attendanceSession.findMany({
        where: {
          lecturerId: lecturer.id,
          date: { gte: today, lt: tomorrow },
        },
        include: {
          class: {
            include: {
              offering: { include: { course: true } },
            },
          },
          records: {
            include: {
              student: { include: { user: true } },
            },
          },
        },
        orderBy: { startTime: 'asc' },
      });
    }

    // Otherwise student view
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) return [];

    return this.prisma.attendanceSession.findMany({
      where: {
        date: { gte: today, lt: tomorrow },
        class: {
          registrationDetails: {
            some: {
              registration: { studentId: student.id },
            },
          },
        },
      },
      include: {
        class: {
          include: {
            offering: { include: { course: true } },
            lecturer: { include: { user: true } },
          },
        },
        records: {
          where: { studentId: student.id },
        },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async startSession(classId: string, lecturerUserId: string, topic?: string) {
    const lecturer = await this.prisma.lecturer.findUnique({ where: { userId: lecturerUserId } });
    if (!lecturer) throw new BadRequestException('Hanya dosen yang dapat memulai sesi presensi');

    // Count existing sessions for sessionNum
    const count = await this.prisma.attendanceSession.count({ where: { classId } });
    const sessionNum = count + 1;

    const now = new Date();
    const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours
    const qrCodeToken = `QR-${classId}-${Date.now()}`;

    return this.prisma.attendanceSession.create({
      data: {
        classId,
        lecturerId: lecturer.id,
        sessionNum,
        date: now,
        startTime: now,
        endTime,
        topic: topic || `Pertemuan ke-${sessionNum}`,
        qrCodeToken,
        isOpen: true,
      },
      include: {
        class: {
          include: {
            offering: { include: { course: true } },
          },
        },
      },
    });
  }

  async checkIn(qrToken: string, studentUserId: string, latitude?: number, longitude?: number) {
    const student = await this.prisma.student.findUnique({ where: { userId: studentUserId } });
    if (!student) throw new NotFoundException('Data mahasiswa tidak ditemukan');

    const session = await this.prisma.attendanceSession.findUnique({
      where: { qrCodeToken: qrToken },
    });

    if (!session || !session.isOpen) {
      throw new BadRequestException('Sesi presensi tidak ditemukan atau sudah ditutup');
    }

    // Check duplicate check-in
    const existing = await this.prisma.attendanceRecord.findUnique({
      where: {
        sessionId_studentId: {
          sessionId: session.id,
          studentId: student.id,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Anda sudah melakukan presensi pada sesi ini');
    }

    const record = await this.prisma.attendanceRecord.create({
      data: {
        sessionId: session.id,
        studentId: student.id,
        status: 'PRESENT',
        checkInTime: new Date(),
        latitude,
        longitude,
      },
    });

    return {
      success: true,
      checkInTime: record.checkInTime,
      status: 'PRESENT',
      message: 'Presensi berhasil dicatat!',
    };
  }

  async getAttendanceHistory(userId: string) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException('Data mahasiswa tidak ditemukan');

    const records = await this.prisma.attendanceRecord.findMany({
      where: { studentId: student.id },
      include: {
        session: {
          include: {
            class: {
              include: {
                offering: { include: { course: true } },
                lecturer: { include: { user: true } },
              },
            },
          },
        },
      },
      orderBy: { checkInTime: 'desc' },
    });

    return records;
  }
}

