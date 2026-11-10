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

  // 2. Seed University & Organizational Hierarchy
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

  console.log('✓ Seeded organizational structure (University, Campus, Faculty, Program, Academic Year, Semester).');

  // 3. Seed Users with Argon2id passwords
  const superAdminRole = await prisma.role.findUniqueOrThrow({ where: { code: 'SUPER_ADMIN' } });
  const lecturerRole = await prisma.role.findUniqueOrThrow({ where: { code: 'LECTURER' } });
  const studentRole = await prisma.role.findUniqueOrThrow({ where: { code: 'STUDENT' } });

  const adminPasswordHash = await argon2.hash('AdminPassword123!');
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

  await prisma.student.upsert({
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

  console.log('✓ Seeded standard default users (Admin, Lecturer, Student).');
  console.log('===========================================================');
  console.log('Credentials:');
  console.log('1. Super Admin: admin / AdminPassword123! (admin@icms.ac.id)');
  console.log('2. Dosen      : dosen / DosenPassword123! (dosen@icms.ac.id)');
  console.log('3. Mahasiswa  : mahasiswa / MahasiswaPassword123! (mahasiswa@icms.ac.id)');
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
