import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useThemeConfig } from '../hooks/useThemeConfig';
import { UserRole } from '@icms/shared';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  Calendar,
  FileCheck2,
  Award,
  Wallet,
  Clock,
  BookMarked,
  Library,
  Megaphone,
  Briefcase,
  FlaskConical,
  Building,
  ShieldCheck,
  History,
  Settings,
  TrendingUp,
  FileText,
  CheckSquare,
  QrCode,
  UserPlus,
  Receipt,
  UserCheck,
  Layers,
  Sparkles,
  ClipboardList,
  FolderKanban,
  FileSearch,
} from 'lucide-react';

interface NavItem {
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  category: string;
  items: NavItem[];
}

interface RoleThemeConfig {
  title: string;
  subtitle: string;
  badgeColor: string;
  activeClass: string;
  bgClass: string;
}

export interface SidebarProps {
  onClose?: () => void;
  isMobileDrawer?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose, isMobileDrawer = false }) => {
  const { user, activeRole } = useAuth();

  // Role Theme and Subtitle Mapping
  const roleTheme: Record<UserRole, RoleThemeConfig> = {
    [UserRole.STUDENT]: {
      title: 'ICMS CAMPUS',
      subtitle: 'PORTAL MAHASISWA',
      badgeColor: 'bg-emerald-600 text-white',
      activeClass: 'bg-emerald-800 text-white shadow-sm font-bold border-l-4 border-emerald-400',
      bgClass: 'bg-[#0D1B2A] border-emerald-950/60',
    },
    [UserRole.LECTURER]: {
      title: 'ICMS CAMPUS',
      subtitle: 'RUANG KERJA DOSEN',
      badgeColor: 'bg-amber-600 text-white',
      activeClass: 'bg-amber-800 text-white shadow-sm font-bold border-l-4 border-amber-400',
      bgClass: 'bg-[#10192A] border-amber-950/40',
    },
    [UserRole.RECTOR]: {
      title: 'ICMS CAMPUS',
      subtitle: 'EXECUTIVE SUITE',
      badgeColor: 'bg-blue-600 text-white',
      activeClass: 'bg-blue-800 text-white shadow-sm font-bold border-l-4 border-icms-gold',
      bgClass: 'bg-icms-deep-navy border-slate-800',
    },
    [UserRole.DEAN]: {
      title: 'ICMS CAMPUS',
      subtitle: 'DEKANAT FAKULTAS',
      badgeColor: 'bg-indigo-600 text-white',
      activeClass: 'bg-indigo-800 text-white shadow-sm font-bold border-l-4 border-indigo-400',
      bgClass: 'bg-[#111836] border-indigo-950/60',
    },
    [UserRole.HEAD_OF_PROGRAM]: {
      title: 'ICMS CAMPUS',
      subtitle: 'KAPRODI WORKSPACE',
      badgeColor: 'bg-teal-600 text-white',
      activeClass: 'bg-teal-800 text-white shadow-sm font-bold border-l-4 border-teal-400',
      bgClass: 'bg-[#0E2024] border-teal-950/60',
    },
    [UserRole.ACADEMIC_ADMIN]: {
      title: 'ICMS CAMPUS',
      subtitle: 'BIRO BAAK REGISTRAR',
      badgeColor: 'bg-sky-600 text-white',
      activeClass: 'bg-sky-800 text-white shadow-sm font-bold border-l-4 border-sky-400',
      bgClass: 'bg-[#0F1F2C] border-sky-950/60',
    },
    [UserRole.FINANCE_ADMIN]: {
      title: 'ICMS CAMPUS',
      subtitle: 'BIRO KEUANGAN BAUK',
      badgeColor: 'bg-emerald-700 text-white',
      activeClass: 'bg-emerald-900 text-white shadow-sm font-bold border-l-4 border-emerald-400',
      bgClass: 'bg-[#0B1E1A] border-emerald-950/60',
    },
    [UserRole.ADMISSION_ADMIN]: {
      title: 'ICMS CAMPUS',
      subtitle: 'ADMISI & PMB KAMPUS',
      badgeColor: 'bg-rose-700 text-white',
      activeClass: 'bg-rose-900 text-white shadow-sm font-bold border-l-4 border-rose-400',
      bgClass: 'bg-[#1E1119] border-rose-950/60',
    },
    [UserRole.LIBRARIAN]: {
      title: 'ICMS CAMPUS',
      subtitle: 'UPT PERPUSTAKAAN',
      badgeColor: 'bg-purple-700 text-white',
      activeClass: 'bg-purple-900 text-white shadow-sm font-bold border-l-4 border-purple-400',
      bgClass: 'bg-[#1A122E] border-purple-950/60',
    },
    [UserRole.HR_ADMIN]: {
      title: 'ICMS CAMPUS',
      subtitle: 'KEPEGAWAIAN & SDM',
      badgeColor: 'bg-orange-700 text-white',
      activeClass: 'bg-orange-900 text-white shadow-sm font-bold border-l-4 border-orange-400',
      bgClass: 'bg-[#20150F] border-orange-950/60',
    },
    [UserRole.STUDENT_AFFAIRS_ADMIN]: {
      title: 'ICMS CAMPUS',
      subtitle: 'KEMAHASISWAAN & ALUMNI',
      badgeColor: 'bg-cyan-700 text-white',
      activeClass: 'bg-cyan-900 text-white shadow-sm font-bold border-l-4 border-cyan-400',
      bgClass: 'bg-[#0F2228] border-cyan-950/60',
    },
    [UserRole.VICE_RECTOR]: {
      title: 'ICMS CAMPUS',
      subtitle: 'WAKIL REKTORAT',
      badgeColor: 'bg-blue-700 text-white',
      activeClass: 'bg-blue-900 text-white shadow-sm font-bold border-l-4 border-blue-400',
      bgClass: 'bg-icms-deep-navy border-slate-800',
    },
    [UserRole.ALUMNI]: {
      title: 'ICMS CAMPUS',
      subtitle: 'PORTAL IKATAN ALUMNI',
      badgeColor: 'bg-slate-700 text-white',
      activeClass: 'bg-slate-800 text-white shadow-sm font-bold border-l-4 border-slate-400',
      bgClass: 'bg-[#131720] border-slate-800',
    },
    [UserRole.SUPER_ADMIN]: {
      title: 'ICMS CAMPUS',
      subtitle: 'MASTER ENTERPRISE',
      badgeColor: 'bg-icms-academic-blue text-white',
      activeClass: 'bg-icms-academic-blue text-white shadow-sm font-bold border-l-4 border-icms-gold',
      bgClass: 'bg-icms-deep-navy border-slate-800',
    },
  };

  // Dedicated Sections and Menus for Every Single Role
  const getSectionsByRole = (role: UserRole): NavSection[] => {
    switch (role) {
      case UserRole.STUDENT:
        return [
          {
            category: 'AKADEMIK SAYA',
            items: [
              { title: 'Beranda Mahasiswa', path: '/', icon: LayoutDashboard },
              { title: 'KRS Online', path: '/akademik/krs', icon: FileCheck2 },
              { title: 'Kartu Hasil Studi (KHS)', path: '/akademik/khs', icon: Award },
              { title: 'Jadwal Kuliah', path: '/akademik/jadwal', icon: Calendar },
              { title: 'Kalender Akademik', path: '/akademik/kalender', icon: Clock },
            ],
          },
          {
            category: 'PERKULIAHAN & UJIAN',
            items: [
              { title: 'Kelas Digital (LMS)', path: '/operasional/lms', icon: BookMarked },
              { title: 'Presensi Kehadiran', path: '/operasional/presensi', icon: CheckSquare },
              { title: 'Ujian Online (CBT)', path: '/operasional/ujian', icon: FileCheck2 },
              { title: 'Layanan Surat & Cuti', path: '/operasional/administrasi', icon: FileText },
            ],
          },
          {
            category: 'LAYANAN & KARIR',
            items: [
              { title: 'Tagihan & Bayar UKT', path: '/operasional/keuangan', icon: Wallet },
              { title: 'Perpustakaan Digital', path: '/operasional/perpustakaan', icon: Library },
              { title: 'Peminjaman Ruang/Lab', path: '/manajemen/fasilitas', icon: Building },
              { title: 'Beasiswa & Ormawa', path: '/manajemen/kemahasiswaan', icon: Award },
              { title: 'Magang MBKM & Karir', path: '/manajemen/magang-karier', icon: Briefcase },
              { title: 'Pengumuman Kampus', path: '/operasional/pengumuman', icon: Megaphone },
            ],
          },
        ];

      case UserRole.LECTURER:
        return [
          {
            category: 'AKTIVITAS MENGAJAR',
            items: [
              { title: 'Dashboard Dosen', path: '/', icon: LayoutDashboard },
              { title: 'Jadwal Mengajar', path: '/akademik/jadwal', icon: Calendar },
              { title: 'Mata Kuliah Diampu', path: '/akademik/mata-kuliah', icon: BookOpen },
              { title: 'Presensi QR Kelas', path: '/operasional/presensi', icon: QrCode },
              { title: 'LMS & Materi Kuliah', path: '/operasional/lms', icon: BookMarked },
              { title: 'Ujian & Bank Soal', path: '/operasional/ujian', icon: FileCheck2 },
            ],
          },
          {
            category: 'PERWALIAN & EVALUASI',
            items: [
              { title: 'Bimbingan KRS Mahasiswa', path: '/akademik/krs', icon: FileCheck2 },
              { title: 'Input & Nilai KHS', path: '/akademik/khs', icon: Award },
              { title: 'Kalender Akademik', path: '/akademik/kalender', icon: Clock },
            ],
          },
          {
            category: 'TRIDHARMA & KAMPUS',
            items: [
              { title: 'Proposal Riset & LPPM', path: '/manajemen/penelitian', icon: FlaskConical },
              { title: 'Profil Dosen & BKD', path: '/manajemen/sdm', icon: Briefcase },
              { title: 'Reservasi Lab & Ruang', path: '/manajemen/fasilitas', icon: Building },
              { title: 'Jurnal & Perpustakaan', path: '/operasional/perpustakaan', icon: Library },
              { title: 'Pengumuman Fakultas', path: '/operasional/pengumuman', icon: Megaphone },
            ],
          },
        ];

      case UserRole.RECTOR:
        return [
          {
            category: 'EKSEKUTIF REKTORAT',
            items: [
              { title: 'Executive Dashboard', path: '/', icon: LayoutDashboard },
              { title: 'Kinerja Fakultas (UPPS)', path: '/akademik/fakultas', icon: Building2 },
              { title: 'Tren Penerimaan PMB', path: '/akademik/mahasiswa', icon: TrendingUp },
              { title: 'Realisasi Keuangan UKT', path: '/operasional/keuangan', icon: Wallet },
            ],
          },
          {
            category: 'KEBIJAKAN & LAPORAN',
            items: [
              { title: 'Direktori Dosen & Tendik', path: '/manajemen/sdm', icon: Briefcase },
              { title: 'Riset, Hibah & LPPM', path: '/manajemen/penelitian', icon: FlaskConical },
              { title: 'Tracer Study Alumni', path: '/manajemen/alumni', icon: GraduationCap },
              { title: 'Mitra Industri & MBKM', path: '/manajemen/magang-karier', icon: Briefcase },
              { title: 'Audit Trail Keamanan', path: '/sistem/audit-log', icon: History },
              { title: 'Pengumuman Rektorat', path: '/operasional/pengumuman', icon: Megaphone },
            ],
          },
        ];

      case UserRole.DEAN:
        return [
          {
            category: 'DEKANAT FAKULTAS',
            items: [
              { title: 'Dashboard Dekan', path: '/', icon: LayoutDashboard },
              { title: 'Struktur Fakultas FTI', path: '/akademik/fakultas', icon: Building2 },
              { title: 'Program Studi & Akreditasi', path: '/akademik/program-studi', icon: Layers },
              { title: 'Kurikulum OBE Fakultas', path: '/akademik/kurikulum', icon: Award },
              { title: 'Jadwal Kuliah Terpadu', path: '/akademik/jadwal', icon: Calendar },
            ],
          },
          {
            category: 'MUTU & TRIDHARMA',
            items: [
              { title: 'Kepatuhan BKD Dosen', path: '/manajemen/sdm', icon: Briefcase },
              { title: 'Riset & Pengabdian LPPM', path: '/manajemen/penelitian', icon: FlaskConical },
              { title: 'Fasilitas & Lab Fakultas', path: '/manajemen/fasilitas', icon: Building },
              { title: 'Prestasi Mahasiswa', path: '/manajemen/kemahasiswaan', icon: Award },
              { title: 'Kemitraan & Magang MBKM', path: '/manajemen/magang-karier', icon: Briefcase },
              { title: 'Broadcast Fakultas', path: '/operasional/pengumuman', icon: Megaphone },
            ],
          },
        ];

      case UserRole.HEAD_OF_PROGRAM:
        return [
          {
            category: 'OPERASIONAL PRODI',
            items: [
              { title: 'Dashboard Kaprodi', path: '/', icon: LayoutDashboard },
              { title: 'Profil Program Studi', path: '/akademik/program-studi', icon: Layers },
              { title: 'Kurikulum & Silabus OBE', path: '/akademik/kurikulum', icon: BookOpen },
              { title: 'Mata Kuliah & Silabus', path: '/akademik/mata-kuliah', icon: BookMarked },
              { title: 'Penjadwalan Kuliah & Dosen', path: '/akademik/jadwal', icon: Calendar },
            ],
          },
          {
            category: 'KONTROL AKADEMIK',
            items: [
              { title: 'Monitoring & Review KRS', path: '/akademik/krs', icon: FileCheck2 },
              { title: 'Rekap Nilai KHS & IPK', path: '/akademik/khs', icon: Award },
              { title: 'Jadwal Ujian CBT Prodi', path: '/operasional/ujian', icon: FileText },
              { title: 'Kalender Akademik', path: '/akademik/kalender', icon: Clock },
            ],
          },
          {
            category: 'PENGEMBANGAN MAHASISWA',
            items: [
              { title: 'Beban Mengajar Dosen', path: '/manajemen/sdm', icon: Users },
              { title: 'Mitra Magang MBKM', path: '/manajemen/magang-karier', icon: Briefcase },
              { title: 'Tracer Study Lulusan', path: '/manajemen/alumni', icon: GraduationCap },
              { title: 'Pengumuman Prodi', path: '/operasional/pengumuman', icon: Megaphone },
            ],
          },
        ];

      case UserRole.ACADEMIC_ADMIN:
        return [
          {
            category: 'LOKET BAAK UTAMA',
            items: [
              { title: 'Dashboard BAAK', path: '/', icon: LayoutDashboard },
              { title: 'Layanan Surat Mahasiswa', path: '/operasional/administrasi', icon: FileText },
              { title: 'Kalender Akademik Resmi', path: '/akademik/kalender', icon: Clock },
              { title: 'Jadwal Kuliah Mingguan', path: '/akademik/jadwal', icon: Calendar },
            ],
          },
          {
            category: 'GOVERNANSI MAHASISWA',
            items: [
              { title: 'Database Mahasiswa', path: '/akademik/mahasiswa', icon: Users },
              { title: 'Validasi KRS & Registrasi', path: '/akademik/krs', icon: FileCheck2 },
              { title: 'Penerbitan KHS & Transkrip', path: '/akademik/khs', icon: Award },
              { title: 'Pelaksanaan Ujian CBT', path: '/operasional/ujian', icon: ClipboardList },
            ],
          },
          {
            category: 'DATA & INFORMASI',
            items: [
              { title: 'Struktur Fakultas & Prodi', path: '/akademik/fakultas', icon: Building2 },
              { title: 'Katalog Mata Kuliah', path: '/akademik/mata-kuliah', icon: BookOpen },
              { title: 'Papan Pengumuman BAAK', path: '/operasional/pengumuman', icon: Megaphone },
            ],
          },
        ];

      case UserRole.FINANCE_ADMIN:
        return [
          {
            category: 'KEUANGAN & PENERIMAAN',
            items: [
              { title: 'Dashboard BAUK', path: '/', icon: LayoutDashboard },
              { title: 'Billing UKT / SPP', path: '/operasional/keuangan', icon: Wallet },
              { title: 'Rekonsiliasi Virtual Account', path: '/operasional/keuangan', icon: Receipt },
              { title: 'Kuitansi & Pelunasan', path: '/operasional/keuangan', icon: FileCheck2 },
            ],
          },
          {
            category: 'ANGGARAN & BEASISWA',
            items: [
              { title: 'Penyaluran Beasiswa', path: '/manajemen/kemahasiswaan', icon: Award },
              { title: 'Dana Hibah Riset LPPM', path: '/manajemen/penelitian', icon: FlaskConical },
              { title: 'Alokasi Sarana & Fasilitas', path: '/manajemen/fasilitas', icon: Building },
              { title: 'Audit Transaksi Keuangan', path: '/sistem/audit-log', icon: History },
              { title: 'Pengumuman Keuangan', path: '/operasional/pengumuman', icon: Megaphone },
            ],
          },
        ];

      case UserRole.ADMISSION_ADMIN:
        return [
          {
            category: 'PENERIMAAN MAHASISWA (PMB)',
            items: [
              { title: 'Dashboard PMB', path: '/', icon: LayoutDashboard },
              { title: 'Pendaftaran Calon Mhs', path: '/akademik/mahasiswa', icon: UserPlus },
              { title: 'Daya Tampung Prodi', path: '/akademik/program-studi', icon: Layers },
              { title: 'Biaya Pendaftaran & UKT', path: '/operasional/keuangan', icon: Wallet },
            ],
          },
          {
            category: 'SELEKSI & SOSIALISASI',
            items: [
              { title: 'Kalender Seleksi PMB', path: '/akademik/kalender', icon: Calendar },
              { title: 'Tur Fasilitas Kampus', path: '/manajemen/fasilitas', icon: Building },
              { title: 'Informasi Beasiswa PMB', path: '/manajemen/kemahasiswaan', icon: Award },
              { title: 'Pengumuman Hasil Seleksi', path: '/operasional/pengumuman', icon: Megaphone },
            ],
          },
        ];

      case UserRole.LIBRARIAN:
        return [
          {
            category: 'SIRKULASI & KOLEKSI',
            items: [
              { title: 'Dashboard Pustakawan', path: '/', icon: LayoutDashboard },
              { title: 'Katalog Buku & OPAC', path: '/operasional/perpustakaan', icon: Library },
              { title: 'Peminjaman & Pengembalian', path: '/operasional/perpustakaan', icon: BookOpen },
              { title: 'Koleksi E-Book & Skripsi', path: '/operasional/perpustakaan', icon: BookMarked },
            ],
          },
          {
            category: 'LAYANAN LITERASI',
            items: [
              { title: 'Repositori Riset LPPM', path: '/manajemen/penelitian', icon: FlaskConical },
              { title: 'Reservasi Ruang Baca/Lab', path: '/manajemen/fasilitas', icon: Building },
              { title: 'Warta Perpustakaan', path: '/operasional/pengumuman', icon: Megaphone },
            ],
          },
        ];

      case UserRole.HR_ADMIN:
        return [
          {
            category: 'KEPEGAWAIAN DOSEN & TENDIK',
            items: [
              { title: 'Dashboard Kepegawaian', path: '/', icon: LayoutDashboard },
              { title: 'Direktori Dosen (NIDN)', path: '/manajemen/sdm', icon: Briefcase },
              { title: 'Evaluasi BKD Dosen', path: '/manajemen/sdm', icon: ClipboardList },
              { title: 'Jabatan Fungsional', path: '/akademik/dosen', icon: GraduationCap },
            ],
          },
          {
            category: 'AKUN & AUDIT SDM',
            items: [
              { title: 'Manajemen Akun Pegawai', path: '/sistem/pengguna', icon: Users },
              { title: 'Audit Jejak Pegawai', path: '/sistem/audit-log', icon: History },
              { title: 'Pengumuman Kepegawaian', path: '/operasional/pengumuman', icon: Megaphone },
            ],
          },
        ];

      case UserRole.STUDENT_AFFAIRS_ADMIN:
        return [
          {
            category: 'PEMBINAAN MAHASISWA',
            items: [
              { title: 'Dashboard Kemahasiswaan', path: '/', icon: LayoutDashboard },
              { title: 'Organisasi & UKM Kampus', path: '/manajemen/kemahasiswaan', icon: Users },
              { title: 'Pengelolaan Beasiswa', path: '/manajemen/kemahasiswaan', icon: Award },
              { title: 'Pencatatan Prestasi Lomba', path: '/manajemen/kemahasiswaan', icon: Award },
            ],
          },
          {
            category: 'KARIR & ALUMNI',
            items: [
              { title: 'Mitra Magang & Karir MBKM', path: '/manajemen/magang-karier', icon: Briefcase },
              { title: 'Tracer Study Alumni', path: '/manajemen/alumni', icon: GraduationCap },
              { title: 'Peminjaman Ruang Ormawa', path: '/manajemen/fasilitas', icon: Building },
              { title: 'Siaran Kemahasiswaan', path: '/operasional/pengumuman', icon: Megaphone },
            ],
          },
        ];

      case UserRole.VICE_RECTOR:
        return [
          {
            category: 'PENGAWASAN WAREK',
            items: [
              { title: 'Dashboard Wakil Rektor', path: '/', icon: LayoutDashboard },
              { title: 'Kinerja Fakultas & UPPS', path: '/akademik/fakultas', icon: Building2 },
              { title: 'Kurikulum & OBE Mutu', path: '/akademik/kurikulum', icon: Award },
              { title: 'Pengawasan Keuangan UKT', path: '/operasional/keuangan', icon: Wallet },
            ],
          },
          {
            category: 'PENGEMBANGAN INSTITUSI',
            items: [
              { title: 'Riset LPPM & Inovasi', path: '/manajemen/penelitian', icon: FlaskConical },
              { title: 'Pembinaan Kemahasiswaan', path: '/manajemen/kemahasiswaan', icon: Users },
              { title: 'Sarana & Fasilitas Kampus', path: '/manajemen/fasilitas', icon: Building },
              { title: 'Audit Operasional', path: '/sistem/audit-log', icon: History },
              { title: 'Siaran Kampus', path: '/operasional/pengumuman', icon: Megaphone },
            ],
          },
        ];

      case UserRole.ALUMNI:
        return [
          {
            category: 'JARINGAN ALUMNI',
            items: [
              { title: 'Dashboard Alumni', path: '/', icon: LayoutDashboard },
              { title: 'Kuesioner Tracer Study', path: '/manajemen/alumni', icon: GraduationCap },
              { title: 'Bursa Karir & Loker', path: '/manajemen/magang-karier', icon: Briefcase },
              { title: 'Layanan Legalisir Ijazah', path: '/operasional/administrasi', icon: FileText },
            ],
          },
          {
            category: 'AFILIASI KAMPUS',
            items: [
              { title: 'Perpustakaan & Repositori', path: '/operasional/perpustakaan', icon: Library },
              { title: 'Agenda & Pengumuman', path: '/operasional/pengumuman', icon: Megaphone },
            ],
          },
        ];

      case UserRole.SUPER_ADMIN:
      default:
        return [
          {
            category: 'SISTEM UTAMA',
            items: [
              { title: 'Pusat Kendali', path: '/', icon: LayoutDashboard },
              { title: 'Manajemen Pengguna', path: '/sistem/pengguna', icon: Users },
              { title: 'Role & Hak Akses', path: '/sistem/role-permission', icon: ShieldCheck },
              { title: 'Audit Trail Keamanan', path: '/sistem/audit-log', icon: History },
              { title: 'Pengaturan & Backup', path: '/sistem/pengaturan', icon: Settings },
            ],
          },
          {
            category: 'GOVERNANSI AKADEMIK',
            items: [
              { title: 'Fakultas & Unit', path: '/akademik/fakultas', icon: Building2 },
              { title: 'Program Studi', path: '/akademik/program-studi', icon: Layers },
              { title: 'Kurikulum Merdeka OBE', path: '/akademik/kurikulum', icon: Award },
              { title: 'Mata Kuliah', path: '/akademik/mata-kuliah', icon: BookOpen },
              { title: 'Jadwal Perkuliahan', path: '/akademik/jadwal', icon: Calendar },
              { title: 'Kalender Akademik', path: '/akademik/kalender', icon: Clock },
              { title: 'Persetujuan KRS', path: '/akademik/krs', icon: FileCheck2 },
              { title: 'Kartu Hasil Studi (KHS)', path: '/akademik/khs', icon: Award },
            ],
          },
          {
            category: 'OPERASIONAL KAMPUS',
            items: [
              { title: 'Keuangan & UKT', path: '/operasional/keuangan', icon: Wallet },
              { title: 'Presensi QR Kelas', path: '/operasional/presensi', icon: QrCode },
              { title: 'Kelas Digital (LMS)', path: '/operasional/lms', icon: BookMarked },
              { title: 'Ujian CBT Online', path: '/operasional/ujian', icon: FileCheck2 },
              { title: 'Layanan Surat Mahasiswa', path: '/operasional/administrasi', icon: FileText },
              { title: 'Perpustakaan Digital', path: '/operasional/perpustakaan', icon: Library },
              { title: 'Papan Pengumuman', path: '/operasional/pengumuman', icon: Megaphone },
            ],
          },
          {
            category: 'MANAJEMEN & TRIDHARMA',
            items: [
              { title: 'Penelitian & LPPM', path: '/manajemen/penelitian', icon: FlaskConical },
              { title: 'Kemahasiswaan & Ormawa', path: '/manajemen/kemahasiswaan', icon: Award },
              { title: 'Magang MBKM & Karir', path: '/manajemen/magang-karier', icon: Briefcase },
              { title: 'Fasilitas & Ruang', path: '/manajemen/fasilitas', icon: Building },
              { title: 'SDM & Kepegawaian', path: '/manajemen/sdm', icon: Briefcase },
              { title: 'Tracer Study Alumni', path: '/manajemen/alumni', icon: GraduationCap },
            ],
          },
        ];
    }
  };

  const { isSlim, theme: institutionalTheme } = useThemeConfig();
  const sections = getSectionsByRole(activeRole);
  const theme = roleTheme[activeRole] || roleTheme[UserRole.SUPER_ADMIN];

  return (
    <aside
      className={
        isMobileDrawer
          ? `flex flex-col h-full w-full ${theme.bgClass} text-slate-300 select-none overflow-hidden`
          : `hidden lg:flex flex-col h-screen fixed left-0 top-0 z-30 border-r transition-all duration-300 select-none ${
              isSlim ? 'w-20' : 'w-64'
            } ${theme.bgClass} text-slate-300`
      }
    >
      {/* Brand Header (Desktop only) */}
      {!isMobileDrawer && (
        <div className={`h-16 flex items-center ${isSlim ? 'justify-center px-2' : 'px-5'} bg-black/20 border-b border-white/10 gap-3`}>
          <div className="w-9 h-9 rounded-xl bg-icms-academic-blue flex items-center justify-center font-bold text-white shadow-md border border-icms-gold/40 shrink-0">
            I
          </div>
          {!isSlim && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-white tracking-wide text-xs font-heading truncate">
                {institutionalTheme.universityName.split(' ')[0]} {institutionalTheme.universityName.split(' ')[1] || 'CAMPUS'}
              </span>
              <span className="text-[10px] text-icms-gold font-semibold uppercase tracking-wider truncate">
                {theme.subtitle}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Role Pill Indicator in Sidebar (Desktop only) */}
      {!isSlim && !isMobileDrawer && (
        <div className="px-4 py-2 bg-black/30 border-b border-white/5 flex items-center justify-between">
          <span className="text-[10px] font-medium text-slate-400">Modul Peran:</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${theme.badgeColor}`}>
            {activeRole}
          </span>
        </div>
      )}

      {/* Navigation Sections */}
      <div className={`flex-1 overflow-y-auto ${isSlim ? 'px-2' : 'px-3'} py-3 space-y-5 scrollbar-thin`}>
        {sections.map((section) => (
          <div key={section.category}>
            {(!isSlim || isMobileDrawer) && (
              <div className="px-3 mb-1.5 text-[10px] font-extrabold text-slate-400/90 uppercase tracking-wider">
                {section.category}
              </div>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path + item.title}
                    to={item.path}
                    end={item.path === '/'}
                    title={isSlim && !isMobileDrawer ? item.title : undefined}
                    onClick={() => {
                      if (onClose) onClose();
                    }}
                    className={({ isActive }) =>
                      `flex items-center ${
                        isSlim && !isMobileDrawer
                          ? 'justify-center p-2.5'
                          : 'gap-2.5 px-3 py-2.5 min-h-[42px]'
                      } rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? theme.activeClass
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0 text-slate-300" />
                    {(!isSlim || isMobileDrawer) && <span className="truncate">{item.title}</span>}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer User Info (Desktop only) */}
      {!isMobileDrawer && (
        <div className={`p-3 bg-black/40 border-t border-white/10 text-[11px] text-slate-400 flex items-center ${isSlim ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {!isSlim && <span className="text-[10px] font-medium text-slate-300">Sistem Aktif</span>}
          </div>
          {!isSlim && (
            <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
              {user?.username ? `@${user.username}` : ''}
            </span>
          )}
        </div>
      )}
    </aside>
  );
};
