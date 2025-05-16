'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

interface ChatSession {
  sessionId: string;
  webhookUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatStore {
  sessions: Record<string, ChatSession>;
  sessionIdToWebhook: Record<string, string>;
  getSessionId: (webhookUrl: string) => string;
  getWebhookBySessionId: (sessionId: string) => string | null;
  createSession: (webhookUrl: string) => string;
  updateSession: (webhookUrl: string, sessionId: string) => void;
  clearSession: (webhookUrl: string) => void;
  setSession: (webhookUrl: string, sessionId: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessions: {},
      sessionIdToWebhook: {},

      getSessionId: (webhookUrl: string) => {
        const sessions = get().sessions;
        const existingSession = sessions[webhookUrl];

        if (existingSession) {
          return existingSession.sessionId;
        }

        return get().createSession(webhookUrl);
      },

      getWebhookBySessionId: (sessionId: string) => {
        const sessionIdToWebhook = get().sessionIdToWebhook;
        return sessionIdToWebhook[sessionId] || null;
      },

      createSession: (webhookUrl: string) => {
        const newSessionId = uuidv4();
        const now = new Date().toISOString();

        set((state) => ({
          sessions: {
            ...state.sessions,
            [webhookUrl]: {
              sessionId: newSessionId,
              webhookUrl,
              createdAt: now,
              updatedAt: now,
            },
          },
          sessionIdToWebhook: {
            ...state.sessionIdToWebhook,
            [newSessionId]: webhookUrl,
          },
        }));

        return newSessionId;
      },

      updateSession: (webhookUrl: string, sessionId: string) => {
        const now = new Date().toISOString();
        const oldSessionId = get().sessions[webhookUrl]?.sessionId;

        set((state) => {
          const newSessionIdToWebhook = { ...state.sessionIdToWebhook };

          if (oldSessionId && oldSessionId !== sessionId) {
            delete newSessionIdToWebhook[oldSessionId];
          }

          newSessionIdToWebhook[sessionId] = webhookUrl;

          return {
            sessions: {
              ...state.sessions,
              [webhookUrl]: {
                ...state.sessions[webhookUrl],
                sessionId,
                webhookUrl,
                updatedAt: now,
                createdAt: state.sessions[webhookUrl]?.createdAt || now,
              },
            },
            sessionIdToWebhook: newSessionIdToWebhook,
          };
        });
      },

      clearSession: (webhookUrl: string) => {
        const newSessionId = uuidv4();
        const now = new Date().toISOString();
        const oldSessionId = get().sessions[webhookUrl]?.sessionId;

        set((state) => {
          const newSessionIdToWebhook = { ...state.sessionIdToWebhook };

          if (oldSessionId) {
            delete newSessionIdToWebhook[oldSessionId];
          }

          newSessionIdToWebhook[newSessionId] = webhookUrl;

          return {
            sessions: {
              ...state.sessions,
              [webhookUrl]: {
                sessionId: newSessionId,
                webhookUrl,
                createdAt: now,
                updatedAt: now,
              },
            },
            sessionIdToWebhook: newSessionIdToWebhook,
          };
        });
      },

      setSession: (webhookUrl: string, sessionId: string) => {
        const now = new Date().toISOString();

        set((state) => ({
          sessions: {
            ...state.sessions,
            [webhookUrl]: {
              sessionId,
              webhookUrl,
              createdAt: now,
              updatedAt: now,
            },
          },
          sessionIdToWebhook: {
            ...state.sessionIdToWebhook,
            [sessionId]: webhookUrl,
          },
        }));
      },
    }),
    {
      name: 'chat-sessions',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    },
  ),
);
