'use client';

import { cn } from '@/utils/ui/utils';
import { ChatMessage as ChatMessageType } from '../types';
import { MessageMarkdown } from './MessageMarkdown';

export interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={cn(
        'flex flex-col mb-3',
        'max-w-[90%] md:max-w-[85%]',
        message.role === 'user' ? 'ml-auto' : 'mr-auto',
      )}
    >
      <div
        className={cn(
          'rounded-2xl px-3 py-2 text-sm md:px-4 md:py-3',
          message.role === 'user'
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-muted rounded-bl-sm',
        )}
      >
        {message.role === 'user' ? (
          message.content
        ) : (
          <MessageMarkdown content={message.content} />
        )}
      </div>
      <span className="text-xs text-muted-foreground mt-1 self-end text-[10px] md:text-xs">
        {formatTime(message.timestamp)}
      </span>
    </div>
  );
}
