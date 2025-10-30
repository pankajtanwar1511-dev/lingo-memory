/**
 * Kanji Type Definitions
 *
 * Type definitions for the kanji learning system.
 * Based on schema defined in docs/kanji_implementation.md
 *
 * Data source: public/seed-data/kanji_n5.json
 */

// JLPT level enum
export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

// Radical position within kanji
export type RadicalPosition = 'left' | 'right' | 'top' | 'bottom' | 'enclosure' | 'standalone';

// Reading type for quiz/display
export type ReadingType = 'kun' | 'on';

/**
 * Radical information
 */
export interface KanjiRadical {
  literal: string;        // Radical character
  meaning: string;        // English meaning
  number?: number;        // Kangxi radical number
  position?: RadicalPosition;
}

/**
 * Stroke order data
 */
export interface KanjiStrokes {
  svgPath: string;        // Path to SVG file (e.g., "/kanji/strokes/065e5.svg")
  count: number;          // Number of strokes
  animationData?: {       // Optional pre-parsed animation data
    paths: string[];      // SVG path data per stroke
    durations: number[];  // Animation duration per stroke (ms)
  };
}

/**
 * Data source attribution
 */
export interface KanjiSource {
  type: 'kanjidic2';
  version: string;        // e.g., "KANJIDIC2 2024-12"
  url: string;            // Source URL
}

/**
 * License information
 */
export interface KanjiLicense {
  text: string;           // e.g., "CC BY-SA 4.0"
  url: string;            // License URL
}

/**
 * Metadata for tracking and QA
 */
export interface KanjiMetadata {
  verified: boolean;      // QA verification status
  addedDate: string;      // ISO 8601 timestamp
  lastUpdated: string;    // ISO 8601 timestamp
}

/**
 * Main kanji card interface
 * Matches schema from public/seed-data/kanji_n5.json
 */
export interface KanjiCard {
  // Core identity
  id: string;             // e.g., "kanji_n5_日"
  kanji: string;          // The kanji character
  jlptLevel: JLPTLevel;

  // Meanings & readings
  meanings: string[];     // English meanings
  onReadings: string[];   // 音読み (katakana)
  kunReadings: string[];  // 訓読み (hiragana)

  // Structure
  strokeCount: number;
  grade: number | null;   // Jouyou grade (1-6) or null
  radical: KanjiRadical | null;
  frequency: number | null;  // Frequency rank (1 = most common)

  // Visual/animation
  strokes: KanjiStrokes;

  // Vocabulary links
  examples: string[];     // Array of vocab IDs (e.g., ["n5_vocab_0001"])

  // Future fields (Phase 4+)
  audio?: {
    onReadings?: string[];
    kunReadings?: string[];
    source?: string;
  };
  mnemonics?: {
    visual?: string;
    story?: string;
    radical?: string;
    source: 'community' | 'generated' | 'manual';
  };

  // Attribution
  source: KanjiSource;
  license: KanjiLicense;
  metadata: KanjiMetadata;
}

/**
 * Root dataset structure
 */
export interface KanjiDataset {
  metadata: {
    version: string;
    generatedAt: string;
    description: string;
    totalKanji: number;
    kanjiWithExamples: number;
    totalExampleWords: number;
    sources: {
      kanjidic2: string;
      kanjivg: string;
      vocabulary: string;
    };
  };
  kanji: KanjiCard[];
}

/**
 * FSRS progress tracking for kanji study
 * (Similar to vocabulary progress)
 */
export interface KanjiProgress {
  id: string;             // kanji card id (e.g., "kanji_n5_日")
  kanji: string;          // The character (for quick reference)

  // FSRS algorithm fields
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  state: 0 | 1 | 2 | 3;   // 0=New, 1=Learning, 2=Review, 3=Relearning

  // Timestamps
  lastReview: Date;
  dueDate: Date;

  // Study statistics
  totalStudyTime?: number;  // Total ms spent studying
  correctCount?: number;
  incorrectCount?: number;
}

/**
 * Kanji study card for quiz/flashcard mode
 */
export interface KanjiStudyCard {
  kanji: KanjiCard;
  progress?: KanjiProgress;
  mode: 'recognition' | 'reading' | 'writing';  // Study mode
}

/**
 * Kanji filter options for list page
 */
export interface KanjiFilter {
  jlptLevel?: JLPTLevel[];
  strokeRange?: {
    min: number;
    max: number;
  };
  grade?: (number | null)[];
  studied?: boolean;      // Show only studied kanji
  mastered?: boolean;     // Show only mastered kanji
  sortBy?: 'stroke' | 'frequency' | 'grade' | 'progress';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Kanji statistics for dashboard
 */
export interface KanjiStats {
  total: number;
  studied: number;
  mastered: number;
  learning: number;
  dueToday: number;
  averageRetention: number;
  totalReviews: number;
  studyStreak: number;
}
