'use client';

import { Card } from '@/components/ui/card';
import { ReactNode, useEffect } from 'react';

export interface ChatWindowProps {
  children: ReactNode;
  isOpen: boolean;
  onClickOutside: () => void;
}

export function ChatWindow({
  children,
  isOpen,
  onClickOutside,
}: ChatWindowProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const chatElement = document.getElementById('window-chat');
      if (chatElement && !chatElement.contains(event.target as Node)) {
        onClickOutside();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClickOutside]);

  return (
    <>
      <div
        className="fixed inset-0 bg-gradient-to-br from-black/10 to-black/30 backdrop-blur-[2px] z-40"
        onClick={onClickOutside}
      />

      <div
        className="fixed bottom-8 right-8 z-50 w-full max-w-xl h-[700px] max-h-[85vh]"
        id="window-chat"
      >
        <Card className="flex flex-col h-full overflow-hidden shadow-2xl border-0">
          {children}
        </Card>
      </div>
    </>
  );
}
