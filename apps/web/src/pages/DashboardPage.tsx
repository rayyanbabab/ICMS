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

export const DashboardPage: React.FC = () => {
  const { activeRole } = useAuth();

  return (
    <div className="space-y-6">
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
