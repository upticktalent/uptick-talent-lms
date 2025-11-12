'use client';

import { Bell, ChevronsUpDown, LogOut } from 'lucide-react';
import Box from '@/components/ui/box';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAppSelector } from '@/redux';
import { getters, LangKey } from '@/lib/config/i18n';
import { NavUserProps } from '@/types/nav';

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar();

  const lang = useAppSelector(state => state.settings.lang) as LangKey;
  const data = getters.geti18ns()[lang].sidebarContent.user;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg text-black">CN</AvatarFallback>
              </Avatar>
              <Box className="grid flex-1 text-left text-sm leading-tight">
                <Box as="span" className="truncate font-medium">
                  {user.name}
                </Box>
                <Box as="span" className="truncate text-xs">
                  {user.email}
                </Box>
              </Box>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <Box className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <Box className="grid flex-1 text-left text-sm leading-tight">
                  <Box as="span" className="truncate font-medium">
                    {user.name}
                  </Box>
                  <Box as="span" className="truncate text-xs">
                    {user.email}
                  </Box>
                </Box>
              </Box>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Bell />
                {data.notification}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              {data.logout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
