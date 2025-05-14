import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export interface WelcomeScreenProps {
  title: string;
  subtitle: string;
  getStartedText: string;
  onStart: () => void;
  isLoading?: boolean;
  hasError?: boolean;
  error?: string | null;
}

export function WelcomeScreen({
  title,
  subtitle,
  getStartedText,
  onStart,
  isLoading = false,
  hasError = false,
  error = null,
}: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6">{subtitle}</p>

      {hasError && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 max-w-xs text-sm">
          <p>Connection error. Please try again.</p>
          {error && <p className="text-xs mt-1 opacity-80">{error}</p>}
        </div>
      )}

      <Button
        onClick={onStart}
        className="w-full max-w-xs"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Spinner size="sm" /> Connecting...
          </span>
        ) : (
          getStartedText
        )}
      </Button>
    </div>
  );
}
