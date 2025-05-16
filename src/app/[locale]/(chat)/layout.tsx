'use client';

import { ReactNode } from 'react';
import ChatSidebar from '@/components/chat/components/ChatSidebar';

interface Props {
  children: ReactNode;
}

export default function ChatLayout({ children }: Props) {
  return (
    <ChatSidebar>
      <main className="h-full">{children}</main>
    </ChatSidebar>
  );
}
