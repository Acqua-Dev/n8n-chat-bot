'use client';

import { Card } from '@/components/ui/card';
import { ReactNode, useEffect, useState } from 'react';

export interface ChatWindowProps {
  children: ReactNode;
  isOpen: boolean;
  onClickOutside: () => void;
}

export default function ChatWindow({
  children,
  isOpen,
  onClickOutside,
}: ChatWindowProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const chatElement = document.getElementById('window-chat');
      if (chatElement && !chatElement.contains(event.target as Node)) {
        onClickOutside();
      }
    };

    if (isMobile && typeof window !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);

      if (isMobile && typeof window !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen, onClickOutside, isMobile]);

  return (
    <>
      <div
        className="fixed inset-0 bg-gradient-to-br from-black/10 to-black/30 backdrop-blur-[2px] z-40"
        onClick={onClickOutside}
      />
      <div
        className="fixed z-50 inset-0 m-0 md:inset-auto md:bottom-4 md:right-4 md:w-full md:max-w-[440px] md:h-[600px] md:max-h-[90vh]"
        id="window-chat"
      >
        <Card className="flex flex-col overflow-hidden shadow-lg border border-border/50 h-full rounded-none md:rounded-2xl bg-background/95 backdrop-blur">
          {children}
        </Card>
      </div>
    </>
  );
}
