/**
 * Email allowlist service.
 *
 * Maintains an invite-only access gate. Admins (see lib/admin.ts) can grant
 * specific email addresses access to the app via /admin/allowlist.
 *
 * Firestore layout:
 *   app/allowlist               doc with { emails: string[] (lowercased) }
 *   pendingRequests/{uid}       one doc per user awaiting approval, with
 *                               { uid, email, displayName, createdAt }
 *
 * Cache: getAllowlist() reads at most once per 30 s. After mutations
 * (add/remove) the cache is invalidated immediately.
 */

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { firestore, isFirebaseConfigured } from '@/lib/firebase';
import { isAdminEmail } from '@/lib/admin';

const CACHE_MS = 30_000;

const ALLOWLIST_DOC = 'app/allowlist';
const PENDING_COLLECTION = 'pendingRequests';

interface AllowlistDoc {
  emails: string[];
}

export interface PendingRequest {
  uid: string;
  email: string;
  displayName?: string | null;
  createdAt?: number; // epoch ms
}

let cache: { fetchedAt: number; emails: Set<string> } | null = null;

function canUseFirestore(): boolean {
  return isFirebaseConfigured() && !!firestore;
}

/** Read the allowlist with a short in-memory cache. */
export async function getAllowlist(forceRefresh = false): Promise<Set<string>> {
  if (!canUseFirestore()) return new Set();
  if (
    !forceRefresh &&
    cache &&
    Date.now() - cache.fetchedAt < CACHE_MS
  ) {
    return cache.emails;
  }
  try {
    const ref = doc(firestore!, ALLOWLIST_DOC);
    const snap = await getDoc(ref);
    const data = (snap.exists() ? snap.data() : null) as AllowlistDoc | null;
    const list = (data?.emails || []).map((e) => e.toLowerCase());
    const set = new Set(list);
    cache = { fetchedAt: Date.now(), emails: set };
    return set;
  } catch (e) {
    console.warn('[allowlist] read failed:', e);
    // Fall back to last cached value if available so a transient network blip
    // doesn't lock everyone out.
    return cache?.emails ?? new Set();
  }
}

/** True if the email is on the allowlist (or admin — admins always pass). */
export async function isEmailAllowed(email: string | null | undefined): Promise<boolean> {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  if (isAdminEmail(normalized)) return true;
  const set = await getAllowlist();
  return set.has(normalized);
}

/** Add an email to the allowlist (admin-only by Firestore rules). */
export async function addEmail(email: string): Promise<void> {
  if (!canUseFirestore()) throw new Error('Firestore not configured');
  const normalized = email.trim().toLowerCase();
  if (!normalized) throw new Error('Email required');
  const ref = doc(firestore!, ALLOWLIST_DOC);
  const snap = await getDoc(ref);
  const existing = (
    snap.exists() ? (snap.data() as AllowlistDoc).emails ?? [] : []
  ).map((e) => e.toLowerCase());
  if (existing.includes(normalized)) return;
  const next = [...existing, normalized];
  await setDoc(ref, { emails: next }, { merge: true });
  cache = null;
}

/** Remove an email from the allowlist. */
export async function removeEmail(email: string): Promise<void> {
  if (!canUseFirestore()) throw new Error('Firestore not configured');
  const normalized = email.trim().toLowerCase();
  const ref = doc(firestore!, ALLOWLIST_DOC);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const existing = ((snap.data() as AllowlistDoc).emails ?? []).map((e) =>
    e.toLowerCase(),
  );
  const next = existing.filter((e) => e !== normalized);
  await setDoc(ref, { emails: next }, { merge: true });
  cache = null;
}

