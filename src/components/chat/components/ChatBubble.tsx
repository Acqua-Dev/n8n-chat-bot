'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';

export interface ChatBubbleProps {
  chatIcon: string;
  onClick: () => void;
  buttonText?: string;
}

export function ChatBubble({
  chatIcon,
  onClick,
  buttonText = 'Chat with AI',
}: ChatBubbleProps) {
  return (
    <div className="fixed z-50 bottom-4 right-4 md:bottom-8 md:right-8">
      <Button
        onClick={onClick}
        className="p-0 flex items-center shadow-xl bg-primary text-primary-foreground hover:shadow-2xl transition-all hover:scale-105 border-0 rounded-full md:gap-3"
        style={{
          padding: '0.75rem',
          paddingRight: '0.75rem',
          height: 'auto',
        }}
        title="Open chat"
      >
        <div className="bg-white rounded-full p-2 flex items-center justify-center w-10 h-10">
          <Image
            src={chatIcon}
            alt="Chat logo"
            className="w-6 h-6"
            width={20}
            height={20}
          />
        </div>
        <span className="hidden md:inline text-base font-medium">
          {buttonText}
        </span>
      </Button>
    </div>
  );
}
