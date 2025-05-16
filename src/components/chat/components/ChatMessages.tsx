'use client';

import { useRef, useEffect, useCallback } from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { useI18n } from '@/utils/localization/client';
import { CHAT_CONFIG } from '../constants';

export interface ChatMessagesProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  helpMessage?: string;
  thinkingText?: string;
  error?: string | null;
}

export default function ChatMessages({
  messages,
  isLoading,
  helpMessage,
  error,
}: ChatMessagesProps) {
  const t = useI18n();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((immediate: boolean = false) => {
    const behavior = immediate ? 'auto' : CHAT_CONFIG.SCROLL_BEHAVIOR;

    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: behavior as ScrollBehavior,
        block: 'end',
      });
    });
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      scrollToBottom(true);
      return;
    }

    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const displayHelpMessage = helpMessage || t('chat.messages.helpMessage');

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth"
      role="log"
      aria-label={t('chat.messages.label')}
      aria-live="polite"
    >
      <div className="pb-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center max-w-md">
              <h1 className="text-3xl font-bold mb-4">
                {t('chat.messages.welcome')}
              </h1>
              <p className="text-muted-foreground text-lg">
                {displayHelpMessage}
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && <TypingIndicator />}

        {error && (
          <div className="mx-4 my-2 p-3 rounded-lg bg-destructive/10 text-destructive">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} className="h-2" aria-hidden="true" />
      </div>
    </div>
  );
}
