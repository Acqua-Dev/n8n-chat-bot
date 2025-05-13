import Stripe from 'stripe';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import formatPrice from '@/utils/format-price';
import { useCurrentLocale, useI18n } from '@/utils/localization/client';
import {
  useCreateCheckoutSession,
  useCreateCustomerPortalSession,
} from '@/api/stripe/mutations';
import { AppRoutes } from '@/constants/routes';

interface SubscriptionPlanCardProps {
  product: Stripe.Product;
  price: Stripe.Price;
  active?: boolean;
}

export function SubscriptionPlanCard({
  product,
  price,
  active = false,
}: SubscriptionPlanCardProps) {
  const locale = useCurrentLocale();
  const t = useI18n();
  const createCheckoutSession = useCreateCheckoutSession();
  const createCustomerPortalSession = useCreateCustomerPortalSession();

  const interval = price.recurring?.interval;
  const intervalCount = price.recurring?.interval_count || 1;
  const isRecommended = product.metadata?.recommended === 'true';

  const features = product.metadata?.features
    ? product.metadata.features.split(',').map((f) => f.trim())
    : [];

  const handleSubscribe = async () => {
    const origin = window.location.origin;
    await createCheckoutSession.mutateAsync({
      priceId: price.id,
      mode: 'subscription',
      successUrl: `${origin}${AppRoutes.paymentSuccess}`,
      cancelUrl: `${origin}${AppRoutes.paymentCancel}`,
    });
  };

  const handleManageSubscription = async () => {
    const origin = window.location.origin;
    await createCustomerPortalSession.mutateAsync({
      returnUrl: `${origin}${AppRoutes.account}`,
    });
  };

  return (
    <Card
      className={`
      max-w-sm
      rounded-xl overflow-hidden h-full border-sm ${
        isRecommended ? 'border-primary shadow-lg' : 'border-border'
      } flex flex-col w-full`}
    >
      <div
        className={`h-1.5 w-full ${isRecommended ? 'bg-primary' : 'bg-muted'}`}
      />
      {isRecommended && (
        <div className="bg-primary/10 text-primary text-xs font-medium py-1.5 text-center">
          {t('subscriptions.recommended')}
        </div>
      )}
      <CardHeader className="space-y-1 pt-6">
        <CardTitle className="text-xl font-bold truncate" title={product.name}>
          {product.name.length > 25
            ? `${product.name.substring(0, 25)}...`
            : product.name}
        </CardTitle>
        <CardDescription
          className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]"
          title={product.description || ''}
        >
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-6">
        <div>
          <div className="space-y-1">
            <div className="flex items-baseline">
              <span className="text-4xl font-extrabold">
                {formatPrice(locale, price.currency, price.unit_amount || 0)}
              </span>
              {interval && (
                <span className="ml-2 text-muted-foreground text-sm font-medium">
                  /
                  {intervalCount > 1
                    ? `${intervalCount} ${interval}s`
                    : interval}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {interval === 'month'
                ? t('subscriptions.billedMonthly')
                : t('subscriptions.billedAnnually')}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="font-medium mb-4">{t('subscriptions.includes')}</p>
          <div className="space-y-3">
            {features.length > 0 ? (
              features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`${isRecommended ? 'text-primary' : 'text-green-600'} h-5 w-5 mt-0.5 flex-shrink-0`}
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span className="text-sm">{feature}</span>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`${isRecommended ? 'text-primary' : 'text-green-600'} h-5 w-5 flex-shrink-0`}
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="text-sm">
                  {t('subscriptions.basicFeatures')}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 pb-6">
        <Button
          variant={isRecommended ? 'default' : 'outline'}
          size="lg"
          className={`w-full font-medium ${isRecommended ? 'bg-primary hover:bg-primary/90' : 'border-2'}`}
          onClick={active ? handleManageSubscription : handleSubscribe}
        >
          {!active
            ? t('subscriptions.subscribe')
            : t('subscriptions.manageSubscription')}
        </Button>
      </CardFooter>
    </Card>
  );
}
