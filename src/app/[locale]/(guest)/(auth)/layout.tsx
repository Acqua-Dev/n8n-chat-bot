'use client';

import { ReactNode, useEffect } from 'react';
import { useUser } from '@/api/auth/queries';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/constants/routes';

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  const router = useRouter();
  const { data: user, isPending } = useUser();

  useEffect(() => {
    if (!isPending && user) {
      router.push(AppRoutes.home);
    }
  }, [isPending, router, user]);

  return !user ? <>{children}</> : null;
}
