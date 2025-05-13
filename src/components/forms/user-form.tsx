'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { TextFormField } from '@/components/form-fields/text-form-field';
import { UploadFormField } from '@/components/form-fields/upload-form-field';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUpdateUser } from '@/api/user/mutations';
import { UserForClient } from '@/api/user/types';
import { useI18n } from '@/utils/localization/client';
import { FileCategory } from '@/api/s3/types';
import { useConfirmFile, useDeleteFile } from '@/api/s3/mutations';
import { S3Constants } from '@/api/s3/constants';

const userFormSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  profilePicture: z.string().optional().nullable(),
  email: z.string().email().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  user: UserForClient;
}

export function UserForm({ user }: UserFormProps) {
  const t = useI18n();
  const updateUser = useUpdateUser();
  const confirmFile = useConfirmFile();
  const deleteFile = useDeleteFile();
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      email: user.email,
    },
  });

  const onSubmit = (data: UserFormValues) => {
    if (
      data.profilePicture &&
      data.profilePicture.includes(S3Constants.tempPrefix)
    ) {
      confirmFile.mutate(data.profilePicture, {
        onSuccess: (response) => {
          const permanentKey = response.key;
          if (permanentKey) {
            const updatedData = {
              ...data,
              profilePicture: permanentKey,
            };
            if (user.profilePicture && user.profilePicture !== permanentKey) {
              deleteFile.mutate(user.profilePicture);
            }
            updateUser.mutate(updatedData);
          } else {
            updateUser.mutate(data);
          }
        },
        onError: () => {
          updateUser.mutate(data);
        },
      });
    } else if (data.profilePicture !== user.profilePicture) {
      if (user.profilePicture && data.profilePicture !== user.profilePicture) {
        deleteFile.mutate(user.profilePicture);
      }
      updateUser.mutate(data);
    } else {
      updateUser.mutate(data);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>{t('user.profilePicture')}</CardTitle>
              <CardDescription>
                {t('user.uploadProfilePicture')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <UploadFormField
                control={form.control}
                name="profilePicture"
                label={t('user.profilePicture')}
                previewComponent="avatar"
                category={FileCategory.PROFILE_PICTURE}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('user.profileInformation')}</CardTitle>
              <CardDescription>
                {t('user.editProfileInformation')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <TextFormField
                control={form.control}
                name="firstName"
                label={t('user.firstName')}
                placeholder={t('user.firstNamePlaceholder')}
              />

              <TextFormField
                control={form.control}
                name="lastName"
                label={t('user.lastName')}
                placeholder={t('user.lastNamePlaceholder')}
              />
              <TextFormField
                control={form.control}
                name="email"
                label={t('user.email')}
              />
              <TextFormField
                control={form.control}
                name="phoneNumber"
                label={t('user.phoneNumber')}
                placeholder={t('user.phoneNumberPlaceholder')}
              />
            </CardContent>

            <CardFooter>
              <Button type="submit" disabled={updateUser.isPending}>
                {updateUser.isPending
                  ? t('common.saving')
                  : t('common.saveChanges')}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
