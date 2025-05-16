export const CHAT_CONFIG = {
  MIN_HEIGHT: 48,
  MAX_HEIGHT: 200,
  MAX_STORED_MESSAGES: 50,
  MAX_MESSAGE_LENGTH: 4000,
  ANIMATION_DURATION: 400,
  DEBOUNCE_DELAY: 100,
  SCROLL_BEHAVIOR: 'smooth',
  TEXTAREA: {
    MIN_HEIGHT: '48px',
    MAX_HEIGHT: '200px',
  },
  AVATAR: {
    SIZE: 'h-8 w-8',
    ICON_SIZE: 'h-4 w-4',
  },
  BUTTON: {
    SIZE: 'h-8 w-8',
    ICON_SIZE: 'h-4 w-4',
  },
} as const;
