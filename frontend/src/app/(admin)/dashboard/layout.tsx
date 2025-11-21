'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/features/dashboard/components/Sidebar';
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader';
import Box from '@/components/ui/box';
import { AuthGuard } from '@/components/common/AuthGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Helper to generate dynamic titles
  const getPageTitle = () => {
    const path = pathname.split('/').pop();
    if (!path || path === 'dashboard') return 'Admin Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  };

  return (
    <AuthGuard>
      <Box className="flex min-h-screen bg-gray-50 dark:bg-background">
        {/* Explicitly set variant to admin */}
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          variant="admin"
        />

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
    </AuthGuard>
  );
}
