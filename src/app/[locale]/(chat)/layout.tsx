'use client';

import { ReactNode } from 'react';
import ChatSidebar from '@/components/chat/components/ChatSidebar';

interface Props {
  children: ReactNode;
}

export default function ChatLayout({ children }: Props) {
  return (
    <ChatSidebar>
      <main className="flex-1">{children}</main>
    </ChatSidebar>
  );
}
