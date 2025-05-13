'use client';

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
  LucideIcon,
  Sparkles,
  Wrench,
} from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useUser } from '@/api/auth/queries';
import { useSignOut } from '@/api/auth/mutations';
import { useI18n } from '@/utils/localization/client';
import { AppRoutes } from '@/constants/routes';
import { ProfileImage } from './profile-image';
import { useUserSubscriptions } from '@/api/stripe/queries';
import { useMemo } from 'react';
import { useCreateCustomerPortalSession } from '@/api/stripe/mutations';

type MenuItemType = {
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  group?: number;
};

export function UserMenu() {
  const { data: user, isPending } = useUser();
  const { isMobile } = useSidebar();
  const t = useI18n();
  const signOut = useSignOut();
  const createCustomerPortalSession = useCreateCustomerPortalSession();
  const { data: subscriptions, isPending: isSubscriptionsPending } =
    useUserSubscriptions();

  const isUserSubscribed = useMemo(() => {
    if (!isSubscriptionsPending && subscriptions && subscriptions.length > 0) {
      return subscriptions.some(
        (subscription) => subscription.status === 'active',
      );
    }
    return false;
  }, [isSubscriptionsPending, subscriptions]);

  const handleSignOut = async () => {
    try {
      await signOut.mutateAsync();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleManageSubscription = async () => {
    const origin = window.location.origin;
    await createCustomerPortalSession.mutateAsync({
      returnUrl: `${origin}${AppRoutes.account}`,
    });
  };

  const menuItems: MenuItemType[] = [
    {
      icon: isUserSubscribed ? Wrench : Sparkles,
      label: isUserSubscribed
        ? t('userMenu.managePlan')
        : t('userMenu.upgradePlan'),
      href: isUserSubscribed ? undefined : AppRoutes.subscribe,
      onClick: isUserSubscribed ? handleManageSubscription : undefined,
      group: 1,
    },
    {
      icon: BadgeCheck,
      label: t('userMenu.account'),
      href: AppRoutes.account,
      group: 2,
    },
    {
      icon: Bell,
      label: t('userMenu.notifications'),
      href: '#',
      group: 2,
    },
    {
      icon: LogOut,
      label: t('userMenu.logOut'),
      onClick: handleSignOut,
      group: 3,
    },
  ];

  const renderMenuItem = (item: MenuItemType) => {
    const Icon = item.icon;
    const content = (
      <>
        <Icon />
        {item.label}
      </>
    );

    if (item.href) {
      return (
        <DropdownMenuItem key={item.label} asChild>
          <Link href={item.href}>{content}</Link>
        </DropdownMenuItem>
      );
    }

    return (
      <DropdownMenuItem key={item.label} onClick={item.onClick}>
        {content}
      </DropdownMenuItem>
    );
  };

  const groupedItems = menuItems.reduce<Record<number, MenuItemType[]>>(
    (acc, item) => {
      const group = item.group || 0;
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(item);
      return acc;
    },
    {},
  );

  return !isPending && user ? (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <ProfileImage
                  profilePictureKey={user.profilePicture}
                  className="rounded-full"
                />
                <AvatarFallback className="rounded-lg">
                  {user.firstName && user.lastName
                    ? user.firstName.charAt(0).toUpperCase() +
                      user.lastName.charAt(0).toUpperCase()
                    : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.firstName}</span>
                <div className="flex items-center gap-1">
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            {Object.entries(groupedItems).map(([groupId, items], index) => (
              <div key={groupId}>
                {index > 0 && <DropdownMenuSeparator />}
                <DropdownMenuGroup>
                  {items.map(renderMenuItem)}
                </DropdownMenuGroup>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  ) : (
    <></>
  );
}
