'use client';

import { ChevronRight, LayoutDashboardIcon } from 'lucide-react';
import Box from '@/components/ui/box';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

import { useAppSelector } from '@/redux';
import { getters, LangKey } from '@/lib/config/i18n';
import { NavMainProps } from '@/types/nav';

export function NavMain({ items }: NavMainProps) {
  const lang = useAppSelector(state => state.settings.lang) as LangKey;
  const data = getters.geti18ns()[lang].sidebarContent;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{data.sidebarGroup.title}</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Dashboard">
            <LayoutDashboardIcon />
            <Box as="span">{data.dashboard}</Box>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {items.map(item => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <Box as="span">{item.title}</Box>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map(subItem => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Box as="a" href={subItem.url}>
                          <Box as="span">{subItem.title}</Box>
                        </Box>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
