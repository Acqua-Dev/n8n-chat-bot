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
        'flex flex-col max-w-[85%] mb-4',
        message.role === 'user' ? 'ml-auto' : 'mr-auto',
      )}
    >
      <div
        className={cn(
          'rounded-2xl px-4 py-3',
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
      <span className="text-xs text-muted-foreground mt-1 self-end">
        {formatTime(message.timestamp)}
      </span>
    </div>
  );
}
