'use client';

import { AvatarImage } from '@/components/ui/avatar';
import { useFileUrl } from '@/api/s3/queries';

interface ProfileImageProps {
  profilePictureKey?: string | null | undefined;
  className?: string;
}

export function ProfileImage({
  profilePictureKey,
  className,
}: ProfileImageProps) {
  const { data: profilePictureData } = useFileUrl(
    profilePictureKey ? profilePictureKey : undefined,
    !!profilePictureKey,
  );

  if (!profilePictureKey || !profilePictureData?.downloadUrl) {
    return null;
  }

  return (
    <AvatarImage
      src={profilePictureData.downloadUrl}
      alt="Profile picture"
      className={className}
    />
  );
}
