import { useQuery } from '@tanstack/react-query';
import { getDownloadUrl } from './client-api';
import { S3QueryKeys } from './constants';
import { DownloadUrlResponse } from './types';
import ms from 'ms';

export function useFileUrl(key?: string, enabled = true) {
  return useQuery<DownloadUrlResponse>({
    queryKey: S3QueryKeys.fileUrl(key),
    queryFn: () =>
      key ? getDownloadUrl(key) : Promise.reject('No key provided'),
    enabled: !!key && enabled,
    staleTime: ms('14m'),
  });
}
