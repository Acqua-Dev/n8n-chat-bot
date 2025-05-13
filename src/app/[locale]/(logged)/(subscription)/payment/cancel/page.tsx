'use client';

import { Button } from '@/components/ui/button';
import { AppRoutes } from '@/constants/routes';
import { useI18n } from '@/utils/localization/client';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentCancelPage() {
  const t = useI18n();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
      <div className="mb-6">
        <AlertCircle className="h-20 w-20 text-orange-500 mx-auto" />
      </div>

      <h1 className="text-3xl font-bold mb-3">
        {t('payments.paymentCanceled')}
      </h1>
      <p className="text-xl mb-2">{t('payments.paymentCanceledMessage')}</p>
      <p className="text-muted-foreground mb-8">{t('payments.needHelp')}</p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href={AppRoutes.subscribe}>
          <Button variant="outline" size="lg">
            {t('subscriptions.choosePlan')}
          </Button>
        </Link>
        <Link href={AppRoutes.home}>
          <Button size="lg">{t('common.backToHome')}</Button>
        </Link>
      </div>
    </div>
  );
}
