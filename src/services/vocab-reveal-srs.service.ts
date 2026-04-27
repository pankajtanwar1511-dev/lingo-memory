/**
 * Vocab-reveal SRS storage service.
 *
 * Dual-layer persistence for the per-card spaced-repetition state used by the
 * /study/kanji/vocab-reveal drill:
 *
 *   1. localStorage  → written on every rating, source of truth offline.
 *   2. Firestore     → users/{uid}/preferences/vocabRevealSrs, single doc with
 *                      a `cards` map. Flushed in batches every 30s + on
 *                      beforeunload to keep writes well under free-tier quotas.
 *
 * The service is **client-only** — guard imports behind `typeof window`.
 *
 * Public API:
 *   - load(uid)       — fetches local + cloud, merges by `lastSeen`, returns SrsState.
 *   - rate(state, key, knew) — pure: returns mutated state for one rating.
 *   - persistLocal(state)    — synchronous localStorage write.
 *   - scheduleFlush(uid, state) — fire-and-forget cloud write (no debounce).
 *   - flushNow(uid, state)   — awaited cloud write (use on unmount).
 */

import { ref, get, update, serverTimestamp } from 'firebase/database';
import { database, isFirebaseConfigured } from '@/lib/firebase';
import {
  CardKey,
  CardSrs,
  MAX_LEVEL,
  MIN_LEVEL,
  SRS,
  SrsLevel,
  SrsState,
  cardKey,
} from '@/types/vocab-reveal-srs';

// ----- Local storage ------------------------------------------------------

/** Read the cards map from localStorage. Returns an empty state on miss/parse error. */
export function readLocal(): SrsState {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(SRS.STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return isSrsState(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

/** Synchronous overwrite of the localStorage copy. */
export function persistLocal(state: SrsState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SRS.STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota or disabled storage — silently ignore, cloud copy still works */
  }
}

// ----- Cloud (Firestore) --------------------------------------------------

/** True when Firebase is configured AND a uid is present. */
function canUseCloud(uid: string | null): uid is string {
  return !!uid && uid !== 'local-user' && isFirebaseConfigured() && !!database;
}

/** Read the user's cards map from Realtime Database. Returns {} if missing. */
async function readCloud(uid: string): Promise<SrsState> {
  if (!canUseCloud(uid)) return {};
  try {
    const snap = await get(ref(database!, SRS.FIRESTORE_DOC(uid)));
    if (!snap.exists()) return {};
    const data = snap.val();
    const cards = data?.cards;
    return isSrsState(cards) ? cards : {};
  } catch (e) {
    console.warn('[vocab-reveal-srs] cloud read failed:', e);
    return {};
  }
}

/** Write the cards map to Realtime Database. Merges into the existing node. */
async function writeCloud(uid: string, state: SrsState): Promise<void> {
  if (!canUseCloud(uid)) return;
  try {
    await update(ref(database!, SRS.FIRESTORE_DOC(uid)), {
      cards: state,
      updatedAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn('[vocab-reveal-srs] cloud write failed:', e);
  }
}

// ----- Merge --------------------------------------------------------------

/** Per-card most-recent-lastSeen-wins merge. */
function mergeStates(a: SrsState, b: SrsState): SrsState {
  const out: SrsState = { ...a };
  for (const k in b) {
    const ours = out[k];
    const theirs = b[k];
    if (!ours || theirs.lastSeen > ours.lastSeen) {
      out[k] = theirs;
    }
  }
  return out;
}

// ----- Public load --------------------------------------------------------

/**
 * Load SRS state for the user. Reads local + cloud (if available), merges by
 * `lastSeen`, and writes the merged result back to local so subsequent reads
 * return the unified view immediately.
 *
 * `uid` may be null/'local-user' — in that case the function reads only local.
 */
export async function load(uid: string | null): Promise<SrsState> {
  const local = readLocal();
  if (!canUseCloud(uid)) return local;
  const cloud = await readCloud(uid);
  const merged = mergeStates(local, cloud);
  // Write merged back to both layers so they're aligned going forward.
  persistLocal(merged);
  // Don't await — this fire-and-forget is fine.
  void writeCloud(uid, merged);
  return merged;
}

// ----- Rating (pure) ------------------------------------------------------

/** Apply a rating to one card. Returns a new state object (does not mutate input). */
export function rate(state: SrsState, key: CardKey, knew: boolean): SrsState {
  const prev: CardSrs = state[key] ?? { level: 0, lastSeen: 0, reviewCount: 0 };
  const nextLevel = (
    knew ? Math.min(MAX_LEVEL, prev.level + 1) : Math.max(MIN_LEVEL, prev.level - 1)
  ) as SrsLevel;
  return {
    ...state,
    [key]: {
      level: nextLevel,
      lastSeen: Date.now(),
      reviewCount: prev.reviewCount + 1,
    },
  };
}

// ----- Time-decay ---------------------------------------------------------

/**
 * Demote cards that have been idle for `decayDays`+ days, one level per full
 * decay window. Pure function — returns a new state. Pass the user's preferred
 * window (settings.srsDecayDays); falls back to SRS.DECAY_DAYS otherwise.
 */
export function applyDecay(
  state: SrsState,
  now: number = Date.now(),
  decayDays: number = SRS.DECAY_DAYS,
): SrsState {
  const out: SrsState = {};
  const windowMs = Math.max(1, decayDays) * 86_400_000;
  for (const k in state) {
    const c = state[k];
    if (c.level === 0 || c.lastSeen === 0) {
      out[k] = c;
      continue;
    }
    const drops = Math.floor((now - c.lastSeen) / windowMs);
    if (drops <= 0) {
      out[k] = c;
      continue;
    }
    const nextLevel = Math.max(0, c.level - drops) as SrsLevel;
    out[k] = nextLevel === c.level ? c : { ...c, level: nextLevel };
  }
  return out;
}

// ----- Cloud sync ---------------------------------------------------------

/**
 * Fire-and-forget cloud write. Called on every rating — local write is
 * synchronous (already happened upstream), so this just ships the latest
 * state to RTDB without blocking the UI.
 *
 * No debounce: ratings are infrequent (~1 per 1-3 sec at peak), each write
 * is a tiny JSON merge, and immediate sync keeps cross-device behavior live.
 */
export function scheduleFlush(uid: string | null, state: SrsState): void {
  if (typeof window === 'undefined') return;
  if (!canUseCloud(uid)) return;
  void writeCloud(uid, state);
}

/** Same as scheduleFlush — kept as a separate name so callers that want to
 * await completion (e.g. on unmount) read clearly. */
export async function flushNow(uid: string | null, state: SrsState): Promise<void> {
  if (!canUseCloud(uid)) return;
  await writeCloud(uid, state);
}

// ----- Helpers ------------------------------------------------------------

function isSrsState(x: unknown): x is SrsState {
  if (!x || typeof x !== 'object') return false;
  for (const v of Object.values(x as Record<string, unknown>)) {
    if (!v || typeof v !== 'object') return false;
    const c = v as Record<string, unknown>;
    if (typeof c.level !== 'number') return false;
    if (typeof c.lastSeen !== 'number') return false;
    if (typeof c.reviewCount !== 'number') return false;
  }
  return true;
}

// Re-export for convenience.
export { cardKey };
