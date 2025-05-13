import { forgotPassword, signIn, signUp } from '@/api/auth/client-api';
import { useQueryMutation } from '@/utils/use-query-mutation';
import { clearAuthCookies } from '@/utils/clear-auth-cookies';
import { getQueryClient } from '@/utils/query-client';
import { ForgotPasswordDto } from './types';
import { useI18n } from '@/utils/localization/client';

export function useSignUp() {
  const t = useI18n();
  return useQueryMutation({
    mutationFn: signUp,
    onSuccess: () => {
      window.location.reload();
    },
    onSuccessMessage: t('auth.signUp.success'),
    onErrorMessage: t('auth.signUp.error'),
  });
}

export function useSignIn() {
  const t = useI18n();
  return useQueryMutation({
    mutationFn: signIn,
    onSuccess: () => {
      window.location.reload();
    },
    onSuccessMessage: t('auth.signIn.success'),
    onErrorMessage: t('auth.signIn.error'),
  });
}

export function useSignOut() {
  const t = useI18n();
  return useQueryMutation({
    mutationFn: async () => {
      const queryClient = getQueryClient();
      queryClient.clear();
      await clearAuthCookies();
    },
    onSuccess: () => {
      window.location.reload();
    },
    onSuccessMessage: t('auth.signOut.success'),
    onErrorMessage: t('auth.signOut.error'),
  });
}

export function useForgotPassword() {
  const t = useI18n();
  return useQueryMutation<{ success: boolean }, Error, ForgotPasswordDto>({
    mutationFn: forgotPassword,
    onSuccessMessage: t('auth.forgotPassword.success'),
    onErrorMessage: t('auth.forgotPassword.error'),
  });
}
