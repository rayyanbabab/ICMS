import React from 'react';
import { Search, Bell, User as UserIcon, Calendar, Database } from 'lucide-react';

interface NavbarProps {
  systemHealth?: {
    status: string;
    dbStatus: string;
    latencyMs: number | null;
  };
}

export const Navbar: React.FC<NavbarProps> = ({ systemHealth }) => {
  return (
    <header className="h-16 bg-white border-b border-icms-border fixed top-0 right-0 left-64 z-20 flex items-center justify-between px-6">
      {/* Search Input */}
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

      {/* Right Section / Controls */}
      <div className="flex items-center gap-4">
        {/* Semester / Academic Year Tag */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full text-xs font-medium">
          <Calendar className="w-3.5 h-3.5 text-icms-gold" />
          <span>TA 2026/2027 Ganjil</span>
        </div>

        {/* Database Connection Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-md text-[11px] font-medium text-slate-700 border border-slate-200">
          <Database className="w-3.5 h-3.5 text-icms-academic-blue" />
          <span>DB:</span>
          <span
            className={`font-semibold ${
              systemHealth?.dbStatus === 'healthy' ? 'text-emerald-600' : 'text-slate-600'
            }`}
          >
            {systemHealth?.dbStatus === 'healthy'
              ? `Online (${systemHealth.latencyMs}ms)`
              : 'Standby'}
          </span>
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 text-slate-500 hover:text-icms-navy hover:bg-slate-100 rounded-lg transition-colors"
          title="Notifikasi"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-icms-danger"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-icms-border">
          <div className="w-8 h-8 rounded-full bg-icms-navy text-white flex items-center justify-center font-semibold text-xs border border-icms-gold/40">
            SA
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-icms-navy leading-tight">Super Administrator</span>
            <span className="text-[10px] text-icms-gold font-medium">SUPER_ADMIN</span>
          </div>
        </div>
      </div>
    </header>
  );
};

