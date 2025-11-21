'use client';

import React, { useState } from 'react';
import Box from '@/components/ui/box';
import { DashboardSidebar } from '@/features/student/dashboard/components/DashboardSidebar';
import { DashboardHeader } from '@/features/student/dashboard/components/DashboardHeader';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Box className="min-h-screen bg-background">
      <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Box className="flex pt-16">
        <DashboardSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          basePath="/student"
        />
        <Box className="flex-1 md:ml-64 p-6 md:p-8 lg:p-10">{children}</Box>
      </Box>
    </Box>
  );
}
