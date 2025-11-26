
export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isError?: boolean;
}

export interface DocumentData {
  id: string;
  title: string;
  content: string;
  lastModified: number;
}

export enum AppView {
  CHAT = 'CHAT',
  EDITOR = 'EDITOR',
  SETTINGS = 'SETTINGS',
}

export enum EditorActionType {
  SUMMARIZE = 'SUMMARIZE',
  FIX_GRAMMAR = 'FIX_GRAMMAR',
  EXPAND = 'EXPAND',
  MAKE_PROFESSIONAL = 'MAKE_PROFESSIONAL',
  TRANSLATE_ES = 'TRANSLATE_ES'
}

export interface AIState {
  isLoading: boolean;
  error: string | null;
}

export type ResponseStyle = 'Default' | 'Formal' | 'Casual' | 'Concise';

export type AppTheme = 'blue' | 'violet' | 'emerald' | 'orange' | 'rose' | 'slate';

export interface UserProfile {
  name: string;
  language: string;
  responseStyle: ResponseStyle;
  customInstructions: string;
  theme: AppTheme;
}
