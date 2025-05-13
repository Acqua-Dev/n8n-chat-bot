'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown';
import { ChatProps, ChatMessage } from './types';
import { useChatApi } from './use-chat-api';
import { Button } from '../ui/button';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from '../ui/card';
import { Trash, Send, Paperclip, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/utils/ui/utils';

// Constants
const MAX_STORED_MESSAGES = 50; // Maximum number of messages to store in localStorage

export default function Chat({
  mode,
  webhookUrl,
  showWelcomeScreen = true,
  initialMessages = [],
  chatIcon = '/logo_small.png',
  allowFileUploads = true,
  // i18n props with defaults
  title = 'AI Assistant',
  subtitle = 'Your AI assistant',
  footer = 'Powered by Acqua',
  getStarted = 'Get Started',
  inputPlaceholder = 'Ask me...',
  closeButtonTooltip = 'Close chat',
  helpMessage = 'How can I assist you today?',
}: ChatProps) {
  // No longer using toast
  // Use environment webhook if not provided
  const finalWebhookUrl =
    webhookUrl || process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';

  // State for minimizing the chat in window mode
  const [isMinimized, setIsMinimized] = useState(false);

  // State
  const [chatStarted, setChatStarted] = useState(!showWelcomeScreen);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // API communication
  const { sendMessage, isLoading, error, clearSession, sessionId } =
    useChatApi(finalWebhookUrl);

  // Log session info for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Chat: Session ID:', sessionId);
    }
  }, [sessionId]);

  // Load previous messages from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && chatStarted) {
      // Try to load saved messages
      const savedMessages = localStorage.getItem(
        `chat-messages-${finalWebhookUrl}`,
      );
      if (savedMessages && messages.length === 0) {
        try {
          const parsedMessages = JSON.parse(savedMessages) as ChatMessage[];
          setMessages(parsedMessages);
        } catch (err) {
          console.error('Error parsing saved messages:', err);

          // If there was an error parsing, use initial messages
          if (messages.length === 0 && initialMessages.length > 0) {
            const initialChatMessages: ChatMessage[] = initialMessages.map(
              (msg) => ({
                id: uuidv4(),
                content: msg,
                role: 'assistant',
                timestamp: new Date().toISOString(),
              }),
            );
            setMessages(initialChatMessages);
          }
        }
      } else if (messages.length === 0 && initialMessages.length > 0) {
        // If no saved messages, use initial messages
        const initialChatMessages: ChatMessage[] = initialMessages.map(
          (msg) => ({
            id: uuidv4(),
            content: msg,
            role: 'assistant',
            timestamp: new Date().toISOString(),
          }),
        );
        setMessages(initialChatMessages);
      }
    }
  }, [chatStarted, initialMessages, messages.length, finalWebhookUrl]);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined' && chatStarted && messages.length > 0) {
      // Only store the last MAX_STORED_MESSAGES messages to prevent localStorage from growing too large
      const messagesToStore =
        messages.length > MAX_STORED_MESSAGES
          ? messages.slice(-MAX_STORED_MESSAGES)
          : messages;

      localStorage.setItem(
        `chat-messages-${finalWebhookUrl}`,
        JSON.stringify(messagesToStore),
      );
    }
  }, [messages, chatStarted, finalWebhookUrl]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle starting the chat
  const handleStartChat = () => {
    setChatStarted(true);
  };

  // Clear chat history and localStorage
  const clearChatHistory = () => {
    // Clear messages array in state
    setMessages([]);

    // Explicitly clear message history from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`chat-messages-${finalWebhookUrl}`);

      // Log clearing action in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Cleared chat history for webhook:', finalWebhookUrl);
      }
    }

    // Get a new session ID
    clearSession();

    // Notify in console for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Chat history cleared with new session');
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle form submission
  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();

    if (!inputValue.trim() && selectedFiles.length === 0) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: inputValue,
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Send message to API
    const response = await sendMessage(inputValue, selectedFiles);

    // Clear selected files
    setSelectedFiles([]);

    // Add assistant response to chat if received
    if (response) {
      setMessages((prev) => [...prev, response]);
    } else if (error) {
      // Add error message if there was an error
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        content: `Error: ${error}`,
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
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

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render the welcome screen
  const renderWelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6">{subtitle}</p>
      <Button onClick={handleStartChat} className="w-full max-w-xs">
        {getStarted}
      </Button>
    </div>
  );

  // Render the chat interface
  const renderChatInterface = () => (
    <>
      {/* Chat Header */}
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-full flex items-center justify-center w-7 h-7 shadow-sm">
            <img src={chatIcon} alt="Chat logo" width="20" height="20" />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (messages.length > 0) {
                if (
                  window.confirm(
                    'Are you sure you want to clear all messages? This cannot be undone.',
                  )
                ) {
                  clearChatHistory();
                }
              } else {
                // Nothing to clear
                console.log('No messages to clear');
              }
            }}
            title="Clear chat history"
            className="hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors"
          >
            <Trash className="h-4 w-4" />
          </Button>

          {mode === 'window' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              title={isMinimized ? 'Maximize chat' : closeButtonTooltip}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && chatStarted && (
          <div className="text-center text-muted-foreground py-6">
            <p>{helpMessage}</p>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex flex-col max-w-[85%] mb-4',
              message.role === 'user' ? 'ml-auto' : 'mr-auto',
            )}
          >
            <div
              className={cn(
                'rounded-2xl px-4 py-3',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : 'bg-muted rounded-bl-sm',
              )}
            >
              {message.role === 'user' ? (
                message.content
              ) : (
                <div className="text-sm [&>p]:my-2 [&>ul]:ml-6 [&>ul]:list-disc [&>ol]:ml-6 [&>ol]:list-decimal [&>ul>li]:mb-1 [&>ol>li]:mb-1 [&>h1]:text-xl [&>h1]:font-bold [&>h1]:my-3 [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:my-2 [&>h3]:font-medium [&>h3]:my-1 [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-4 [&>blockquote]:italic">
                  <ReactMarkdown
                    components={{
                      // Force code blocks to use pre and maintain whitespace
                      code: ({
                        node,
                        inline,
                        className,
                        children,
                        ...props
                      }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <pre
                            className={cn(
                              'bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-2 overflow-x-auto',
                              className,
                            )}
                          >
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        ) : (
                          <code
                            className={cn(
                              'bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono',
                              className,
                            )}
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                      // Ensure pre blocks maintain whitespace
                      pre: ({ children }) => (
                        <pre className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-2 overflow-x-auto">
                          {children}
                        </pre>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            <span className="text-xs text-muted-foreground mt-1 self-end">
              {formatTime(message.timestamp)}
            </span>
          </div>
        ))}

        {/* Typing indicator when loading */}
        {isLoading && (
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
            <span className="text-sm text-muted-foreground ml-1">
              Thinking...
            </span>
          </div>
        )}

        {/* Empty div for scrolling to bottom */}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Input Area */}
      <CardFooter className="border-t p-4">
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
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={inputPlaceholder}
              disabled={isLoading}
              className="flex w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-9 min-h-9 max-h-32"
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
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>

      {/* Footer */}
      <div className="text-xs text-center text-muted-foreground p-2 border-t">
        {footer}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-1 text-muted-foreground/70">
            Session ID: {sessionId || 'None'}
          </div>
        )}
      </div>
    </>
  );

  // For minimized state in window mode
  if (mode === 'window' && isMinimized) {
    return (
      <Button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 p-3 rounded-full shadow-lg bg-primary text-white"
        title="Open chat"
      >
        <img src={chatIcon} alt="Chat logo" width="24" height="24" />
      </Button>
    );
  }

  return (
    <Card
      className={cn(
        'flex flex-col h-full overflow-hidden shadow-md',
        mode === 'window' ? 'mx-auto max-w-xl' : 'w-full',
      )}
    >
      {showWelcomeScreen && !chatStarted
        ? renderWelcomeScreen()
        : renderChatInterface()}
    </Card>
  );
}
