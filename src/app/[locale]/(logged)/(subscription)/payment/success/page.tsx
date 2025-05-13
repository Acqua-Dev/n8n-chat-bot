'use client';

import { Button } from '@/components/ui/button';
import { AppRoutes } from '@/constants/routes';
import { useI18n } from '@/utils/localization/client';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const t = useI18n();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
      <div className="mb-6">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
      </div>

      <h1 className="text-3xl font-bold mb-3">
        {t('payments.paymentSuccessful')}
      </h1>
      <p className="text-xl mb-2">{t('payments.thankYouForPurchase')}</p>
      <p className="text-muted-foreground mb-8">
        {t('payments.checkYourEmail')}
      </p>

      <Link href={AppRoutes.home}>
        <Button size="lg">{t('common.backToHome')}</Button>
      </Link>
    </div>
  );
}
