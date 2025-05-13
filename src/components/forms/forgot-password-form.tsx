'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { TextFormField } from '@/components/form-fields/text-form-field';
import { useForgotPassword } from '@/api/auth/mutations';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { useI18n } from '@/utils/localization/client';
import { AppRoutes } from '@/constants/routes';

const formSchema = z.object({
  email: z.string().email().min(1, {
    message: 'Email is required.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function ForgotPasswordForm() {
  const [emailSent, setEmailSent] = useState(false);
  const forgotPasswordMutation = useForgotPassword();
  const t = useI18n();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await forgotPasswordMutation.mutateAsync(data);
      setEmailSent(true);
    } catch (error) {
      console.error(error);
      setEmailSent(true);
    }
  };

  if (emailSent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              {t('auth.forgotPassword.success')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('auth.forgotPassword.successDescription')}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push(AppRoutes.login)}>
              {t('auth.buttons.backToLogin')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {t('auth.title.forgotPassword')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('auth.forgotPassword.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              id="forgot-password-form"
            >
              <TextFormField
                control={form.control}
                name="email"
                label={t('auth.email.label')}
                placeholder={t('auth.email.placeholder')}
                required
              />
              {forgotPasswordMutation.isPending && (
                <div className="flex justify-center items-center py-2">
                  <Spinner className="mr-2" />
                  <span className="text-sm">{t('auth.processing')}</span>
                </div>
              )}
              {forgotPasswordMutation.isError && (
                <Alert variant="destructive" className="mt-4 text-center">
                  <AlertDescription>
                    {(forgotPasswordMutation.error as Error)?.message}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            type="submit"
            form="forgot-password-form"
            className="w-full"
            size="lg"
            disabled={forgotPasswordMutation.isPending}
          >
            {t('auth.buttons.sendResetLink')}
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={() => router.push(AppRoutes.login)}
            className="text-sm"
          >
            {t('auth.buttons.backToLogin')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
