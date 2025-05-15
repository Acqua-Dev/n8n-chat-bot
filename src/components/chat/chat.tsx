'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ChatMode } from './types';
import { useN8nChat } from './use-n8n-chat';
import { Card } from '../ui/card';
import { ChatFooter } from '@/components/chat/components/ChatFooter';
import { ChatHeader } from '@/components/chat/components/ChatHeader';
import { ChatMessages } from '@/components/chat/components/ChatMessages';
import { ChatInput } from '@/components/chat/components/ChatInput';
import { ChatBubble } from '@/components/chat/components/ChatBubble';
import { ChatWindow } from '@/components/chat/components/ChatWindow';
import { Button } from '@/components/ui/button';

const MAX_STORED_MESSAGES = 50;

interface ChatProps {
  mode: ChatMode;
  webhookUrl: string;
  initialMessages?: string[];
  chatIcon?: string;
  allowFileUploads?: boolean;
  title?: string;
  footer?: string;
  inputPlaceholder?: string;
  closeButtonTooltip?: string;
  helpMessage?: string;
  thinkingText?: string;
}

export default function Chat({
  mode,
  webhookUrl,
  initialMessages = [],
  chatIcon = '/logo_small.png',
  allowFileUploads = true,
  title = 'AI Assistant',
  footer = 'Powered by Acqua',
  inputPlaceholder = 'Ask me...',
  helpMessage = 'How can I assist you today?',
  thinkingText = 'Thinking...',
}: ChatProps) {
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const {
    sendMessage,
    isLoading,
    error,
    setError,
    clearSession,
    sessionId,
    isError,
    validateWebhookUrl,
  } = useN8nChat(webhookUrl);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Chat: Session ID:', sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem(`chat-messages-${webhookUrl}`);
      if (savedMessages && messages.length === 0) {
        try {
          const parsedMessages = JSON.parse(savedMessages) as ChatMessage[];
          setMessages(parsedMessages);
        } catch (err) {
          console.error('Error parsing saved messages:', err);

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
  }, [initialMessages, messages.length, webhookUrl]);

  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      const messagesToStore =
        messages.length > MAX_STORED_MESSAGES
          ? messages.slice(-MAX_STORED_MESSAGES)
          : messages;

      localStorage.setItem(
        `chat-messages-${webhookUrl}`,
        JSON.stringify(messagesToStore),
      );
    }
  }, [messages, webhookUrl]);

  // No need for handleStartChat as we removed the welcome screen

  /**
   * Clears the chat history and creates a new session
   */
  const clearChatHistory = () => {
    setMessages([]);

    if (typeof window !== 'undefined') {
      localStorage.removeItem(`chat-messages-${webhookUrl}`);

      if (process.env.NODE_ENV === 'development') {
        console.log('Cleared chat history for webhook:', webhookUrl);
      }
    }

    clearSession();

    if (process.env.NODE_ENV === 'development') {
      console.log('Chat history cleared with new session');
    }
  };

  const handleSubmit = async (inputMessage: string, selectedFiles: File[]) => {
    const trimmedMessage = inputMessage?.trim() || '';
    if (trimmedMessage === '' && (!selectedFiles || selectedFiles.length === 0))
      return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const response = await sendMessage(inputMessage, selectedFiles);

    if (response) {
      setMessages((prev) => [...prev, response]);
    } else if (error) {
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        content: `Error: ${error}`,
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const WebhookErrorMessage = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4 max-w-md">
          <h3 className="font-bold mb-2">Connection Error</h3>
          <p className="text-sm mb-3">
            There was a problem connecting to the chat service.
            {error && (
              <span className="block mt-2 text-xs opacity-80">{error}</span>
            )}
          </p>
          <Button
            onClick={() => {
              setError(null);
              validateWebhookUrl();
            }}
            variant="outline"
            className="w-full"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  };

  const renderChatContent = () => {
    if (isError) {
      return <WebhookErrorMessage />;
    }

    return (
      <>
        <ChatHeader
          title={title}
          chatIcon={chatIcon}
          onClearChat={clearChatHistory}
          messagesCount={messages.length}
          onClose={mode === 'window' ? () => setIsMinimized(true) : undefined}
          isWindowMode={mode === 'window'}
        />

        <div className="relative flex-1 overflow-hidden flex flex-col">
          {isError && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
              <div className="bg-destructive/10 text-destructive p-4 rounded-md max-w-md m-4">
                <h3 className="font-bold mb-2">Connection Error</h3>
                <p className="text-sm mb-3">
                  Lost connection to the chat service.
                  {error && (
                    <span className="block mt-2 text-xs opacity-80">
                      {error}
                    </span>
                  )}
                </p>
                <Button
                  onClick={() => {
                    setError(null);
                    validateWebhookUrl();
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Reconnect
                </Button>
              </div>
            </div>
          )}

          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            helpMessage={helpMessage}
            thinkingText={thinkingText}
          />
        </div>

        <ChatInput
          onSubmit={handleSubmit}
          isLoading={isLoading}
          inputPlaceholder={inputPlaceholder}
          allowFileUploads={allowFileUploads}
        />

        <ChatFooter footer={footer} sessionId={sessionId} />
      </>
    );
  };

  if (mode === 'window' && isMinimized) {
    return (
      <ChatBubble
        chatIcon={chatIcon}
        onClick={() => setIsMinimized(false)}
        buttonText="Chat with AI"
      />
    );
  }

  if (mode === 'window' && !isMinimized) {
    return (
      <ChatWindow
        isOpen={!isMinimized}
        onClickOutside={() => setIsMinimized(true)}
      >
        {renderChatContent()}
      </ChatWindow>
    );
  }

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-md w-full">
      {renderChatContent()}
    </Card>
  );
}
