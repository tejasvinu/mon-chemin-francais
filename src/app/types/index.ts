export interface VocabularyEntry {
  id: string;
  french: string;
  english: string;
  example?: string;
  createdAt: string;
  lastReviewed?: string;
  nextReview?: string;
  srsLevel: number; // 0-4, representing spacing intervals
}

export interface GrammarNote {
  id: string;
  title: string;
  explanation: string;
  examples: Array<{
    french: string;
    english: string;
    hiddenParts?: string[];
  }>;
  createdAt: string;
  category: string;
}

export interface SRSInterval {
  level: number;
  days: number;
}