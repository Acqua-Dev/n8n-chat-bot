export type ChatMode = 'fullscreen' | 'window';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface ApiRequestPayload {
  action: 'sendMessage' | 'loadPreviousSession';
  chatInput?: string; // Optional for loadPreviousSession
  files?: File[];
  sessionId?: string;
}

export interface ApiResponsePayload {
  output?: string | object;
  messages?: ChatMessage[];
  content?: string;
  sessionId?: string;
  error?: string;
  [key: string]: unknown;
}
