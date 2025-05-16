'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

export interface ChatBubbleProps {
  onClick: () => void;
}

export default function ChatBubble({ onClick }: ChatBubbleProps) {
  return (
    <div className="fixed z-50 bottom-4 right-4 md:bottom-8 md:right-8">
      <Button
        onClick={onClick}
        className="rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 h-14 w-14 p-0"
        title="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
}
