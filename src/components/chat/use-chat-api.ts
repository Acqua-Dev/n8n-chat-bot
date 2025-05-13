'use client';

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ApiRequestPayload, ApiResponsePayload } from './types';

// This hook manages the communication with the chat API
export function useChatApi(webhookUrl: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Initialize sessionId from localStorage if available, or generate a new one
  const [sessionId, setSessionId] = useState<string>(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      const existingSession = localStorage.getItem(
        `chat-session-${webhookUrl}`,
      );
      if (existingSession) {
        return existingSession;
      }

      // No existing session, generate a new one
      const newSessionId = uuidv4();
      localStorage.setItem(`chat-session-${webhookUrl}`, newSessionId);
      return newSessionId;
    }
    return uuidv4(); // Fallback for SSR (will be replaced on client)
  });

  // Function to send a message to the chat API
  const sendMessage = useCallback(
    async (message: string, files?: File[]): Promise<ChatMessage | null> => {
      if (!webhookUrl) {
        setError('Webhook URL is required');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Always include a sessionId in the payload - use existing or create new one
        let currentSessionId = sessionId;

        // If there's no session ID, generate a new one and save it
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

        // Create the payload for the API in the required format
        const payload: ApiRequestPayload = {
          action: 'sendMessage',
          chatInput: message,
          sessionId: currentSessionId, // Always include sessionId
        };

        // If there are files, add them to the payload
        if (files && files.length > 0) {
          payload.files = files;
        }

        // Create headers for the request
        let headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        // Handle the request body based on whether we have files or not
        let requestBody: string | FormData;

        if (files && files.length > 0) {
          // Create a FormData object for file uploads
          const formData = new FormData();
          formData.append('data', JSON.stringify(payload));
          files.forEach((file, index) => {
            formData.append(`file${index}`, file);
          });

          // Set requestBody to the FormData object
          requestBody = formData;

          // Remove Content-Type header to let the browser set it with the boundary
          headers = {};
        } else {
          // For regular requests, just stringify the payload
          requestBody = JSON.stringify(payload);
        }

        // Log the request in development with detailed payload inspection
        if (process.env.NODE_ENV === 'development') {
          console.log('Sending chat request to:', webhookUrl);
          console.log('Full Payload:', payload);
          console.log('SessionID in payload:', payload.sessionId);
          console.log('Action in payload:', payload.action);
          console.log('ChatInput in payload:', payload.chatInput);
          console.log('Payload JSON:', JSON.stringify(payload));
        }

        // Send the request to the webhook
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers,
          body: requestBody,
        });

        // Check if the response is ok
        if (!response.ok) {
          const errorText = await response.text();
          const errorMessage = `Server error: ${response.status} ${errorText}`;
          setError(errorMessage);
          setIsLoading(false);
          return null;
        }

        // Parse the response
        const data: ApiResponsePayload = await response.json();

        // Log the response data in development mode
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

        // If there's a session ID in the response, store it for future requests
        if (data.sessionId) {
          setSessionId(data.sessionId);

          // Save to localStorage for persistence across page refreshes
          if (typeof window !== 'undefined') {
            localStorage.setItem(`chat-session-${webhookUrl}`, data.sessionId);
          }
        }

        // If there's an error in the response, set it
        if (data.error) {
          setError(data.error);
          setIsLoading(false);
          return null;
        }

        // Create a new message object from the response
        // Handle the {output: response} format
        let assistantMessage: ChatMessage;

        if (data.output !== undefined) {
          // Primary response format: {output: response}
          // Stringify the output if it's not a string
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
          // Fall back to messages array if present
          const assistantMessages = data.messages.filter(
            (m) => m.role === 'assistant',
          );
          assistantMessage = assistantMessages[assistantMessages.length - 1];
        } else if (typeof data.content === 'string') {
          // Alternative response format - direct content
          assistantMessage = {
            id: uuidv4(),
            content: data.content,
            role: 'assistant',
            timestamp: new Date().toISOString(),
          };
        } else {
          // Fallback - if we can't determine the content, create a placeholder
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
    [webhookUrl, sessionId],
  );

  // Function to clear the current session
  const clearSession = useCallback(() => {
    if (typeof window !== 'undefined') {
      // Create a new session ID instead of setting to null
      const newSessionId = uuidv4();
      localStorage.setItem(`chat-session-${webhookUrl}`, newSessionId);
      setSessionId(newSessionId);
    }
  }, [webhookUrl]);

  return {
    sendMessage,
    isLoading,
    error,
    setError,
    sessionId,
    clearSession,
  };
}
