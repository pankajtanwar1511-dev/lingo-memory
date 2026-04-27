/**
 * Generic localStorage ↔ Realtime Database progress sync.
 *
 * Mirrors any localStorage JSON value to RTDB at
 * `users/{uid}/progress/{storageKey}`. Last-write-wins at the document level
 * (whichever side has the later `updatedAt` timestamp). Local writes happen
 * immediately; cloud writes are debounced (default 10 s) so a flurry of
 * ratings collapses into a single round-trip.
 *
 * Used for simple per-page progress maps (kanji practice, etc.) where
 * per-key merging isn't needed. For SRS state that benefits from per-card
 * merge, see vocab-reveal-srs.service.ts.
 *
 * Public API:
 *   - loadProgress(uid, key, default)   — local + cloud, returns the newer one
 *   - saveProgress(uid, key, value)     — local immediate, cloud debounced
 *   - flushAllPending(uid)              — force-flush all pending cloud writes
 */

import { ref, get, set } from 'firebase/database';
import { database, isFirebaseConfigured } from '@/lib/firebase';

const FLUSH_INTERVAL_MS = 10_000;
const TIMESTAMP_KEY_SUFFIX = '__updatedAt';

const flushTimers = new Map<string, ReturnType<typeof setTimeout>>();
const pendingValues = new Map<string, unknown>();
const pendingUids = new Map<string, string>();

function canSync(uid: string | null | undefined): uid is string {
  return !!uid && uid !== 'local-user' && isFirebaseConfigured() && !!database;
}

function cloudPath(uid: string, key: string): string {
  return `users/${uid}/progress/${key}`;
}

function localTsKey(key: string): string {
  return `${key}${TIMESTAMP_KEY_SUFFIX}`;
}

function readLocal<T>(key: string, fallback: T): { value: T; ts: number } {
  if (typeof window === 'undefined') return { value: fallback, ts: 0 };
  try {
    const raw = window.localStorage.getItem(key);
    const ts = parseInt(window.localStorage.getItem(localTsKey(key)) || '0', 10) || 0;
    if (!raw) return { value: fallback, ts };
    return { value: JSON.parse(raw) as T, ts };
  } catch {
    return { value: fallback, ts: 0 };
  }
}

function writeLocal<T>(key: string, value: T, ts: number): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.localStorage.setItem(localTsKey(key), String(ts));
  } catch {
    /* quota or disabled — local will fall back to cloud on next load */
  }
}

async function writeCloud<T>(uid: string, key: string, value: T, ts: number): Promise<void> {
  if (!canSync(uid)) return;
  try {
    await set(ref(database!, cloudPath(uid, key)), { data: value, updatedAt: ts });
  } catch (e) {
    console.warn(`[cloud-progress] write failed (${key}):`, e);
  }
}

/**
 * Load progress for `key`. Reads local + cloud (if available); returns
 * whichever side has the later `updatedAt`. Writes the chosen value back
 * to local so subsequent reads on this device are instant.
 */
export async function loadProgress<T>(
  uid: string | null | undefined,
  key: string,
  defaultValue: T,
): Promise<T> {
  const local = readLocal<T>(key, defaultValue);
  if (!canSync(uid)) return local.value;

  try {
    const snap = await get(ref(database!, cloudPath(uid, key)));
    if (!snap.exists()) return local.value;
    const data = snap.val();
    const cloudTs = typeof data?.updatedAt === 'number' ? data.updatedAt : 0;
    if (cloudTs > local.ts && data?.data !== undefined) {
      writeLocal(key, data.data, cloudTs);
      return data.data as T;
    }
    return local.value;
  } catch (e) {
    console.warn(`[cloud-progress] read failed (${key}):`, e);
    return local.value;
  }
}

/**
 * Save progress for `key`. Local write is synchronous; cloud write is
 * debounced — the latest value within FLUSH_INTERVAL_MS wins.
 */
export function saveProgress<T>(
  uid: string | null | undefined,
  key: string,
  value: T,
): void {
  const ts = Date.now();
  writeLocal(key, value, ts);

  if (!canSync(uid)) return;
  pendingValues.set(key, value);
  pendingUids.set(key, uid);

  const existing = flushTimers.get(key);
  if (existing) clearTimeout(existing);
  flushTimers.set(
    key,
    setTimeout(() => {
      flushTimers.delete(key);
      const pending = pendingValues.get(key);
      const pendingUid = pendingUids.get(key);
      pendingValues.delete(key);
      pendingUids.delete(key);
      if (pending !== undefined && pendingUid) {
        void writeCloud(pendingUid, key, pending, Date.now());
      }
    }, FLUSH_INTERVAL_MS),
  );
}

/** Force-flush all pending cloud writes. Call from beforeunload handlers. */
export async function flushAllPending(): Promise<void> {
  const promises: Promise<void>[] = [];
  for (const [key, value] of pendingValues) {
    const uid = pendingUids.get(key);
    const timer = flushTimers.get(key);
    if (timer) clearTimeout(timer);
    flushTimers.delete(key);
    if (uid) promises.push(writeCloud(uid, key, value, Date.now()));
  }
  pendingValues.clear();
  pendingUids.clear();
  await Promise.all(promises);
}
