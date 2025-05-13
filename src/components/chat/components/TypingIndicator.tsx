export interface TypingIndicatorProps {
  thinkingText?: string;
}

export function TypingIndicator({
  thinkingText = 'Thinking...',
}: TypingIndicatorProps) {
  return (
    <div className="flex items-center gap-2 p-3 bg-muted rounded-2xl w-fit">
      <div className="flex items-center space-x-1">
        <div
          className="w-2 h-2 rounded-full bg-current animate-bounce"
          style={{ animationDelay: '0ms' }}
        />
        <div
          className="w-2 h-2 rounded-full bg-current animate-bounce"
          style={{ animationDelay: '200ms' }}
        />
        <div
          className="w-2 h-2 rounded-full bg-current animate-bounce"
          style={{ animationDelay: '400ms' }}
        />
      </div>
      <span className="text-sm text-muted-foreground ml-1">{thinkingText}</span>
    </div>
  );
}
