'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { X, SquarePen } from 'lucide-react';
import Image from 'next/image';

export interface ChatHeaderProps {
  title: string;
  onClearChat: () => void;
  messagesCount: number;
  onClose?: () => void;
  isWindowMode?: boolean;
  onNewChat?: () => void;
}

export default function ChatHeader({
  title,
  onClose,
  onNewChat,
  isWindowMode = false,
}: ChatHeaderProps) {
  return (
    <div className="border-b border-border/50">
      <div className="max-w-3xl mx-auto px-4 py-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-muted rounded-full flex items-center justify-center w-9 h-9">
            <Image
              src="/logo_small.png"
              alt="Chat logo"
              width="22"
              height="22"
            />
          </div>
          <h2 className="text-base font-medium">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {onNewChat && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onNewChat}
                    className="h-9 w-9 hover:bg-muted rounded-lg"
                  >
                    <SquarePen className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Start a new conversation</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {isWindowMode && onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              title="Close chat"
              className="h-9 w-9 hover:bg-muted rounded-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
