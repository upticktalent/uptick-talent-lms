'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/common/logo';
import { usePathname, useRouter } from 'next/navigation';
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
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Box from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { deleteStorageCookie, removeLocalItem, getLocalItem, env } from '@/lib';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  variant: 'admin' | 'student';
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  variant = 'admin',
}) => {
  const pathname = usePathname();
  const router = useRouter();

  // const handleLogout = () => {
  //   const user = getLocalItem<{ role: string }>({ key: 'user' });
  //   const role = user?.role;

  //   deleteStorageCookie({ key: env.AUTH_TOKEN });
  //   removeLocalItem({ key: 'user' });

  //   if (role === 'ADMIN') {
  //     router.push('/login?role=admin');
  //   } else if (role === 'MENTOR') {
  //     router.push('/login?role=mentor');
  //   } else {
  //     router.push('/login');
  //   }
  // };

  const handleLogout = () => {
    deleteStorageCookie({ key: env.AUTH_TOKEN });
    deleteStorageCookie({ key: 'user_role' }); // Clear role cookie
    removeLocalItem({ key: 'user' });
    router.push('/login');
  };

  // Define menus for different roles
  const adminMenu = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/applicants', label: 'Applicants', icon: Users },
    { href: '/dashboard/course-materials', label: 'Course Materials', icon: FileText },
    { href: '/dashboard/assignments', label: 'Assignments', icon: ClipboardList },
    { href: '/dashboard/attendance', label: 'Attendance', icon: CalendarCheck },
    { href: '/dashboard/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/dashboard/discussion', label: 'Discussion', icon: MessageSquare },
    { href: '/dashboard/progress', label: 'Progress', icon: TrendingUp },
  ];

  const studentMenu = [
    { href: '/student/dashboard', label: 'My Learning', icon: Home },
    { href: '/student/courses', label: 'My Courses', icon: BookOpen },
    { href: '/student/assignments', label: 'Assignments', icon: ClipboardList },
    { href: '/student/schedule', label: 'Schedule', icon: CalendarCheck },
    { href: '/student/discussion', label: 'Discussion', icon: MessageSquare },
  ];

  // Select menu based on variant
  const menuItems = variant === 'admin' ? adminMenu : studentMenu;
  const settingsLink = variant === 'admin' ? '/dashboard/settings' : '/student/settings';

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
          {variant === 'admin' ? 'Admin Menu' : 'Student Menu'}
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

          <Box className="mt-auto pt-4 pb-6">
            <Box className="border-t border-white/10 mb-4 mx-3" />
            <Box as="ul" className="space-y-1 px-3">
              <Box as="li">
                <Link
                  href={settingsLink}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-white/5 text-white/70 hover:text-white"
                >
                  <Settings className="h-5 w-5 flex-shrink-0" />
                  <Box as="span" className="text-sm">
                    Settings
                  </Box>
                </Link>
              </Box>

              <Box as="li">
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full flex justify-start items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    'hover:bg-red-500/10 text-red-400 hover:text-red-300 cursor-pointer',
                  )}
                  onClick={handleLogout}
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
      </Box>
    </>
  );
};
