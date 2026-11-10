import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-icms-bg flex">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar />

        {/* Content Area */}
        <main className="flex-1 mt-16 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

