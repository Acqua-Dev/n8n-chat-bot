'use client';

import { useRef, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { ChatMessage as ChatMessageType } from '../types';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';

export interface ChatMessagesProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  helpMessage?: string;
  thinkingText?: string;
}

export function ChatMessages({
  messages,
  isLoading,
  helpMessage = 'How can I assist you today?',
  thinkingText = 'Thinking...',
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <CardContent className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3">
      {messages.length === 0 && (
        <div className="text-center text-muted-foreground py-6">
          <p>{helpMessage}</p>
        </div>
      )}
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isLoading && <TypingIndicator thinkingText={thinkingText} />}
      <div ref={messagesEndRef} className="h-2" />{' '}
    </CardContent>
  );
}
