import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@icms/shared';
import { Sidebar } from './Sidebar';
import {
  X,
  Sparkles,
  LogOut,
  Palette,
  ShieldCheck,
  GraduationCap,
  Users,
  UserCheck,
  Building2,
  BookOpen,
  FileText,
  Receipt,
  Library,
  UserPlus,
  Award,
} from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTheme: () => void;
}

const roleOptions = [
  { role: UserRole.SUPER_ADMIN, label: 'Super Admin', icon: ShieldCheck, color: 'bg-slate-800' },
  { role: UserRole.RECTOR, label: 'Rektor', icon: UserCheck, color: 'bg-blue-800' },
  { role: UserRole.VICE_RECTOR, label: 'Wakil Rektor', icon: Award, color: 'bg-blue-700' },
  { role: UserRole.DEAN, label: 'Dekan FTI', icon: Building2, color: 'bg-indigo-700' },
  { role: UserRole.HEAD_OF_PROGRAM, label: 'Kaprodi IF', icon: BookOpen, color: 'bg-teal-700' },
  { role: UserRole.ACADEMIC_ADMIN, label: 'BAAK', icon: FileText, color: 'bg-sky-700' },
  { role: UserRole.FINANCE_ADMIN, label: 'BAUK', icon: Receipt, color: 'bg-emerald-700' },
  { role: UserRole.ADMISSION_ADMIN, label: 'PMB', icon: UserPlus, color: 'bg-rose-700' },
  { role: UserRole.LECTURER, label: 'Dosen', icon: Users, color: 'bg-amber-600' },
  { role: UserRole.STUDENT, label: 'Mahasiswa', icon: GraduationCap, color: 'bg-emerald-600' },
  { role: UserRole.LIBRARIAN, label: 'Pustakawan', icon: Library, color: 'bg-purple-700' },
  { role: UserRole.STUDENT_AFFAIRS_ADMIN, label: 'Kemahasiswaan', icon: Users, color: 'bg-cyan-700' },
  { role: UserRole.HR_ADMIN, label: 'HRD Dosen', icon: UserCheck, color: 'bg-orange-700' },
  { role: UserRole.ALUMNI, label: 'Alumni', icon: GraduationCap, color: 'bg-slate-700' },
];

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onOpenTheme,
}) => {
  const { user, activeRole, setActiveRole, logout } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = () => {
    onClose();
    logout();
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Dim Backdrop with blur */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-80 max-w-[85vw] bg-icms-deep-navy text-slate-100 flex flex-col h-full shadow-2xl z-10 border-r border-white/10 animate-in slide-in-from-left duration-250">
        {/* Mobile Drawer Top Banner */}
        <div className="p-4 bg-black/40 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-icms-academic-blue flex items-center justify-center font-bold text-white shadow-sm border border-icms-gold/40">
              U
            </div>
            <div>
              <div className="text-xs font-bold text-white font-heading">
                UNIVERSITAS INDONESIA
              </div>
              <div className="text-[10px] text-icms-gold font-medium">
                ICMS Campus Suite
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-3.5 bg-black/20 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {user?.fullName || 'Pengguna'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate">
                @{user?.username || 'user'}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Keluar"
            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Role Switcher Bar */}
        <div className="p-3 bg-black/30 border-b border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-icms-gold" />
              Simulasi 14 Peran Kampus
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
              Aktif: {activeRole}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {roleOptions.map((item) => {
              const Icon = item.icon;
              const isSelected = activeRole === item.role;
              return (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => setActiveRole(item.role)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                    isSelected
                      ? `${item.color} text-white ring-2 ring-white/40 shadow-sm`
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Role-Specific Menu */}
        <div className="flex-1 overflow-hidden relative">
          <Sidebar isMobileDrawer={true} onClose={onClose} />
        </div>

        {/* Drawer Bottom Actions */}
        <div className="p-3 bg-black/50 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenTheme();
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-white/10"
          >
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            <span>Kustomisasi Tema</span>
          </button>

          <span className="text-[10px] font-mono text-slate-500">v1.0.0</span>
        </div>
      </div>
    </div>
  );
};

