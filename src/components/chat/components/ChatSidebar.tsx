'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useChatStore } from '@/store/chat-store';
import { Button } from '@/components/ui/button';
import { useScopedI18n } from '@/utils/localization/client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SquarePen, MessageSquare, MoreHorizontal, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { cn } from '@/utils/ui/utils';

interface ChatSidebarProps {
  children?: ReactNode;
}

function MainContent({
  children,
  handleNewChat,
}: {
  children: ReactNode;
  handleNewChat: () => void;
}) {
  const { open } = useSidebar();

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="sticky top-0 left-0 z-50 bg-background/95 backdrop-blur-sm p-3">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          {!open && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNewChat()}
              className="h-8 w-8"
            >
              <SquarePen className="h-4 w-4" />
            </Button>
          )}
          <Image
            src="/logo_dark.png"
            alt="Logo"
            width={160}
            height={50}
            className="h-6 w-auto"
          />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

export default function ChatSidebar({ children }: ChatSidebarProps) {
  const [hasHydrated, setHasHydrated] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const currentSessionId = params.sessionId as string;
  const t = useScopedI18n('chat');
  const webhookUrlParam = searchParams.get('webhookUrl');
  const idParam = searchParams.get('id');
  const currentWebhookUrl =
    webhookUrlParam ||
    (idParam
      ? `${process.env.NEXT_PUBLIC_N8N_BASE_URL}/webhook/${idParam}/chat`
      : '');

  const { getAllSessions, getSessionsByWebhook, deleteSession, createSession } =
    useChatStore();

  useEffect(() => {
    useChatStore.persist.rehydrate();
    setHasHydrated(true);
  }, []);

  const sessions = hasHydrated
    ? currentWebhookUrl
      ? getSessionsByWebhook(currentWebhookUrl)
      : getAllSessions()
    : [];

  const handleSessionClick = (sessionId: string) => {
    const queryString = searchParams.toString();
    router.push(`/${sessionId}${queryString ? `?${queryString}` : ''}`);
  };

  const handleNewChat = (url?: string) => {
    const webhookUrl =
      url || currentWebhookUrl || sessions[0]?.webhookUrl || '';

    if (!webhookUrl || typeof webhookUrl !== 'string') {
      console.error('No valid webhook URL available for new chat');
      return;
    }

    try {
      const newSessionId = createSession(webhookUrl);
      const queryParams = new URLSearchParams(searchParams.toString());
      if (!queryParams.has('webhookUrl') && webhookUrl) {
        queryParams.set('webhookUrl', webhookUrl);
      }
      router.push(`/${newSessionId}?${queryParams.toString()}`);
    } catch (error) {
      console.error('Error creating new session:', error);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    const getSession = sessions.find((s) => s.sessionId === sessionId);
    const webhookUrl = getSession?.webhookUrl;
    if (!getSession) return;
    deleteSession(sessionId);

    if (sessionId === currentSessionId) {
      const remainingSessions = sessions.filter(
        (s) => s.sessionId !== sessionId,
      );

      if (remainingSessions.length > 0) {
        const nextSession = remainingSessions[0];
        setTimeout(() => {
          handleSessionClick(nextSession.sessionId);
        }, 0);
      } else {
        setTimeout(() => {
          handleNewChat(webhookUrl);
        }, 0);
      }
    }
  };

  const getSessionTitle = (session: (typeof sessions)[0]) => {
    if (session.title) return session.title;
    if (session.lastMessage) {
      return (
        session.lastMessage.slice(0, 20) +
        (session.lastMessage.length > 20 ? '...' : '')
      );
    }
    return t('sidebar.newChat');
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen w-full">
        <Sidebar className="border-r flex-shrink-0">
          <SidebarHeader className="border-b px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo_small.png"
                  alt="Chat logo"
                  width="24"
                  height="24"
                />
                <span className="font-semibold">{t('sidebar.title')}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleNewChat()}
                className="h-8 w-8"
              >
                <SquarePen className="h-4 w-4" />
              </Button>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu className="p-2">
              {sessions.map((session) => (
                <SidebarMenuItem key={session.sessionId}>
                  <SidebarMenuButton
                    className={cn(
                      'pr-8',
                      currentSessionId === session.sessionId ? 'bg-muted' : '',
                    )}
                    onClick={() => handleSessionClick(session.sessionId)}
                  >
                    <MessageSquare className="h-4 w-4 flex-shrink-0" />
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <div className="truncate text-sm">
                        {getSessionTitle(session)}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {formatDistanceToNow(new Date(session.updatedAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction>
                        <MoreHorizontal className="h-3 w-3" />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSession(session.sessionId);
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t('sidebar.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="text-xs text-muted-foreground text-center">
              {sessions.length}{' '}
              {sessions.length !== 1
                ? t('sidebar.conversationsPlural')
                : t('sidebar.conversations')}{' '}
              {t('sidebar.forThisWebhook')}
            </div>
          </SidebarFooter>
        </Sidebar>

        <MainContent handleNewChat={handleNewChat}>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}
