'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Monitor, MessageSquare } from 'lucide-react';
import { useI18n } from '@/utils/localization/client';
import dynamic from 'next/dynamic';
import ChatSkeleton from '@/components/chat/chat-skeleton';

const Chat = dynamic(() => import('@/components/chat/chat'), {
  ssr: false,
  loading: () => <ChatSkeleton />,
});

interface ChatViewProps {
  webhookUrl: string;
}

export default function ChatView({ webhookUrl }: ChatViewProps) {
  const t = useI18n();
  const [currentMode, setCurrentMode] = useState<string>('fullscreen');

  return (
    <div className="w-full h-full relative">
      <Tabs
        defaultValue="fullscreen"
        className="w-full h-full"
        onValueChange={(value) => {
          console.log('Tab changing to:', value);
          setCurrentMode(value);
        }}
      >
        <div className="flex justify-end mb-4">
          <TabsList className="bg-[var(--chat-sky)] dark:bg-[var(--chat-deep-ocean)] p-1 rounded-lg shadow-sm">
            <TabsTrigger
              value="fullscreen"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium data-[state=active]:bg-[var(--chat-water-blue)] data-[state=active]:text-white"
            >
              <Monitor size={16} />
              <span>{t('chat.fullscreenMode')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="window"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium data-[state=active]:bg-[var(--chat-water-blue)] data-[state=active]:text-white"
            >
              <MessageSquare size={16} />
              <span>{t('chat.windowMode')}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="fullscreen" className="h-[calc(100%-60px)]">
          <Chat
            key="fullscreen-mode"
            mode="fullscreen"
            webhookUrl={webhookUrl}
          />
        </TabsContent>

        <TabsContent value="window" className="h-[calc(100%-60px)]">
          <div className="w-full h-full flex items-center justify-center text-center text-muted-foreground">
            <p>{t('chat.windowChat.description')}</p>
          </div>
        </TabsContent>
      </Tabs>
      {currentMode === 'window' && (
        <Chat key="window-mode" mode="window" webhookUrl={webhookUrl} />
      )}
    </div>
  );
}
