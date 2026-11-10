import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
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
  Compass,
  Building,
  ShieldCheck,
  History,
  Settings,
  HelpCircle,
  FileSpreadsheet,
  TrendingUp,
  FileText,
  CheckSquare,
  QrCode,
  FolderOpen,
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

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const userRoles = user?.roles || [];
  const isSuperAdmin = userRoles.includes(UserRole.SUPER_ADMIN);
  const isRector = userRoles.includes(UserRole.RECTOR);
  const isLecturer = userRoles.includes(UserRole.LECTURER);
  const isStudent = userRoles.includes(UserRole.STUDENT);

  // Dynamic Navigation Configuration per PRD Section 5
  let sections: NavSection[] = [];

  if (isStudent) {
    sections = [
      {
        category: 'PORTAL MAHASISWA',
        items: [
          { title: 'Dashboard Saya', path: '/', icon: LayoutDashboard },
          { title: 'KRS Online', path: '/akademik/krs', icon: FileCheck2 },
          { title: 'Nilai & KHS', path: '/akademik/khs', icon: Award },
          { title: 'Jadwal Kuliah', path: '/akademik/jadwal', icon: Calendar },
        ],
      },
      {
        category: 'PEMBELAJARAN (LMS)',
        items: [
          { title: 'Kelas Digital Saya', path: '/operasional/lms', icon: BookMarked },
          { title: 'Tugas Kuliah', path: '/operasional/lms', icon: CheckSquare },
          { title: 'Ujian Online', path: '/operasional/ujian', icon: FileCheck2 },
          { title: 'Presensi Kehadiran', path: '/operasional/presensi', icon: Clock },
        ],
      },
      {
        category: 'LAYANAN KAMPUS',
        items: [
          { title: 'Keuangan & Tagihan UKT', path: '/operasional/keuangan', icon: Wallet },
          { title: 'Perpustakaan Digital', path: '/operasional/perpustakaan', icon: Library },
          { title: 'Pengumuman Akademik', path: '/operasional/pengumuman', icon: Megaphone },
        ],
      },
    ];
  } else if (isLecturer) {
    sections = [
      {
        category: 'RUANG KERJA DOSEN',
        items: [
          { title: 'Dashboard Dosen', path: '/', icon: LayoutDashboard },
          { title: 'Jadwal Mengajar', path: '/akademik/jadwal', icon: Calendar },
          { title: 'Kelas & Mata Kuliah', path: '/akademik/mata-kuliah', icon: BookOpen },
          { title: 'Presensi QR Kelas', path: '/operasional/presensi', icon: QrCode },
        ],
      },
      {
        category: 'EVALUASI & AKADEMIK',
        items: [
          { title: 'Bimbingan PA & KRS', path: '/akademik/krs', icon: FileCheck2 },
          { title: 'Input Nilai KHS', path: '/akademik/khs', icon: Award },
          { title: 'LMS & Materi Kuliah', path: '/operasional/lms', icon: BookMarked },
          { title: 'Ujian & Bank Soal', path: '/operasional/ujian', icon: FileCheck2 },
        ],
      },
      {
        category: 'TRIDHARMA',
        items: [
          { title: 'Penelitian & LPPM', path: '/manajemen/penelitian', icon: FlaskConical },
          { title: 'Pengumuman Fakultas', path: '/operasional/pengumuman', icon: Megaphone },
        ],
      },
    ];
  } else if (isRector) {
    sections = [
      {
        category: 'EKSEKUTIF REKTORAT',
        items: [
          { title: 'Executive Dashboard', path: '/', icon: LayoutDashboard },
          { title: 'Kinerja Fakultas', path: '/akademik/fakultas', icon: Building2 },
          { title: 'Tren Penerimaan (PMB)', path: '/akademik/mahasiswa', icon: TrendingUp },
          { title: 'Kinerja Finansial (UKT)', path: '/operasional/keuangan', icon: Wallet },
        ],
      },
      {
        category: 'KEBIJAKAN & LAPORAN',
        items: [
          { title: 'Keputusan Strategis', path: '/sistem/audit', icon: FileText },
          { title: 'SDM & Tenaga Pengajar', path: '/manajemen/sdm', icon: Briefcase },
          { title: 'Riset & Publikasi LPPM', path: '/manajemen/penelitian', icon: FlaskConical },
          { title: 'Laporan Akreditasi', path: '/akademik/kurikulum', icon: Award },
        ],
      },
    ];
  } else {
    // Super Administrator View (Full Management)
    sections = [
      {
        category: 'SISTEM UTAMA',
        items: [
          { title: 'Pusat Kendali', path: '/', icon: LayoutDashboard },
          { title: 'Manajemen Pengguna', path: '/sistem/pengguna', icon: ShieldCheck },
          { title: 'Audit Trail & Log', path: '/sistem/audit', icon: History },
        ],
      },
      {
        category: 'GOVERNANSI AKADEMIK',
        items: [
          { title: 'Mahasiswa (NIM)', path: '/akademik/mahasiswa', icon: Users },
          { title: 'Dosen (NIDN)', path: '/akademik/dosen', icon: GraduationCap },
          { title: 'Fakultas & Prodi', path: '/akademik/fakultas', icon: Building2 },
          { title: 'Mata Kuliah', path: '/akademik/mata-kuliah', icon: BookOpen },
          { title: 'Kurikulum & Jadwal', path: '/akademik/jadwal', icon: Calendar },
          { title: 'Persetujuan KRS', path: '/akademik/krs', icon: FileCheck2 },
          { title: 'Nilai & KHS', path: '/akademik/khs', icon: Award },
        ],
      },
      {
        category: 'OPERASIONAL & KEUANGAN',
        items: [
          { title: 'Keuangan & UKT', path: '/operasional/keuangan', icon: Wallet },
          { title: 'Presensi QR', path: '/operasional/presensi', icon: Clock },
          { title: 'LMS Kuliah', path: '/operasional/lms', icon: BookMarked },
          { title: 'Ujian Online', path: '/operasional/ujian', icon: FileCheck2 },
          { title: 'Perpustakaan Digital', path: '/operasional/perpustakaan', icon: Library },
        ],
      },
      {
        category: 'MANAJEMEN KAMPUS',
        items: [
          { title: 'SDM & Kepegawaian', path: '/manajemen/sdm', icon: Briefcase },
          { title: 'Fasilitas & Aset', path: '/manajemen/fasilitas', icon: Building },
          { title: 'Pengaturan Sistem', path: '/sistem/pengaturan', icon: Settings },
        ],
      },
    ];
  }

  // Sidebar background tone: Mint/Deep Navy for Student vs Slate Navy for Admin/Rector
  const sidebarBg = isStudent ? 'bg-[#0F1E2E] border-emerald-950/40' : 'bg-icms-deep-navy border-slate-800';

  return (
    <aside className={`w-64 ${sidebarBg} text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-30 border-r`}>
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 bg-icms-navy border-b border-slate-800 gap-3">
        <div className="w-9 h-9 rounded-xl bg-icms-academic-blue flex items-center justify-center font-bold text-white shadow-md border border-icms-gold/40">
          I
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-white tracking-wide text-sm font-heading">ICMS CAMPUS</span>
          <span className="text-[10px] text-icms-gold font-medium uppercase tracking-wider">
            {isStudent ? 'Student Portal' : isRector ? 'Executive Suite' : isLecturer ? 'Lecturer Suite' : 'Enterprise Suite'}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {sections.map((section) => (
          <div key={section.category}>
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {section.category}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? isStudent
                            ? 'bg-emerald-800 text-white shadow-sm font-bold border-l-4 border-emerald-400'
                            : 'bg-icms-academic-blue text-white shadow-sm font-bold border-l-4 border-icms-gold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0 text-slate-400" />
                    <span>{item.title}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer User Info */}
      <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Online</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          {user?.username ? `@${user.username}` : ''}
        </span>
      </div>
    </aside>
  );
};
