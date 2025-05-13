import { Button } from '@/components/ui/button';

export interface WelcomeScreenProps {
  title: string;
  subtitle: string;
  getStartedText: string;
  onStart: () => void;
}

export function WelcomeScreen({
  title,
  subtitle,
  getStartedText,
  onStart,
}: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6">{subtitle}</p>
      <Button onClick={onStart} className="w-full max-w-xs">
        {getStartedText}
      </Button>
    </div>
  );
}
