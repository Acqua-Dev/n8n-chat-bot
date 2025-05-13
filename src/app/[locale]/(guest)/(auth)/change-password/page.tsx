import { ResetPasswordForm } from '@/components/forms/reset-password-form';

interface Props {
  searchParams: Promise<{
    token: string;
  }>;
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;
  return token ? <ResetPasswordForm token={token} /> : null;
}
