'use client';

import { useIsMobile } from '@/utils/ui/hooks/use-mobile';

export interface ChatFooterProps {
  footer: string;
  sessionId?: string;
  showSessionId?: boolean;
}

export function ChatFooter({
  footer,
  sessionId,
  showSessionId = process.env.NODE_ENV === 'development',
}: ChatFooterProps) {
  const isMobile = useIsMobile();

  return (
    <div
      className={`text-center text-muted-foreground border-t ${isMobile ? 'text-[10px] p-1' : 'text-xs p-2'}`}
    >
      {footer}
      {showSessionId && sessionId && !isMobile && (
        <div className="mt-1 text-muted-foreground/70">
          Session ID: {sessionId}
        </div>
      )}
    </div>
  );
}
