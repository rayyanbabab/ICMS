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
              <Route path="akademik/*" element={<ModulePlaceholderPage />} />

              {/* Operational Routes */}
              <Route path="operasional/presensi" element={<AttendancePage />} />
              <Route path="operasional/lms" element={<LmsPage />} />
              <Route path="operasional/keuangan" element={<FinancePage />} />
              <Route path="operasional/perpustakaan" element={<LibraryPage />} />
              <Route path="operasional/*" element={<ModulePlaceholderPage />} />

              {/* Management Routes */}
              <Route path="manajemen/*" element={<ModulePlaceholderPage />} />

              {/* System Routes */}
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
