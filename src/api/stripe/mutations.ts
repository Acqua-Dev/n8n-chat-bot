import { useQueryMutation } from '@/utils/use-query-mutation';
import {
  createCheckoutSession,
  createCustomerPortalSession,
} from '@/api/stripe/client-api';
import { useI18n } from '@/utils/localization/client';

export function useCreateCheckoutSession() {
  const t = useI18n();
  return useQueryMutation({
    mutationFn: createCheckoutSession,
    onSuccess: ({ url }) => {
      if (url) {
        window.location.href = url;
      }
    },
    onSuccessMessage: t('stripe.checkoutSession.success'),
    onErrorMessage: t('stripe.checkoutSession.error'),
  });
}

export function useCreateCustomerPortalSession() {
  const t = useI18n();
  return useQueryMutation({
    mutationFn: createCustomerPortalSession,
    onSuccess: ({ url }) => {
      if (url) {
        window.location.href = url;
      }
    },
    onSuccessMessage: t('stripe.customerPortalSession.success'),
    onErrorMessage: t('stripe.customerPortalSession.error'),
  });
}
