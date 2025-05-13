export class S3Routes {
  static base = '/s3';
  static presignedUrl = `${this.base}/presigned`;
  static download = (key: string) =>
    `${this.base}/download/${encodeURIComponent(key)}`;
  static delete = (key: string) => `${this.base}/${encodeURIComponent(key)}`;
  static upload = `${this.base}/upload`;
  static confirmFile = `${this.base}/confirm`;
}

export class S3QueryKeys {
  static base = 's3';
  static fileUrl = (key?: string) => [this.base, 'file', 'url', key];
}

import { FileCategory } from './types';

export const S3Constants = {
  tempPrefix: 'temp/',
};

export const S3Config = {
  categoryConfig: {
    [FileCategory.PROFILE_PICTURE]: {
      maxSize: 5 * 1024 * 1024, // 5MB
      acceptedFileTypes: 'image/*',
      requiresResourceId: false,
    },
    [FileCategory.DOCUMENT]: {
      maxSize: 10 * 1024 * 1024, // 10MB
      acceptedFileTypes: '.pdf,.doc,.docx,.txt',
      requiresResourceId: true,
    },
  },
} as const;
