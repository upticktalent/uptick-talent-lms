'use client';

import * as React from 'react';

import { useAppSelector } from '@/redux';
import { getters, LangKey } from '@/lib/config/i18n';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Logo } from '@/components/common/logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const lang = useAppSelector(state => state.settings.lang) as LangKey;
  const data = getters.geti18ns()[lang].sidebarContent;
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo className="w-46" linkTo="/dashboard" />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.applications} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
