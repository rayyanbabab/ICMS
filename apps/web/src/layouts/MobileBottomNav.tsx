import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '@icms/shared';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Calendar,
  Receipt,
  Wallet,
  Menu,
  Plus,
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
        return { label: 'Akademik', path: '/akademik/krs', icon: GraduationCap };
      case UserRole.LECTURER:
        return { label: 'Jadwal', path: '/akademik/jadwal', icon: BookOpen };
      default:
        return { label: 'Akademik', path: '/akademik/jadwal', icon: Calendar };
    }
  };

  // Role-aware tertiary navigation destination
  const getFinanceTab = () => {
    switch (activeRole) {
      case UserRole.STUDENT:
        return { label: 'Tagihan', path: '/keuangan/ukt', icon: Wallet };
      case UserRole.FINANCE_ADMIN:
        return { label: 'Kasir', path: '/keuangan/ukt', icon: Receipt };
      default:
        return { label: 'Keuangan', path: '/keuangan/ukt', icon: Receipt };
    }
  };

  const academicTab = getAcademicTab();
  const financeTab = getFinanceTab();
  const AcademicIcon = academicTab.icon;
  const FinanceIcon = financeTab.icon;

  const isHomeActive = location.pathname === '/';
  const isAcademicActive =
    location.pathname.startsWith('/akademik') || location.pathname.startsWith('/portal');
  const isFinanceActive = location.pathname.startsWith('/keuangan');

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-4 inset-x-4 max-w-sm mx-auto z-40 lg:hidden pointer-events-none"
    >
      <div className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_12px_36px_rgba(15,23,42,0.12),0_1px_2px_rgba(15,23,42,0.06)] rounded-full px-2 py-1.5 flex items-center justify-between">
        {/* 1. Beranda */}
        <NavLink
          to="/"
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-full transition-all ${
            isHomeActive
              ? 'text-blue-700 font-bold bg-blue-50/80'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 stroke-[2]" />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Beranda</span>
        </NavLink>

        {/* 2. Akademik */}
        <NavLink
          to={academicTab.path}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-full transition-all ${
            isAcademicActive
              ? 'text-blue-700 font-bold bg-blue-50/80'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <AcademicIcon className="w-4 h-4 stroke-[2]" />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium truncate max-w-[56px]">
            {academicTab.label}
          </span>
        </NavLink>

        {/* 3. Center Quick Action Trigger: Sleek, Flush Circular Button */}
        <div className="flex items-center justify-center px-1">
          <button
            type="button"
            onClick={onOpenQuickActions}
            aria-label="Buka Aksi Cepat"
            title="Aksi Cepat"
            className="w-9 h-9 rounded-full bg-icms-navy hover:bg-slate-800 active:scale-95 text-white flex items-center justify-center shadow-sm transition-all focus:outline-none"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* 4. Keuangan */}
        <NavLink
          to={financeTab.path}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-full transition-all ${
            isFinanceActive
              ? 'text-blue-700 font-bold bg-blue-50/80'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FinanceIcon className="w-4 h-4 stroke-[2]" />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium truncate max-w-[56px]">
            {financeTab.label}
          </span>
        </NavLink>

        {/* 5. Menu Lengkap */}
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Buka Menu Kampus"
          className="flex flex-col items-center justify-center flex-1 py-1 rounded-full text-slate-500 hover:text-slate-800 transition-all"
        >
          <Menu className="w-4 h-4 stroke-[2]" />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Menu</span>
        </button>
      </div>
    </nav>
  );
};
