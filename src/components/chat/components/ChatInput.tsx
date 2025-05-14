'use client';

import { useState, useRef, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Paperclip, Send } from 'lucide-react';

export interface ChatInputProps {
  onSubmit: (message: string, files: File[]) => void;
  isLoading: boolean;
  inputPlaceholder?: string;
  allowFileUploads?: boolean;
}

export function ChatInput({
  onSubmit,
  isLoading,
  inputPlaceholder = 'Ask me...',
  allowFileUploads = true,
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle form submission
  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();

    if (!inputValue.trim() && selectedFiles.length === 0) return;

    // Call parent's onSubmit
    onSubmit(inputValue, selectedFiles);

    // Clear input and files
    setInputValue('');
    setSelectedFiles([]);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  // Handle click on file button
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <CardFooter className="border-t p-2 pb-3 md:p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-2 w-full">
        {allowFileUploads && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleFileButtonClick}
              title="Upload file"
              className="shrink-0"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              multiple
            />

            {selectedFiles.length > 0 && (
              <div className="text-xs text-muted-foreground">
                {selectedFiles.length} file(s) selected
              </div>
            )}
          </>
        )}

        <div className="relative flex-1">
          <textarea
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              // Auto-resize the textarea
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, window.innerWidth < 768 ? 80 : 120)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={inputPlaceholder}
            disabled={isLoading}
            className="flex w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-9 text-base h-9 max-h-20 md:text-sm md:h-9 md:max-h-32"
            rows={1}
            ref={textareaRef}
          />
        </div>

        <Button
          type="submit"
          size="icon"
          disabled={
            isLoading || (!inputValue.trim() && selectedFiles.length === 0)
          }
        >
          <Send className="h-3 w-3 md:h-4 md:w-4" />
        </Button>
      </form>
    </CardFooter>
  );
}
