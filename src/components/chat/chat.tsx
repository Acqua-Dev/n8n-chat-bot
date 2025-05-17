'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChatMessage, ChatMode } from './types';
import { useN8nChat } from './use-n8n-chat';
import { useChatStore } from '@/store/chat-store';
import ChatFooter from '@/components/chat/components/ChatFooter';
import ChatMessages from '@/components/chat/components/ChatMessages';
import ChatInput from '@/components/chat/components/ChatInput';
import ChatBubble from '@/components/chat/components/ChatBubble';
import ChatWindow from '@/components/chat/components/ChatWindow';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/utils/localization/client';
import { CHAT_CONFIG } from './constants';

interface ChatProps {
  mode: ChatMode;
  webhookUrl: string;
  sessionId: string;
  initialMessages?: string[];
  allowFileUploads?: boolean;
  footer?: string;
  inputPlaceholder?: string;
  closeButtonTooltip?: string;
  helpMessage?: string;
  thinkingText?: string;
}

export default function Chat({
  mode,
  webhookUrl,
  sessionId: initialSessionId,
  initialMessages = [],
  allowFileUploads = true,
  footer,
  inputPlaceholder,
  helpMessage,
  thinkingText,
}: ChatProps) {
  const t = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [readySessionId, setReadySessionId] = useState<string | null>(null);
  const {
    getMostRecentSession,
    getWebhookBySessionId,
    setSession,
    updateSessionInfo,
  } = useChatStore();
  const hasProcessedSessionId = useRef(false);

  useEffect(() => {
    if (!initialSessionId || hasProcessedSessionId.current) return;

    hasProcessedSessionId.current = true;

    const existingWebhookUrl = getWebhookBySessionId(initialSessionId);

    if (existingWebhookUrl && existingWebhookUrl !== webhookUrl) {
      // Session exists but webhook URL doesn't match - use existing session for this URL if available
      const existingSession = getMostRecentSession(webhookUrl);
      const sessionToUse = existingSession
        ? existingSession.sessionId
        : initialSessionId;

      if (sessionToUse !== initialSessionId) {
        const queryString = searchParams.toString();
        router.replace(
          `/${sessionToUse}${queryString ? `?${queryString}` : ''}`,
        );
      }

      setReadySessionId(sessionToUse);
    } else if (!existingWebhookUrl) {
      setSession(webhookUrl, initialSessionId);
      setReadySessionId(initialSessionId);
    } else {
      setReadySessionId(initialSessionId);
    }
  }, [
    initialSessionId,
    webhookUrl,
    getMostRecentSession,
    getWebhookBySessionId,
    setSession,
    searchParams,
    router,
  ]);

  const {
    sendMessage,
    isLoading,
    error,
    setError,
    sessionId,
    isError,
    validateWebhookUrl,
    previousMessages,
  } = useN8nChat(webhookUrl, readySessionId);

  const displayFooter = footer || t('chat.footer');
  const displayInputPlaceholder =
    inputPlaceholder || t('chat.input.placeholder');
  const displayHelpMessage = helpMessage || t('chat.messages.helpMessage');
  const displayThinkingText = thinkingText || t('chat.messages.thinking');

  useEffect(() => {
    if (readySessionId && !isInitialized) {
      if (previousMessages.length > 0) {
        setMessages(previousMessages);
      } else {
        const savedMessages = localStorage.getItem(
          `chat-messages-${webhookUrl}-${readySessionId}`,
        );

        if (savedMessages) {
          try {
            const parsedMessages = JSON.parse(savedMessages) as ChatMessage[];
            setMessages(parsedMessages);
          } catch (err) {
            console.error('Error parsing saved messages:', err);
            localStorage.removeItem(
              `chat-messages-${webhookUrl}-${readySessionId}`,
            );
          }
        } else if (initialMessages.length > 0) {
          const initialChatMessages: ChatMessage[] = initialMessages.map(
            (msg, index) => ({
              id: uuidv4(),
              content: msg,
              role: 'assistant' as const,
              timestamp: new Date(
                Date.now() - (initialMessages.length - index) * 1000,
              ).toISOString(),
            }),
          );
          setMessages(initialChatMessages);
        }
      }

      setIsInitialized(true);
    }
  }, [
    readySessionId,
    webhookUrl,
    initialMessages,
    isInitialized,
    previousMessages,
  ]);

  useEffect(() => {
    if (
      isInitialized &&
      typeof window !== 'undefined' &&
      messages.length > 0 &&
      readySessionId
    ) {
      const messagesToStore =
        messages.length > CHAT_CONFIG.MAX_STORED_MESSAGES
          ? messages.slice(-CHAT_CONFIG.MAX_STORED_MESSAGES)
          : messages;

      try {
        localStorage.setItem(
          `chat-messages-${webhookUrl}-${readySessionId}`,
          JSON.stringify(messagesToStore),
        );
      } catch (err) {
        console.error('Error saving messages to localStorage:', err);
      }
    }
  }, [messages, webhookUrl, readySessionId, isInitialized]);

  const handleSubmit = useCallback(
    async (inputMessage: string, selectedFiles: File[]) => {
      const trimmedMessage = inputMessage?.trim() || '';
      if (
        trimmedMessage === '' &&
        (!selectedFiles || selectedFiles.length === 0)
      ) {
        return;
      }

      const userMessage: ChatMessage = {
        id: uuidv4(),
        content: trimmedMessage,
        role: 'user' as const,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);

      if (readySessionId) {
        setTimeout(() => {
          updateSessionInfo(readySessionId, {
            lastMessage: trimmedMessage,
            title:
              messages.length === 0 ? trimmedMessage.slice(0, 50) : undefined,
          });
        }, 0);
      }

      try {
        const response = await sendMessage(trimmedMessage, selectedFiles);

        if (response) {
          setMessages((prev) => [...prev, response]);
        }
      } catch (err) {
        console.error('Error sending message:', err);
        const errorMessage: ChatMessage = {
          id: uuidv4(),
          content: t('chat.errors.sendFailed'),
          role: 'assistant' as const,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    },
    [sendMessage, t, readySessionId, updateSessionInfo, messages.length],
  );

  const WebhookErrorMessage = useCallback(() => {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4 max-w-md">
          <h3 className="font-bold mb-2">{t('chat.errors.connection')}</h3>
          <p className="text-sm mb-3">
            {t('chat.errors.connectionDescription')}
            {error && (
              <span className="block mt-2 text-xs opacity-80">{error}</span>
            )}
          </p>
          <Button
            onClick={() => {
              setError(null);
              validateWebhookUrl();
            }}
            variant="outline"
            className="w-full"
          >
            {t('chat.errors.tryAgain')}
          </Button>
        </div>
      </div>
    );
  }, [error, setError, t, validateWebhookUrl]);

  const renderChatContent = () => {
    if (isError) {
      return <WebhookErrorMessage />;
    }

    return (
      <>
        <div className="flex flex-col h-full overflow-hidden">
          {isError && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
              <div className="bg-destructive/10 text-destructive p-4 rounded-md max-w-md m-4">
                <h3 className="font-bold mb-2">
                  {t('chat.errors.connection')}
                </h3>
                <p className="text-sm mb-3">
                  {t('chat.errors.lostConnection')}
                  {error && (
                    <span className="block mt-2 text-xs opacity-80">
                      {error}
                    </span>
                  )}
                </p>
                <Button
                  onClick={() => {
                    setError(null);
                    validateWebhookUrl();
                  }}
                  variant="outline"
                  className="w-full"
                >
                  {t('chat.errors.reconnect')}
                </Button>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto pb-20">
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              helpMessage={displayHelpMessage}
              thinkingText={displayThinkingText}
              error={error}
            />
          </div>

          <div className="chat-input-container">
            <ChatInput
              onSubmit={handleSubmit}
              isLoading={isLoading}
              inputPlaceholder={displayInputPlaceholder}
              allowFileUploads={allowFileUploads}
            />
          </div>
          <ChatFooter footer={displayFooter} sessionId={sessionId} />
        </div>
      </>
    );
  };

  if (!isInitialized || !readySessionId) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <p>Initializing chat...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {mode === 'window' && isMinimized ? (
        <ChatBubble onClick={() => setIsMinimized(false)} />
      ) : mode === 'window' && !isMinimized ? (
        <ChatWindow
          isOpen={!isMinimized}
          onClickOutside={() => setIsMinimized(true)}
        >
          {renderChatContent()}
        </ChatWindow>
      ) : (
        <div className="flex flex-col h-full overflow-hidden w-full relative pb-[80px] sm:pb-0">
          {renderChatContent()}
        </div>
      )}
    </>
  );
}
