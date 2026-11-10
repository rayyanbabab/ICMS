import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { MainLayout } from './layouts/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { UsersPage } from './pages/UsersPage';
import { KrsPage } from './pages/KrsPage';
import { KhsPage } from './pages/KhsPage';
import { CoursesPage } from './pages/CoursesPage';
import { AttendancePage } from './pages/AttendancePage';
import { LmsPage } from './pages/LmsPage';
import { FinancePage } from './pages/FinancePage';
import { LibraryPage } from './pages/LibraryPage';
import { SchedulePage } from './pages/SchedulePage';
import { AcademicCalendarPage } from './pages/AcademicCalendarPage';
import { ExamCbtPage } from './pages/ExamCbtPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { FacultiesPage } from './pages/FacultiesPage';
import { StudyProgramsPage } from './pages/StudyProgramsPage';
import { CurriculumPage } from './pages/CurriculumPage';
import { AdministrationLettersPage } from './pages/AdministrationLettersPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { StudentAffairsPage } from './pages/StudentAffairsPage';
import { ResearchLppmPage } from './pages/ResearchLppmPage';
import { CareerInternshipPage } from './pages/CareerInternshipPage';
import { HumanResourcesPage } from './pages/HumanResourcesPage';
import { AlumniTracerPage } from './pages/AlumniTracerPage';
import { RolePermissionsPage } from './pages/RolePermissionsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SystemSettingsPage } from './pages/SystemSettingsPage';
import { ModulePlaceholderPage } from './pages/ModulePlaceholderPage';
import { Loader2 } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const ProtectedLayout: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-icms-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-icms-academic-blue" />
          <span className="text-xs font-semibold text-slate-600">Memuat Sesi Pengguna...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout />;
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedLayout />}>
              <Route index element={<DashboardPage />} />

              {/* User Management Route */}
              <Route path="sistem/pengguna" element={<UsersPage />} />

              {/* Academic Core Routes */}
              <Route path="akademik/krs" element={<KrsPage />} />
              <Route path="akademik/khs" element={<KhsPage />} />
              <Route path="akademik/mata-kuliah" element={<CoursesPage />} />
              <Route path="akademik/jadwal" element={<SchedulePage />} />
              <Route path="akademik/kalender" element={<AcademicCalendarPage />} />
              <Route path="akademik/fakultas" element={<FacultiesPage />} />
              <Route path="akademik/program-studi" element={<StudyProgramsPage />} />
              <Route path="akademik/kurikulum" element={<CurriculumPage />} />
              <Route path="akademik/*" element={<ModulePlaceholderPage />} />

              {/* Operational Routes */}
              <Route path="operasional/presensi" element={<AttendancePage />} />
              <Route path="operasional/lms" element={<LmsPage />} />
              <Route path="operasional/keuangan" element={<FinancePage />} />
              <Route path="operasional/perpustakaan" element={<LibraryPage />} />
              <Route path="operasional/ujian" element={<ExamCbtPage />} />
              <Route path="operasional/pengumuman" element={<AnnouncementsPage />} />
              <Route path="operasional/administrasi" element={<AdministrationLettersPage />} />
              <Route path="operasional/*" element={<ModulePlaceholderPage />} />

              {/* Management Routes */}
              <Route path="manajemen/fasilitas" element={<FacilitiesPage />} />
              <Route path="manajemen/kemahasiswaan" element={<StudentAffairsPage />} />
              <Route path="manajemen/penelitian" element={<ResearchLppmPage />} />
              <Route path="manajemen/magang-karier" element={<CareerInternshipPage />} />
              <Route path="manajemen/sdm" element={<HumanResourcesPage />} />
              <Route path="manajemen/alumni" element={<AlumniTracerPage />} />
              <Route path="manajemen/*" element={<ModulePlaceholderPage />} />

              {/* System Routes */}
              <Route path="sistem/role-permission" element={<RolePermissionsPage />} />
              <Route path="sistem/audit-log" element={<AuditLogsPage />} />
              <Route path="sistem/pengaturan" element={<SystemSettingsPage />} />
              <Route path="sistem/backup" element={<SystemSettingsPage />} />
              <Route path="sistem/*" element={<ModulePlaceholderPage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
