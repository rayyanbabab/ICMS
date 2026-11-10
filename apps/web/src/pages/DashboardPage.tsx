import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '@icms/shared';
import { SuperAdminDashboard } from './dashboards/SuperAdminDashboard';
import { RectorDashboard } from './dashboards/RectorDashboard';
import { LecturerDashboard } from './dashboards/LecturerDashboard';
import { StudentPortalDashboard } from './dashboards/StudentPortalDashboard';
import { ShieldCheck, GraduationCap, Users, UserCheck } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  // Determine primary active view based on actual user role
  const initialRole = user?.roles?.includes(UserRole.STUDENT)
    ? UserRole.STUDENT
    : user?.roles?.includes(UserRole.LECTURER)
    ? UserRole.LECTURER
    : user?.roles?.includes(UserRole.RECTOR)
    ? UserRole.RECTOR
    : UserRole.SUPER_ADMIN;

  const [activeWorkspaceRole, setActiveWorkspaceRole] = useState<UserRole>(initialRole);

  return (
    <div className="space-y-6">
      {/* Role Workspace Switcher Bar (Stage 2 Requirement) */}
      <div className="bg-white rounded-2xl p-2.5 border border-icms-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 pl-2">
          <span className="w-2.5 h-2.5 rounded-full bg-icms-academic-blue animate-pulse"></span>
          <span className="text-xs font-bold text-icms-navy">Workspace Switcher:</span>
          <span className="text-[11px] text-slate-500 hidden md:inline">
            (Pilih peran untuk melihat pengalaman antarmuka khusus tiap role)
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveWorkspaceRole(UserRole.SUPER_ADMIN)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeWorkspaceRole === UserRole.SUPER_ADMIN
                ? 'bg-icms-navy text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Super Admin</span>
          </button>

          <button
            onClick={() => setActiveWorkspaceRole(UserRole.RECTOR)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeWorkspaceRole === UserRole.RECTOR
                ? 'bg-icms-academic-blue text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Rektor</span>
          </button>

          <button
            onClick={() => setActiveWorkspaceRole(UserRole.LECTURER)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeWorkspaceRole === UserRole.LECTURER
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Dosen</span>
          </button>

          <button
            onClick={() => setActiveWorkspaceRole(UserRole.STUDENT)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeWorkspaceRole === UserRole.STUDENT
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Mahasiswa</span>
          </button>
        </div>
      </div>

      {/* Render Distinct Role-Based Dashboard Experience */}
      {activeWorkspaceRole === UserRole.SUPER_ADMIN && <SuperAdminDashboard />}
      {activeWorkspaceRole === UserRole.RECTOR && <RectorDashboard />}
      {activeWorkspaceRole === UserRole.LECTURER && <LecturerDashboard />}
      {activeWorkspaceRole === UserRole.STUDENT && <StudentPortalDashboard />}
    </div>
  );
};
