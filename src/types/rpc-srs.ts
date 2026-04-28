/**
 * RPC drill spaced-repetition state.
 *
 * Per-page progress for the /study/rpc drill (each PDF page = one card).
 * Persisted in two places (kept in sync by rpc-srs.service.ts):
 *   - localStorage  → instant write on every rating, source of truth offline
 *   - Realtime DB   → users/{uid}/preferences/rpcSrs (single doc, batched flush)
 *
 * Algorithm parity with the kanji vocab-reveal drill (same level system,
 * weights, decay) — only the storage location and the card key differ.
 */

/** A card key is the page id from the manifest, e.g. `rpc-0001`. */
export type CardKey = string;

/** SRS level. 0 = forgot/new, 4 = mastered. Each step roughly halves the
 *  card's draw probability when the queue is rebuilt. */
export type SrsLevel = 0 | 1 | 2 | 3 | 4;

export interface CardSrs {
  /** Current Leitner box. */
  level: SrsLevel;
  /** epoch_ms of the last rating. Used for time-decay and merge-on-load. */
  lastSeen: number;
  /** Total number of ratings ever given to this card. */
  reviewCount: number;
}

/** Whole-corpus SRS state, keyed by manifest page id. */
export type SrsState = Record<CardKey, CardSrs>;

/**
 * Tunable constants. Mirrors the kanji drill's SRS object but with RPC-specific
 * storage paths so the two corpora can never bleed into each other.
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
  STORAGE_KEY: 'rpc-drill-srs',

  /** Realtime DB path. Single node per user; cards live under a `cards` field. */
  RTDB_PATH: (uid: string) => `users/${uid}/preferences/rpcSrs`,

  /** Background flush interval to RTDB (ms). beforeunload also flushes. */
  FLUSH_INTERVAL_MS: 30_000,
} as const;

export const MAX_LEVEL: SrsLevel = 4;
export const MIN_LEVEL: SrsLevel = 0;

/** Build the canonical key for an RPC page. */
export function cardKey(pageId: string): CardKey {
  return pageId;
}
