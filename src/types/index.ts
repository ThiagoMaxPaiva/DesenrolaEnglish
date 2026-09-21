export type UserLevel = 'branca' | 'azul' | 'preta' | null;

export interface UserState {
  level: UserLevel;
  levelName: string;
  score: number;
  streak: number;
  weeklyProgress: Record<string, TaskStatus>;
  hasCompletedPlacement: boolean;
}

export type TaskStatus = 'locked' | 'available' | 'in-progress' | 'completed';

export interface WeekDay {
  id: string;
  day: string;
  dayShort: string;
  title: string;
  titlePt: string;
  description: string;
  icon: string;
  duration: string;
  tasks: string[];
}

export interface PlacementQuestion {
  id: number;
  type: 'listen-speak' | 'listen-select' | 'speak-free';
  prompt: string;
  audioPrompt: string;
  options?: string[];
  expectedKeywords?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isPlaying?: boolean;
}

export interface SpeechState {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  error: string | null;
  isSupported: boolean;
}
