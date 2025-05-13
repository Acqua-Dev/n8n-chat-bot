'use client';

import ChatView from '@/components/views/chat-view';
import ClientSideBar from '@/components/bars/client-side-bar';

export default function ChatPageContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-8 p-8 sm:p-12">
      <ClientSideBar />
      <div className="h-[70vh] lg:h-[80vh] relative">
        <ChatView />
      </div>
    </div>
  );
}