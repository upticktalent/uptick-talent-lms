'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/features/dashboard/components/Sidebar';
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader';
import Box from '@/components/ui/box';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname.includes('/applicants')) return 'Applicants';
    if (pathname.includes('/course-materials')) return 'Course Materials';
    return 'Dashboard';
  };

  return (
    <Box className="flex min-h-screen bg-gray-50">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <Box className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <DashboardHeader
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          pageTitle={getPageTitle()}
        />

        <Box as="main" className="flex-1 p-6 lg:p-8">
          {children}
        </Box>
      </Box>
    </Box>
  );
};
