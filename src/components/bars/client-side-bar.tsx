'use client';

import { useI18n } from '@/utils/localization/client';

export default function ClientSideBar() {
  const t = useI18n();

  return (
    <div className="hidden lg:flex flex-col p-6 bg-[var(--chat-sky)] rounded-xl shadow-[0_0_20px_rgba(0,29,102,0.1)]">
      <h2 className="text-[var(--chat-water-blue)] text-xl font-bold mb-4">
        {t('direct.title')}
      </h2>
      <p className="text-[var(--chat-grey5)] mb-4">{t('direct.description')}</p>

      <ul className="space-y-3 mb-6">
        <li className="flex items-center text-[var(--chat-grey5)]">
          <span className="inline-block w-2 h-2 mr-2 rounded-full bg-[var(--chat-coral)]"></span>
          {t('direct.features.feature1')}
        </li>
        <li className="flex items-center text-[var(--chat-grey5)]">
          <span className="inline-block w-2 h-2 mr-2 rounded-full bg-[var(--chat-coral)]"></span>
          {t('direct.features.feature2')}
        </li>
        <li className="flex items-center text-[var(--chat-grey5)]">
          <span className="inline-block w-2 h-2 mr-2 rounded-full bg-[var(--chat-coral)]"></span>
          {t('direct.features.feature3')}
        </li>
      </ul>
    </div>
  );
}