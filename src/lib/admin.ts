/**
 * Admin identity helpers.
 *
 * Two layers:
 *
 *   1. BOOTSTRAP_ADMIN_EMAILS — hardcoded in code. Can never be demoted via
 *      the UI; this is the safety net so we can't accidentally lock out the
 *      founder/owner.
 *   2. Runtime admins — list at Firestore doc `app/admins.emails[]`, fully
 *      managed from /admin (promote / demote). Reactive — uses onSnapshot.
 *
 * isAdminEmail(email) checks BOTH. useIsAdmin() subscribes to the runtime
 * list so changes take effect within seconds.
 *
 * Admins:
 *   - Bypass the allowlist gate (auto-approved)
 *   - Can manage the email allowlist + admins at /admin
 *   - See an "Admin" link in the header
 */

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore, isFirebaseConfigured } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';

/** Founder/owner email — always admin, can never be demoted via UI. Lowercase. */
export const BOOTSTRAP_ADMIN_EMAILS: ReadonlySet<string> = new Set([
  'pankaj.tanwar1511@gmail.com',
]);

const ADMINS_DOC_PATH = 'app/admins';

/** Module-level cache of runtime admin emails (lowercase). Refreshed by the
 * onSnapshot subscriber in useRuntimeAdmins / by isAdminEmail's lazy fetch. */
let runtimeAdminCache: Set<string> = new Set();
let runtimeAdminFetchedAt = 0;
const RUNTIME_CACHE_TTL_MS = 30_000;

/** Synchronous admin check using whatever runtime admins are cached.
 * Always honors BOOTSTRAP_ADMIN_EMAILS even before the cache is populated. */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  if (BOOTSTRAP_ADMIN_EMAILS.has(normalized)) return true;
  return runtimeAdminCache.has(normalized);
}

/** Update the cached runtime admin set. Called by useRuntimeAdmins on snapshot. */
export function _setRuntimeAdminCache(emails: Iterable<string>): void {
  runtimeAdminCache = new Set([...emails].map((e) => e.toLowerCase()));
  runtimeAdminFetchedAt = Date.now();
}

/** True if the runtime cache is fresh enough to skip a re-fetch. */
export function _runtimeAdminCacheFresh(): boolean {
  return Date.now() - runtimeAdminFetchedAt < RUNTIME_CACHE_TTL_MS;
}

/**
 * React hook subscribing to the runtime admin list. Sets the module cache as a
 * side effect so synchronous isAdminEmail() works elsewhere in the app.
 *
 * Returns the live set of runtime admin emails (lowercase).
 */
export function useRuntimeAdmins(): ReadonlySet<string> {
  const [admins, setAdmins] = useState<ReadonlySet<string>>(runtimeAdminCache);
  useEffect(() => {
    if (!isFirebaseConfigured() || !firestore) return;
    const ref = doc(firestore, ADMINS_DOC_PATH);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const data = snap.exists() ? (snap.data() as { emails?: string[] }) : null;
        const emails = (data?.emails || []).map((e) => e.toLowerCase());
        _setRuntimeAdminCache(emails);
        setAdmins(new Set(emails));
      },
      (err) => {
        // Read-blocked or doc-missing — leave bootstrap as the only admin.
        console.warn('[admin] runtime admins snapshot failed:', err);
      },
    );
    return () => unsub();
  }, []);
  return admins;
}

/** React hook returning true when the signed-in user is an admin (live). */
export function useIsAdmin(): boolean {
  const { user } = useAuth();
  // Subscribe so the page re-renders when runtime admins change.
  useRuntimeAdmins();
  return isAdminEmail(user?.email ?? null);
}
