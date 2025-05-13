'use client';

import { Command, LifeBuoy, Send, SquareTerminal } from 'lucide-react';

import { TreeSidebarMenu } from '@/components/menus/tree-sidebar-menu';
import { UserMenu } from '@/components/menus/user-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ComponentProps } from 'react';
import Link from 'next/link';
import { ListSidebarMenu } from '@/components/menus/list-sidebar-menu';

import { AppRoutes } from '@/constants/routes';

const navBarData = {
  navMain: [
    {
      title: 'Payment',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Test subscription',
          url: AppRoutes.subscribe,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
  ],
};

type AppSidebarProps = ComponentProps<typeof Sidebar>;

export function AppSidebar({ ...props }: AppSidebarProps) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <TreeSidebarMenu title="Plateform" items={navBarData.navMain} />
        <ListSidebarMenu items={navBarData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
