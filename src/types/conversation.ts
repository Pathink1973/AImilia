export interface Message {
  text: string;
  isBot: boolean;
  timestamp: string;
}

export interface ConversationContext {
  lastMessageTime: Date;
  messageCount: number;
  topics: string[];
}

export type SpeechRecognitionStatus = 
  | 'inactive'
  | 'listening'
  | 'processing'
  | 'error';

export type SpeechSynthesisStatus =
  | 'idle'
  | 'speaking'
  | 'paused'
  | 'error';

export interface SpeechError {
  type: 'recognition' | 'synthesis';
  message: string;
  code?: string;
}
