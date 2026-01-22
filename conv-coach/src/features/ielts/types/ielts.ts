export interface IELTSTestState {
  currentPart: 'introduction' | 'part1' | 'part2-prep' | 'part2-speaking' | 'part3' | 'completed';
  isRecording: boolean;
  isAnalyzing: boolean;
  startTime: Date | null;
  elapsedTime: number;
  partTimes: {
    part1: number;
    part2Prep: number;
    part2Speaking: number;
    part3: number;
  };
}

export interface BandScores {
  overall: number;
  fluencyCoherence: number;
  lexicalResource: number;
  grammaticalRange: number;
  pronunciation: number;
}

export interface IELTSSession {
  _id: string;
  date: string;
  testType: 'ielts';
  part1Questions: Question[];
  part2CueCard: CueCard;
  part3Questions: Question[];
  responses: {
    part1: string[];
    part2: string;
    part3: string[];
  };
  scores: IELTSScores;
  bandScores: BandScores;
  duration: number;
  timeline: TimelineData[];
  transcript: string;
}

export interface Question {
  id: string;
  question: string;
  category: string;
  followUp?: string[];
}

export interface CueCard {
  id: string;
  topic: string;
  bulletPoints: string[];
  preparation: number; // in seconds
  speaking: number; // in seconds
}

export interface IELTSScores {
  fluencyCoherence: {
    score: number;
    feedback: string;
    details: string[];
  };
  lexicalResource: {
    score: number;
    feedback: string;
    details: string[];
  };
  grammaticalRange: {
    score: number;
    feedback: string;
    details: string[];
  };
  pronunciation: {
    score: number;
    feedback: string;
    details: string[];
  };
}

export interface ExaminerScript {
  introduction: string[];
  partTransitions: {
    toPart2: string;
    toPart3: string;
    conclusion: string;
  };
  prompts: {
    startSpeaking: string;
    continueSpeaking: string;
    timeUp: string;
  };
}

export interface TimelineData {
  time: number;
  wpm: number;
  word: string;
  isFiller: boolean;
}

export type TestMode = 'basic' | 'ielts';