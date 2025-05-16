'use client';

import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  ChatMessage,
  ApiRequestPayload,
  ApiResponsePayload,
  LoadPreviousSessionResponse,
} from './types';
import { useChatStore } from '@/store/chat-store';

export function useN8nChat(
  webhookUrl: string,
  providedSessionId?: string | null,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    getSessionId,
    updateSession,
    clearSession: clearStoreSession,
  } = useChatStore();
  const [sessionId, setSessionId] = useState<string>(() => {
    if (providedSessionId) {
      return providedSessionId;
    }
    return getSessionId(webhookUrl);
  });

  useEffect(() => {
    if (providedSessionId) {
      setSessionId(providedSessionId);
    }
  }, [providedSessionId]);

  const loadPreviousSession = useCallback(async (): Promise<ChatMessage[]> => {
    if (!webhookUrl || !sessionId) {
      return [];
    }

    try {
      // Build URL with query parameters
      const url = new URL(webhookUrl);
      url.searchParams.append('action', 'loadPreviousSession');
      url.searchParams.append('sessionId', sessionId);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Cache-Control': 'no-cache',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const data = await response.json();

        // Check if response is in the expected n8n format
        if (Array.isArray(data) && data.length > 0 && data[0].kwargs) {
          // Convert n8n format to ChatMessage format
          const previousMessages: ChatMessage[] = (
            data as LoadPreviousSessionResponse
          ).map((item, index) => ({
            id: item.id?.join('-') || `msg-${index}`,
            content: item.kwargs.content,
            role: (item.kwargs.additional_kwargs?.role || 'assistant') as
              | 'user'
              | 'assistant',
            timestamp: new Date().toISOString(), // n8n doesn't provide timestamps
          }));

          return previousMessages;
        }

        // If response has messages array directly
        if (data.messages && Array.isArray(data.messages)) {
          return data.messages;
        }

        // If response has output property (legacy format)
        if (data.output) {
          return [
            {
              id: uuidv4(),
              content:
                typeof data.output === 'string'
                  ? data.output
                  : JSON.stringify(data.output),
              role: 'assistant',
              timestamp: new Date().toISOString(),
            },
          ];
        }
      }

      return [];
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.log('LoadPreviousSession failed:', err);
      }
      return [];
    }
  }, [webhookUrl, sessionId]);

  const validateWebhookUrl = useCallback(async (): Promise<boolean> => {
    if (!webhookUrl) {
      setError('Webhook URL is required');
      return false;
    }

    try {
      // Try a simple GET request first
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

      // Fallback to loadPreviousSession with GET
      const currentSessionId = sessionId || uuidv4();
      const url = new URL(webhookUrl);
      url.searchParams.append('action', 'loadPreviousSession');
      url.searchParams.append('sessionId', currentSessionId);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Cache-Control': 'no-cache',
        },
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

  const [previousMessages, setPreviousMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (webhookUrl && sessionId) {
      // First load previous session if sessionId exists
      loadPreviousSession().then((messages) => {
        setPreviousMessages(messages);
        // Then validate the webhook
        validateWebhookUrl();
      });
    } else if (webhookUrl) {
      validateWebhookUrl();
    } else {
      setError('Webhook URL is missing or invalid');
    }
  }, [webhookUrl, sessionId, loadPreviousSession, validateWebhookUrl]);

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
          currentSessionId = getSessionId(webhookUrl);
          setSessionId(currentSessionId);
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
          updateSession(webhookUrl, data.sessionId);
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
    [
      webhookUrl,
      sessionId,
      error,
      validateWebhookUrl,
      getSessionId,
      updateSession,
    ],
  );

  const clearSession = useCallback(() => {
    const newSessionId = clearStoreSession(webhookUrl);
    setSessionId(newSessionId);
    return newSessionId;
  }, [webhookUrl, clearStoreSession]);

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
    loadPreviousSession,
    previousMessages,
  };
}
