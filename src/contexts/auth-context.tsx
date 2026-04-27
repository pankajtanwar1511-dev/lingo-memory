"use client"

/**
 * Authentication Context
 *
 * Provides authentication state and methods throughout the app.
 * Automatically syncs with Firebase auth state.
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { authService, AuthUser } from '@/services/auth.service'
import { syncService } from '@/services/sync.service'
import { isFirebaseConfigured } from '@/lib/firebase'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  isAuthenticated: boolean
  isFirebaseAvailable: boolean
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<AuthUser>
  signInWithEmail: (email: string, password: string) => Promise<AuthUser>
  signInWithGoogle: () => Promise<AuthUser>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  /** Attach an email/password credential to the currently-signed-in user
   *  (preserves their UID — used for migrating away from Google sign-in). */
  linkPasswordToCurrentUser: (password: string) => Promise<void>
  /** Whether the current user already has email/password as a sign-in method. */
  hasPasswordProvider: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFirebaseAvailable] = useState(isFirebaseConfigured())

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((authUser) => {
      setUser(authUser)
      setLoading(false)

      // Wire up cloud sync (vocab cards / study cards / decks) in the
      // background. We DON'T await — sync.initialize does multiple RTDB
      // round-trips that can take a few seconds, and blocking the auth
      // callback would freeze the UI in the spinner.
      if (authUser) {
        void syncService.initialize(authUser.uid).catch((err) => {
          console.warn('Sync init failed:', err)
        })
      } else {
        syncService.stop()
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('Auth state changed:', authUser ? authUser.email : 'signed out')
      }
    })

    return () => {
      unsubscribe()
      syncService.stop()
    }
  }, [])

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    isFirebaseAvailable,
    signUpWithEmail: authService.signUpWithEmail.bind(authService),
    signInWithEmail: authService.signInWithEmail.bind(authService),
    signInWithGoogle: authService.signInWithGoogle.bind(authService),
    signOut: authService.signOut.bind(authService),
    resetPassword: authService.resetPassword.bind(authService),
    linkPasswordToCurrentUser: authService.linkPasswordToCurrentUser.bind(authService),
    hasPasswordProvider: authService.hasPasswordProvider.bind(authService),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * Hook to require authentication.
 *
 * The top-level <RequireAuth> guard already enforces login + email-verification
 * for the whole app, so this hook is mostly a no-op for new code. Kept for
 * backwards-compat: instead of throwing, we redirect to /login with ?next=<...>
 * so callers don't crash if Firebase resolves a logged-out state late.
 */
export function useRequireAuth() {
  const context = useAuth()
  const router = useRouter()
  const pathname = usePathname() || '/'

  useEffect(() => {
    if (context.loading) return
    if (!context.isFirebaseAvailable) return
    if (!context.isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
    } else if (context.user && !context.user.emailVerified) {
      router.replace(`/verify-email?next=${encodeURIComponent(pathname)}`)
    }
  }, [context.loading, context.isAuthenticated, context.user, context.isFirebaseAvailable, router, pathname])

  return context
}
