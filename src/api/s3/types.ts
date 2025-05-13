export enum FileCategory {
  PROFILE_PICTURE = 'profile-picture',
  DOCUMENT = 'document',
}

export interface DownloadUrlResponse {
  downloadUrl: string;
}

export interface UploadFileResponse {
  key: string;
}

export interface ConfirmFileDto {
  key: string;
}
