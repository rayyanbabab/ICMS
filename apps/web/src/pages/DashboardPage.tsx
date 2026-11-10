import React from 'react';
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
  Award,
  Sparkles
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, activeRole, setActiveRole } = useAuth();

  const roleConfigs = [
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
  ];

  return (
    <div className="space-y-6">
      {/* Role Workspace Switcher Bar */}
      <div className="bg-white rounded-2xl p-3 border border-icms-border shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-icms-gold animate-pulse" />
            <span className="text-xs font-bold text-icms-navy">Role Workspace Switcher:</span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Pilih peran untuk mensimulasikan antarmuka Dashboard & Sidebar khusus masing-masing role.
            </span>
          </div>
          <div className="text-[11px] font-semibold text-icms-academic-blue bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            Role Aktif: {roleConfigs.find((r) => r.role === activeRole)?.label || activeRole}
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {roleConfigs.map((item) => {
            const Icon = item.icon;
            const isSelected = activeRole === item.role;
            return (
              <button
                key={item.role}
                onClick={() => setActiveRole(item.role)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? `${item.color} text-white shadow-md ring-2 ring-offset-1 ring-icms-academic-blue`
                    : 'text-slate-600 hover:bg-slate-100 bg-slate-50 border border-slate-200/80'
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
      {activeRole === UserRole.SUPER_ADMIN && <SuperAdminDashboard />}
      {activeRole === UserRole.RECTOR && <RectorDashboard />}
      {activeRole === UserRole.DEAN && <DeanDashboard />}
      {activeRole === UserRole.HEAD_OF_PROGRAM && <HeadOfProgramDashboard />}
      {activeRole === UserRole.ACADEMIC_ADMIN && <AcademicAdminDashboard />}
      {activeRole === UserRole.FINANCE_ADMIN && <FinanceAdminDashboard />}
      {activeRole === UserRole.LIBRARIAN && <LibrarianDashboard />}
      {activeRole === UserRole.ADMISSION_ADMIN && <AdmissionAdminDashboard />}
      {activeRole === UserRole.LECTURER && <LecturerDashboard />}
      {activeRole === UserRole.STUDENT && <StudentPortalDashboard />}
      {[UserRole.VICE_RECTOR, UserRole.STUDENT_AFFAIRS_ADMIN, UserRole.HR_ADMIN, UserRole.ALUMNI].includes(activeRole) && (
        <AdaptiveStaffDashboard role={activeRole} />
      )}
    </div>
  );
};
