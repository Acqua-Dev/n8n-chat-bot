import SubscriptionPlansList from '@/components/lists/subscription-plans-list';
import { getI18n } from '@/utils/localization/server';
import { X } from 'lucide-react';
import Link from 'next/link';
import { AppRoutes } from '@/constants/routes';
import { Button } from '@/components/ui/button';

export default async function SubscribePage() {
  const t = await getI18n();

  return (
    <>
      <Button asChild variant="ghost" size="icon" className="rounded-full">
        <Link href={AppRoutes.home} className="absolute top-4 right-4">
          <X className="h-6 w-6" />
        </Link>
      </Button>
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {t('subscriptions.choosePlan')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('subscriptions.subscribeSubtext')}
          </p>
        </div>
        <SubscriptionPlansList />
      </div>
    </>
  );
}
