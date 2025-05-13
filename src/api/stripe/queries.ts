import { useQuery } from '@tanstack/react-query';
import { getStripePrices, getStripeProducts } from './server-api';
import { StripeQueryKeys } from '@/api/stripe/constants';
import { getUserSubscriptions } from '@/api/stripe/client-api';

export function useStripeProducts() {
  return useQuery({
    queryKey: StripeQueryKeys.products,
    queryFn: getStripeProducts,
  });
}

export function useStripePrices() {
  return useQuery({
    queryKey: StripeQueryKeys.prices,
    queryFn: getStripePrices,
  });
}

export function useUserSubscriptions() {
  return useQuery({
    queryKey: StripeQueryKeys.subscriptions,
    queryFn: getUserSubscriptions,
  });
}
