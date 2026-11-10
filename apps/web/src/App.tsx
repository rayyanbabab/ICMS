import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from './layouts/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ModulePlaceholderPage } from './pages/ModulePlaceholderPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />

            {/* Academic Routes */}
            <Route path="akademik/*" element={<ModulePlaceholderPage />} />

            {/* Operational Routes */}
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
    </QueryClientProvider>
  );
};

export default App;

