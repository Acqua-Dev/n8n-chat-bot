'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

interface ChatSession {
  sessionId: string;
  webhookUrl: string;
  createdAt: string;
  updatedAt: string;
  title?: string;
  lastMessage?: string;
}

interface ChatStore {
  sessions: Record<string, ChatSession[]>; // Multiple sessions per webhookUrl
  sessionIdToWebhook: Record<string, string>;
  getSessionId: (webhookUrl: string) => string;
  getWebhookBySessionId: (sessionId: string) => string | null;
  createSession: (webhookUrl: string) => string;
  updateSession: (webhookUrl: string, sessionId: string) => void;
  clearSession: (webhookUrl: string) => string;
  setSession: (webhookUrl: string, sessionId: string) => void;
  getAllSessions: () => ChatSession[];
  updateSessionInfo: (
    sessionId: string,
    info: Partial<Pick<ChatSession, 'title' | 'lastMessage'>>,
  ) => void;
  deleteSession: (sessionId: string) => void;
  getSessionsByWebhook: (webhookUrl: string) => ChatSession[];
  getMostRecentSession: (webhookUrl: string) => ChatSession | null;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessions: {},
      sessionIdToWebhook: {},

      getSessionId: (webhookUrl: string) => {
        const sessions = get().getSessionsByWebhook(webhookUrl);
        const mostRecent = sessions[0]; // Already sorted by date

        if (mostRecent) {
          return mostRecent.sessionId;
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

        set((state) => {
          const existingSessions = state.sessions[webhookUrl] || [];

          return {
            sessions: {
              ...state.sessions,
              [webhookUrl]: [
                ...existingSessions,
                {
                  sessionId: newSessionId,
                  webhookUrl,
                  createdAt: now,
                  updatedAt: now,
                },
              ],
            },
            sessionIdToWebhook: {
              ...state.sessionIdToWebhook,
              [newSessionId]: webhookUrl,
            },
          };
        });

        return newSessionId;
      },

      updateSession: (webhookUrl: string, sessionId: string) => {
        // This method might need to be reconsidered for multiple sessions
        // For now, we'll just update the session's timestamp
        const now = new Date().toISOString();

        set((state) => {
          const sessions = state.sessions[webhookUrl] || [];
          const updatedSessions = sessions.map((session) =>
            session.sessionId === sessionId
              ? { ...session, updatedAt: now }
              : session,
          );

          return {
            sessions: {
              ...state.sessions,
              [webhookUrl]: updatedSessions,
            },
          };
        });
      },

      clearSession: (webhookUrl: string) => {
        // Clear creates a new session for this webhookUrl
        return get().createSession(webhookUrl);
      },

      setSession: (webhookUrl: string, sessionId: string) => {
        // Check if session already exists
        const existingWebhook = get().sessionIdToWebhook[sessionId];
        if (existingWebhook) {
          // Session already exists, just update it
          get().updateSession(existingWebhook, sessionId);
          return;
        }

        // Create new session
        const now = new Date().toISOString();

        set((state) => {
          const existingSessions = state.sessions[webhookUrl] || [];

          return {
            sessions: {
              ...state.sessions,
              [webhookUrl]: [
                ...existingSessions,
                {
                  sessionId,
                  webhookUrl,
                  createdAt: now,
                  updatedAt: now,
                },
              ],
            },
            sessionIdToWebhook: {
              ...state.sessionIdToWebhook,
              [sessionId]: webhookUrl,
            },
          };
        });
      },

      getAllSessions: () => {
        const allSessions = get().sessions;
        const flatSessions: ChatSession[] = [];

        Object.values(allSessions).forEach((sessionData) => {
          // Check if it's already an array or needs migration from old format
          if (Array.isArray(sessionData)) {
            flatSessions.push(...sessionData);
          } else if (
            sessionData &&
            typeof sessionData === 'object' &&
            'sessionId' in sessionData
          ) {
            // Migrate from old single session format
            flatSessions.push(sessionData as ChatSession);
          }
        });

        return flatSessions.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
      },

      getSessionsByWebhook: (webhookUrl: string) => {
        const sessionData = get().sessions[webhookUrl];

        if (!sessionData) {
          return [];
        }

        // Check if it's already an array or needs migration from old format
        const sessions = Array.isArray(sessionData)
          ? sessionData
          : sessionData &&
              typeof sessionData === 'object' &&
              'sessionId' in sessionData
            ? [sessionData as ChatSession]
            : [];

        return sessions.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
      },

      getMostRecentSession: (webhookUrl: string) => {
        const sessions = get().getSessionsByWebhook(webhookUrl);
        return sessions.length > 0 ? sessions[0] : null;
      },

      updateSessionInfo: (
        sessionId: string,
        info: Partial<Pick<ChatSession, 'title' | 'lastMessage'>>,
      ) => {
        const webhookUrl = get().sessionIdToWebhook[sessionId];
        if (!webhookUrl) return;

        set((state) => {
          const sessions = state.sessions[webhookUrl] || [];
          const updatedSessions = sessions.map((session) =>
            session.sessionId === sessionId
              ? { ...session, ...info, updatedAt: new Date().toISOString() }
              : session,
          );

          return {
            sessions: {
              ...state.sessions,
              [webhookUrl]: updatedSessions,
            },
          };
        });
      },

      deleteSession: (sessionId: string) => {
        const webhookUrl = get().sessionIdToWebhook[sessionId];
        if (!webhookUrl) return;

        set((state) => {
          const sessions = state.sessions[webhookUrl] || [];
          const filteredSessions = sessions.filter(
            (session) => session.sessionId !== sessionId,
          );

          const newSessionIdToWebhook = { ...state.sessionIdToWebhook };
          delete newSessionIdToWebhook[sessionId];

          // Remove the webhookUrl entry if no sessions left
          const newSessions = { ...state.sessions };
          if (filteredSessions.length === 0) {
            delete newSessions[webhookUrl];
          } else {
            newSessions[webhookUrl] = filteredSessions;
          }

          return {
            sessions: newSessions,
            sessionIdToWebhook: newSessionIdToWebhook,
          };
        });
      },
    }),
    {
      name: 'chat-sessions',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migrate from old format (single session per webhook) to new format (array of sessions)
          const migratedState = { ...persistedState };
          if (migratedState.sessions) {
            const newSessions: Record<string, ChatSession[]> = {};

            Object.entries(migratedState.sessions).forEach(([key, value]) => {
              if (Array.isArray(value)) {
                // Already in new format
                newSessions[key] = value;
              } else if (
                value &&
                typeof value === 'object' &&
                'sessionId' in value
              ) {
                // Old format - convert to array
                newSessions[key] = [value as ChatSession];
              }
            });

            migratedState.sessions = newSessions;
          }
          return migratedState;
        }
        return persistedState;
      },
    },
  ),
);
