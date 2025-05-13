export type ChatMode = 'fullscreen' | 'window';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface ChatProps {
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
}

export interface ApiRequestPayload {
  action: "sendMessage";
  chatInput: string;
  files?: File[];
  sessionId?: string;
}

export interface ApiResponsePayload {
  output?: string;          // Main response format {output: response}
  messages?: ChatMessage[];
  content?: string;
  sessionId?: string;
  error?: string;
  [key: string]: unknown;   // Allow for additional properties
}