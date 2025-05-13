import { ReactNode } from 'react';
import AppLayout from '@/components/layouts/app-layout';

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return <AppLayout>{children}</AppLayout>;
}
