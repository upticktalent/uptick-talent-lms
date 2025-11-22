'use client';

import React from 'react';
import Box from '@/components/ui/box';
import { Logo } from '@/components/common/logo';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuClick }) => {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('______Up@TickLMS____TOKEN___');
    }
    router.push('/login');
  };

  return (
    <Box
      as="header"
      className="h-16 bg-sidebar border-b border-border fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6"
    >
      <Box className="flex items-center gap-4">
        {/* Mobile Menu Trigger */}
        <Button variant="outline" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        <Logo className="h-8" />
      </Box>

      <Box className="flex items-center gap-2 md:gap-4">
        <ModeToggle />
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};
