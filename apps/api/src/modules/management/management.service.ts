import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ManagementService {
  constructor(private readonly prisma: PrismaService) {}

  async getFacilities() {
    const classrooms = await this.prisma.classroom.findMany({
      include: {
        campus: true,
      },
    });

    const facilitiesList = [
      {
        id: 'FAC-01',
        name: 'Laboratorium Rekayasa Perangkat Lunak & Cloud Computing',
        code: 'LAB-KOM-01',
        type: 'LABORATORIUM',
        building: 'Gedung Rektorat & Lab Terpadu',
        floor: 3,
        capacity: 40,
        equipment: ['40 PC Core i7 32GB RAM', 'Gigabit LAN', 'Proyektor 4K', 'Smart Board', 'AC Dual Unit'],
        status: 'AVAILABLE',
        currentBooking: null,
      },
      {
        id: 'FAC-02',
        name: 'Auditorium Utama Universitas Indonesia Mandiri',
        code: 'AUD-THAMRIN-01',
        type: 'AUDITORIUM',
        building: 'Gedung Rektorat Lt. 1',
        floor: 1,
        capacity: 500,
        equipment: ['Sound System Yamaha 10.000W', 'LED Videotron 8x4m', 'Lighting Stage', 'Ruang Transit VIP'],
        status: 'AVAILABLE',
        currentBooking: null,
      },
      {
        id: 'FAC-03',
        name: 'Ruang Seminar & Sidang Skripsi Pascasarjana',
        code: 'R-SIDANG-201',
        type: 'MEETING_ROOM',
        building: 'Gedung FTI',
        floor: 2,
        capacity: 25,
        equipment: ['Meja Konferensi', 'Video Conference Camera 360', 'Proyektor HD', 'Mic Delegasi'],
        status: 'IN_USE',
        currentBooking: {
          event: 'Sidang Proposal Tesis S2',
          organizer: 'Program Studi Magister Informatika',
          until: '12:00 WIB',
        },
      },
      {
        id: 'FAC-04',
        name: 'Laboratorium Jaringan Komputer & IoT',
        code: 'LAB-NET-02',
        type: 'LABORATORIUM',
        building: 'Gedung FTI',
        floor: 3,
        capacity: 35,
        equipment: ['Cisco Router & Switch Rack', 'MikroTik Cloud Core', 'IoT Sensor Kit', 'Logic Analyzer'],
        status: 'AVAILABLE',
        currentBooking: null,
      },
    ];

    return facilitiesList;
  }

  async bookFacility(userId: string, facilityId: string, data: { eventName: string; date: string; startTime: string; endTime: string }) {
    return {
      success: true,
      bookingId: `BKG-${Date.now().toString().slice(-6)}`,
      facilityId,
      eventName: data.eventName,
      date: data.date,
      time: `${data.startTime} - ${data.endTime}`,
      status: 'CONFIRMED',
      message: 'Reservasi ruangan berhasil dikonfirmasi oleh sistem sarana dan prasarana kampus.',
    };
  }

  async getResearchLPPM() {
    return {
      stats: {
        totalProposals: 28,
        activeGrants: 14,
        totalFundingIDR: 1850000000, // Rp 1.85 Miliar
        scopusIndexed: 42,
        sinta12Indexed: 68,
      },
      proposals: [
        {
          id: 'RES-2026-001',
          title: 'Pengembangan Multi-Agent LLM untuk Pemantauan Kualitas Kurikulum OBE Berbasis Real-Time Learning Analytics',
          leadResearcher: 'Dr. Rian Pratama, S.Kom., M.Cs.',
          scheme: 'Hibah Penelitian Terapan Kemendikbudristek',
          funding: 150000000,
          year: 2026,
          status: 'ONGOING',
          outputs: ['Jurnal Internasional Terindeks Scopus Q1', 'Hak Cipta Perangkat Lunak'],
        },
        {
          id: 'RES-2026-002',
          title: 'Implementasi Algoritma Quantum-Resistant Cryptography pada Protokol Keamanan Smart Campus IoT',
          leadResearcher: 'Dr. Anita Rahmawati, S.Kom., M.T.',
          scheme: 'Hibah Riset Kolaborasi Nasional (BRIN)',
          funding: 220000000,
          year: 2026,
          status: 'ONGOING',
          outputs: ['Prosiding IEEE International Conference', 'Prototipe Modul Enkripsi'],
        },
        {
          id: 'RES-2026-003',
          title: 'Optimasi Routing Pengiriman Bantuan Bencana Menggunakan Algoritma Genetika Hibrida',
          leadResearcher: 'Prof. Dr. Ir. Budi Rahardjo, M.Sc.',
          scheme: 'Hibah Internal Universitas Indonesia Mandiri',
          funding: 75000000,
          year: 2025,
          status: 'COMPLETED',
          outputs: ['Jurnal Nasional Terindeks Sinta 2'],
        },
      ],
    };
  }

  async getStudentAffairs() {
    return {
      stats: {
        activeOrganizations: 18,
        scholarshipRecipients: 340,
        nationalAchievements: 24,
        internationalAchievements: 6,
      },
      scholarships: [
        {
          id: 'SCH-01',
          name: 'Beasiswa Unggulan Prestasi Akademik UIM 2026',
          provider: 'Yayasan Indonesia Mandiri',
          coverage: '100% Bebas UKT & Tunjangan Bulanan Rp 1.500.000',
          requirement: 'IPK >= 3.60, Sertifikat Prestasi Lomba',
          deadline: '2026-12-15',
          status: 'OPEN',
        },
        {
          id: 'SCH-02',
          name: 'Program Beasiswa KIP-Kuliah Merdeka 2026',
          provider: 'Kemendikbudristek RI',
          coverage: 'Bantuan Biaya Pendidikan & Biaya Hidup Penuh',
          requirement: 'Mahasiswa dari keluarga prasejahtera berprestasi',
          deadline: '2026-11-30',
          status: 'OPEN',
        },
        {
          id: 'SCH-03',
          name: 'Djarum Beasiswa Plus Mitra Industri',
          provider: 'Djarum Foundation',
          coverage: 'Dana Pelatihan Kepemimpinan & Tunjangan Studi',
          requirement: 'Mahasiswa Semester 3 atau 5, IPK >= 3.20',
          deadline: '2027-01-10',
          status: 'UPCOMING',
        },
      ],
      clubs: [
        {
          id: 'CLUB-01',
          name: 'Himpunan Mahasiswa Teknik Informatika (HMTI)',
          category: 'HIMPUNAN_PRODI',
          membersCount: 420,
          president: 'Rafi Alfarizi (202401015)',
          activities: 'TechFest 2026, Bootcamp Cloud, Coding Marathon',
        },
        {
          id: 'CLUB-02',
          name: 'Unit Kegiatan Mahasiswa Robotika & Otomasi',
          category: 'SAINS_TEKNOLOGI',
          membersCount: 85,
          president: 'Dimas Setiawan (202501042)',
          activities: 'Kontes Robot Terbang Indonesia, Divisi Wheeled Soccer',
        },
        {
          id: 'CLUB-03',
          name: 'Badan Eksekutif Mahasiswa (BEM UIM)',
          category: 'LEMBAGA_EKSEKUTIF',
          membersCount: 150,
          president: 'Fikri Haikal (202402008)',
          activities: 'Bina Desa Nasional, Advokasi Mahasiswa, Pentas Seni',
        },
      ],
      achievements: [
        {
          competition: 'GEMASTIK XVII 2026 (Puspresnas)',
          category: 'Pengembangan Perangkat Lunak',
          award: 'Juara 1 (Medali Emas)',
          team: 'Tim UIM Inovasi Cerdas',
          year: 2026,
        },
        {
          competition: 'Southeast Asia Cyber Security Hackathon 2026',
          category: 'Capture The Flag (CTF)',
          award: '1st Runner-Up (Medali Perak)',
          team: 'UIM CyberSec Squad',
          year: 2026,
        },
      ],
    };
  }

  async getCareerAndInternships() {
    return {
      stats: {
        activeVacancies: 38,
        industryPartners: 84,
        studentsInterning: 145,
        mbkmConversionRate: '100% (20 SKS Terkonversi)',
      },
      vacancies: [
        {
          id: 'VAC-01',
          company: 'PT Telkom Indonesia (Persero) Tbk',
          position: 'Software Engineering Intern (Backend / Microservices)',
          location: 'Jakarta Selatan (Hybrid)',
          type: 'MAGANG_MBKM',
          stipend: 'Rp 4.500.000 / Bulan',
          deadline: '2026-11-30',
          skills: ['TypeScript', 'NestJS', 'PostgreSQL', 'Docker'],
          status: 'OPEN',
        },
        {
          id: 'VAC-02',
          company: 'Bank Central Asia (BCA)',
          position: 'Data Analyst & BI Intern',
          location: 'Jakarta Barat (On-site)',
          type: 'MAGANG_MBKM',
          stipend: 'Rp 4.000.000 / Bulan',
          deadline: '2026-12-05',
          skills: ['SQL', 'Python', 'PowerBI / Tableau', 'Statistics'],
          status: 'OPEN',
        },
        {
          id: 'VAC-03',
          company: 'GoTo Financial (Midtrans)',
          position: 'Junior Cloud Platform Specialist',
          location: 'Jakarta Selatan (Remote)',
          type: 'FULL_TIME_JUNIOR',
          stipend: 'Gaji Kompetitif + Asuransi',
          deadline: '2026-12-15',
          skills: ['GCP / AWS', 'Kubernetes', 'Terraform', 'CI/CD'],
          status: 'OPEN',
        },
      ],
    };
  }

  async getHumanResources() {
    const lecturers = await this.prisma.lecturer.findMany({
      include: {
        user: true,
        studyProgram: true,
      },
    });

    return {
      stats: {
        totalStaff: 124,
        totalLecturers: lecturers.length,
        doctoralDegrees: 18,
        masterDegrees: 48,
        professors: 5,
        bkdCompliance: '100% Memenuhi BKD',
      },
      staff: lecturers.map((l) => ({
        id: l.id,
        name: l.user.fullName,
        email: l.user.email,
        nidn: l.nidn || '0012058801',
        academicRank: l.academicRank || 'Lektor (III/c)',
        studyProgram: l.studyProgram.name,
        specialization: l.specialization || 'Rekayasa Perangkat Lunak & Kecerdasan Buatan',
        status: 'AKTIF_MENGAJAR',
      })),
    };
  }

  async getAlumniTracer() {
    return {
      stats: {
        totalAlumni: 3420,
        averageWaitingMonth: 1.8,
        fieldRelevancePercentage: 91.4,
        averageStartingSalaryIDR: 8500000,
      },
      recentGraduates: [
        {
          id: 'ALM-01',
          name: 'Muhammad Farhan, S.Kom.',
          nim: '202201018',
          gradYear: 2026,
          studyProgram: 'Teknik Informatika (S1)',
          ipk: 3.92,
          currentCompany: 'PT Shopee International Indonesia',
          currentRole: 'Backend Engineer',
          waitingMonths: 1,
        },
        {
          id: 'ALM-02',
          name: 'Annisa Putri Ramadhani, S.Kom.',
          nim: '202201044',
          gradYear: 2026,
          studyProgram: 'Teknik Informatika (S1)',
          ipk: 3.84,
          currentCompany: 'Traveloka Tech Hub',
          currentRole: 'Product Analyst',
          waitingMonths: 2,
        },
        {
          id: 'ALM-03',
          name: 'Kevin Santoso, S.Kom.',
          nim: '202201090',
          gradYear: 2026,
          studyProgram: 'Sistem Informasi (S1)',
          ipk: 3.78,
          currentCompany: 'KPMG Indonesia Advisory',
          currentRole: 'IT Risk & Assurance Consultant',
          waitingMonths: 1.5,
        },
      ],
    };
  }
}
