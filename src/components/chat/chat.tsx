'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ChatMode } from './types';
import { useChatApi } from './use-chat-api';
import { Card } from '../ui/card';
import { ChatFooter } from '@/components/chat/components/ChatFooter';
import { WelcomeScreen } from '@/components/chat/components/WelcomeScreen';
import { ChatHeader } from '@/components/chat/components/ChatHeader';
import { ChatMessages } from '@/components/chat/components/ChatMessages';
import { ChatInput } from '@/components/chat/components/ChatInput';
import { ChatBubble } from '@/components/chat/components/ChatBubble';
import { ChatWindow } from '@/components/chat/components/ChatWindow';

// Constants
const MAX_STORED_MESSAGES = 50; // Maximum number of messages to store in localStorage

interface ChatProps {
  mode: ChatMode;
  webhookUrl?: string;
  showWelcomeScreen?: boolean;
  initialMessages?: string[];
  chatIcon?: string;
  allowFileUploads?: boolean;
  // i18n props
  title?: string;
  subtitle?: string;
  footer?: string;
  getStarted?: string;
  inputPlaceholder?: string;
  closeButtonTooltip?: string;
  helpMessage?: string;
  thinkingText?: string;
}

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
  helpMessage = 'How can I assist you today?',
  thinkingText = 'Thinking...',
}: ChatProps) {
  // Use environment webhook if not provided
  const finalWebhookUrl =
    webhookUrl || process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';

  // State for minimizing the chat in window mode
  const [isMinimized, setIsMinimized] = useState(true);

  // State
  const [chatStarted, setChatStarted] = useState(!showWelcomeScreen);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

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

  // Handle form submission
  const handleSubmit = async (inputMessage: string, selectedFiles: File[]) => {
    if (!inputMessage.trim() && selectedFiles.length === 0) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Send message to API
    const response = await sendMessage(inputMessage, selectedFiles);

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

  // Render chat content (used by both fullscreen and window mode)
  const renderChatContent = () => {
    if (showWelcomeScreen && !chatStarted) {
      return (
        <WelcomeScreen
          title={title}
          subtitle={subtitle}
          getStartedText={getStarted}
          onStart={handleStartChat}
        />
      );
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

        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          helpMessage={helpMessage}
          chatStarted={chatStarted}
          thinkingText={thinkingText}
        />

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

  // For minimized state in window mode
  if (mode === 'window' && isMinimized) {
    return (
      <ChatBubble
        chatIcon={chatIcon}
        onClick={() => setIsMinimized(false)}
        buttonText="Chat with AI"
      />
    );
  }

  // Window mode with chat open
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

  // Default fullscreen render
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-md w-full">
      {renderChatContent()}
    </Card>
  );
}
