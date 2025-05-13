import Image from 'next/image';
import { getI18n } from '@/utils/localization/server';

export default async function Home() {
  const t = await getI18n();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Image
        className="dark:invert"
        src="/next.svg"
        alt="Next.js logo"
        width={180}
        height={38}
        priority
      />
      <div className="text-center">
        <h1 className="text-5xl font-bold">{t('welcome')} to Next.js</h1>
      </div>
    </div>
  );
}
