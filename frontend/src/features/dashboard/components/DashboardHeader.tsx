'use client';

import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Box from '@/components/ui/box';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DashboardHeaderProps {
  onMenuToggle: () => void;
  pageTitle: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuToggle, pageTitle }) => {
  // Mock data - replace with actual query
  const userProfile = { name: 'Faith Udoh', role: 'Student', avatar: null };

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

        {/* Center: Search */}
        <Box className="flex-1 max-w-xl">
          <Box className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search"
              className="pl-10 bg-gray-50 border-gray-200 focus-visible:ring-[#477BFF]"
            />
          </Box>
        </Box>

        {/* Right: Notification + Profile */}
        <Box className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-600 hover:text-[#477BFF] hover:bg-gray-100"
          >
            <Bell className="h-5 w-5" />
            <Box as="span" className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>

          <Box className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200">
            <Avatar>
              <AvatarImage src={userProfile.avatar || ''} />
              <AvatarFallback className="bg-gray-200 text-[#000523]">
                {userProfile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Box className="text-right">
              <Box as="p" className="text-sm font-semibold text-[#000523]">
                {userProfile.name}
              </Box>
              <Box as="p" className="text-xs text-gray-500">
                {userProfile.role}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
