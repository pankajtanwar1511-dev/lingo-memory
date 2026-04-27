/**
 * Vocab-reveal spaced-repetition state.
 *
 * Per-card progress for the /study/extended-kanji/vocab-reveal drill.
 * Persisted in two places (kept in sync by vocab-reveal-srs.service.ts):
 *   - localStorage  → instant write on every rating, source of truth offline
 *   - Firestore     → users/{uid}/preferences/vocabRevealSrs (single doc, batched flush)
 */

/** A card key is `${word}|${reading}` — unique across the vocabulary corpus. */
export type CardKey = string;

/** SRS level. 0 = forgot/new, 4 = mastered. Each step roughly halves the
 * card's draw probability when the queue is rebuilt. */
export type SrsLevel = 0 | 1 | 2 | 3 | 4;

export interface CardSrs {
  /** Current Leitner box. */
  level: SrsLevel;
  /** epoch_ms of the last rating. Used for time-decay and merge-on-load. */
  lastSeen: number;
  /** Total number of ratings ever given to this card. */
  reviewCount: number;
}

/** Whole-corpus SRS state, keyed by `${word}|${reading}`. */
export type SrsState = Record<CardKey, CardSrs>;

/**
 * Tunable constants. Kept in one place so the algorithm can be A/B-tweaked
 * without hunting through the page component.
 */
export const SRS = {
  /** Draw weight per level. Index = level. Lower level → higher weight. */
  WEIGHTS: [1.0, 0.5, 0.33, 0.25, 0.2] as const,

  /** A card cannot reappear within this many positions in the queue. */
  MIN_GAP: 5,

  /** Idle days that demote a card by one level on next session start. */
  DECAY_DAYS: 7,

  /** Built queue length = pool.length × this multiplier (pre-cardLimit). */
  QUEUE_MULTIPLIER: 1.5,

  /** localStorage key for the cards map. */
  STORAGE_KEY: 'extended-kanji-vocab-reveal-srs',

  /** Firestore path. Single doc per user; the cards live under a `cards` field. */
  FIRESTORE_DOC: (uid: string) => `users/${uid}/preferences/vocabRevealSrs`,

  /** Background flush interval to Firestore (ms). beforeunload also flushes. */
  FLUSH_INTERVAL_MS: 30_000,
} as const;

export const MAX_LEVEL: SrsLevel = 4;
export const MIN_LEVEL: SrsLevel = 0;

/** Build the canonical key for a vocab row. */
export function cardKey(word: string, reading: string): CardKey {
  return `${word}|${reading}`;
}
