import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding comprehensive ICMS enterprise master foundation...');

  // 1. Seed Roles
  const roles = [
    { code: 'SUPER_ADMIN', name: 'Super Administrator', isSystem: true },
    { code: 'RECTOR', name: 'Rektor', isSystem: true },
    { code: 'VICE_RECTOR', name: 'Wakil Rektor', isSystem: true },
    { code: 'DEAN', name: 'Dekan Fakultas', isSystem: true },
    { code: 'HEAD_OF_PROGRAM', name: 'Ketua Program Studi (Kaprodi)', isSystem: true },
    { code: 'ACADEMIC_ADMIN', name: 'Administrator Akademik (BAAK)', isSystem: true },
    { code: 'FINANCE_ADMIN', name: 'Administrator Keuangan (BAUK)', isSystem: true },
    { code: 'ADMISSION_ADMIN', name: 'Administrator Admisi (PMB)', isSystem: true },
    { code: 'LECTURER', name: 'Dosen Pengajar & Wali', isSystem: true },
    { code: 'STUDENT', name: 'Mahasiswa', isSystem: true },
    { code: 'LIBRARIAN', name: 'Pustakawan', isSystem: true },
    { code: 'HR_ADMIN', name: 'Administrator Kepegawaian (SDM)', isSystem: true },
    { code: 'STUDENT_AFFAIRS_ADMIN', name: 'Administrator Kemahasiswaan', isSystem: true },
    { code: 'ALUMNI', name: 'Alumni', isSystem: true },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: {},
      create: role,
    });
  }
  console.log(`✓ Seeded ${roles.length} system roles.`);

  // 2. Organization Structure
  const university = await prisma.university.upsert({
    where: { code: 'UIM' },
    update: {},
    create: {
      code: 'UIM',
      name: 'Universitas Indonesia Mandiri',
      legalName: 'Universitas Indonesia Mandiri Terpadu',
      address: 'Jl. Kampus Merdeka No. 10, Jakarta Selatan',
      phone: '+62 21 89765432',
      email: 'rektorat@uim.ac.id',
      website: 'https://uim.ac.id',
      accreditation: 'Unggul',
    },
  });

  const campus = await prisma.campus.upsert({
    where: { code: 'KAMPUS-A' },
    update: {},
    create: {
      universityId: university.id,
      code: 'KAMPUS-A',
      name: 'Kampus Utama Thamrin',
      address: 'Jl. M.H. Thamrin No. 45',
      city: 'Jakarta Pusat',
    },
  });

  const faculty = await prisma.faculty.upsert({
    where: { code: 'FTI' },
    update: {},
    create: {
      universityId: university.id,
      code: 'FTI',
      name: 'Fakultas Teknologi Informasi',
      deanName: 'Prof. Dr. Ir. Hendra Setiawan, M.Eng.',
    },
  });

  const studyProgram = await prisma.studyProgram.upsert({
    where: { code: 'IF' },
    update: {},
    create: {
      facultyId: faculty.id,
      code: 'IF',
      name: 'Teknik Informatika (S1)',
      degreeLevel: 'S1',
      headOfProgram: 'Dr. Anita Rahmawati, S.Kom., M.T.',
      accreditation: 'A',
    },
  });

  const academicYear = await prisma.academicYear.upsert({
    where: { code: '2026/2027' },
    update: {},
    create: {
      code: '2026/2027',
      name: 'Tahun Akademik 2026/2027',
      startDate: new Date('2026-09-01'),
      endDate: new Date('2027-08-31'),
      isActive: true,
    },
  });

  const semester = await prisma.semester.upsert({
    where: { code: '2026-1' },
    update: {},
    create: {
      academicYearId: academicYear.id,
      code: '2026-1',
      name: 'Semester Ganjil 2026/2027',
      type: 'ODD',
      startDate: new Date('2026-09-01'),
      endDate: new Date('2027-01-31'),
      krsStartDate: new Date('2026-08-15'),
      krsEndDate: new Date('2026-09-10'),
      isActive: true,
    },
  });

  // 3. Classrooms
  const roomA = await prisma.classroom.upsert({
    where: { code: 'LAB-KOM-01' },
    update: {},
    create: {
      campusId: campus.id,
      code: 'LAB-KOM-01',
      name: 'Laboratorium Komputer & Rekayasa Perangkat Lunak',
      capacity: 40,
      building: 'Gedung Rektorat & Lab Terpadu',
      floor: 3,
      isLab: true,
    },
  });

  const roomB = await prisma.classroom.upsert({
    where: { code: 'R-TEORI-302' },
    update: {},
    create: {
      campusId: campus.id,
      code: 'R-TEORI-302',
      name: 'Ruang Teori 302',
      capacity: 50,
      building: 'Gedung FTI',
      floor: 3,
      isLab: false,
    },
  });

  // 4. Curriculum & Courses
  const curriculum = await prisma.curriculum.upsert({
    where: { code: 'KUR-IF-2024' },
    update: {},
    create: {
      studyProgramId: studyProgram.id,
      code: 'KUR-IF-2024',
      name: 'Kurikulum Merdeka Teknik Informatika 2024',
      year: 2024,
      totalCredits: 144,
      isActive: true,
    },
  });

  const coursesData = [
    { code: 'IF101', name: 'Algoritma & Pemrograman Dasar', englishName: 'Fundamentals of Algorithm & Programming', credits: 3, semester: 1, type: 'MANDATORY' },
    { code: 'IF102', name: 'Matematika Diskrit', englishName: 'Discrete Mathematics', credits: 3, semester: 1, type: 'MANDATORY' },
    { code: 'IF103', name: 'Pengantar Teknologi Informasi', englishName: 'Introduction to Information Technology', credits: 2, semester: 1, type: 'MANDATORY' },
    { code: 'IF201', name: 'Struktur Data & Algoritma Lanjut', englishName: 'Data Structures & Algorithms', credits: 4, semester: 2, type: 'MANDATORY' },
    { code: 'IF202', name: 'Sistem Basis Data', englishName: 'Database Systems', credits: 3, semester: 2, type: 'MANDATORY' },
    { code: 'IF301', name: 'Rekayasa Perangkat Lunak', englishName: 'Software Engineering', credits: 3, semester: 3, type: 'MANDATORY' },
    { code: 'IF302', name: 'Jaringan Komputer & Keamanan', englishName: 'Computer Networks & Security', credits: 3, semester: 3, type: 'MANDATORY' },
    { code: 'IF303', name: 'Kecerdasan Buatan (AI)', englishName: 'Artificial Intelligence', credits: 3, semester: 5, type: 'ELECTIVE' },
  ];

  const seededCourses: Record<string, any> = {};
  for (const c of coursesData) {
    const course = await prisma.course.upsert({
      where: { code: c.code },
      update: {},
      create: {
        curriculumId: curriculum.id,
        ...c,
      },
    });
    seededCourses[c.code] = course;
  }
  console.log(`✓ Seeded ${coursesData.length} academic courses.`);

  // 5. Seed Users & Profiles
  const superAdminRole = await prisma.role.findUniqueOrThrow({ where: { code: 'SUPER_ADMIN' } });
  const rectorRole = await prisma.role.findUniqueOrThrow({ where: { code: 'RECTOR' } });
  const lecturerRole = await prisma.role.findUniqueOrThrow({ where: { code: 'LECTURER' } });
  const studentRole = await prisma.role.findUniqueOrThrow({ where: { code: 'STUDENT' } });

  const adminPasswordHash = await argon2.hash('AdminPassword123!');
  const rektorPasswordHash = await argon2.hash('RektorPassword123!');
  const dosenPasswordHash = await argon2.hash('DosenPassword123!');
  const mhsPasswordHash = await argon2.hash('MahasiswaPassword123!');

  // Super Admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@icms.ac.id' },
    update: {},
    create: {
      email: 'admin@icms.ac.id',
      username: 'admin',
      passwordHash: adminPasswordHash,
      fullName: 'Super Administrator ICMS',
      phoneNumber: '081234567890',
      isActive: true,
      isVerified: true,
    },
  });

  await prisma.userRoleMap.upsert({
    where: {
      userId_roleId_facultyId_studyProgramId: {
        userId: adminUser.id,
        roleId: superAdminRole.id,
        facultyId: faculty.id,
        studyProgramId: studyProgram.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: superAdminRole.id,
      facultyId: faculty.id,
      studyProgramId: studyProgram.id,
    },
  });

  // Rector
  const rektorUser = await prisma.user.upsert({
    where: { email: 'rektor@icms.ac.id' },
    update: {},
    create: {
      email: 'rektor@icms.ac.id',
      username: 'rektor',
      passwordHash: rektorPasswordHash,
      fullName: 'Prof. Dr. Ir. Hendra Setiawan, M.Eng.',
      phoneNumber: '081198765432',
      isActive: true,
      isVerified: true,
    },
  });

  await prisma.userRoleMap.upsert({
    where: {
      userId_roleId_facultyId_studyProgramId: {
        userId: rektorUser.id,
        roleId: rectorRole.id,
        facultyId: faculty.id,
        studyProgramId: studyProgram.id,
      },
    },
    update: {},
    create: {
      userId: rektorUser.id,
      roleId: rectorRole.id,
      facultyId: faculty.id,
      studyProgramId: studyProgram.id,
    },
  });

  // Lecturer
  const dosenUser = await prisma.user.upsert({
    where: { email: 'dosen@icms.ac.id' },
    update: {},
    create: {
      email: 'dosen@icms.ac.id',
      username: 'dosen',
      passwordHash: dosenPasswordHash,
      fullName: 'Dr. Ir. Budi Santoso, M.Kom.',
      phoneNumber: '081298765432',
      isActive: true,
      isVerified: true,
    },
  });

  await prisma.userRoleMap.upsert({
    where: {
      userId_roleId_facultyId_studyProgramId: {
        userId: dosenUser.id,
        roleId: lecturerRole.id,
        facultyId: faculty.id,
        studyProgramId: studyProgram.id,
      },
    },
    update: {},
    create: {
      userId: dosenUser.id,
      roleId: lecturerRole.id,
      facultyId: faculty.id,
      studyProgramId: studyProgram.id,
    },
  });

  const lecturer = await prisma.lecturer.upsert({
    where: { userId: dosenUser.id },
    update: {},
    create: {
      userId: dosenUser.id,
      studyProgramId: studyProgram.id,
      nidn: '0012058001',
      nip: '198005122005011002',
      academicRank: 'Lektor Kepala',
      highestDegree: 'S3',
      specialization: 'Artificial Intelligence & Software Architecture',
    },
  });

  // Student
  const mhsUser = await prisma.user.upsert({
    where: { email: 'mahasiswa@icms.ac.id' },
    update: {},
    create: {
      email: 'mahasiswa@icms.ac.id',
      username: 'mahasiswa',
      passwordHash: mhsPasswordHash,
      fullName: 'Ahmad Fauzi',
      phoneNumber: '081345678901',
      isActive: true,
      isVerified: true,
    },
  });

  await prisma.userRoleMap.upsert({
    where: {
      userId_roleId_facultyId_studyProgramId: {
        userId: mhsUser.id,
        roleId: studentRole.id,
        facultyId: faculty.id,
        studyProgramId: studyProgram.id,
      },
    },
    update: {},
    create: {
      userId: mhsUser.id,
      roleId: studentRole.id,
      facultyId: faculty.id,
      studyProgramId: studyProgram.id,
    },
  });

  const student = await prisma.student.upsert({
    where: { userId: mhsUser.id },
    update: {},
    create: {
      userId: mhsUser.id,
      studyProgramId: studyProgram.id,
      nim: '202601001',
      entryYear: 2026,
      entrySemester: '2026-1',
      currentSemester: 1,
      status: 'ACTIVE',
      advisorId: lecturer.id,
      gpa: 3.85,
      totalCredits: 20,
    },
  });

  // 6. Course Offerings & Classes for active semester
  const activeCourses = [seededCourses['IF101'], seededCourses['IF102'], seededCourses['IF103'], seededCourses['IF202']];
  const seededClasses: any[] = [];

  for (const c of activeCourses) {
    if (!c) continue;
    const offering = await prisma.courseOffering.upsert({
      where: {
        semesterId_courseId: {
          semesterId: semester.id,
          courseId: c.id,
        },
      },
      update: {},
      create: {
        semesterId: semester.id,
        courseId: c.id,
      },
    });

    const courseClass = await prisma.courseClass.upsert({
      where: { id: `class-${c.code}-01` },
      update: {},
      create: {
        id: `class-${c.code}-01`,
        courseOfferingId: offering.id,
        lecturerId: lecturer.id,
        name: `${c.code}-01`,
        capacity: 40,
        enrolledCount: 1,
      },
    });

    seededClasses.push(courseClass);

    // Class schedule
    await prisma.classSchedule.create({
      data: {
        classId: courseClass.id,
        classroomId: c.code === 'IF101' ? roomA.id : roomB.id,
        dayOfWeek: 1, // Monday
        startTime: '08:00',
        endTime: '10:30',
      },
    }).catch(() => {});
  }
  console.log(`✓ Seeded course offerings, classes, and schedules.`);

  // 7. Initial Student Registration (KRS) & KHS Grades
  const registration = await prisma.studentRegistration.upsert({
    where: {
      studentId_semesterId: {
        studentId: student.id,
        semesterId: semester.id,
      },
    },
    update: {},
    create: {
      studentId: student.id,
      semesterId: semester.id,
      status: 'APPROVED',
      totalCredits: 11,
      maxCredits: 24,
      gpaPrevious: 3.85,
      submittedAt: new Date(),
      approvedAt: new Date(),
      approvedBy: lecturer.id,
    },
  });

  // Seed sample grades for KHS display
  const sampleGrades = [
    { classId: seededClasses[0]?.id, score: 92.5, gradeLetter: 'A', gradePoint: 4.0 },
    { classId: seededClasses[1]?.id, score: 85.0, gradeLetter: 'A', gradePoint: 4.0 },
    { classId: seededClasses[2]?.id, score: 78.5, gradeLetter: 'B+', gradePoint: 3.5 },
    { classId: seededClasses[3]?.id, score: 88.0, gradeLetter: 'A', gradePoint: 4.0 },
  ];

  for (const sg of sampleGrades) {
    if (!sg.classId) continue;
    await prisma.studentRegistrationDetail.upsert({
      where: {
        registrationId_classId: {
          registrationId: registration.id,
          classId: sg.classId,
        },
      },
      update: {},
      create: {
        registrationId: registration.id,
        classId: sg.classId,
        scoreNumeric: sg.score,
        gradeLetter: sg.gradeLetter,
        gradePoint: sg.gradePoint,
        isPublished: true,
      },
    });
  }
  console.log(`✓ Seeded student registration, KRS approval, and KHS grade details.`);

  // 8. Finance & UKT Invoices
  const paidInvoice = await prisma.studentInvoice.upsert({
    where: { invoiceNumber: 'INV-2026-0001' },
    update: {},
    create: {
      studentId: student.id,
      semesterId: semester.id,
      invoiceNumber: 'INV-2026-0001',
      title: 'UKT / SPP Semester Ganjil 2026/2027',
      amount: 6500000,
      paidAmount: 6500000,
      status: 'PAID',
      dueDate: new Date('2026-09-01'),
      paidAt: new Date('2026-08-28'),
    },
  });

  await prisma.invoiceItem.createMany({
    data: [
      { invoiceId: paidInvoice.id, name: 'Biaya Pokok Pendidikan (BPP / UKT)', amount: 4500000 },
      { invoiceId: paidInvoice.id, name: 'Biaya Praktikum Laboratorium Software', amount: 1500000 },
      { invoiceId: paidInvoice.id, name: 'Iuran Asuransi Mahasiswa & Fasilitas Kampus', amount: 500000 },
    ],
    skipDuplicates: true,
  }).catch(() => {});

  await prisma.payment.upsert({
    where: { referenceNo: 'PAY-VA-88202601001' },
    update: {},
    create: {
      invoiceId: paidInvoice.id,
      paymentMethod: 'VIRTUAL_ACCOUNT',
      referenceNo: 'PAY-VA-88202601001',
      amount: 6500000,
      status: 'SUCCESS',
      isVerified: true,
      paidAt: new Date('2026-08-28'),
    },
  });

  const unpaidInvoice = await prisma.studentInvoice.upsert({
    where: { invoiceNumber: 'INV-2026-0042' },
    update: {},
    create: {
      studentId: student.id,
      semesterId: semester.id,
      invoiceNumber: 'INV-2026-0042',
      title: 'Ujian Sertifikasi Internasional Cloud Computing (AWS/GCP)',
      amount: 1250000,
      paidAmount: 0,
      status: 'UNPAID',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // in 14 days
    },
  });

  await prisma.invoiceItem.createMany({
    data: [
      { invoiceId: unpaidInvoice.id, name: 'Voucher Ujian Resmi Cloud Architect', amount: 1000000 },
      { invoiceId: unpaidInvoice.id, name: 'Akses Mock Exam & Laboratorium Hands-on', amount: 250000 },
    ],
    skipDuplicates: true,
  }).catch(() => {});

  console.log('✓ Seeded student financial invoices and payments.');

  // 9. LMS Materials, Assignments & Submissions
  const primaryClass = seededClasses[0];
  if (primaryClass) {
    await prisma.courseMaterial.createMany({
      data: [
        {
          classId: primaryClass.id,
          title: 'Modul 01: Pengenalan Bahasa C & Sintaksis Komputasi',
          description: 'Materi pengantar instalasi GCC compiler, variabel, tipe data, dan I/O.',
          fileUrl: 'https://cdn.icms.ac.id/materials/if101-modul-01.pdf',
          fileType: 'PDF',
          fileSize: 2450000,
          order: 1,
        },
        {
          classId: primaryClass.id,
          title: 'Modul 02: Percabangan, Perulangan, dan Fungsi Rekursif',
          description: 'Logika kontrol alur program, pemecahan masalah rekursif, dan stack memory.',
          fileUrl: 'https://cdn.icms.ac.id/materials/if101-modul-02.pdf',
          fileType: 'PDF',
          fileSize: 3120000,
          order: 2,
        },
        {
          classId: primaryClass.id,
          title: 'Slide Kuliah 03: Pointer & Alokasi Memori Dinamis',
          description: 'Pembahasan mendalam konsep pointer, reference, malloc, dan free.',
          fileUrl: 'https://cdn.icms.ac.id/materials/if101-slide-03.pptx',
          fileType: 'PPTX',
          fileSize: 8400000,
          order: 3,
        },
      ],
      skipDuplicates: true,
    }).catch(() => {});

    const assignment1 = await prisma.assignment.create({
      data: {
        classId: primaryClass.id,
        title: 'Tugas Praktikum 1: Algoritma Pencarian & Sorting',
        description: 'Implementasikan algoritma QuickSort dan Binary Search dalam Bahasa C dengan analisis Big-O notation.',
        attachmentUrl: 'https://cdn.icms.ac.id/assignments/tugas1-spec.pdf',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // in 5 days
        maxScore: 100,
      },
    }).catch(() => null);

    const assignment2 = await prisma.assignment.create({
      data: {
        classId: primaryClass.id,
        title: 'Tugas Praktikum 2: Pointer & Struktur Data Senarai Tertaut (Linked List)',
        description: 'Buatlah struktur data Singly & Doubly Linked List lengkap dengan operasi penambahan, penghapusan, dan pembalikan node.',
        attachmentUrl: 'https://cdn.icms.ac.id/assignments/tugas2-spec.pdf',
        dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // in 12 days
        maxScore: 100,
      },
    }).catch(() => null);

    if (assignment1) {
      await prisma.assignmentSubmission.upsert({
        where: {
          assignmentId_studentId: {
            assignmentId: assignment1.id,
            studentId: student.id,
          },
        },
        update: {},
        create: {
          assignmentId: assignment1.id,
          studentId: student.id,
          fileUrl: 'https://cdn.icms.ac.id/submissions/202601001-tugas1.zip',
          submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          score: 95.0,
          feedback: 'Sangat baik! Implementasi rapi, memory leak free berdasarkan pengujian Valgrind.',
          gradedAt: new Date(),
        },
      });
    }
  }
  console.log('✓ Seeded LMS course materials, assignments, and sample submissions.');

  // 10. Digital Library Categories, Books, and Loans
  const catCS = await prisma.bookCategory.upsert({
    where: { name: 'Teknologi Informasi & Ilmu Komputer' },
    update: {},
    create: {
      name: 'Teknologi Informasi & Ilmu Komputer',
      description: 'Buku teks, jurnal ilmiah, dan referensi rekayasa perangkat lunak serta komputasi.',
    },
  });

  const catMath = await prisma.bookCategory.upsert({
    where: { name: 'Matematika & Sains Terapan' },
    update: {},
    create: {
      name: 'Matematika & Sains Terapan',
      description: 'Koleksi matematika diskrit, kalkulus, statistika data, dan fisika komputasi.',
    },
  });

  const catBisnis = await prisma.bookCategory.upsert({
    where: { name: 'Bisnis & Manajemen Teknologi' },
    update: {},
    create: {
      name: 'Bisnis & Manajemen Teknologi',
      description: 'Manajemen proyek TI, kepemimpinan digital, dan transformasi organisasi.',
    },
  });

  const book1 = await prisma.book.upsert({
    where: { isbn: '978-0132350884' },
    update: {},
    create: {
      categoryId: catCS.id,
      isbn: '978-0132350884',
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin ("Uncle Bob")',
      publisher: 'Prentice Hall',
      publishYear: 2008,
      isDigital: true,
      digitalUrl: 'https://elibrary.icms.ac.id/reader/clean-code',
      totalStock: 8,
      availableStock: 6,
      coverUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=400&q=80',
    },
  });

  await prisma.book.upsert({
    where: { isbn: '978-0262033848' },
    update: {},
    create: {
      categoryId: catCS.id,
      isbn: '978-0262033848',
      title: 'Introduction to Algorithms, Fourth Edition (CLRS)',
      author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
      publisher: 'MIT Press',
      publishYear: 2022,
      isDigital: true,
      digitalUrl: 'https://elibrary.icms.ac.id/reader/clrs-4th',
      totalStock: 12,
      availableStock: 9,
      coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    },
  });

  await prisma.book.upsert({
    where: { isbn: '978-1491950357' },
    update: {},
    create: {
      categoryId: catCS.id,
      isbn: '978-1491950357',
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      publisher: "O'Reilly Media",
      publishYear: 2017,
      isDigital: true,
      digitalUrl: 'https://elibrary.icms.ac.id/reader/ddia',
      totalStock: 6,
      availableStock: 5,
      coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
    },
  });

  await prisma.book.upsert({
    where: { isbn: '978-0134610993' },
    update: {},
    create: {
      categoryId: catMath.id,
      isbn: '978-0134610993',
      title: 'Discrete Mathematics and Its Applications, 8th Edition',
      author: 'Kenneth H. Rosen',
      publisher: 'McGraw-Hill Education',
      publishYear: 2019,
      isDigital: true,
      digitalUrl: 'https://elibrary.icms.ac.id/reader/discrete-math',
      totalStock: 15,
      availableStock: 14,
      coverUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80',
    },
  });

  // Library member for student
  const libMember = await prisma.libraryMember.upsert({
    where: { userId: student.userId },
    update: {},
    create: {
      userId: student.userId,
      memberCode: 'LIB-MHS-202601001',
    },
  });

  await prisma.bookLoan.create({
    data: {
      bookId: book1.id,
      memberId: libMember.id,
      borrowDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // due in 10 days
      status: 'BORROWED',
      penaltyFee: 0,
    },
  }).catch(() => {});

  console.log('✓ Seeded Digital Library categories, catalog books, member and active loans.');

  console.log('===========================================================');
  console.log('Database Seeding Complete!');
  console.log('===========================================================');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
