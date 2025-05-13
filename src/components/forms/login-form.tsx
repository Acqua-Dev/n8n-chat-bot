'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { TextFormField } from '@/components/form-fields/text-form-field';
import { useSignIn, useSignUp } from '@/api/auth/mutations';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { useI18n } from '@/utils/localization/client';
import { AppRoutes } from '@/constants/routes';

const formSchema = z.object({
  email: z.string().email().min(1, {
    message: 'Email is required.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
  activationCode: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const signInMutation = useSignIn();
  const signUpMutation = useSignUp();
  const t = useI18n();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      activationCode: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      if (isSignUp) {
        const { email, password, activationCode } = data;
        await signUpMutation.mutateAsync({ email, password, activationCode });
      } else {
        const { email, password } = data;
        await signInMutation.mutateAsync({ email, password });
      }
      // Could add redirect logic here after successful login/signup
    } catch (error) {
      // Error is handled by the mutation's onError callback
      console.error(error);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {isSignUp ? t('auth.title.signUp') : t('auth.title.signIn')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              id="auth-form"
            >
              <TextFormField
                control={form.control}
                name="email"
                label={t('auth.email.label')}
                description={t('auth.email.description')}
                placeholder={t('auth.email.placeholder')}
                required
              />
              <TextFormField
                control={form.control}
                name="password"
                label={t('auth.password.label')}
                description={t('auth.password.description')}
                placeholder={t('auth.password.placeholder')}
                type="password"
                required
              />
              <div className="text-right">
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(AppRoutes.forgotPassword);
                  }}
                >
                  {t('auth.forgotPassword.link')}
                </Button>
              </div>
              {isSignUp && (
                <TextFormField
                  control={form.control}
                  name="activationCode"
                  label={t('auth.activationCode.label')}
                  description={t('auth.activationCode.description')}
                  placeholder={t('auth.activationCode.placeholder')}
                />
              )}

              {(signInMutation.isPending || signUpMutation.isPending) && (
                <div className="flex justify-center items-center py-2">
                  <Spinner className="mr-2" />
                  <span className="text-sm">{t('auth.processing')}</span>
                </div>
              )}

              {(signInMutation.isError || signUpMutation.isError) && (
                <Alert variant="destructive" className="mt-4 text-center">
                  <AlertDescription>
                    {(signInMutation.error as Error)?.message ||
                      (signUpMutation.error as Error)?.message}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button type="submit" form="auth-form" className="w-full" size="lg">
            {isSignUp ? t('auth.buttons.signUp') : t('auth.buttons.signIn')}
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={toggleMode}
            className="text-sm"
          >
            {isSignUp
              ? t('auth.buttons.toggleToSignIn')
              : t('auth.buttons.toggleToSignUp')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
