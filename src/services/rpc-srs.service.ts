/**
 * RPC drill SRS storage service.
 *
 * Dual-layer persistence for the per-page spaced-repetition state used by the
 * /study/rpc drill:
 *
 *   1. localStorage  → written on every rating, source of truth offline.
 *   2. Realtime DB   → users/{uid}/preferences/rpcSrs, single node with a
 *                      `cards` map. Fire-and-forget on every rating; merges
 *                      per-card by `lastSeen` on load.
 *
 * The service is **client-only** — guard imports behind `typeof window`.
 *
 * Public API mirrors the kanji vocab-reveal-srs service so callers feel the
 * same: load · rate · applyDecay · persistLocal · scheduleFlush · flushNow.
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
} from '@/types/rpc-srs';

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

// ----- Cloud (Realtime DB) -----------------------------------------------

function canUseCloud(uid: string | null): uid is string {
  return !!uid && uid !== 'local-user' && isFirebaseConfigured() && !!database;
}

async function readCloud(uid: string): Promise<SrsState> {
  if (!canUseCloud(uid)) return {};
  try {
    const snap = await get(ref(database!, SRS.RTDB_PATH(uid)));
    if (!snap.exists()) return {};
    const data = snap.val();
    const cards = data?.cards;
    return isSrsState(cards) ? cards : {};
  } catch (e) {
    console.warn('[rpc-srs] cloud read failed:', e);
    return {};
  }
}

async function writeCloud(uid: string, state: SrsState): Promise<void> {
  if (!canUseCloud(uid)) return;
  try {
    await update(ref(database!, SRS.RTDB_PATH(uid)), {
      cards: state,
      updatedAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn('[rpc-srs] cloud write failed:', e);
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
 */
export async function load(uid: string | null): Promise<SrsState> {
  const local = readLocal();
  if (!canUseCloud(uid)) return local;
  const cloud = await readCloud(uid);
  const merged = mergeStates(local, cloud);
  persistLocal(merged);
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

export function scheduleFlush(uid: string | null, state: SrsState): void {
  if (typeof window === 'undefined') return;
  if (!canUseCloud(uid)) return;
  void writeCloud(uid, state);
}

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

export { cardKey };
