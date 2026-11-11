import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '@icms/shared';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Receipt,
  Wallet,
  Menu,
  Sparkles,
  Calendar,
  Layers,
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenMenu: () => void;
  onOpenQuickActions: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenMenu,
  onOpenQuickActions,
}) => {
  const { activeRole } = useAuth();
  const location = useLocation();

  // Role-aware secondary navigation destination
  const getAcademicTab = () => {
    switch (activeRole) {
      case UserRole.STUDENT:
        return { label: 'KRS / Nilai', path: '/akademik/krs', icon: GraduationCap };
      case UserRole.LECTURER:
        return { label: 'Jadwal Mengajar', path: '/akademik/jadwal', icon: BookOpen };
      default:
        return { label: 'Akademik', path: '/akademik/jadwal', icon: Calendar };
    }
  };

  // Role-aware tertiary navigation destination
  const getFinanceTab = () => {
    switch (activeRole) {
      case UserRole.STUDENT:
        return { label: 'UKT & Tagihan', path: '/keuangan/ukt', icon: Wallet };
      case UserRole.FINANCE_ADMIN:
        return { label: 'Kasir UKT', path: '/keuangan/ukt', icon: Receipt };
      default:
        return { label: 'Keuangan', path: '/keuangan/ukt', icon: Receipt };
    }
  };

  const academicTab = getAcademicTab();
  const financeTab = getFinanceTab();
  const AcademicIcon = academicTab.icon;
  const FinanceIcon = financeTab.icon;

  const isHomeActive = location.pathname === '/';
  const isAcademicActive = location.pathname.startsWith('/akademik');
  const isFinanceActive = location.pathname.startsWith('/keuangan');

  // Role short label for mobile badge
  const roleShortLabels: Partial<Record<UserRole, string>> = {
    [UserRole.SUPER_ADMIN]: 'Admin',
    [UserRole.RECTOR]: 'Rektor',
    [UserRole.VICE_RECTOR]: 'Warek',
    [UserRole.DEAN]: 'Dekan',
    [UserRole.HEAD_OF_PROGRAM]: 'Kaprodi',
    [UserRole.ACADEMIC_ADMIN]: 'BAAK',
    [UserRole.FINANCE_ADMIN]: 'BAUK',
    [UserRole.ADMISSION_ADMIN]: 'PMB',
    [UserRole.LECTURER]: 'Dosen',
    [UserRole.STUDENT]: 'Mhs',
    [UserRole.LIBRARIAN]: 'Perpus',
    [UserRole.HR_ADMIN]: 'HRD',
    [UserRole.STUDENT_AFFAIRS_ADMIN]: 'Kemhs',
    [UserRole.ALUMNI]: 'Alumni',
  };

  return (
    <nav
      aria-label="Mobile Navigation Dock"
      className="fixed bottom-3 inset-x-3 sm:inset-x-8 max-w-md mx-auto z-40 lg:hidden"
    >
      <div className="bg-[#17233F]/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl px-2 py-1.5 flex items-center justify-around text-white">
        {/* 1. Beranda / Dashboard */}
        <NavLink
          to="/"
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[46px] rounded-xl transition-all ${
            isHomeActive
              ? 'text-white font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <LayoutDashboard className={`w-5 h-5 ${isHomeActive ? 'text-icms-gold' : ''}`} />
            {isHomeActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-icms-gold rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Beranda</span>
        </NavLink>

        {/* 2. Akademik */}
        <NavLink
          to={academicTab.path}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[46px] rounded-xl transition-all ${
            isAcademicActive
              ? 'text-white font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <AcademicIcon className={`w-5 h-5 ${isAcademicActive ? 'text-icms-academic-blue' : ''}`} />
            {isAcademicActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-icms-academic-blue rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">
            {academicTab.label}
          </span>
        </NavLink>

        {/* 3. Center Elevated Quick Action Orb */}
        <div className="relative -top-5 flex flex-col items-center">
          <button
            type="button"
            onClick={onOpenQuickActions}
            aria-label="Buka Aksi Cepat"
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 shadow-xl shadow-blue-500/40 border-2 border-[#17233F] flex items-center justify-center text-white active:scale-90 transition-transform focus:outline-none ring-4 ring-black/10 group"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform text-white animate-pulse" />
          </button>
          <span className="text-[10px] font-bold text-slate-200 mt-1 tracking-tight">
            Aksi Cepat
          </span>
        </div>

        {/* 4. Keuangan / Kasir */}
        <NavLink
          to={financeTab.path}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[46px] rounded-xl transition-all ${
            isFinanceActive
              ? 'text-white font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <FinanceIcon className={`w-5 h-5 ${isFinanceActive ? 'text-emerald-400' : ''}`} />
            {isFinanceActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">
            {financeTab.label}
          </span>
        </NavLink>

        {/* 5. Menu Lengkap / Modul Drawer */}
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Buka Menu Modul Lengkap"
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[46px] rounded-xl text-slate-400 hover:text-slate-200 transition-all relative"
        >
          <div className="relative">
            <Menu className="w-5 h-5" />
            <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-blue-500 text-[8px] font-bold text-white rounded-full">
              {roleShortLabels[activeRole] || 'All'}
            </span>
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Menu</span>
        </button>
      </div>
    </nav>
  );
};
