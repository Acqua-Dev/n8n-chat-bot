'use client';

import { useUser } from '@/api/auth/queries';
import { UserForm } from '@/components/forms/user-form';
import { useI18n } from '@/utils/localization/client';

export default function AccountPage() {
  const { data: user, isLoading } = useUser();
  const t = useI18n();

  return !isLoading && user ? (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">{t('user.profileTitle')}</h1>
      <UserForm user={user} />
    </div>
  ) : (
    <></>
  );
}
