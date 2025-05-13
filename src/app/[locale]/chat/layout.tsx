import Header from '@/app/[locale]/_components/header';
import { Metadata } from 'next';
import FooterBar from '@/components/bars/footer-bar';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Chat | Acqua',
  description: 'Chat with Acqua AI assistant',
};

interface Props {
  children: ReactNode;
}

export default function ChatLayout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[var(--chat-dawn)]">
      <Header />
      <main className="flex-1">{children}</main>
      <FooterBar />
    </div>
  );
}
