'use client';

import { useRef, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { ChatMessage as ChatMessageType } from '../types';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { useIsMobile } from '@/utils/ui/hooks/use-mobile';

export interface ChatMessagesProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  helpMessage?: string;
  chatStarted: boolean;
  thinkingText?: string;
}

export function ChatMessages({
  messages,
  isLoading,
  helpMessage = 'How can I assist you today?',
  chatStarted,
  thinkingText = 'Thinking...',
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Also scroll to bottom when loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <CardContent
      className={`flex-1 overflow-y-auto ${isMobile ? 'p-3' : 'p-4'} space-y-3`}
    >
      {messages.length === 0 && chatStarted && (
        <div className="text-center text-muted-foreground py-6">
          <p>{helpMessage}</p>
        </div>
      )}
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isLoading && <TypingIndicator thinkingText={thinkingText} />}
      <div ref={messagesEndRef} className="h-2" />{' '}
      {/* Added height to ensure better scrolling */}
    </CardContent>
  );
}
