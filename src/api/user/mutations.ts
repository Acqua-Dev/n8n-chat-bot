import { UpdateUserDto, UpdateUserWithTokenDto, UserForClient } from './types';
import { updateUser, updateUserWithToken } from './client-api';
import { useQueryMutation } from '@/utils/use-query-mutation';
import { getQueryClient } from '@/utils/query-client';
import { AuthQueryKeys } from '@/api/auth/constants';
import { useI18n } from '@/utils/localization/client';

export function useUpdateUser() {
  const t = useI18n();
  return useQueryMutation<UserForClient, Error, UpdateUserDto>({
    mutationFn: updateUser,
    onSuccess: async () => {
      const queryClient = getQueryClient();
      await queryClient.invalidateQueries({ queryKey: AuthQueryKeys.user });
    },
    onSuccessMessage: t('user.update.success'),
    onErrorMessage: t('user.update.error'),
  });
}

export function useUpdateUserWithToken() {
  const t = useI18n();
  return useQueryMutation<
    UserForClient,
    Error,
    { token: string; updateDto: UpdateUserWithTokenDto }
  >({
    mutationFn: ({ token, updateDto }) => updateUserWithToken(token, updateDto),
    onSuccessMessage: t('user.update.success'),
    onErrorMessage: t('user.update.error'),
  });
}
