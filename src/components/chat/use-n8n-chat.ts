'use client';

import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ApiRequestPayload, ApiResponsePayload } from './types';

export function useN8nChat(webhookUrl: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sessionId, setSessionId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const existingSession = localStorage.getItem(
        `chat-session-${webhookUrl}`,
      );
      if (existingSession) {
        return existingSession;
      }

      const newSessionId = uuidv4();
      localStorage.setItem(`chat-session-${webhookUrl}`, newSessionId);
      return newSessionId;
    }
    return uuidv4();
  });

  const validateWebhookUrl = useCallback(async (): Promise<boolean> => {
    if (!webhookUrl) {
      setError('Webhook URL is required');
      return false;
    }

    try {
      try {
        const getResponse = await fetch(webhookUrl, {
          method: 'GET',
          signal: AbortSignal.timeout(5000),
          headers: {
            Accept: '*/*',
            'Cache-Control': 'no-cache',
          },
        });

        if (getResponse.ok) {
          setError(null);
          return true;
        }
      } catch (getErr) {
        if (process.env.NODE_ENV === 'development') {
          console.log('GET check failed, trying loadPreviousSession', getErr);
        }
      }

      const currentSessionId = sessionId || uuidv4();
      const payload = {
        action: 'loadPreviousSession',
        sessionId: currentSessionId,
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });

      const isValid = response.status < 500;

      if (!isValid) {
        const errorText = await response.text();
        setError(`Webhook validation failed: ${response.status} ${errorText}`);
      } else {
        setError(null);
      }

      return isValid;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Webhook validation failed: ${errorMessage}`);
      return false;
    }
  }, [webhookUrl, sessionId]);

  useEffect(() => {
    if (webhookUrl) {
      validateWebhookUrl();
    } else {
      setError('Webhook URL is missing or invalid');
    }
  }, [webhookUrl, validateWebhookUrl]);

  const sendMessage = useCallback(
    async (message: string, files?: File[]): Promise<ChatMessage | null> => {
      const trimmedMessage = message?.trim() || '';

      if (trimmedMessage === '' && (!files || files.length === 0)) {
        return null;
      }

      if (!webhookUrl) {
        setError('Webhook URL is required');
        return null;
      }

      if (error) {
        const isValid = await validateWebhookUrl();
        if (!isValid) {
          setError('Cannot send message: Webhook URL is not functional');
          return null;
        }
      }

      setIsLoading(true);
      setError(null);

      try {
        let currentSessionId = sessionId;

        if (!currentSessionId) {
          currentSessionId = uuidv4();
          if (typeof window !== 'undefined') {
            localStorage.setItem(
              `chat-session-${webhookUrl}`,
              currentSessionId,
            );
            setSessionId(currentSessionId);
          }
        }

        const payload: ApiRequestPayload = {
          action: 'sendMessage',
          chatInput: trimmedMessage,
          sessionId: currentSessionId,
        };

        if (files && files.length > 0) {
          payload.files = files;
        }

        let headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        let requestBody: string | FormData;

        if (files && files.length > 0) {
          const formData = new FormData();
          formData.append('data', JSON.stringify(payload));
          files.forEach((file, index) => {
            formData.append(`file${index}`, file);
          });

          requestBody = formData;

          headers = {};
        } else {
          requestBody = JSON.stringify(payload);
        }

        if (process.env.NODE_ENV === 'development') {
          console.log('Sending chat request to:', webhookUrl);
          console.log('Full Payload:', payload);
          console.log('SessionID in payload:', payload.sessionId);
          console.log('Action in payload:', payload.action);
          console.log('ChatInput in payload:', payload.chatInput);
          console.log('Payload JSON:', JSON.stringify(payload));
        }

        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers,
          body: requestBody,
        });

        if (!response.ok) {
          const errorText = await response.text();
          const errorMessage = `Server error: ${response.status} ${errorText}`;
          setError(errorMessage);
          setIsLoading(false);
          return null;
        }

        const data: ApiResponsePayload = await response.json();

        if (process.env.NODE_ENV === 'development') {
          console.log('API Response:', data);
          console.log('Output property:', data.output);
          console.log('Output type:', typeof data.output);

          if (data.output !== undefined) {
            try {
              const parsedOutput = JSON.parse(JSON.stringify(data.output));
              console.log('Parsed output:', parsedOutput);
            } catch (e) {
              console.log('Output parsing failed:', e);
            }
          }
        }

        if (data.sessionId) {
          setSessionId(data.sessionId);

          if (typeof window !== 'undefined') {
            localStorage.setItem(`chat-session-${webhookUrl}`, data.sessionId);
          }
        }

        if (data.error) {
          setError(data.error);
          setIsLoading(false);
          return null;
        }

        let assistantMessage: ChatMessage;

        if (data.output !== undefined) {
          const outputContent =
            typeof data.output === 'string'
              ? data.output
              : JSON.stringify(data.output, null, 2);

          assistantMessage = {
            id: uuidv4(),
            content: outputContent,
            role: 'assistant',
            timestamp: new Date().toISOString(),
          };
        } else if (Array.isArray(data.messages) && data.messages.length > 0) {
          const assistantMessages = data.messages.filter(
            (m) => m.role === 'assistant',
          );
          assistantMessage = assistantMessages[assistantMessages.length - 1];
        } else if (typeof data.content === 'string') {
          assistantMessage = {
            id: uuidv4(),
            content: data.content,
            role: 'assistant',
            timestamp: new Date().toISOString(),
          };
        } else {
          const content =
            typeof data === 'object'
              ? JSON.stringify(data)
              : 'Received response from assistant';

          assistantMessage = {
            id: uuidv4(),
            content,
            role: 'assistant',
            timestamp: new Date().toISOString(),
          };
        }

        setIsLoading(false);
        return assistantMessage || null;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to send message: ${errorMessage}`);
        setIsLoading(false);
        return null;
      }
    },
    [webhookUrl, sessionId, error, validateWebhookUrl],
  );

  const clearSession = useCallback(() => {
    if (typeof window !== 'undefined') {
      const newSessionId = uuidv4();
      localStorage.setItem(`chat-session-${webhookUrl}`, newSessionId);
      setSessionId(newSessionId);
    }
  }, [webhookUrl]);

  const isError = !!error;

  return {
    sendMessage,
    isLoading,
    error,
    setError,
    sessionId,
    clearSession,
    isError,
    validateWebhookUrl,
  };
}
