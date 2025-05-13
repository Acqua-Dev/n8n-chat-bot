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
    <div className="text-xs text-center text-muted-foreground p-2 border-t">
      {footer}
      {showSessionId && sessionId && (
        <div className="mt-1 text-muted-foreground/70">
          Session ID: {sessionId}
        </div>
      )}
    </div>
  );
}
