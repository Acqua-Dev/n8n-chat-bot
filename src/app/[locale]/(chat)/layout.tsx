import { Metadata } from 'next';
import FooterBar from '@/components/bars/footer-bar';
import { ReactNode } from 'react';
import HeaderBar from '@/components/bars/header-bar';

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
      <HeaderBar />
      <main className="flex-1">{children}</main>
      <FooterBar />
    </div>
  );
}
