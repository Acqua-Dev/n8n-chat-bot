import { ReactNode } from 'react';
import { I18nProviderClient } from '@/utils/localization/client';

interface Props {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>;
}
