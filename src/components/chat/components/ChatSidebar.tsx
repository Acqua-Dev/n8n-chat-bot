'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useChatStore } from '@/store/chat-store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
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

interface ChatSidebarProps {
  children?: ReactNode;
}

// Separate component to use the sidebar context
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
      <div className="sticky top-0 left-0 z-50 bg-background/95 backdrop-blur-sm p-3 border-b">
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

  const { getAllSessions, deleteSession, createSession } = useChatStore();

  useEffect(() => {
    useChatStore.persist.rehydrate();
    setHasHydrated(true);
  }, []);

  const sessions = hasHydrated ? getAllSessions() : [];

  const handleSessionClick = (sessionId: string) => {
    const queryString = searchParams.toString();
    router.push(`/${sessionId}${queryString ? `?${queryString}` : ''}`);
  };

  const handleNewChat = (url?: string) => {
    // Make sure we handle event objects being passed
    if (url && typeof url !== 'string') {
      console.error('Invalid URL passed to handleNewChat:', url);
      url = undefined;
    }

    const webhookUrl = url || sessions[0]?.webhookUrl || '';

    if (!webhookUrl || typeof webhookUrl !== 'string') {
      console.error('No valid webhook URL available for new chat');
      return;
    }

    try {
      const newSessionId = createSession(webhookUrl);
      router.push(`/${newSessionId}?webhookUrl=${webhookUrl}`);
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
        session.lastMessage.slice(0, 30) +
        (session.lastMessage.length > 30 ? '...' : '')
      );
    }
    return 'New Chat';
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
                <span className="font-semibold">Chat History</span>
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
            <ScrollArea className="h-full">
              <SidebarMenu className="p-2">
                {sessions.map((session) => (
                  <SidebarMenuItem key={session.sessionId}>
                    <SidebarMenuButton
                      className={
                        currentSessionId === session.sessionId ? 'bg-muted' : ''
                      }
                      onClick={() => handleSessionClick(session.sessionId)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <div className="flex-1 text-left">
                        <div>{getSessionTitle(session)}</div>
                        <div className="text-xs text-muted-foreground">
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
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </ScrollArea>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="text-xs text-muted-foreground text-center">
              {sessions.length} conversation{sessions.length !== 1 ? 's' : ''}
            </div>
          </SidebarFooter>
        </Sidebar>

        <MainContent handleNewChat={handleNewChat}>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}
