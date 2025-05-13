'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { TextFormField } from '@/components/form-fields/text-form-field';
import { useUpdateUserWithToken } from '@/api/user/mutations';
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

const formSchema = z
  .object({
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters.',
    }),
    confirmPassword: z.string().min(8, {
      message: 'Password confirmation is required.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof formSchema>;

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [resetComplete, setResetComplete] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const updateUserWithToken = useUpdateUserWithToken();
  const t = useI18n();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await updateUserWithToken.mutateAsync({
        token,
        updateDto: {
          password: data.password,
        },
      });
      setResetComplete(true);
    } catch (error) {
      console.error(error);
      // Check if token is invalid
      if ((error as Error).message?.includes('token')) {
        setTokenError(true);
      }
    }
  };

  if (tokenError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              {t('auth.resetPassword.invalidToken')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('auth.resetPassword.invalidTokenDescription')}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push(AppRoutes.forgotPassword)}>
              {t('auth.buttons.sendResetLink')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (resetComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              {t('auth.resetPassword.success')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('auth.resetPassword.successDescription')}
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
            {t('auth.title.resetPassword')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('auth.resetPassword.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              id="reset-password-form"
            >
              <TextFormField
                control={form.control}
                name="password"
                label={t('auth.password.newPassword')}
                placeholder={t('auth.password.placeholder')}
                type="password"
                required
              />
              <TextFormField
                control={form.control}
                name="confirmPassword"
                label={t('auth.password.confirmPassword')}
                placeholder={t('auth.password.placeholder')}
                type="password"
                required
              />

              {updateUserWithToken.isPending && (
                <div className="flex justify-center items-center py-2">
                  <Spinner className="mr-2" />
                  <span className="text-sm">{t('auth.processing')}</span>
                </div>
              )}

              {updateUserWithToken.isError && !tokenError && (
                <Alert variant="destructive" className="mt-4 text-center">
                  <AlertDescription>
                    {(updateUserWithToken.error as Error)?.message}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            type="submit"
            form="reset-password-form"
            className="w-full"
            size="lg"
            disabled={updateUserWithToken.isPending}
          >
            {t('auth.buttons.resetPassword')}
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
