'use client';

import { cn } from '@/utils/ui/utils';
import { ChatMessage as ChatMessageType } from '../types';
import MessageMarkdown from './MessageMarkdown';
import { User, Bot, Copy, Check } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { memo, useState, useCallback } from 'react';

export interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage = memo(function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }, [message.content]);

  return (
    <div
      className={cn(
        'group relative w-full animate-messageIn overflow-hidden',
        message.role === 'user' ? 'bg-transparent' : 'bg-muted/20',
      )}
    >
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex gap-4">
          <Avatar className="h-8 w-8">
            <AvatarFallback
              className={cn(
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground',
              )}
            >
              {message.role === 'user' ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 overflow-hidden">
            <div className="mb-1 text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              {message.role === 'user' ? 'You' : 'Assistant'} ·{' '}
              {formatTime(message.timestamp)}
            </div>
            <div className="text-sm leading-relaxed prose prose-sm max-w-none">
              {message.role === 'user' ? (
                <p className="text-foreground">{message.content}</p>
              ) : (
                <MessageMarkdown content={message.content} />
              )}
            </div>
            <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 hover:bg-muted/80"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ChatMessage;
