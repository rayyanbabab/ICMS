import React from 'react';
import { NavLink } from 'react-router-dom';
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

const NAVIGATION_SECTIONS: NavSection[] = [
  {
    category: 'UTAMA',
    items: [
      { title: 'Dashboard', path: '/', icon: LayoutDashboard },
    ],
  },
  {
    category: 'AKADEMIK',
    items: [
      { title: 'Mahasiswa', path: '/akademik/mahasiswa', icon: Users },
      { title: 'Dosen', path: '/akademik/dosen', icon: GraduationCap },
      { title: 'Fakultas & Prodi', path: '/akademik/fakultas', icon: Building2 },
      { title: 'Mata Kuliah', path: '/akademik/mata-kuliah', icon: BookOpen },
      { title: 'Kurikulum', path: '/akademik/kurikulum', icon: FileSpreadsheet },
      { title: 'Kelas & Jadwal', path: '/akademik/jadwal', icon: Calendar },
      { title: 'KRS & Persetujuan', path: '/akademik/krs', icon: FileCheck2 },
      { title: 'Nilai & KHS', path: '/akademik/khs', icon: Award },
    ],
  },
  {
    category: 'OPERASIONAL',
    items: [
      { title: 'Keuangan', path: '/operasional/keuangan', icon: Wallet },
      { title: 'Presensi', path: '/operasional/presensi', icon: Clock },
      { title: 'LMS Kuliah', path: '/operasional/lms', icon: BookMarked },
      { title: 'Ujian Online', path: '/operasional/ujian', icon: FileCheck2 },
      { title: 'Perpustakaan Digital', path: '/operasional/perpustakaan', icon: Library },
      { title: 'Pengumuman', path: '/operasional/pengumuman', icon: Megaphone },
    ],
  },
  {
    category: 'MANAJEMEN',
    items: [
      { title: 'SDM / HRD', path: '/manajemen/sdm', icon: Briefcase },
      { title: 'Penelitian & LPPM', path: '/manajemen/penelitian', icon: FlaskConical },
      { title: 'Kemahasiswaan', path: '/manajemen/kemahasiswaan', icon: Compass },
      { title: 'Fasilitas & Aset', path: '/manajemen/fasilitas', icon: Building },
    ],
  },
  {
    category: 'SISTEM',
    items: [
      { title: 'Pengguna & Role', path: '/sistem/pengguna', icon: ShieldCheck },
      { title: 'Audit Log', path: '/sistem/audit', icon: History },
      { title: 'Pengaturan Sistem', path: '/sistem/pengaturan', icon: Settings },
    ],
  },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-icms-deep-navy text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-30 border-r border-slate-800">
      {/* Brand Identity */}
      <div className="h-16 flex items-center px-6 bg-icms-navy border-b border-slate-800 gap-3">
        <div className="w-9 h-9 rounded-lg bg-icms-academic-blue flex items-center justify-center font-bold text-white shadow-md border border-icms-gold/40">
          I
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-white tracking-wide text-sm">ICMS CAMPUS</span>
          <span className="text-[10px] text-icms-gold font-medium uppercase tracking-wider">Enterprise Suite</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAVIGATION_SECTIONS.map((section) => (
          <div key={section.category}>
            <div className="px-3 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
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
                      `flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-icms-academic-blue text-white shadow-sm font-semibold border-l-4 border-icms-gold'
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

      {/* Footer Info */}
      <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>v1.0.0 (Phase 0)</span>
        </div>
        <HelpCircle className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
      </div>
    </aside>
  );
};

