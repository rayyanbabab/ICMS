import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '@icms/shared';
import { SuperAdminDashboard } from './dashboards/SuperAdminDashboard';
import { RectorDashboard } from './dashboards/RectorDashboard';
import { LecturerDashboard } from './dashboards/LecturerDashboard';
import { StudentPortalDashboard } from './dashboards/StudentPortalDashboard';
import { DeanDashboard } from './dashboards/DeanDashboard';
import { HeadOfProgramDashboard } from './dashboards/HeadOfProgramDashboard';
import { AcademicAdminDashboard } from './dashboards/AcademicAdminDashboard';
import { FinanceAdminDashboard } from './dashboards/FinanceAdminDashboard';
import { LibrarianDashboard } from './dashboards/LibrarianDashboard';
import { AdmissionAdminDashboard } from './dashboards/AdmissionAdminDashboard';
import { AdaptiveStaffDashboard } from './dashboards/AdaptiveStaffDashboard';
import { 
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
  Award
} from 'lucide-react';

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
          {[
            { role: UserRole.SUPER_ADMIN, label: 'Super Admin', icon: ShieldCheck, color: 'bg-icms-navy' },
            { role: UserRole.RECTOR, label: 'Rektor', icon: UserCheck, color: 'bg-icms-academic-blue' },
            { role: UserRole.DEAN, label: 'Dekan FTI', icon: Building2, color: 'bg-indigo-700' },
            { role: UserRole.HEAD_OF_PROGRAM, label: 'Kaprodi IF', icon: BookOpen, color: 'bg-teal-700' },
            { role: UserRole.ACADEMIC_ADMIN, label: 'BAAK', icon: FileText, color: 'bg-sky-700' },
            { role: UserRole.FINANCE_ADMIN, label: 'BAUK', icon: Receipt, color: 'bg-emerald-700' },
            { role: UserRole.LIBRARIAN, label: 'Pustakawan', icon: Library, color: 'bg-purple-700' },
            { role: UserRole.ADMISSION_ADMIN, label: 'PMB', icon: UserPlus, color: 'bg-rose-700' },
            { role: UserRole.LECTURER, label: 'Dosen', icon: Users, color: 'bg-amber-600' },
            { role: UserRole.STUDENT, label: 'Mahasiswa', icon: GraduationCap, color: 'bg-emerald-600' },
            { role: UserRole.VICE_RECTOR, label: 'Wakil Rektor', icon: Award, color: 'bg-blue-800' },
            { role: UserRole.STUDENT_AFFAIRS_ADMIN, label: 'Kemahasiswaan', icon: Users, color: 'bg-cyan-700' },
            { role: UserRole.HR_ADMIN, label: 'HRD Dosen', icon: UserCheck, color: 'bg-orange-700' },
            { role: UserRole.ALUMNI, label: 'Alumni', icon: GraduationCap, color: 'bg-slate-700' },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activeWorkspaceRole === item.role;
            return (
              <button
                key={item.role}
                onClick={() => setActiveWorkspaceRole(item.role)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? `${item.color} text-white shadow-sm ring-1 ring-black/10`
                    : 'text-slate-600 hover:bg-slate-100 bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Distinct Role-Based Dashboard Experience */}
      {activeWorkspaceRole === UserRole.SUPER_ADMIN && <SuperAdminDashboard />}
      {activeWorkspaceRole === UserRole.RECTOR && <RectorDashboard />}
      {activeWorkspaceRole === UserRole.DEAN && <DeanDashboard />}
      {activeWorkspaceRole === UserRole.HEAD_OF_PROGRAM && <HeadOfProgramDashboard />}
      {activeWorkspaceRole === UserRole.ACADEMIC_ADMIN && <AcademicAdminDashboard />}
      {activeWorkspaceRole === UserRole.FINANCE_ADMIN && <FinanceAdminDashboard />}
      {activeWorkspaceRole === UserRole.LIBRARIAN && <LibrarianDashboard />}
      {activeWorkspaceRole === UserRole.ADMISSION_ADMIN && <AdmissionAdminDashboard />}
      {activeWorkspaceRole === UserRole.LECTURER && <LecturerDashboard />}
      {activeWorkspaceRole === UserRole.STUDENT && <StudentPortalDashboard />}
      {[UserRole.VICE_RECTOR, UserRole.STUDENT_AFFAIRS_ADMIN, UserRole.HR_ADMIN, UserRole.ALUMNI].includes(activeWorkspaceRole) && (
        <AdaptiveStaffDashboard role={activeWorkspaceRole} />
      )}
    </div>
  );
};
