'use client';

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
  return (
    <div className="text-center text-muted-foreground border-t text-[10px] p-1 md:text-xs md:p-2">
      {footer}
      {showSessionId && sessionId && (
        <div className="hidden md:block mt-1 text-muted-foreground/70">
          Session ID: {sessionId}
        </div>
      )}
    </div>
  );
}
