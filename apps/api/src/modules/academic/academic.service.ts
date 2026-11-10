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

  async getWeeklySchedule(userId: string) {
    // 1. Check if student
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        registrations: {
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            details: {
              include: {
                class: {
                  include: {
                    offering: {
                      include: { course: true, semester: true },
                    },
                    lecturer: {
                      include: { user: { select: { fullName: true } } },
                    },
                    schedules: {
                      include: { classroom: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (student && student.registrations.length > 0) {
      const activeReg = student.registrations[0];
      const schedulesList: any[] = [];

      activeReg.details.forEach((d) => {
        const cls = d.class;
        cls.schedules.forEach((sch) => {
          schedulesList.push({
            id: sch.id,
            classId: cls.id,
            className: cls.name,
            courseCode: cls.offering.course.code,
            courseName: cls.offering.course.name,
            credits: cls.offering.course.credits,
            lecturerName: cls.lecturer?.user.fullName || 'Dosen Pengampu',
            classroomName: sch.classroom.name,
            classroomCode: sch.classroom.code,
            building: sch.classroom.building,
            dayOfWeek: sch.dayOfWeek,
            startTime: sch.startTime,
            endTime: sch.endTime,
          });
        });
      });

      return {
        roleContext: 'STUDENT',
        totalClasses: activeReg.details.length,
        schedules: schedulesList.sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)),
      };
    }

    // 2. Check if lecturer
    const lecturer = await this.prisma.lecturer.findUnique({
      where: { userId },
    });

    const whereClause: any = lecturer ? { lecturerId: lecturer.id } : {};

    const classes = await this.prisma.courseClass.findMany({
      where: whereClause,
      include: {
        offering: {
          include: { course: true, semester: true },
        },
        lecturer: {
          include: { user: { select: { fullName: true } } },
        },
        schedules: {
          include: { classroom: true },
        },
      },
    });

    const schedulesList: any[] = [];
    classes.forEach((cls) => {
      cls.schedules.forEach((sch) => {
        schedulesList.push({
          id: sch.id,
          classId: cls.id,
          className: cls.name,
          courseCode: cls.offering.course.code,
          courseName: cls.offering.course.name,
          credits: cls.offering.course.credits,
          lecturerName: cls.lecturer?.user.fullName || 'Dosen Pengampu',
          classroomName: sch.classroom.name,
          classroomCode: sch.classroom.code,
          building: sch.classroom.building,
          dayOfWeek: sch.dayOfWeek,
          startTime: sch.startTime,
          endTime: sch.endTime,
        });
      });
    });

    return {
      roleContext: lecturer ? 'LECTURER' : 'ADMIN',
      totalClasses: classes.length,
      schedules: schedulesList.sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)),
    };
  }

  async getAcademicCalendar() {
    const activeSemester = await this.prisma.semester.findFirst({
      where: { isActive: true },
      include: { academicYear: true },
    });

    const events = [
      {
        id: 'cal-1',
        title: 'Masa Registrasi Ulang & Pembayaran UKT / SPP',
        category: 'KEUANGAN',
        startDate: '2026-08-01',
        endDate: '2026-08-20',
        status: 'COMPLETED',
        description: 'Pembayaran UKT mahasiswa lama dan mahasiswa baru melalui Virtual Account & QRIS.',
      },
      {
        id: 'cal-2',
        title: 'Pengisian & Konsultasi KRS Online',
        category: 'AKADEMIK',
        startDate: '2026-08-15',
        endDate: '2026-09-05',
        status: 'COMPLETED',
        description: 'Penyusunan rencana studi dengan Dosen Pembimbing Akademik melalui portal ICMS.',
      },
      {
        id: 'cal-3',
        title: 'Awal Perkuliahan Tatap Muka & Daring Semester Ganjil',
        category: 'PERKULIAHAN',
        startDate: '2026-09-08',
        endDate: '2026-09-08',
        status: 'COMPLETED',
        description: 'Kuliah perdana tatap muka di seluruh fakultas Universitas Indonesia Mandiri.',
      },
      {
        id: 'cal-4',
        title: 'Batas Akhir Perubahan Rencana Studi (KPRS / Batal-Tambah)',
        category: 'AKADEMIK',
        startDate: '2026-09-22',
        endDate: '2026-09-22',
        status: 'COMPLETED',
        description: 'Batas akhir penggantian atau pembatalan mata kuliah semester ganjil.',
      },
      {
        id: 'cal-5',
        title: 'Ujian Tengah Semester (UTS) Ganjil 2026/2027',
        category: 'UJIAN',
        startDate: '2026-11-15',
        endDate: '2026-11-27',
        status: 'ACTIVE',
        description: 'Evaluasi pembelajaran tengah semester berbasis Computer-Based Testing (CBT).',
      },
      {
        id: 'cal-6',
        title: 'Minggu Tenang Perkuliahan',
        category: 'PERKULIAHAN',
        startDate: '2027-01-05',
        endDate: '2027-01-09',
        status: 'UPCOMING',
        description: 'Pekan persiapan evaluasi akhir semester, bebas dari penugasan baru.',
      },
      {
        id: 'cal-7',
        title: 'Ujian Akhir Semester (UAS) Ganjil 2026/2027',
        category: 'UJIAN',
        startDate: '2027-01-12',
        endDate: '2027-01-24',
        status: 'UPCOMING',
        description: 'Evaluasi akhir capaian pembelajaran seluruh mata kuliah kurikulum 2024.',
      },
      {
        id: 'cal-8',
        title: 'Batas Akhir Input & Finalisasi Nilai oleh Dosen',
        category: 'AKADEMIK',
        startDate: '2027-01-30',
        endDate: '2027-01-30',
        status: 'UPCOMING',
        description: 'Batas pengunggahan nilai resmi oleh dosen pengampu sebelum penerbitan KHS.',
      },
      {
        id: 'cal-9',
        title: 'Penerbitan KHS & Yudisium Kelulusan',
        category: 'KELULUSAN',
        startDate: '2027-02-05',
        endDate: '2027-02-05',
        status: 'UPCOMING',
        description: 'Penerbitan Kartu Hasil Studi resmi semester ganjil dan yudisium sarjana.',
      },
    ];

    return {
      activeSemester: activeSemester ? {
        code: activeSemester.code,
        name: activeSemester.name,
        academicYear: activeSemester.academicYear.name,
        startDate: activeSemester.startDate,
        endDate: activeSemester.endDate,
      } : null,
      events,
    };
  }

  async getExams(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        registrations: {
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            details: {
              include: {
                class: {
                  include: {
                    offering: { include: { course: true } },
                    exams: {
                      include: {
                        attempts: {
                          where: { studentId: undefined },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const examsList = [
      {
        id: 'exam-cbt-01',
        title: 'UTS Teori: Algoritma & Pemrograman Dasar (IF101)',
        type: 'MIDTERM',
        courseCode: 'IF101',
        courseName: 'Algoritma & Pemrograman Dasar',
        credits: 3,
        durationMin: 60,
        startTime: '2026-11-15T08:00:00Z',
        endTime: '2026-11-15T09:00:00Z',
        totalQuestions: 5,
        status: 'AVAILABLE',
        score: null as number | null,
        isCompleted: false,
        questions: [
          {
            id: 'q1',
            text: 'Manakah dari struktur kontrol perulangan berikut yang menjamin setidaknya satu kali eksekusi blok kode?',
            options: ['for loop', 'while loop', 'do-while loop', 'nested loop'],
            correctIndex: 2,
          },
          {
            id: 'q2',
            text: 'Berapakah kompleksitas waktu terburuk (Worst-case Big-O) dari algoritma QuickSort konvensional?',
            options: ['O(log N)', 'O(N log N)', 'O(N^2)', 'O(1)'],
            correctIndex: 2,
          },
          {
            id: 'q3',
            text: 'Fungsi alokasi memori dinamis di bahasa C yang menginisialisasi seluruh blok memori dengan nilai nol (0) adalah:',
            options: ['malloc()', 'calloc()', 'realloc()', 'free()'],
            correctIndex: 1,
          },
          {
            id: 'q4',
            text: 'Struktur data apa yang menggunakan prinsip LIFO (Last In First Out)?',
            options: ['Queue (Antrean)', 'Stack (Tumpukan)', 'Linked List', 'Binary Tree'],
            correctIndex: 1,
          },
          {
            id: 'q5',
            text: 'Pada basis 2 (Biner), representasi dari angka desimal 25 adalah:',
            options: ['11001', '10011', '11100', '10101'],
            correctIndex: 0,
          },
        ],
      },
      {
        id: 'exam-cbt-02',
        title: 'UTS Teori: Matematika Diskrit (IF102)',
        type: 'MIDTERM',
        courseCode: 'IF102',
        courseName: 'Matematika Diskrit',
        credits: 3,
        durationMin: 90,
        startTime: '2026-11-18T10:00:00Z',
        endTime: '2026-11-18T11:30:00Z',
        totalQuestions: 5,
        status: 'UPCOMING',
        score: null as number | null,
        isCompleted: false,
        questions: [],
      },
      {
        id: 'exam-cbt-03',
        title: 'UTS Praktikum: Struktur Data & Logika (IF202)',
        type: 'MIDTERM',
        courseCode: 'IF202',
        courseName: 'Struktur Data & Analisis Algoritma',
        credits: 3,
        durationMin: 90,
        startTime: '2026-11-20T13:00:00Z',
        endTime: '2026-11-20T14:30:00Z',
        totalQuestions: 5,
        status: 'UPCOMING',
        score: null as number | null,
        isCompleted: false,
        questions: [],
      },
    ];

    return {
      exams: examsList,
    };
  }

  async submitExam(userId: string, examId: string, answers: Record<string, number>) {
    // Grade the exam based on answers
    const keyAnswers: Record<string, number> = {
      q1: 2,
      q2: 2,
      q3: 1,
      q4: 1,
      q5: 0,
    };

    let correctCount = 0;
    const totalQ = Object.keys(keyAnswers).length;

    Object.entries(answers).forEach(([qId, ansIndex]) => {
      if (keyAnswers[qId] === ansIndex) {
        correctCount += 1;
      }
    });

    const finalScore = parseFloat(((correctCount / totalQ) * 100).toFixed(1));

    return {
      examId,
      totalQuestions: totalQ,
      correctCount,
      wrongCount: totalQ - correctCount,
      score: finalScore,
      submittedAt: new Date(),
      message: 'Ujian CBT telah berhasil diselesaikan dan dinilai otomatis oleh sistem ICMS.',
    };
  }

  async getCurricula() {
    return this.prisma.curriculum.findMany({
      include: {
        studyProgram: {
          include: { faculty: true },
        },
        courses: {
          orderBy: [{ semester: 'asc' }, { code: 'asc' }],
        },
      },
      orderBy: { year: 'desc' },
    });
  }

  async getAdministrationLetters(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        user: { select: { fullName: true } },
        studyProgram: { include: { faculty: true } },
      },
    });

    const lettersList = [
      {
        id: 'LTR-2026-001',
        letterNumber: '042/BAAK/UIM/X/2026',
        type: 'AKTIF_KULIAH',
        title: 'Surat Keterangan Mahasiswa Aktif Kuliah',
        purpose: 'Pengajuan Tunjangan Gaji Orang Tua (PNS/BUMN)',
        studentNim: student?.nim || '202601001',
        studentName: student?.user?.fullName || 'Ahmad Fauzi',
        studyProgram: student?.studyProgram?.name || 'Teknik Informatika (S1)',
        faculty: student?.studyProgram?.faculty?.name || 'Fakultas Teknologi Informasi',
        status: 'APPROVED',
        requestDate: '2026-10-12',
        approvedDate: '2026-10-13',
        signedBy: 'Dr. Hendra Wijaya, M.Pd. (Kepala BAAK)',
        verificationCode: 'VERIF-UIM-884920',
      },
      {
        id: 'LTR-2026-002',
        letterNumber: '089/BAAK/UIM/XI/2026',
        type: 'PENGANTAR_RISET',
        title: 'Surat Pengantar Riset & Pengambilan Data Lapangan',
        purpose: 'Survei dan Pengumpulan Data Tugas Akhir di PT Telekomunikasi Indonesia',
        studentNim: student?.nim || '202601001',
        studentName: student?.user?.fullName || 'Ahmad Fauzi',
        studyProgram: student?.studyProgram?.name || 'Teknik Informatika (S1)',
        faculty: student?.studyProgram?.faculty?.name || 'Fakultas Teknologi Informasi',
        status: 'APPROVED',
        requestDate: '2026-11-02',
        approvedDate: '2026-11-03',
        signedBy: 'Dr. Hendra Wijaya, M.Pd. (Kepala BAAK)',
        verificationCode: 'VERIF-UIM-918234',
      },
    ];

    return {
      student: student ? {
        nim: student.nim,
        name: student.user.fullName,
        studyProgram: student.studyProgram.name,
        faculty: student.studyProgram.faculty.name,
      } : null,
      letters: lettersList,
    };
  }

  async requestLetter(userId: string, data: { type: string; purpose: string; recipientAgency?: string }) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        user: { select: { fullName: true } },
        studyProgram: { include: { faculty: true } },
      },
    });

    const letterNum = `${Math.floor(100 + Math.random() * 900)}/BAAK/UIM/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
    const verifCode = `VERIF-UIM-${Math.floor(100000 + Math.random() * 900000)}`;

    const newLetter = {
      id: `LTR-${Date.now()}`,
      letterNumber: letterNum,
      type: data.type,
      title: data.type === 'AKTIF_KULIAH' 
        ? 'Surat Keterangan Mahasiswa Aktif Kuliah' 
        : data.type === 'PENGANTAR_RISET' 
          ? 'Surat Pengantar Riset & Skripsi'
          : 'Surat Rekomendasi Magang MBKM',
      purpose: data.purpose,
      studentNim: student?.nim || '202601001',
      studentName: student?.user?.fullName || 'Mahasiswa',
      studyProgram: student?.studyProgram?.name || 'Teknik Informatika',
      faculty: student?.studyProgram?.faculty?.name || 'Fakultas Teknologi Informasi',
      status: 'APPROVED',
      requestDate: new Date().toISOString().split('T')[0],
      approvedDate: new Date().toISOString().split('T')[0],
      signedBy: 'Dr. Hendra Wijaya, M.Pd. (Kepala BAAK)',
      verificationCode: verifCode,
    };

    return newLetter;
  }
}

