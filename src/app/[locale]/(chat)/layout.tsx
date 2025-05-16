import { Metadata } from 'next';
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
    <div className="flex flex-col min-h-screen w-full">
      <main className="flex-1">{children}</main>
    </div>
  );
}
