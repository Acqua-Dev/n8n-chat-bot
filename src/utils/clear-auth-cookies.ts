'use server';

import { cookies } from 'next/headers';
import { JwtConstants } from '@/api/auth/constants';

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(JwtConstants.accessToken);
}
