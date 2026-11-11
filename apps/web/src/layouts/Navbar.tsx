import React, { useEffect, useState } from 'react';
import { Search, Bell, Calendar, Database, LogOut, ChevronDown, Check, Sparkles, Command } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@icms/shared';
import { CommandPalette } from '../components/ui/CommandPalette';
import { NotificationCenter } from '../components/ui/NotificationCenter';

const roleLabels: Record<UserRole, { label: string; badge: string }> = {
  [UserRole.SUPER_ADMIN]: { label: 'Super Admin', badge: 'bg-slate-800 text-white' },
  [UserRole.RECTOR]: { label: 'Rektor', badge: 'bg-blue-800 text-white' },
  [UserRole.VICE_RECTOR]: { label: 'Wakil Rektor', badge: 'bg-blue-700 text-white' },
  [UserRole.DEAN]: { label: 'Dekan FTI', badge: 'bg-indigo-700 text-white' },
  [UserRole.HEAD_OF_PROGRAM]: { label: 'Kaprodi IF', badge: 'bg-teal-700 text-white' },
  [UserRole.ACADEMIC_ADMIN]: { label: 'BAAK', badge: 'bg-sky-700 text-white' },
  [UserRole.FINANCE_ADMIN]: { label: 'BAUK', badge: 'bg-emerald-700 text-white' },
  [UserRole.ADMISSION_ADMIN]: { label: 'PMB Admisi', badge: 'bg-rose-700 text-white' },
  [UserRole.LECTURER]: { label: 'Dosen', badge: 'bg-amber-600 text-white' },
  [UserRole.STUDENT]: { label: 'Mahasiswa', badge: 'bg-emerald-600 text-white' },
  [UserRole.LIBRARIAN]: { label: 'Pustakawan', badge: 'bg-purple-700 text-white' },
  [UserRole.HR_ADMIN]: { label: 'HRD Dosen', badge: 'bg-orange-700 text-white' },
  [UserRole.STUDENT_AFFAIRS_ADMIN]: { label: 'Kemahasiswaan', badge: 'bg-cyan-700 text-white' },
  [UserRole.ALUMNI]: { label: 'Alumni', badge: 'bg-slate-700 text-white' },
};

export const Navbar: React.FC = () => {
  const { user, activeRole, setActiveRole, logout } = useAuth();
  const navigate = useNavigate();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState<{ status: string; latencyMs: number | null }>({
    status: 'checking',
    latencyMs: null,
  });

  // Global Ctrl+K / Cmd+K key listener for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    fetch('/api/v1/health')
      .then((res) => res.json())
      .then((res) => {
        const d = res.data || res;
        if (d.database) {
          setDbStatus({
            status: d.database.status,
            latencyMs: d.database.latencyMs,
          });
        }
      })
      .catch(() => {
        setDbStatus({ status: 'offline', latencyMs: null });
      });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentRoleInfo = roleLabels[activeRole] || { label: activeRole, badge: 'bg-slate-700 text-white' };

  return (
    <>
      <header className="h-16 bg-white border-b border-icms-border fixed top-0 right-0 left-64 z-20 flex items-center justify-between px-6">
        {/* Search Bar / Omnisearch Trigger */}
        <div className="flex items-center gap-3 w-80 md:w-96">
          <div
            onClick={() => setIsPaletteOpen(true)}
            className="relative w-full cursor-pointer group"
          >
            <Search className="w-4 h-4 text-icms-gray absolute left-3 top-1/2 -translate-y-1/2 group-hover:text-icms-academic-blue transition-colors" />
            <div className="w-full pl-9 pr-14 py-1.5 text-xs bg-slate-50 border border-icms-border rounded-lg group-hover:border-icms-academic-blue text-slate-500 flex items-center justify-between transition-all select-none">
              <span>Cari modul, mahasiswa, dosen...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-400">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Role Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200 transition-all shadow-sm"
              title="Ganti sudut pandang role"
            >
              <Sparkles className="w-3.5 h-3.5 text-icms-gold" />
              <span className="hidden sm:inline text-slate-500 font-normal">Peran:</span>
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${currentRoleInfo.badge}`}>
                {currentRoleInfo.label}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setRoleMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-40 max-h-96 overflow-y-auto">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Ganti Tampilan Role & Sidebar
                  </div>
                  {Object.entries(roleLabels).map(([rKey, info]) => {
                    const roleEnum = rKey as UserRole;
                    const isSelected = activeRole === roleEnum;
                    return (
                      <button
                        key={rKey}
                        onClick={() => {
                          setActiveRole(roleEnum);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-blue-50 text-icms-academic-blue font-bold'
                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-icms-academic-blue' : 'bg-slate-300'}`} />
                          <span>{info.label}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-icms-academic-blue" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Semester Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 text-icms-gold" />
            <span>TA 2026/2027 Ganjil</span>
          </div>

          {/* Database Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-md text-[11px] font-medium text-slate-700 border border-slate-200">
            <Database className="w-3.5 h-3.5 text-icms-academic-blue" />
            <span
              className={`font-semibold ${
                dbStatus.status === 'healthy' ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {dbStatus.status === 'healthy' ? 'PostgreSQL Online' : 'DB Checking'}
            </span>
          </div>

          {/* Notification Bell with Active Popover */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen((prev) => !prev)}
              className="relative p-2 text-slate-500 hover:text-icms-navy hover:bg-slate-100 rounded-lg transition-colors"
              title="Pusat Notifikasi & Pemberitahuan"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
            </button>

            <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-icms-border">
            <div className="w-8 h-8 rounded-full bg-icms-navy text-white flex items-center justify-center font-bold text-xs border border-icms-gold/40">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-icms-navy leading-tight truncate max-w-[130px]">
                {user?.fullName || 'Pengguna'}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                @{user?.username || 'user'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              title="Keluar (Logout)"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </>
  );
};
