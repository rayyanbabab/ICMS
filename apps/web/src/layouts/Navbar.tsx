import React, { useEffect, useState } from 'react';
import { Search, Bell, Calendar, Database, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dbStatus, setDbStatus] = useState<{ status: string; latencyMs: number | null }>({
    status: 'checking',
    latencyMs: null,
  });

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

  const primaryRole = user?.roles?.[0] || 'GUEST';

  return (
    <header className="h-16 bg-white border-b border-icms-border fixed top-0 right-0 left-64 z-20 flex items-center justify-between px-6">
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-icms-gray absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari mahasiswa (NIM), dosen, mata kuliah..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-icms-border rounded-lg focus:outline-none focus:ring-1 focus:ring-icms-academic-blue focus:border-icms-academic-blue transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Semester Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full text-xs font-medium">
          <Calendar className="w-3.5 h-3.5 text-icms-gold" />
          <span>TA 2026/2027 Ganjil</span>
        </div>

        {/* Database Status Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-md text-[11px] font-medium text-slate-700 border border-slate-200">
          <Database className="w-3.5 h-3.5 text-icms-academic-blue" />
          <span>PostgreSQL:</span>
          <span
            className={`font-semibold ${
              dbStatus.status === 'healthy' ? 'text-emerald-600' : 'text-amber-600'
            }`}
          >
            {dbStatus.status === 'healthy'
              ? `Connected (${dbStatus.latencyMs}ms)`
              : 'Checking'}
          </span>
        </div>

        {/* Notification Bell */}
        <button
          className="relative p-2 text-slate-500 hover:text-icms-navy hover:bg-slate-100 rounded-lg transition-colors"
          title="Notifikasi"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-icms-danger"></span>
        </button>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-3 pl-3 border-l border-icms-border">
          <div className="w-8 h-8 rounded-full bg-icms-navy text-white flex items-center justify-center font-bold text-xs border border-icms-gold/40">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-icms-navy leading-tight truncate max-w-[140px]">
              {user?.fullName || 'Pengguna'}
            </span>
            <span className="text-[10px] text-icms-gold font-medium">
              {primaryRole}
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
  );
};
