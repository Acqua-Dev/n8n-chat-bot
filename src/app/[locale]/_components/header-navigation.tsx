import Link from 'next/link';
import { getI18n } from '@/utils/localization/server';

export default async function HeaderNavigation() {
  const t = await getI18n();

  return (
    <div className="flex space-x-6">
      <Link 
        href="/chat"
        className="text-white hover:text-gray-200 transition-colors"
      >
        {t('header.chatLink')}
      </Link>
    </div>
  );
}