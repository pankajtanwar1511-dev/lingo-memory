"use client"

/**
 * Authentication Context
 *
 * Provides authentication state and methods throughout the app.
 * Automatically syncs with Firebase auth state.
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFirebaseAvailable] = useState(isFirebaseConfigured())

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authService.onAuthStateChange(async (authUser) => {
      setUser(authUser)
      setLoading(false)

      // Handle sync service based on auth state
      if (authUser) {
        // User logged in - initialize sync
        try {
          await syncService.initialize(authUser.uid)
          console.log('Sync service initialized for user:', authUser.email)
        } catch (error) {
          console.error('Failed to initialize sync service:', error)
        }
      } else {
        // User logged out - stop sync
        syncService.stop()
        console.log('Sync service stopped')
      }

      // Debug logging
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
 * Hook to require authentication
 * Throws error if user is not authenticated
 */
export function useRequireAuth() {
  const context = useAuth()

  if (!context.isAuthenticated && !context.loading) {
    throw new Error('This feature requires authentication')
  }

  return context
}
