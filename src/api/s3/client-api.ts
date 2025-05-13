import { fetchApi, HTTPMethod } from '@/utils/fetch-api';
import { S3Config, S3Routes } from './constants';
import {
  ConfirmFileDto,
  DownloadUrlResponse,
  FileCategory,
  UploadFileResponse,
} from './types';

export async function getDownloadUrl(
  key: string,
): Promise<DownloadUrlResponse> {
  return fetchApi<DownloadUrlResponse>({
    method: HTTPMethod.GET,
    endpoint: S3Routes.download(key),
  });
}

export async function deleteFile(key: string): Promise<void> {
  return fetchApi<void>({
    method: HTTPMethod.DELETE,
    endpoint: S3Routes.delete(key),
  });
}

export async function uploadFile(
  file: File,
  category: FileCategory,
  resourceId?: string,
): Promise<UploadFileResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', category);

  const categoryConfig = S3Config.categoryConfig[category];
  if (resourceId && categoryConfig.requiresResourceId) {
    formData.append('resourceId', resourceId);
  }

  return fetchApi<UploadFileResponse>({
    method: HTTPMethod.POST,
    endpoint: S3Routes.upload,
    body: formData,
  });
}

export async function confirmFile(key: string): Promise<UploadFileResponse> {
  return fetchApi<UploadFileResponse, ConfirmFileDto>({
    method: HTTPMethod.PUT,
    endpoint: S3Routes.confirmFile,
    body: { key },
  });
}
