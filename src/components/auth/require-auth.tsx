'use client'

/**
 * Top-level authentication + email-verification guard.
 *
 * Wraps the app in src/app/layout.tsx and enforces:
 *   - Unauthenticated users → /login (with ?next=<original path>)
 *   - Signed-in but unverified email users → /verify-email (with ?next=<...>)
 *
 * Public routes (always accessible):
 *   /login, /signup, /verify-email, /reset-password, /forgot-password
 *
 * The Firebase auth state lives client-side, so this guard can't run at the
 * Edge/middleware layer — it's a client component. While auth state is
 * resolving (loading=true), we render a minimal spinner to avoid flashing
 * protected content.
 */

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

const PUBLIC_PATHS = new Set([
  '/login',
  '/signup',
  '/verify-email',
  '/reset-password',
  '/forgot-password',
])

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true
  // Treat /__/auth/* (Firebase action handler) and Next internals as public.
  if (pathname.startsWith('/__/')) return true
  if (pathname.startsWith('/_next/')) return true
  return false
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname() || '/'
  const { user, loading, isFirebaseAvailable } = useAuth()

  useEffect(() => {
    // While auth state is resolving, do nothing — let the spinner render.
    if (loading) return

    // If Firebase isn't configured at all, fall back to fully open access
    // (e.g., local dev without env vars). This keeps the app usable without
    // forcing a Firebase project on contributors.
    if (!isFirebaseAvailable) return

    if (isPublicPath(pathname)) return

    if (!user) {
      const next = encodeURIComponent(pathname)
      router.replace(`/login?next=${next}`)
      return
    }

    if (!user.emailVerified) {
      const next = encodeURIComponent(pathname)
      router.replace(`/verify-email?next=${next}`)
      return
    }
  }, [loading, user, pathname, router, isFirebaseAvailable])

  // Render a neutral spinner while we don't yet know whether to allow access.
  // For public paths, render children immediately even during loading so the
  // login/signup forms aren't held back by auth resolution.
  if (isPublicPath(pathname)) {
    return <>{children}</>
  }
  if (!isFirebaseAvailable) {
    return <>{children}</>
  }
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    )
  }
  if (!user || !user.emailVerified) {
    // Redirect is in flight. Render nothing rather than the protected tree.
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    )
  }
  return <>{children}</>
}
