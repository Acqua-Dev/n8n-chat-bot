'use client';

import {
  useState,
  useRef,
  FormEvent,
  useEffect,
  useCallback,
  KeyboardEvent,
  ChangeEvent,
} from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUp } from 'lucide-react';
import { useI18n } from '@/utils/localization/client';
import { CHAT_CONFIG } from '../constants';
import { cn } from '@/utils/ui/utils';

export interface ChatInputProps {
  onSubmit: (message: string, files: File[]) => void;
  isLoading: boolean;
  inputPlaceholder?: string;
  allowFileUploads?: boolean;
}

export default function ChatInput({
  onSubmit,
  isLoading,
  inputPlaceholder,
}: ChatInputProps) {
  const t = useI18n();
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleResize = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, CHAT_CONFIG.MAX_HEIGHT);
    textarea.style.height = `${newHeight}px`;
  }, []);

  const handleSubmit = useCallback(
    (e?: FormEvent) => {
      if (e) e.preventDefault();

      const trimmedValue = inputValue.trim();

      if (!trimmedValue) {
        return;
      }

      onSubmit(trimmedValue, []);

      setInputValue('');

      if (textareaRef.current) {
        textareaRef.current.style.height = `${CHAT_CONFIG.MIN_HEIGHT}px`;
      }
    },
    [inputValue, onSubmit],
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value);
      handleResize();
    },
    [handleResize],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit, isLoading],
  );

  const hasContent = inputValue.trim().length > 0;
  const isDisabled = isLoading;
  const canSubmit = hasContent && !isDisabled;

  return (
    <div className="px-4 py-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] bg-background">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={inputPlaceholder || t('chat.input.placeholder')}
            disabled={isDisabled}
            className={cn(
              'min-h-[48px] resize-none pr-14 py-3 text-base overflow-y-hidden',
              'rounded-2xl border-border',
              'focus:ring-2 focus:ring-primary focus:border-transparent',
              'transition-all duration-200',
              isDisabled && 'opacity-50 cursor-not-allowed',
            )}
            rows={1}
            aria-label={t('chat.input.label')}
          />

          {isLoading && (
            <span className="sr-only">{t('chat.status.sending')}</span>
          )}

          <Button
            type="submit"
            size="icon"
            disabled={!canSubmit}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2',
              'h-8 w-8 rounded-full',
              'bg-primary hover:bg-primary/90',
              'transition-all duration-200',
              'disabled:opacity-30 disabled:cursor-not-allowed',
            )}
            aria-label={t('chat.input.sendButton')}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
