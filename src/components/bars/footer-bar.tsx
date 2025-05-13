import { getI18n } from '@/utils/localization/server';

export default async function FooterBar() {
  const t = await getI18n();
  const currentYear = new Date().getFullYear().toString();

  return (
    <footer className="py-4 px-8 bg-[var(--chat-water-blue)] text-[var(--chat-clear-blue)] text-sm text-center">
      © {currentYear} {t('footer.copyright')}
    </footer>
  );
}
