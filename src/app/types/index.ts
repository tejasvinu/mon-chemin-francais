export interface VocabularyEntry {
  id: string;
  _id?: string;  // MongoDB ObjectId as string
  french: string;
  english: string;
  example?: string;
  notes?: string;
  category?: string;
  srsLevel: number; // 0-4, representing spacing intervals
  nextReview?: Date;
  createdAt: Date;
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

export interface Story {
  id: string;
  title: string;
  level: string; // A1, A2, B1, B2, C1, C2
  content: string;
  translation?: string;
  vocabularyHighlights?: VocabularyEntry[];
  comprehensionQuestions?: Array<{
    question: string;
    options: string[];
    correctAnswerIndex: number;
  }>;
  createdAt: string;
}

export interface FunPhrase {
  id: string;
  phrase: string;
  meaning: string;
  literalTranslation?: string;
  example?: string;
  type: 'idiom' | 'slang' | 'proverb' | 'flirt';
  notes?: string;
  createdAt: string;
}

export interface SRSInterval {
  level: number;
  days: number;
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}