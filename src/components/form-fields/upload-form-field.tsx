import {
  BaseFormField,
  BaseFormFieldProps,
} from '@/components/form-fields/base-form-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useUploadFile, useDeleteFile } from '@/api/s3/mutations';
import { useFileUrl } from '@/api/s3/queries';
import { FileCategory } from '@/api/s3/types';
import { S3Config } from '@/api/s3/constants';
import { Trash2 } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { ChangeEvent, ComponentProps, useEffect, useState } from 'react';
import { FieldPath } from 'react-hook-form';
import Image from 'next/image';
import { useI18n } from '@/utils/localization/client';

interface UploadFormFieldProps<
  TFieldValues extends Record<string, any> = Record<string, any>,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<BaseFormFieldProps<TFieldValues, TName>, 'render'>,
    Pick<ComponentProps<'input'>, 'placeholder' | 'required'> {
  previewComponent?: 'avatar' | 'image';
  category?: FileCategory;
  resourceId?: string;
}

export function UploadFormField<
  TFieldValues extends Record<string, any> = Record<string, any>,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  placeholder,
  previewComponent = 'image',
  category = FileCategory.PROFILE_PICTURE,
  resourceId,
  ...props
}: UploadFormFieldProps<TFieldValues, TName>) {
  const t = useI18n();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const formValue = props.control?._formValues[props.name as string] as
    | string
    | undefined;
  const fileUrlQuery = useFileUrl(formValue);
  const uploadFileMutation = useUploadFile();
  const deleteFileMutation = useDeleteFile();

  useEffect(() => {
    if (fileUrlQuery.data?.downloadUrl) {
      setPreviewUrl(fileUrlQuery.data.downloadUrl);
    }
  }, [fileUrlQuery.data?.downloadUrl]);

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    uploadFileMutation.mutate(
      { file, category, resourceId },
      {
        onSuccess: ({ key }) => {
          onChange(key);
        },
        onError: () => {
          setPreviewUrl(null);
        },
      },
    );
  };

  const handleDeleteFile = (onChange: (...event: any[]) => void) => {
    if (formValue) {
      deleteFileMutation.mutate(formValue, {
        onSuccess: () => {
          setPreviewUrl(null);
          onChange(null);
        },
      });
    } else {
      setPreviewUrl(null);
      onChange(null);
    }
  };

  const renderPreview = () => {
    if (!previewUrl) {
      return null;
    }

    if (previewComponent === 'avatar') {
      return (
        <div className="mb-4">
          <Avatar className="h-20 w-20">
            <div className="relative w-full h-full overflow-hidden rounded-full">
              <Image
                src={previewUrl}
                alt={t('user.profilePicture')}
                fill
                sizes="80px"
                className="object-cover"
                priority
              />
            </div>
          </Avatar>
        </div>
      );
    }

    return (
      <div className="mb-4 relative h-40 w-full max-w-xs">
        <Image
          src={previewUrl}
          alt={t('user.fileUploaded')}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-contain rounded-md"
          priority
        />
      </div>
    );
  };

  return (
    <BaseFormField
      {...props}
      render={({ field: { onChange, ref, ...fieldProps } }) => (
        <div className="space-y-2">
          {fileUrlQuery.isLoading ? (
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                <Spinner />
              </div>
            </div>
          ) : (
            renderPreview()
          )}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder={placeholder || t('user.upload')}
                  type="file"
                  accept={S3Config.categoryConfig[category].acceptedFileTypes}
                  disabled={
                    uploadFileMutation.isPending || deleteFileMutation.isPending
                  }
                  onChange={(e) => handleFileChange(e, onChange)}
                  name={fieldProps.name}
                  onBlur={fieldProps.onBlur}
                  ref={ref}
                />
              </div>
              {previewUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={deleteFileMutation.isPending}
                  onClick={() => handleDeleteFile(onChange)}
                  aria-label={t('user.delete')}
                >
                  {deleteFileMutation.isPending ? (
                    <Spinner size="sm" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
            {uploadFileMutation.isPending && (
              <Button
                disabled
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Spinner size="sm" />
                <span>{t('user.uploading')}</span>
              </Button>
            )}
          </div>
        </div>
      )}
    />
  );
}
