'use client';

import {
  useStripePrices,
  useStripeProducts,
  useUserSubscriptions,
} from '@/api/stripe/queries';
import { useMemo } from 'react';
import { SubscriptionPlanCard } from '@/components/cards/subscription-plan-card';

export default function SubscriptionPlansList() {
  const { data: products, isPending: isProductsPending } = useStripeProducts();
  const { data: prices, isPending: isPricesPending } = useStripePrices();
  const { data: subscriptions, isPending: isSubscriptionsPending } =
    useUserSubscriptions();

  const productsWithPrices = useMemo(() => {
    if (
      !isPricesPending &&
      !isProductsPending &&
      !isSubscriptionsPending &&
      products &&
      prices &&
      subscriptions
    ) {
      const sortedProducts = [...products].sort((a, b) => {
        const aRecommended = a.metadata?.recommended === 'true';
        const bRecommended = b.metadata?.recommended === 'true';
        if (aRecommended && !bRecommended) return 0;
        if (!aRecommended && bRecommended) return -1;
        return 0;
      });

      return sortedProducts.map((product) => {
        const price = prices.find(
          (price) => price.id === product.default_price,
        );
        const isSubscriptionActive = subscriptions?.some((subscription) =>
          subscription.items.data.some((item) => item.price.id === price?.id),
        );
        return {
          product,
          price,
          active: isSubscriptionActive,
        };
      });
    }
    return [];
  }, [
    isPricesPending,
    isProductsPending,
    isSubscriptionsPending,
    products,
    prices,
    subscriptions,
  ]);

  return !isPricesPending && !isProductsPending && products && prices ? (
    <div className="bg-muted/30 rounded-2xl py-10 px-4 md:px-8 mb-16">
      <div className="flex justify-center">
        {productsWithPrices.map(({ product, price, active }) =>
          price && product ? (
            <SubscriptionPlanCard
              key={product.id}
              product={product}
              price={price}
              active={active}
            />
          ) : null,
        )}
      </div>
    </div>
  ) : (
    <></>
  );
}
