import { QueryClient, useQuery } from '@tanstack/react-query';
import { AuthQueryKeys } from '@/api/auth/constants';
import { getUser } from '@/api/auth/client-api';

export async function prefetchUser(queryClient: QueryClient) {
  await queryClient.prefetchQuery({
    queryKey: AuthQueryKeys.user,
    queryFn: getUser,
  });
}

export function useUser() {
  return useQuery({
    queryKey: AuthQueryKeys.user,
    queryFn: getUser,
    retry: 0,
  });
}
