'use client';

import { Card } from '@/components/ui/card';
import { ReactNode, useEffect } from 'react';
import { useIsMobile } from '@/utils/ui/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const chatElement = document.getElementById('window-chat');
      if (chatElement && !chatElement.contains(event.target as Node)) {
        onClickOutside();
      }
    };

    // On mobile, prevent body scrolling when chat is open
    if (isMobile && typeof window !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);

      // Restore body scrolling when chat is closed
      if (isMobile && typeof window !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen, onClickOutside, isMobile]);

  return (
    <>
      {/* Overlay to capture clicks outside */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-black/10 to-black/30 backdrop-blur-[2px] z-40"
        onClick={onClickOutside}
      />

      {/* Floating chat window - full screen on mobile, floating on desktop */}
      <div
        className={`fixed z-50 ${
          isMobile
            ? 'inset-0 m-0' // Full screen on mobile
            : 'bottom-8 right-8 w-full max-w-xl h-[700px] max-h-[85vh]' // Floating window on desktop
        }`}
        id="window-chat"
      >
        <Card
          className={`flex flex-col overflow-hidden shadow-2xl border-0 ${
            isMobile
              ? 'h-full rounded-none' // Full height without rounded corners on mobile
              : 'h-full rounded-lg' // Rounded corners on desktop
          }`}
        >
          {children}
        </Card>
      </div>
    </>
  );
}
