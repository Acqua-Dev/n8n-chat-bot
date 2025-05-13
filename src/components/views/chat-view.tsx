'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Monitor, MessageSquare } from 'lucide-react';
import { useI18n } from '@/utils/localization/client';
import dynamic from 'next/dynamic';

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Chat loading skeleton
const ChatSkeleton = () => (
  <Card className="flex flex-col h-full overflow-hidden shadow-md w-full">
    <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
      <div className="flex items-center gap-2">
        <Skeleton className="h-7 w-7 rounded-full" />
        <Skeleton className="h-5 w-40" />
      </div>
      <Skeleton className="h-8 w-8 rounded-md" />
    </CardHeader>
    <CardContent className="flex-1 p-4 space-y-4">
      <Skeleton className="h-16 w-3/4 rounded-2xl" />
      <Skeleton className="h-20 w-2/3 rounded-2xl ml-auto" />
      <Skeleton className="h-16 w-3/4 rounded-2xl" />
      <Skeleton className="h-12 w-2/3 rounded-2xl ml-auto" />
    </CardContent>
    <CardFooter className="border-t p-4 gap-2 flex">
      <Skeleton className="h-9 w-9 rounded-md" />
      <Skeleton className="h-9 flex-1 rounded-md" />
      <Skeleton className="h-9 w-9 rounded-md" />
    </CardFooter>
  </Card>
);

// Use our Chat implementation
const Chat = dynamic(() => import('@/components/chat/chat'), {
  ssr: false,
  loading: () => <ChatSkeleton />,
});

export default function ChatView() {
  const t = useI18n();

  return (
    <div className="w-full h-full relative">
      <Tabs defaultValue="fullscreen" className="w-full h-full">
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
            mode="fullscreen"
            webhookUrl={process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL}
          />
        </TabsContent>
        <TabsContent value="window" className="h-[calc(100%-60px)]">
          <Chat
            mode="window"
            webhookUrl={process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
