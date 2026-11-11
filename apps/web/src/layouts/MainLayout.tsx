import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileDrawer } from './MobileDrawer';
import { MobileQuickActionsModal } from './MobileQuickActionsModal';
import { useThemeConfig } from '../hooks/useThemeConfig';

export const MainLayout: React.FC = () => {
  const { isSlim } = useThemeConfig();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  const handleOpenSearch = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  const handleOpenTheme = () => {
    window.dispatchEvent(new CustomEvent('open-theme-modal'));
  };

  return (
    <div className="min-h-screen bg-icms-bg flex flex-col lg:flex-row text-slate-800">
      {/* Fixed Left Sidebar (Desktop Only) */}
      <Sidebar />

      {/* Main Container */}
      <div
        className={`flex-1 ml-0 ${
          isSlim ? 'lg:ml-20' : 'lg:ml-64'
        } flex flex-col min-h-screen transition-all duration-300 w-full overflow-x-hidden`}
      >
        {/* Top Navbar */}
        <Navbar onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)} />

        {/* Content Area with Mobile Safe Bottom Padding */}
        <main className="flex-1 mt-14 lg:mt-16 p-3.5 sm:p-6 pb-28 lg:pb-8 w-full max-w-full">
          <Outlet />
        </main>
      </div>

      {/* Modern App-Native Floating Bottom Nav (Mobile Only) */}
      <MobileBottomNav
        onOpenMenu={() => setIsMobileMenuOpen(true)}
        onOpenQuickActions={() => setIsQuickActionOpen(true)}
      />

      {/* Native Slide-over Mobile Drawer for All 14 Roles */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenTheme={handleOpenTheme}
      />

      {/* Native Mobile Quick Actions Bottom Sheet */}
      <MobileQuickActionsModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        onOpenSearch={handleOpenSearch}
        onOpenTheme={handleOpenTheme}
      />
    </div>
  );
};
