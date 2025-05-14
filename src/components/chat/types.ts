export type ChatMode = 'fullscreen' | 'window';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface ApiRequestPayload {
  action: 'sendMessage' | 'healthCheck';
  chatInput?: string; // Optional for healthCheck
  files?: File[];
  sessionId?: string;
}

export interface ApiResponsePayload {
  output?: string; // Main response format {output: response}
  messages?: ChatMessage[];
  content?: string;
  sessionId?: string;
  error?: string;
  [key: string]: unknown; // Allow for additional properties
}
