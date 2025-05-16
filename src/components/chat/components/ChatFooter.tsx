'use client';

export interface ChatFooterProps {
  footer: string;
  sessionId?: string;
  showSessionId?: boolean;
}

export default function ChatFooter({
  footer,
  sessionId,
  showSessionId = process.env.NODE_ENV === 'development',
}: ChatFooterProps) {
  return (
    <div className="text-center text-xs text-muted-foreground/60 py-2">
      {footer}
      {showSessionId && sessionId && (
        <div className="mt-0.5 text-[10px] text-muted-foreground/40">
          Session ID: {sessionId}
        </div>
      )}
    </div>
  );
}
