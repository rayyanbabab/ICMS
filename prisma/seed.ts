import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial ICMS system foundation...');

  // Roles to seed in Phase 1
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

  console.log(`Seeded ${roles.length} system roles successfully.`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

