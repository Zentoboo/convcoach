export interface BandScores {
  overall: number;
  fluencyCoherence: number;
  lexicalResource: number;
  grammaticalRange: number;
  pronunciation: number;
}

export interface ToeflScores {
  delivery: number;
  languageUse: number;
  topicDevelopment: number;
}

export interface RubricBreakdown {
  clarity: { score: number; feedback: string; maxScore: number };
  relevance: { score: number; feedback: string; maxScore: number };
  structure: { score: number; feedback: string; maxScore: number };
  engagement: { score: number; feedback: string; maxScore: number };
  vocabulary: { score: number; feedback: string; maxScore: number };
  grammar: { score: number; feedback: string; maxScore: number };
}

export interface Session {
  _id: string;
  date: string;
  speed: number;
  fillers: number;
  fillerPercentage: number;
  confidence: number;
  transcript: string;
  feedback: string;
  duration: number;
  language: string;
  timeline?: Array<{ time: number; wpm: number; word: string; isFiller: boolean }>;
  topic?: string;
  aiFeedback?: string;
  // Enhanced scoring fields
  bandScores?: BandScores;
  toeflScores?: ToeflScores;
  rubricBreakdown?: RubricBreakdown;
  detailedRubric?: string;
}

export interface LanguageConfig {
  code: string;
  name: string;
  defaultFillers: string[];
}

export interface TimelineData {
  time: number;
  wpm: number;
  word: string;
  isFiller: boolean;
}

export interface SpeechRecognitionState {
  isRecording: boolean;
  isAnalyzing: boolean;
  speakingSpeed: number;
  fillerWords: number;
  fillerPercentage: number;
  confidenceScore: number;
  transcript: string;
  feedback: string;
  timelineData: TimelineData[];
}

export interface SettingsState {
  selectedLanguage: string;
  customFillers: string[];
}

export interface HistoryState {
  history: Session[];
  showHistory: boolean;
  currentPage: number;
  sessionToDelete: string | null;
  showDeleteConfirm: boolean;
  showClearMenu: boolean;
  clearType: string;
  showClearConfirm: boolean;
}