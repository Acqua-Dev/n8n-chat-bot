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
    <div className="fixed bottom-8 right-8 z-50">
      <Button
        onClick={onClick}
        className="p-0 flex items-center gap-3 rounded-full shadow-xl bg-primary text-primary-foreground hover:shadow-2xl transition-all hover:scale-105 border-0"
        style={{
          padding: '0.75rem 1.5rem 0.75rem 0.75rem',
          height: 'auto',
        }}
        title="Open chat"
      >
        <div className="bg-white rounded-full p-2 flex items-center justify-center w-12 h-12">
          <Image
            src={chatIcon}
            alt="Chat logo"
            className="w-8 h-8"
            width={20}
            height={20}
          />
        </div>
        <span className="text-base font-medium">{buttonText}</span>
      </Button>
    </div>
  );
}
