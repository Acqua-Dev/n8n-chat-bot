'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useIsMobile } from '@/utils/ui/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  return (
    <div
      className={`fixed z-50 ${
        isMobile
          ? 'bottom-4 right-4' // Less margin on mobile
          : 'bottom-8 right-8' // More margin on desktop
      }`}
    >
      <Button
        onClick={onClick}
        className={`p-0 flex items-center shadow-xl bg-primary text-primary-foreground hover:shadow-2xl transition-all hover:scale-105 border-0 ${
          isMobile
            ? 'rounded-full' // Circle button on mobile
            : 'rounded-full gap-3' // Pill button with text on desktop
        }`}
        style={{
          padding: isMobile ? '0.75rem' : '0.75rem 1.5rem 0.75rem 0.75rem',
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
        {!isMobile && (
          <span className="text-base font-medium">{buttonText}</span>
        )}
      </Button>
    </div>
  );
}
