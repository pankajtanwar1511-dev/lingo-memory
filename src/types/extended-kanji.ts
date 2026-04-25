/**
 * Types for the Extended Kanji feature.
 * Every field maps 1:1 to public/seed-data/extended-kanji/*.json
 * (produced by scripts/extract_kanji_reference.py from KANJI_REFERENCE.md).
 *
 * The shape is intentionally different from `KanjiCard` in kanji.ts — this feature
 * uses only teacher-provided reference data and never merges with KANJIDIC2.
 */

export interface ExtendedKanjiVocab {
  word: string;
  reading: string;
  meaning: string;
  parentKanji?: string;
}

/** Row in vocabulary.json — merged per-kanji + theme-sourced rows. */
export interface MergedVocabRow {
  word: string;
  reading: string;
  meaning: string;
  parentKanji: string[];
  themes: string[];
}

export interface ExtendedKanjiSentence {
  japanese: string;
  english: string;
  parentKanji?: string;
  sectionTitle?: string;
  source?: 'part1' | 'part1_extras';
}

export interface BulletItem {
  text: string;
  gloss: string;
}

export type ExtraSection =
  | {
      title: string;
      type: 'table';
      headers: string[];
      rows: Record<string, string>[];
    }
  | {
      title: string;
      type: 'bullets';
      items: BulletItem[];
    }
  | {
      title: string;
      type: 'prose';
      text: string;
    }
  | {
      title: string;
      type: 'mixed';
      blocks: Array<
        | { type: 'table'; headers: string[]; rows: Record<string, string>[] }
        | { type: 'bullets'; items: BulletItem[] }
        | { type: 'prose'; text: string }
      >;
    };

export interface ExtendedKanji {
  id: string;
  kanji: string;
  meaning: string;
  kunReadings: string[];
  onReadings: string[];
  vocabulary: ExtendedKanjiVocab[];
  exampleSentences: ExtendedKanjiSentence[];
  extraSections: ExtraSection[];
  orderInReference: number;
  bundledWith: string[] | null;
  lessonNumber: number | null;
  lessonDate: string | null;
  textbookPage: number | null;
  lessonSource: string | null;
}

export interface ExtendedKanjiLesson {
  number: number;
  date: string;
  kanjiChars: string[];
  reviewKanjiChars: string[];
  source: string | null;
  textbookPage: number | null;
  isPracticeOnly: boolean;
  rawKanjiField: string;
  kanjiIds: string[];
  reviewKanjiIds: string[];
}

export interface ExtendedKanjiTheme {
  theme: string;
  rows: Record<string, string>[];
}

export interface TopicSentenceGroup {
  topic: string;
  sentences: string[];
}

export interface AnswerKeyPage {
  page: string;
  context: string;
  items: string[];
  subSections: { title: string; items: string[] }[];
}

export interface ConfusableGroup {
  context: string | null;
  group?: Record<string, string>[];
  note?: string;
}

export interface StudyAids {
  confusables: ConfusableGroup[];
  specialReadings: { context: string | null; entry: string }[];
  verbStems: { context: string | null; item: string }[];
  sectionLabels: Record<string, string>[];
  dialogPhrases: Record<string, { jp: string; en: string }[]>;
}

export interface PrerequisiteKanji {
  Kanji: string;
  Reading: string;
  'Common uses seen': string;
}

export interface CardProgress {
  kanjiId: string;
  level: number;
  lastSeen: number;
  reviewCount: number;
}
