'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/common/logo';
import { usePathname } from 'next/navigation';
import {
  Home,
  FileText,
  ClipboardList,
  CalendarCheck,
  Trophy,
  MessageSquare,
  TrendingUp,
  Settings,
  LogOut,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Box from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/applicants', label: 'Applicants', icon: Users },
    { href: '/dashboard/course-materials', label: 'Course Materials', icon: FileText },
    { href: '/dashboard/assignments', label: 'Assignments', icon: ClipboardList },
    { href: '/dashboard/attendance', label: 'Attendance', icon: CalendarCheck },
    { href: '/dashboard/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/dashboard/discussion', label: 'Discussion', icon: MessageSquare },
    { href: '/dashboard/progress', label: 'Progress', icon: TrendingUp },
  ];

  const bottomMenuItems = [{ href: '/dashboard/settings', label: 'Settings', icon: Settings }];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <Box
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <Box
        as="aside"
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-[#000523] text-white transition-transform duration-300 flex flex-col w-64',
          'lg:translate-x-0',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo Section */}
        <Box className="flex items-center justify-center p-6 border-b border-white/10">
          <Box className="flex flex-col items-center gap-2">
            <Logo />
          </Box>
        </Box>

        {/* Menu Label */}
        <Box className="px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">
          Menu
        </Box>

        {/* Navigation */}
        <Box as="nav" className="flex-1 overflow-y-auto py-2">
          <Box as="ul" className="space-y-1 px-3">
            {menuItems.map(item => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Box as="li" key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                      'hover:bg-white/5',
                      isActive
                        ? 'bg-[#477BFF] text-white font-medium'
                        : 'text-white/70 hover:text-white',
                    )}
                  >
                    <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-white')} />
                    <Box as="span" className="text-sm">
                      {item.label}
                    </Box>
                  </Link>
                </Box>
              );
            })}
          </Box>

          <Box className="mt-auto pt-4">
            <Box className="border-t border-white/10 mb-4 mx-3" />
            <Box as="ul" className="space-y-1 px-3">
              {bottomMenuItems.map(item => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Box as="li" key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                        'hover:bg-white/5',
                        isActive
                          ? 'bg-[#477BFF] text-white font-medium'
                          : 'text-white/70 hover:text-white',
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <Box as="span" className="text-sm">
                        {item.label}
                      </Box>
                    </Link>
                  </Box>
                );
              })}

              <Box as="li">
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    'hover:bg-red-500/10 text-red-400 hover:text-red-300 cursor-pointer',
                  )}
                  onClick={() => console.log('Logout clicked')}
                >
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  <Box as="span" className="text-sm">
                    Log out
                  </Box>
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* User Profile at Bottom */}
        <Box className="p-4 border-t border-white/10 mt-auto">
          <Box className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback className="bg-gray-300 text-[#000523]">FU</AvatarFallback>
            </Avatar>
            <Box className="flex-1 min-w-0">
              <Box as="p" className="text-sm font-medium text-white truncate">
                Faith Udoh
              </Box>
              <Box as="p" className="text-xs text-white/60 truncate">
                faithudoh@utf.com
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
