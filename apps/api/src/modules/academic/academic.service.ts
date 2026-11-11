import { Injectable, BadRequestException, NotFoundException, Optional } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { EventsGateway } from '../realtime/events.gateway';

export interface StoredLetter {
  id: string;
  letterNumber: string;
  type: string;
  title: string;
  purpose: string;
  studentNim: string;
  studentName: string;
  studyProgram: string;
  faculty: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestDate: string;
  approvedDate?: string;
  signedBy?: string;
  verificationCode?: string;
}

// In-memory shared reactive store for official letters
let sharedLetters: StoredLetter[] = [
  {
    id: 'LTR-2026-001',
    letterNumber: '042/BAAK/UIM/X/2026',
    type: 'AKTIF_KULIAH',
    title: 'Surat Keterangan Mahasiswa Aktif Kuliah',
    purpose: 'Pengajuan Tunjangan Gaji Orang Tua (PNS/BUMN)',
    studentNim: '202601001',
    studentName: 'Ahmad Fauzi',
    studyProgram: 'Teknik Informatika (S1)',
    faculty: 'Fakultas Teknologi Informasi',
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
    studentNim: '202601001',
    studentName: 'Ahmad Fauzi',
    studyProgram: 'Teknik Informatika (S1)',
    faculty: 'Fakultas Teknologi Informasi',
    status: 'APPROVED',
    requestDate: '2026-11-02',
    approvedDate: '2026-11-03',
    signedBy: 'Dr. Hendra Wijaya, M.Pd. (Kepala BAAK)',
    verificationCode: 'VERIF-UIM-918234',
  },
];

@Injectable()
export class AcademicService {
  constructor(
    private readonly prisma: PrismaService,
    @Optional() private readonly eventsGateway?: EventsGateway,
  ) {}

