import { type LucideIcon } from 'lucide-react';

export type NavMenuItemProps = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
};
