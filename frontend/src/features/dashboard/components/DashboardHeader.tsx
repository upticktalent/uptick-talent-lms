'use client';

import React, { useEffect, useState } from 'react';
import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Box from '@/components/ui/box';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getLocalItem } from '@/lib';

interface DashboardHeaderProps {
  onMenuToggle: () => void;
  pageTitle: string;
}

interface UserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  photoUrl?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuToggle, pageTitle }) => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    // Safely read the latest user from localStorage on mount
    const userData = getLocalItem<UserData>({ key: 'user' });
    setUser(userData);

    // Also subscribe to storage changes in case another tab updates it
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'user') {
        try {
          const parsed = e.newValue ? (JSON.parse(e.newValue) as UserData) : null;
          setUser(parsed);
        } catch {
          setUser(null);
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', onStorage);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', onStorage);
      }
    };
  }, []);

  const firstName = user?.firstName?.trim();
  const lastName = user?.lastName?.trim();
  const fullName =
    firstName || lastName ? `${firstName ?? ''} ${lastName ?? ''}`.trim() : user?.email || 'User';
  const role = user?.role ?? 'Admin';

  return (
    <Box as="header" className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <Box className="flex items-center justify-between px-6 py-4 gap-4">
        {/* Left: Mobile Menu + Title */}
        <Box className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden text-[#000523] hover:bg-gray-100 shrink-0"
          >
            <Menu className="h-6 w-6" />
          </Button>

          <Box as="h1" className="text-2xl font-bold text-[#000523] hidden md:block">
            {pageTitle}
          </Box>
        </Box>

        {/* Right: Notification + Profile */}
        <Box className="flex items-center gap-3 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-600 hover:text-[#477BFF] hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-muted"
          >
            <Bell className="h-5 w-5" />
            <Box as="span" className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>

          {/* Make profile visible on small screens too, with truncation to avoid overflow */}
          <Box className="flex items-center gap-3 pl-3 border-l border-gray-200 max-w-[60vw] sm:max-w-none">
            <Avatar>
              <AvatarImage src={user?.photoUrl || ''} />
              <AvatarFallback className="bg-gray-200 text-[#000523]">
                {(firstName?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Box className="flex flex-col items-start">
              <Box
                as="p"
                className="text-sm font-semibold text-[#000523] truncate max-w-[40vw] sm:max-w-none"
              >
                {fullName}
              </Box>
              <Box as="p" className="text-xs text-gray-500">
                {role}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
