'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';
import { X, Home, Video, User2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  name: string;
  path: string; // Changed from href to path (relative)
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: <Home className="w-5 h-5" />,
  },
  {
    name: 'Live Classes',
    path: '/live-classes',
    icon: <Video className="w-5 h-5" />,
  },
  {
    name: 'Profile',
    path: '/profile',
    icon: <User2 className="w-5 h-5" />,
  },
];

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  basePath?: string;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen = false,
  onClose,
  basePath = '/student', // Default to student base path if not provided
}) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && <Box className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <Box
        as="aside"
        className={cn(
          'fixed left-0 top-16 z-40 w-64 min-h-[calc(100vh-4rem)] border-r border-sidebar-border p-6 transition-transform duration-300 ease-in-out',
          'bg-sidebar text-sidebar-foreground',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0',
        )}
      >
        <Box className="flex justify-between items-center md:hidden mb-6">
          <span className="font-semibold text-lg">Menu</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </Box>

        <nav className="space-y-2">
          {navItems.map(item => {
            const fullHref = `${basePath}${item.path}`;

            const isActive = pathname === fullHref;

            return (
              <Link
                key={fullHref}
                href={fullHref}
                onClick={() => onClose?.()}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </Box>
    </>
  );
};
