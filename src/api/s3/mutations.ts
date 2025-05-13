import { FileCategory, UploadFileResponse } from './types';
import { uploadFile, deleteFile, confirmFile } from './client-api';
import { useQueryMutation } from '@/utils/use-query-mutation';
import { useI18n } from '@/utils/localization/client';

interface UploadFileParams {
  file: File;
  category: FileCategory;
  resourceId?: string;
}

export function useUploadFile() {
  const t = useI18n();
  return useQueryMutation<UploadFileResponse, Error, UploadFileParams>({
    mutationFn: ({ file, category, resourceId }) =>
      uploadFile(file, category, resourceId),
    onSuccessMessage: t('s3.fileUpload.success'),
    onErrorMessage: t('s3.fileUpload.error'),
  });
}

export function useDeleteFile() {
  const t = useI18n();
  return useQueryMutation<void, Error, string>({
    mutationFn: (key) => deleteFile(key),
    onSuccessMessage: t('s3.fileDelete.success'),
    onErrorMessage: t('s3.fileDelete.error'),
  });
}

export function useConfirmFile() {
  const t = useI18n();
  return useQueryMutation<UploadFileResponse, Error, string>({
    mutationFn: (key) => confirmFile(key),
    onSuccessMessage: t('s3.fileConfirm.success'),
    onErrorMessage: t('s3.fileConfirm.error'),
  });
}