  private async resolveStudent(userId: string) {
    const directStudent = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        advisor: { include: { user: true } },
        studyProgram: { include: { faculty: true } },
        user: true,
      },
    });

    if (directStudent) return directStudent;

    return this.prisma.student.findFirst({
      include: {
        advisor: { include: { user: true } },
        studyProgram: { include: { faculty: true } },
        user: true,
      },
    });
  }

  private async resolveLecturer(userId: string) {
    const directLecturer = await this.prisma.lecturer.findUnique({
      where: { userId },
      include: {
        user: true,
        studyProgram: true,
      },
    });

    if (directLecturer) return directLecturer;

    return this.prisma.lecturer.findFirst({
      include: {
        user: true,
        studyProgram: true,
      },
    });
  }

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

  async getStudentKrs(userId: string, _activeRole?: string) {
    const student = await this.resolveStudent(userId);

    if (!student) {
      throw new NotFoundException('Data mahasiswa tidak ditemukan');
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

  async enrollKrs(userId: string, classIds: string[], _activeRole?: string) {
    const student = await this.resolveStudent(userId);
    if (!student) throw new NotFoundException('Data mahasiswa tidak ditemukan');

    const activeSemester = await this.prisma.semester.findFirst({ where: { isActive: true } });
    if (!activeSemester) throw new BadRequestException('Semester aktif tidak ditemukan');

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

    const totalCredits = classes.reduce((sum, c) => sum + c.offering.course.credits, 0);
    const maxCredits = 24;

    if (totalCredits > maxCredits) {
      throw new BadRequestException(
        `Total SKS yang dipilih (${totalCredits} SKS) melebihi batas maksimal (${maxCredits} SKS)`,
      );
    }

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

  async getKrsSubmissions(advisorUserId?: string, activeRole?: string) {
    let advisorId: string | undefined;
    if (advisorUserId && activeRole === 'LECTURER') {
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
    let lecturer = await this.prisma.lecturer.findUnique({ where: { userId: approvedByUserId } });
    if (!lecturer) {
      lecturer = await this.prisma.lecturer.findFirst();
    }

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

  async getStudentKhs(userId: string, _activeRole?: string) {
    const student = await this.resolveStudent(userId);
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

    let totalGradePointsAll = 0;
    let totalCreditsAll = 0;

    const semestersReport = registrations.map((reg) => {
      let semPoints = 0;
      let semCredits = 0;

      const items = reg.details.map((d) => {
        const credits = d.class.offering.course.credits;
        const gradePoint = d.gradePoint ?? (d.scoreNumeric ? (d.scoreNumeric >= 85 ? 4.0 : d.scoreNumeric >= 75 ? 3.5 : 3.0) : 4.0);
        const letter = d.gradeLetter || (d.scoreNumeric ? (d.scoreNumeric >= 85 ? 'A' : d.scoreNumeric >= 75 ? 'B+' : 'B') : 'A');
        const numeric = d.scoreNumeric ?? 92;
        const totalPoint = credits * gradePoint;

        semPoints += totalPoint;
        semCredits += credits;

        return {
          detailId: d.id,
          courseCode: d.class.offering.course.code,
          courseName: d.class.offering.course.name,
          credits,
          className: d.class.name,
          lecturerName: d.class.lecturer?.user?.fullName || 'Dr. Ir. Budi Santoso, M.Kom.',
          scoreNumeric: numeric,
          gradeLetter: letter,
          gradePoint,
          totalPoint,
          isPublished: d.isPublished ?? true,
        };
      });

      const ips = semCredits > 0 ? parseFloat((semPoints / semCredits).toFixed(2)) : 3.85;
      totalGradePointsAll += semPoints;
      totalCreditsAll += semCredits;

      return {
        registrationId: reg.id,
        semesterId: reg.semester.id,
        semesterName: reg.semester.name,
        semesterCode: reg.semester.code,
        academicYear: reg.semester.academicYear.name,
        totalCredits: semCredits,
        totalGradePoints: semPoints,
        ips,
        items,
      };
    });

    const ipk = totalCreditsAll > 0 ? parseFloat((totalGradePointsAll / totalCreditsAll).toFixed(2)) : 3.85;

    return {
      student: {
        id: student.id,
        nim: student.nim,
        fullName: student.user?.fullName || 'Ahmad Fauzi',
        studyProgram: student.studyProgram?.name || 'Teknik Informatika (S1)',
        faculty: student.studyProgram?.faculty?.name || 'Fakultas Teknologi Informasi',
        currentSemester: student.currentSemester || 1,
        totalCreditsCompleted: totalCreditsAll || 20,
        ipk: ipk || 3.85,
        advisor: student.advisor?.user?.fullName || 'Dr. Ir. Budi Santoso, M.Kom.',
      },
      semesters: semestersReport,
    };
  }

  async updateStudentGrades(detailId: string, scoreNumeric: number, gradeLetter: string, gradePoint: number) {
    return this.prisma.studentRegistrationDetail.update({
      where: { id: detailId },
      data: {
        scoreNumeric,
        gradeLetter,
        gradePoint,
        isPublished: true,
      },
    });
  }

  async getWeeklySchedule(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        registrations: {
          where: { status: 'APPROVED' },
          include: {
            details: {
              include: {
                class: {
                  include: {
                    offering: { include: { course: true } },
                    lecturer: { include: { user: true } },
                    schedules: { include: { classroom: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (student && student.registrations.length > 0) {
      const schedulesList: any[] = [];
      student.registrations.forEach((reg) => {
        reg.details.forEach((det) => {
          const cls = det.class;
          cls.schedules.forEach((sch) => {
            schedulesList.push({
              id: sch.id,
              dayOfWeek: sch.dayOfWeek,
              startTime: sch.startTime,
              endTime: sch.endTime,
              courseCode: cls.offering.course.code,
              courseName: cls.offering.course.name,
              credits: cls.offering.course.credits,
              className: cls.name,
              lecturerName: cls.lecturer?.user?.fullName || '-',
              classroomName: sch.classroom.name,
              classroomCode: sch.classroom.code,
            });
          });
        });
      });
      return schedulesList;
    }

    return [
      {
        id: 'sch-1',
        dayOfWeek: 1, // Senin
        startTime: '08:00',
        endTime: '10:30',
        courseCode: 'IF101',
        courseName: 'Algoritma & Pemrograman Lanjut',
        credits: 3,
        className: 'IF-1A',
        lecturerName: 'Dr. Ir. Budi Santoso, M.Kom.',
        classroomName: 'Laboratorium Rekayasa Perangkat Lunak',
        classroomCode: 'LAB-KOM-01',
      },
      {
        id: 'sch-2',
        dayOfWeek: 1,
        startTime: '13:00',
        endTime: '15:30',
        courseCode: 'IF202',
        courseName: 'Struktur Data & Kompleksitas Algoritma',
        credits: 3,
        className: 'IF-1A',
        lecturerName: 'Siti Nurhaliza, M.T.',
        classroomName: 'Ruang Teori C-302',
        classroomCode: 'R-TEORI-302',
      },
      {
        id: 'sch-3',
        dayOfWeek: 2, // Selasa
        startTime: '09:00',
        endTime: '11:30',
        courseCode: 'IF301',
        courseName: 'Basis Data & Big Data Analytics',
        credits: 3,
        className: 'IF-1B',
        lecturerName: 'Dr. Ahmad Fauzi, M.Sc.',
        classroomName: 'Laboratorium Basis Data',
        classroomCode: 'LAB-KOM-02',
      },
      {
        id: 'sch-4',
        dayOfWeek: 3, // Rabu
        startTime: '08:00',
        endTime: '10:30',
        courseCode: 'IF304',
        courseName: 'Rekayasa Perangkat Lunak Berbasis Objek',
        credits: 3,
        className: 'IF-1A',
        lecturerName: 'Dr. Ir. Budi Santoso, M.Kom.',
        classroomName: 'Ruang Teori D-401',
        classroomCode: 'R-TEORI-401',
      },
      {
        id: 'sch-5',
        dayOfWeek: 4, // Kamis
        startTime: '10:00',
        endTime: '12:30',
        courseCode: 'IF402',
        courseName: 'Arsitektur Komputasi Cloud & Microservices',
        credits: 3,
        className: 'IF-1A',
        lecturerName: 'Rian Pratama, M.Kom.',
        classroomName: 'Laboratorium Jaringan & Cyber Security',
        classroomCode: 'LAB-NET-01',
      },
      {
        id: 'sch-6',
        dayOfWeek: 5, // Jumat
        startTime: '08:00',
        endTime: '10:00',
        courseCode: 'KU101',
        courseName: 'Etika Profesi & Hukum Siber',
        credits: 2,
        className: 'KU-1',
        lecturerName: 'Prof. Dr. Hendra Setiawan, M.Eng.',
        classroomName: 'Auditorium Utama Lt. 1',
        classroomCode: 'AUD-01',
      },
    ];
  }

  async getAcademicCalendar() {
    return {
      activeSemester: {
        code: '2026-1',
        name: 'Semester Ganjil 2026/2027',
        academicYear: 'Tahun Akademik 2026/2027',
        startDate: new Date('2026-09-01'),
        endDate: new Date('2027-01-31'),
      },
      events: [
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
      ],
    };
  }

  async getExams(_userId: string) {
    return [
      {
        id: 'EXAM-UTS-01',
        title: 'Ujian Tengah Semester: Algoritma & Pemrograman Lanjut',
        courseCode: 'IF101',
        courseName: 'Algoritma & Pemrograman Lanjut',
        type: 'MIDTERM',
        durationMinutes: 60,
        totalQuestions: 5,
        passingGrade: 70,
        status: 'READY',
        startTime: '2026-11-15T08:00:00Z',
        endTime: '2026-11-15T12:00:00Z',
        instructions: 'Kerjakan soal pilihan ganda secara mandiri. Timer countdown akan otomatis berjalan saat Anda menekan Mulai Ujian.',
        questions: [
          {
            id: 'q1',
            number: 1,
            text: 'Manakah dari struktur data berikut yang menggunakan prinsip Last-In-First-Out (LIFO)?',
            options: ['Queue (Antrean)', 'Binary Tree', 'Stack (Tumpukan)', 'Linked List'],
          },
          {
            id: 'q2',
            number: 2,
            text: 'Berapakah kompleksitas waktu rata-rata (Average Time Complexity) dari algoritma QuickSort?',
            options: ['O(n)', 'O(n^2)', 'O(n log n)', 'O(1)'],
          },
          {
            id: 'q3',
            number: 3,
            text: 'Pola arsitektur software apa yang paling tepat untuk memisahkan logika presentasi, pemrosesan data, dan persistensi database?',
            options: ['Monolitik Tanpa Pola', 'Model-View-Controller (MVC)', 'Peer-to-Peer', 'Event-Driven Only'],
          },
          {
            id: 'q4',
            number: 4,
            text: 'Apa fungsi utama dari indeks (B-Tree Index) pada basis data relasional PostgreSQL?',
            options: ['Menghapus data duplikat', 'Mempercepat pencarian data saat query WHERE', 'Mengenkripsi password pengguna', 'Membuat backup snapshot'],
          },
          {
            id: 'q5',
            number: 5,
            text: 'Protokol apa yang digunakan untuk komunikasi real-time dua arah (full-duplex) antara klien dan server?',
            options: ['WebSocket', 'HTTP/1.1 Standard GET', 'FTP', 'SMTP'],
          },
        ],
      },
      {
        id: 'EXAM-UTS-02',
        title: 'Ujian Tengah Semester: Basis Data & Big Data Analytics',
        courseCode: 'IF301',
        courseName: 'Basis Data & Big Data Analytics',
        type: 'MIDTERM',
        durationMinutes: 90,
        totalQuestions: 5,
        passingGrade: 75,
        status: 'UPCOMING',
        startTime: '2026-11-18T10:00:00Z',
        endTime: '2026-11-18T14:00:00Z',
        instructions: 'Ujian akan dibuka pada 18 November 2026 pukul 10:00 WIB.',
        questions: [],
      },
    ];
  }

  async submitExam(_userId: string, examId: string, answers: Record<string, number>) {
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

  async getAdministrationLetters(userId: string, _activeRole?: string) {
    const student = await this.resolveStudent(userId);

    return {
      student: student
        ? {
            nim: student.nim,
            name: student.user?.fullName || 'Ahmad Fauzi',
            studyProgram: student.studyProgram?.name || 'Teknik Informatika (S1)',
            faculty: student.studyProgram?.faculty?.name || 'Fakultas Teknologi Informasi',
          }
        : null,
      letters: sharedLetters,
    };
  }

  async requestLetter(
    userId: string,
    data: { type: string; purpose: string; recipientAgency?: string },
    _activeRole?: string,
  ) {
    const student = await this.resolveStudent(userId);
    const letterNum = `${Math.floor(100 + Math.random() * 900)}/BAAK/UIM/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
    const verifCode = `VERIF-UIM-${Math.floor(100000 + Math.random() * 900000)}`;

    const newLetter: StoredLetter = {
      id: `LTR-${Date.now()}`,
      letterNumber: letterNum,
      type: data.type,
      title:
        data.type === 'AKTIF_KULIAH'
          ? 'Surat Keterangan Mahasiswa Aktif Kuliah'
          : data.type === 'PENGANTAR_RISET'
          ? 'Surat Pengantar Riset & Skripsi'
          : 'Surat Rekomendasi Magang MBKM',
      purpose: data.purpose,
      studentNim: student?.nim || '202601001',
      studentName: student?.user?.fullName || 'Ahmad Fauzi',
      studyProgram: student?.studyProgram?.name || 'Teknik Informatika (S1)',
      faculty: student?.studyProgram?.faculty?.name || 'Fakultas Teknologi Informasi',
      status: 'PENDING',
      requestDate: new Date().toISOString().split('T')[0],
      verificationCode: verifCode,
    };

    sharedLetters.unshift(newLetter);

    if (this.eventsGateway) {
      this.eventsGateway.broadcastNotification({
        id: `notif-ltr-${Date.now()}`,
        title: 'Permohonan Surat Baru',
        message: `${newLetter.studentName} (${newLetter.studentNim}) mengajukan ${newLetter.title}.`,
        category: 'AKADEMIK',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        link: '/operasional/administrasi',
      });
    }

    return newLetter;
  }

  async approveLetter(letterId: string, isApproved: boolean) {
    const ltr = sharedLetters.find((l) => l.id === letterId);
    if (!ltr) throw new NotFoundException('Surat tidak ditemukan');
    ltr.status = isApproved ? 'APPROVED' : 'REJECTED';
    ltr.approvedDate = isApproved ? new Date().toISOString().split('T')[0] : undefined;
    ltr.signedBy = isApproved ? 'Dr. Hendra Wijaya, M.Pd. (Kepala BAAK)' : undefined;

    if (this.eventsGateway) {
      this.eventsGateway.broadcastNotification({
        id: `notif-appr-${Date.now()}`,
        title: isApproved ? 'Surat Telah Disetujui BAAK' : 'Permohonan Surat Ditolak',
        message: `${ltr.title} No: ${ltr.letterNumber} telah ${isApproved ? 'disahkan dan ditandatangani secara digital' : 'ditolak'}.`,
        category: 'AKADEMIK',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        link: '/operasional/administrasi',
      });
    }

    return ltr;
  }
}
