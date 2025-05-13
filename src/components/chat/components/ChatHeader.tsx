'use client';

import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Trash, X } from 'lucide-react';
import Image from 'next/image';
import { useIsMobile } from '@/utils/ui/hooks/use-mobile';

export interface ChatHeaderProps {
  title: string;
  chatIcon: string;
  onClearChat: () => void;
  messagesCount: number;
  onClose?: () => void;
  isWindowMode?: boolean;
}

export function ChatHeader({
  title,
  chatIcon,
  onClearChat,
  messagesCount,
  onClose,
  isWindowMode = false,
}: ChatHeaderProps) {
  const isMobile = useIsMobile();

  // Handle clear button click
  const handleClearClick = () => {
    if (messagesCount > 0) {
      if (
        window.confirm(
          'Are you sure you want to clear all messages? This cannot be undone.',
        )
      ) {
        onClearChat();
      }
    } else {
      // Nothing to clear
      console.log('No messages to clear');
    }
  };

  return (
    <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <div className="bg-white rounded-full flex items-center justify-center w-7 h-7 shadow-sm">
          <Image src={chatIcon} alt="Chat logo" width="20" height="20" />
        </div>
        <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>
          {title}
        </CardTitle>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClearClick}
          title="Clear chat history"
          className="hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors"
        >
          <Trash className="h-4 w-4" />
        </Button>

        {isWindowMode && onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            title="Close chat"
            className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-1"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </CardHeader>
  );
}
