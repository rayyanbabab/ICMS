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