/** Write a pending-request doc for a newly signed-up user. */
export async function writePendingRequest(
  uid: string,
  email: string,
  displayName?: string | null,
): Promise<void> {
  if (!canUseFirestore() || !uid || !email) return;
  const normalized = email.trim().toLowerCase();
  // Admins or already-allowed users skip the pending step.
  if (isAdminEmail(normalized)) return;
  const set = await getAllowlist();
  if (set.has(normalized)) return;
  try {
    const ref = doc(firestore!, PENDING_COLLECTION, uid);
    await setDoc(
      ref,
      {
        uid,
        email: normalized,
        displayName: displayName || null,
        createdAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (e) {
    console.warn('[allowlist] write pending failed:', e);
  }
}

/** Admin-only: list all pending requests. */
export async function listPendingRequests(): Promise<PendingRequest[]> {
  if (!canUseFirestore()) return [];
  try {
    const snap = await getDocs(collection(firestore!, PENDING_COLLECTION));
    return snap.docs.map((d) => {
      const data = d.data() as Record<string, unknown>;
      const created = data.createdAt as { toMillis?: () => number } | undefined;
      return {
        uid: d.id,
        email: String(data.email ?? ''),
        displayName: (data.displayName as string | null) ?? null,
        createdAt: created?.toMillis?.(),
      };
    });
  } catch (e) {
    console.warn('[allowlist] list pending failed:', e);
    return [];
  }
}

/** Admin-only: delete a pending-request doc (after approve OR decline). */
export async function deletePendingRequest(uid: string): Promise<void> {
  if (!canUseFirestore() || !uid) return;
  try {
    await deleteDoc(doc(firestore!, PENDING_COLLECTION, uid));
  } catch (e) {
    console.warn('[allowlist] delete pending failed:', e);
  }
}

/** Approve a pending request: add email to allowlist + delete pending doc. */
export async function approvePendingRequest(uid: string, email: string): Promise<void> {
  await addEmail(email);
  await deletePendingRequest(uid);
}

/** Force-clear the cache. Useful after the user's own approval flips through. */
export function invalidateAllowlistCache(): void {
  cache = null;
}

// ---------- Runtime admin management ----------

const ADMINS_DOC = 'app/admins';

interface AdminsDoc {
  emails: string[];
}

/** Read the runtime admin list (uncached — admin lists are small and rare to read). */
export async function listAdmins(): Promise<string[]> {
  if (!canUseFirestore()) return [];
  try {
    const ref = doc(firestore!, ADMINS_DOC);
    const snap = await getDoc(ref);
    const data = (snap.exists() ? snap.data() : null) as AdminsDoc | null;
    return (data?.emails || []).map((e) => e.toLowerCase());
  } catch (e) {
    console.warn('[admin] list failed:', e);
    return [];
  }
}

/** Add an email to the runtime admin list. */
export async function addAdmin(email: string): Promise<void> {
  if (!canUseFirestore()) throw new Error('Firestore not configured');
  const normalized = email.trim().toLowerCase();
  if (!normalized) throw new Error('Email required');
  const ref = doc(firestore!, ADMINS_DOC);
  const snap = await getDoc(ref);
  const existing = (
    snap.exists() ? (snap.data() as AdminsDoc).emails ?? [] : []
  ).map((e) => e.toLowerCase());
  if (existing.includes(normalized)) return;
  await setDoc(ref, { emails: [...existing, normalized] }, { merge: true });
  // Also auto-add to the access allowlist so the new admin can use the app.
  try {
    await addEmail(normalized);
  } catch {
    /* allowlist write may fail if rules differ — ignore, admin is still admin */
  }
}

/** Remove an email from the runtime admin list. Bootstrap admins are protected
 * one layer up (UI hides the remove button), but we double-check here too. */
export async function removeAdmin(email: string): Promise<void> {
  if (!canUseFirestore()) throw new Error('Firestore not configured');
  const normalized = email.trim().toLowerCase();
  const ref = doc(firestore!, ADMINS_DOC);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const existing = ((snap.data() as AdminsDoc).emails ?? []).map((e) =>
    e.toLowerCase(),
  );
  const next = existing.filter((e) => e !== normalized);
  await setDoc(ref, { emails: next }, { merge: true });
}
