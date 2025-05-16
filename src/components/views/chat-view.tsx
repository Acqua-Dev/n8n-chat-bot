'use client';

import dynamic from 'next/dynamic';

const Chat = dynamic(() => import('@/components/chat/chat'), {
  ssr: false,
});

interface ChatViewProps {
  webhookUrl: string;
  sessionId: string;
}

export default function ChatView({ webhookUrl, sessionId }: ChatViewProps) {
  return (
    <div className="h-full overflow-hidden">
      <Chat mode="fullscreen" webhookUrl={webhookUrl} sessionId={sessionId} />
    </div>
  );
}
