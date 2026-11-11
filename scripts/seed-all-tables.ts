import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function seedAll() {
  console.log('======================================================================');
  console.log('Starting Complete Enterprise Seeding for ALL 49 Tables in Neon DB...');
  console.log('======================================================================\n');

  const defaultPasswordHash = await argon2.hash('AdminPassword123!', {
    timeCost: 2,
    memoryCost: 32768,
    parallelism: 2,
  });

  // 1. Roles & Permissions Matrix
  console.log('1. Seeding Permissions and RolePermission matrix...');
  const permissionsData = [
    // Academic Module
    { module: 'ACADEMIC', action: 'READ', code: 'ACADEMIC:READ', description: 'Melihat data kurikulum, jadwal, dan nilai' },
    { module: 'ACADEMIC', action: 'CREATE', code: 'ACADEMIC:CREATE', description: 'Membuat kurikulum, mata kuliah, dan kelas' },
    { module: 'ACADEMIC', action: 'UPDATE', code: 'ACADEMIC:UPDATE', description: 'Mengubah jadwal, kurikulum, dan nilai' },
    { module: 'ACADEMIC', action: 'APPROVE', code: 'ACADEMIC:APPROVE', description: 'Menyetujui KRS dan pengesahan surat BAAK' },
    // Finance Module
    { module: 'FINANCE', action: 'READ', code: 'FINANCE:READ', description: 'Melihat tagihan, invoice, dan riwayat pembayaran' },
    { module: 'FINANCE', action: 'CREATE', code: 'FINANCE:CREATE', description: 'Membuat invoice UKT dan tagihan kuliah' },
    { module: 'FINANCE', action: 'APPROVE', code: 'FINANCE:APPROVE', description: 'Mengesahkan rekonsiliasi dan verifikasi kas' },
    // LMS Module
    { module: 'LMS', action: 'READ', code: 'LMS:READ', description: 'Mengakses materi kuliah dan silabus digital' },
    { module: 'LMS', action: 'CREATE', code: 'LMS:CREATE', description: 'Mengunggah materi pembelajaran dan tugas' },
    { module: 'LMS', action: 'GRADE', code: 'LMS:GRADE', description: 'Memberikan nilai dan umpan balik tugas mahasiswa' },
    // System Module
    { module: 'SYSTEM', action: 'MANAGE', code: 'SYSTEM:MANAGE', description: 'Pengelolaan pengguna, audit log, dan backup' },
    // Library Module
    { module: 'LIBRARY', action: 'MANAGE', code: 'LIBRARY:MANAGE', description: 'Peminjaman dan manajemen katalog buku' },
  ];

  const permissions: any[] = [];
  for (const p of permissionsData) {
    const perm = await prisma.permission.upsert({
      where: { code: p.code },
      update: {},
      create: p,
    });
    permissions.push(perm);
  }
  console.log(`   ✓ Seeded ${permissions.length} granular permissions.`);

  const allRoles = await prisma.role.findMany();
  for (const role of allRoles) {
    for (const perm of permissions) {
      let shouldAssign = false;
      if (role.code === 'SUPER_ADMIN') shouldAssign = true;
      else if (role.code === 'RECTOR' && perm.action === 'READ') shouldAssign = true;
      else if (role.code === 'ACADEMIC_ADMIN' && perm.module === 'ACADEMIC') shouldAssign = true;
      else if (role.code === 'FINANCE_ADMIN' && perm.module === 'FINANCE') shouldAssign = true;
      else if (role.code === 'LECTURER' && (perm.module === 'ACADEMIC' || perm.module === 'LMS')) shouldAssign = true;
      else if (role.code === 'STUDENT' && perm.action === 'READ') shouldAssign = true;
      else if (role.code === 'LIBRARIAN' && perm.module === 'LIBRARY') shouldAssign = true;

      if (shouldAssign) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: perm.id,
            },
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: perm.id,
          },
        });
      }
    }
  }
  console.log(`   ✓ Seeded RolePermission RBAC mappings.`);

  // 2. Additional Faculties & Study Programs
  console.log('2. Seeding Multi-Faculty & Study Programs...');
  const univ = await prisma.university.findFirstOrThrow();
  const campus = await prisma.campus.findFirstOrThrow();

  const facultyEkonomi = await prisma.faculty.upsert({
    where: { code: 'FEB' },
    update: {},
    create: {
      universityId: univ.id,
      code: 'FEB',
      name: 'Fakultas Ekonomi dan Bisnis',
      deanName: 'Dr. Hj. Ratna Sari, S.E., M.M., Ak.',
    },
  });

  const prodiManajemen = await prisma.studyProgram.upsert({
    where: { code: 'MNJ' },
    update: {},
    create: {
      facultyId: facultyEkonomi.id,
      code: 'MNJ',
      name: 'Manajemen Keuangan & Bisnis (S1)',
      degreeLevel: 'S1',
      headOfProgram: 'Dr. Agus Wahyudi, S.E., M.Sc.',
      accreditation: 'Unggul',
    },
  });

  const prodiSI = await prisma.studyProgram.upsert({
    where: { code: 'SI' },
    update: {},
    create: {
      facultyId: (await prisma.faculty.findFirstOrThrow({ where: { code: 'FTI' } })).id,
      code: 'SI',
      name: 'Sistem Informasi Enterprise (S1)',
      degreeLevel: 'S1',
      headOfProgram: 'Dr. Ir. Bambang Hermanto, M.Kom.',
      accreditation: 'A',
    },
  });
  console.log('   ✓ Seeded additional Faculties (FEB) and Study Programs (Manajemen, SI).');

  // 3. Multi-Role Users & Employees
  console.log('3. Seeding Enterprise Users across all 14 roles and Employee records...');
  const roleAccounts = [
    { username: 'rektor', email: 'rektor@icms.ac.id', fullName: 'Prof. Dr. Ir. H. Muhammad Anshar, M.Sc.', roleCode: 'RECTOR' },
    { username: 'warek', email: 'warek1@icms.ac.id', fullName: 'Dr. Ir. Suryadi Pratama, M.Eng.', roleCode: 'VICE_RECTOR' },
    { username: 'dekan_fti', email: 'dekan.fti@icms.ac.id', fullName: 'Prof. Dr. Ir. Hendra Setiawan, M.Eng.', roleCode: 'DEAN' },
    { username: 'kaprodi_if', email: 'kaprodi.if@icms.ac.id', fullName: 'Dr. Anita Rahmawati, S.Kom., M.T.', roleCode: 'HEAD_OF_PROGRAM' },
    { username: 'baak_admin', email: 'baak@icms.ac.id', fullName: 'Drs. Tri Wahyono, M.Pd.', roleCode: 'ACADEMIC_ADMIN' },
    { username: 'bauk_admin', email: 'bauk@icms.ac.id', fullName: 'Rina Kartika Dewi, S.E., Ak., M.Ak.', roleCode: 'FINANCE_ADMIN' },
    { username: 'pmb_admin', email: 'pmb@icms.ac.id', fullName: 'Ahmad Faisal, S.Sos., M.I.Kom.', roleCode: 'ADMISSION_ADMIN' },
    { username: 'pustakawan', email: 'perpustakaan@icms.ac.id', fullName: 'Dewi Lestari, S.I.Pust., M.Hum.', roleCode: 'LIBRARIAN' },
    { username: 'hrd_admin', email: 'hrd@icms.ac.id', fullName: 'Dra. Endang Setyowati, M.M.', roleCode: 'HR_ADMIN' },
    { username: 'kemahasiswaan', email: 'kemahasiswaan@icms.ac.id', fullName: 'Ir. Wahyu Hidayat, M.T.', roleCode: 'STUDENT_AFFAIRS_ADMIN' },
    { username: 'alumni_lead', email: 'alumni@icms.ac.id', fullName: 'Bayu Wicaksono, S.Kom. (Alumni 2022)', roleCode: 'ALUMNI' },
  ];

  const seededUsers: any[] = [];
  for (const acc of roleAccounts) {
    const role = allRoles.find((r) => r.code === acc.roleCode);
    const user = await prisma.user.upsert({
      where: { email: acc.email },
      update: {},
      create: {
        username: acc.username,
        email: acc.email,
        fullName: acc.fullName,
        passwordHash: defaultPasswordHash,
        phoneNumber: '0812' + Math.floor(10000000 + Math.random() * 90000000),
        isActive: true,
        isVerified: true,
      },
    });
    seededUsers.push(user);

    if (role) {
      const existingMap = await prisma.userRoleMap.findFirst({
        where: { userId: user.id, roleId: role.id },
      });
      if (!existingMap) {
        await prisma.userRoleMap.create({
          data: {
            userId: user.id,
            roleId: role.id,
          },
        });
      }
    }

    // Seed Employee Record
    await prisma.employee.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        nip: '1985' + Math.floor(10000000 + Math.random() * 90000000),
        position: acc.fullName.includes('Prof.') ? 'Guru Besar' : (acc.fullName.includes('Dr.') ? 'Lektor Kepala' : 'Staf Madya Operasional'),
        department: acc.roleCode.includes('ACADEMIC') ? 'Biro Administrasi Akademik' : (acc.roleCode.includes('FINANCE') ? 'Biro Administrasi Keuangan' : 'Rektorat & Dekanat'),
        employmentType: 'PERMANENT',
        salaryBase: 9500000,
        joinedAt: new Date('2018-03-01'),
      },
    });
  }
  console.log(`   ✓ Seeded ${seededUsers.length} role-specific enterprise users and Employee records.`);

  // 4. Password Resets
  console.log('4. Seeding PasswordReset tokens...');
  const adminUser = await prisma.user.findFirstOrThrow({ where: { username: 'admin' } });
  await prisma.passwordReset.upsert({
    where: { tokenHash: 'sample_token_hash_reset_demo_2026_xyz' },
    update: {},
    create: {
      userId: adminUser.id,
      tokenHash: 'sample_token_hash_reset_demo_2026_xyz',
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000),
      isUsed: false,
    },
  });
  console.log('   ✓ Seeded PasswordReset records.');

  // 5. Additional Students, Guardians, Documents, and Status Histories
  console.log('5. Seeding Students, Guardians, Documents, and Status Histories...');
  const prodiIF = await prisma.studyProgram.findFirstOrThrow({ where: { code: 'IF' } });
  const lecturerUser = await prisma.user.findFirstOrThrow({ where: { email: 'dosen@icms.ac.id' } });
  const lecturer = await prisma.lecturer.findFirstOrThrow({ where: { userId: lecturerUser.id } });

  const extraStudentsData = [
    { nim: '2024011002', name: 'Siti Nurhaliza', email: 'siti.nurhaliza@icms.ac.id', gpa: 3.92, credits: 78, semester: 4 },
    { nim: '2024011003', name: 'Rian Hidayatullah', email: 'rian.hidayat@icms.ac.id', gpa: 3.65, credits: 62, semester: 4 },
    { nim: '2023011015', name: 'Fadhil Pratama Putra', email: 'fadhil.pratama@icms.ac.id', gpa: 3.78, credits: 110, semester: 6 },
  ];

  for (const s of extraStudentsData) {
    const sUser = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        username: s.nim,
        email: s.email,
        fullName: s.name,
        passwordHash: defaultPasswordHash,
        phoneNumber: '0813' + Math.floor(10000000 + Math.random() * 90000000),
        isActive: true,
        isVerified: true,
      },
    });

    const studentRole = allRoles.find((r) => r.code === 'STUDENT')!;
    const existingStudentMap = await prisma.userRoleMap.findFirst({
      where: { userId: sUser.id, roleId: studentRole.id },
    });
    if (!existingStudentMap) {
      await prisma.userRoleMap.create({
        data: {
          userId: sUser.id,
          roleId: studentRole.id,
        },
      });
    }

    const student = await prisma.student.upsert({
      where: { nim: s.nim },
      update: {},
      create: {
        userId: sUser.id,
        studyProgramId: prodiIF.id,
        advisorId: lecturer.id,
        nim: s.nim,
        entryYear: 2024,
        entrySemester: '2024-1',
        currentSemester: s.semester,
        gpa: s.gpa,
        totalCredits: s.credits,
        status: 'ACTIVE',
        gender: s.name.includes('Siti') ? 'P' : 'L',
        dateOfBirth: new Date('2004-05-12'),
        placeOfBirth: 'Jakarta',
      },
    });

    // Seed StudentGuardian
    await prisma.studentGuardian.create({
      data: {
        studentId: student.id,
        name: 'H. Bambang Irawan (Orang Tua ' + s.name + ')',
        relation: 'FATHER',
        phoneNumber: '081298765432',
        email: 'wali.' + s.nim + '@gmail.com',
        occupation: 'Wiraswasta / Pegawai Swasta',
        incomeRange: 'Rp 10.000.000 - Rp 25.000.000',
      },
    });

    // Seed StudentDocument
    await prisma.studentDocument.create({
      data: {
        studentId: student.id,
        title: 'Ijazah SMA Legalisir Resmi - ' + s.name,
        type: 'IJAZAH',
        fileUrl: 'https://storage.uim.ac.id/docs/' + s.nim + '/ijazah.pdf',
        fileSize: 1420500,
        mimeType: 'application/pdf',
        isVerified: true,
      },
    });

    await prisma.studentDocument.create({
      data: {
        studentId: student.id,
        title: 'Kartu Tanda Penduduk (KTP) Asli - ' + s.name,
        type: 'KTP',
        fileUrl: 'https://storage.uim.ac.id/docs/' + s.nim + '/ktp.jpg',
        fileSize: 420500,
        mimeType: 'image/jpeg',
        isVerified: true,
      },
    });

    // Seed StudentStatusHistory
    await prisma.studentStatusHistory.create({
      data: {
        studentId: student.id,
        prevStatus: 'ADMITTED',
        newStatus: 'ACTIVE',
        reason: 'Heregistrasi dan Pelunasan Biaya Kuliah Semester Genap TA 2026/2027 Berhasil',
        changedBy: 'Sistem Registrasi Akademik Terpadu (BAAK)',
      },
    });
  }
  console.log('   ✓ Seeded extra Students, StudentGuardians, StudentDocuments, and StudentStatusHistories.');

  // 6. Course Prerequisite
  console.log('6. Seeding CoursePrerequisite relationships...');
  const courseIF101 = await prisma.course.findFirstOrThrow({ where: { code: 'IF101' } });
  const courseIF102 = await prisma.course.findFirstOrThrow({ where: { code: 'IF102' } });
  const courseIF201 = await prisma.course.findFirstOrThrow({ where: { code: 'IF201' } });

  await prisma.coursePrerequisite.upsert({
    where: {
      courseId_prerequisiteId: {
        courseId: courseIF102.id,
        prerequisiteId: courseIF101.id,
      },
    },
    update: {},
    create: {
      courseId: courseIF102.id,
      prerequisiteId: courseIF101.id,
      minGrade: 'C',
    },
  });

  await prisma.coursePrerequisite.upsert({
    where: {
      courseId_prerequisiteId: {
        courseId: courseIF201.id,
        prerequisiteId: courseIF102.id,
      },
    },
    update: {},
    create: {
      courseId: courseIF201.id,
      prerequisiteId: courseIF102.id,
      minGrade: 'C',
    },
  });
  console.log('   ✓ Seeded CoursePrerequisites (IF101 -> IF102 -> IF201).');

  // 7. Attendance Sessions & Records
  console.log('7. Seeding AttendanceSessions and AttendanceRecords...');
  const courseClass = await prisma.courseClass.findFirstOrThrow();
  const demoStudent = await prisma.student.findFirstOrThrow();

  const attSession1 = await prisma.attendanceSession.create({
    data: {
      classId: courseClass.id,
      lecturerId: lecturer.id,
      sessionNum: 1,
      date: new Date('2026-09-08'),
      startTime: new Date('2026-09-08T08:00:00Z'),
      endTime: new Date('2026-09-08T10:30:00Z'),
      topic: 'Pengantar Desain Algoritma & Kompleksitas Komputasi (Big-O)',
      qrCodeToken: 'QR-ATT-SESS-01-IF101-AUTH',
      isOpen: false,
    },
  });

  const attSession2 = await prisma.attendanceSession.create({
    data: {
      classId: courseClass.id,
      lecturerId: lecturer.id,
      sessionNum: 2,
      date: new Date(),
      startTime: new Date(Date.now() - 3600 * 1000),
      endTime: new Date(Date.now() + 3600 * 1000),
      topic: 'Struktur Data Pohon Biner & Graf Terapan pada Database',
      qrCodeToken: 'QR-ATT-SESS-02-ACTIVE-TOKEN',
      isOpen: true,
    },
  });

  await prisma.attendanceRecord.create({
    data: {
      sessionId: attSession1.id,
      studentId: demoStudent.id,
      status: 'PRESENT',
      checkInTime: new Date('2026-09-08T08:05:12Z'),
      latitude: -6.2088,
      longitude: 106.8456,
      notes: 'Presensi scan QR Berhasil di Ruang LAB-KOM-01',
    },
  });

  await prisma.attendanceRecord.create({
    data: {
      sessionId: attSession2.id,
      studentId: demoStudent.id,
      status: 'PRESENT',
      checkInTime: new Date(),
      latitude: -6.2088,
      longitude: 106.8456,
      notes: 'Presensi Realtime Check-in Berhasil',
    },
  });
  console.log('   ✓ Seeded AttendanceSessions and AttendanceRecords.');

  // 8. Exam & ExamAttempt
  console.log('8. Seeding Exams and ExamAttempts (CBT Online)...');
  const examMidterm = await prisma.exam.create({
    data: {
      classId: courseClass.id,
      title: 'Ujian Tengah Semester (UTS) Teori & Praktikum Pemrograman Lanjut',
      type: 'MIDTERM',
      durationMin: 90,
      startTime: new Date(Date.now() - 7 * 24 * 3600 * 1000),
      endTime: new Date(Date.now() - 7 * 24 * 3600 * 1000 + 2 * 3600 * 1000),
      isRandomized: true,
    },
  });

  const examFinal = await prisma.exam.create({
    data: {
      classId: courseClass.id,
      title: 'Ujian Akhir Semester (UAS) Simulasi CBT Komprehensif',
      type: 'FINAL',
      durationMin: 120,
      startTime: new Date(Date.now() + 14 * 24 * 3600 * 1000),
      endTime: new Date(Date.now() + 14 * 24 * 3600 * 1000 + 3 * 3600 * 1000),
      isRandomized: true,
    },
  });

  await prisma.examAttempt.create({
    data: {
      examId: examMidterm.id,
      studentId: demoStudent.id,
      startedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000),
      submittedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000 + 80 * 60 * 1000),
      score: 94.5,
      isGraded: true,
    },
  });
  console.log('   ✓ Seeded Exams and ExamAttempts.');

  // 9. Facilities
  console.log('9. Seeding Campus Facilities & Infrastructure...');
  const facilitiesData = [
    { name: 'Auditorium Utama Graha Nuswantara', type: 'AUDITORIUM', capacity: 1200, description: 'Gedung pertemuan akbar, wisuda, dan kuliah umum rektorat' },
    { name: 'Laboratorium Artificial Intelligence & Cloud Computing', type: 'LAB', capacity: 45, description: 'Lab berteknologi GPU Nvidia A100 untuk riset Machine Learning' },
    { name: 'Laboratorium Rekayasa Perangkat Lunak Terpadu', type: 'LAB', capacity: 40, description: 'Lab komputer workstation untuk mata kuliah praktikum' },
    { name: 'Gelanggang Olahraga & Lapangan Futsal / Basket', type: 'SPORTS', capacity: 300, description: 'Sarana olahraga dan pembinaan atlet mahasiswa' },
    { name: 'Creative Hub & Student Co-Working Lounge', type: 'ROOM', capacity: 80, description: 'Ruang kolaborasi dan inkubasi bisnis startup mahasiswa' },
  ];

  for (const f of facilitiesData) {
    await prisma.facility.create({
      data: {
        campusId: campus.id,
        name: f.name,
        type: f.type,
        capacity: f.capacity,
        description: f.description,
      },
    });
  }
  console.log(`   ✓ Seeded ${facilitiesData.length} Campus Facilities.`);

  // 10. Notifications
  console.log('10. Seeding Notifications...');
  const notifUsers = [adminUser, lecturerUser, await prisma.user.findFirstOrThrow({ where: { email: 'mahasiswa@icms.ac.id' } })];
  for (const u of notifUsers) {
    await prisma.notification.createMany({
      data: [
        {
          userId: u.id,
          title: 'Pengumuman Jadwal Ujian Tengah Semester (UTS)',
          message: 'Jadwal dan kartu ujian UTS Semester Ganjil 2026/2027 telah dapat diakses melalui portal masing-masing.',
          type: 'ACADEMIC',
          isRead: false,
        },
        {
          userId: u.id,
          title: 'Verifikasi Pembayaran UKT Berhasil',
          message: 'Transaksi keuangan Anda telah diverifikasi oleh sistem BAUK dan tercatat pada buku besar kas kampus.',
          type: 'PAYMENT',
          isRead: true,
        },
        {
          userId: u.id,
          title: 'Pemeliharaan Keamanan Server Terjadwal',
          message: 'Backup database snapshot dan pembaruan sertifikat enkripsi berkala telah dilaksanakan dengan sukses.',
          type: 'GENERAL',
          isRead: true,
        },
      ],
    });
  }
  console.log('   ✓ Seeded Notifications for multiple users.');

  // 11. Messages
  console.log('11. Seeding Direct Messages & Academic Consultations...');
  const studentUser = await prisma.user.findFirstOrThrow({ where: { email: 'mahasiswa@icms.ac.id' } });
  await prisma.message.createMany({
    data: [
      {
        senderId: studentUser.id,
        receiverId: lecturerUser.id,
        content: 'Selamat pagi Bapak Dr. Ir. Budi Santoso, mohon izin konsultasi terkait proposal skripsi saya tentang arsitektur microservices.',
        isRead: true,
      },
      {
        senderId: lecturerUser.id,
        receiverId: studentUser.id,
        content: 'Selamat pagi. Silakan bawa draf proposal Anda ke ruang dosen FTI lantai 3 hari Kamis jam 10:00.',
        isRead: true,
      },
      {
        senderId: studentUser.id,
        receiverId: lecturerUser.id,
        content: 'Baik Bapak, terima kasih banyak atas kesediaan waktunya.',
        isRead: false,
      },
    ],
  });
  console.log('   ✓ Seeded direct chat Messages between Student and Lecturer.');

  // 12. Audit Logs
  console.log('12. Seeding AuditLogs (System Activity & Compliance Tracking)...');
  const auditLogsData = [
    { action: 'LOGIN_SUCCESS', module: 'AUTH', targetId: adminUser.id, oldValue: null, newValue: 'IP: 10.1.13.117' },
    { action: 'APPROVE_KRS', module: 'ACADEMIC', targetId: 'REG-2026-001', oldValue: 'SUBMITTED', newValue: 'APPROVED' },
    { action: 'UPDATE_GRADE', module: 'ACADEMIC', targetId: 'SCORE-IF101-01', oldValue: '85.0', newValue: '92.5' },
    { action: 'VERIFY_PAYMENT', module: 'FINANCE', targetId: 'INV-2026-001', oldValue: 'UNPAID', newValue: 'PAID' },
    { action: 'ISSUE_LETTER', module: 'ACADEMIC', targetId: 'SK-BAAK-042', oldValue: 'PENDING', newValue: 'ISSUED_WITH_TTE' },
    { action: 'SYSTEM_BACKUP', module: 'SYSTEM', targetId: 'SNAPSHOT-20261111', oldValue: null, newValue: 'SUCCESS (24.8MB)' },
  ];

  for (const al of auditLogsData) {
    await prisma.auditLog.create({
      data: {
        userId: adminUser.id,
        action: al.action,
        module: al.module,
        targetId: al.targetId,
        oldValue: al.oldValue,
        newValue: al.newValue,
        ipAddress: '10.1.13.117',
      },
    });
  }
  console.log(`   ✓ Seeded ${auditLogsData.length} AuditLog entries.`);

  // 13. System Settings
  console.log('13. Seeding SystemSettings (Institution & Platform Configurations)...');
  const systemSettingsData = [
    { key: 'INSTITUTION_NAME', value: 'Universitas Indonesia Mandiri (UIM)', description: 'Nama resmi institusi pendidikan tinggi' },
    { key: 'CAMPUS_ACCREDITATION', value: 'Akreditasi Institusi Unggul (BAN-PT)', description: 'Peringkat akreditasi universitas' },
    { key: 'ACADEMIC_YEAR_ACTIVE', value: '2026/2027', description: 'Tahun akademik yang sedang berjalan' },
    { key: 'SEMESTER_ACTIVE', value: 'Ganjil 2026/2027', description: 'Semester operasional aktif' },
    { key: 'MAX_SKS_REGISTRATION', value: '24', description: 'Batas maksimal SKS yang dapat diambil mahasiswa per semester' },
    { key: 'PAYMENT_GATEWAY_MODE', value: 'SANDBOX_SIMULATION', description: 'Mode integrasi pembayaran Virtual Account & QRIS' },
    { key: 'MAINTENANCE_MODE', value: 'false', description: 'Status mode pemeliharaan sistem' },
    { key: 'TTE_VERIFICATION_URL', value: 'https://icms.uim.ac.id/verify-tte', description: 'URL verifikasi publik tanda tangan elektronik berkode QR' },
  ];

  for (const ss of systemSettingsData) {
    await prisma.systemSetting.upsert({
      where: { key: ss.key },
      update: { value: ss.value, description: ss.description },
      create: ss,
    });
  }
  console.log(`   ✓ Seeded ${systemSettingsData.length} global SystemSetting parameters.`);

  console.log('\n======================================================================');
  console.log('SUCCESS: All 49 Tables Seeded and Synchronized in Neon Database!');
  console.log('======================================================================\n');
}

seedAll()
  .catch((err) => {
    console.error('Seeding error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
