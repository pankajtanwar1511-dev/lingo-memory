/**
 * Authentication Service
 *
 * Handles all authentication operations including:
 * - Email/Password authentication
 * - Google Sign-In
 * - Session persistence
 * - User state management
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  User,
  UserCredential,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth'
import { ref, get, set, update, serverTimestamp } from 'firebase/database'
import { auth, database, isFirebaseConfigured } from '@/lib/firebase'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
  createdAt?: Date
  lastLoginAt?: Date
}

export class AuthService {
  private googleProvider: GoogleAuthProvider

  constructor() {
    this.googleProvider = new GoogleAuthProvider()
    this.googleProvider.setCustomParameters({
      prompt: 'select_account'
    })

    // Set persistence to LOCAL (survives page refresh)
    if (auth) {
      setPersistence(auth, browserLocalPersistence).catch(console.error)
    }
  }

  /**
   * Check if authentication is available
   */
  isAvailable(): boolean {
    return isFirebaseConfigured() && !!auth
  }

  /**
   * Sign up with email and password
   */
  async signUpWithEmail(
    email: string,
    password: string,
    displayName?: string
  ): Promise<AuthUser> {
    if (!this.isAvailable()) {
      throw new Error('Firebase authentication not configured')
    }

    try {
      const credential = await createUserWithEmailAndPassword(auth!, email, password)

      // Update display name if provided
      if (displayName && credential.user) {
        await updateProfile(credential.user, { displayName })
      }

      // Firestore not yet provisioned — failures must not block the auth flow.
      try {
        await this.createUserDocument(credential.user)
      } catch (e) {
        console.warn('Failed to create user document:', e)
      }

      try {
        await sendEmailVerification(credential.user)
      } catch (e) {
        console.warn('Failed to send verification email on signup:', e)
      }

      return this.toAuthUser(credential.user)
    } catch (error: any) {
      throw this.handleAuthError(error)
    }
  }

  /**
   * Resend the email-verification link for the currently signed-in user.
   * Throws if no user is signed in or if the user is already verified.
   */
  async resendEmailVerification(): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('Firebase authentication not configured')
    }
    const user = auth?.currentUser
    if (!user) throw new Error('No user signed in')
    if (user.emailVerified) throw new Error('Email already verified')
    try {
      await sendEmailVerification(user)
    } catch (error: any) {
      throw this.handleAuthError(error)
    }
  }

  /**
   * Force-refresh the current user from Firebase. Used by /verify-email to
   * detect when the user has clicked the link in their inbox.
   */
  async reloadCurrentUser(): Promise<AuthUser | null> {
    if (!this.isAvailable()) return null
    const user = auth?.currentUser
    if (!user) return null
    await user.reload()
    return this.toAuthUser(user)
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    if (!this.isAvailable()) {
      throw new Error('Firebase authentication not configured')
    }

    try {
      const credential = await signInWithEmailAndPassword(auth!, email, password)

      try {
        await this.updateUserDocument(credential.user.uid, {
          lastLoginAt: serverTimestamp()
        })
      } catch (e) {
        console.warn('Failed to update user document on email sign-in:', e)
      }

      return this.toAuthUser(credential.user)
    } catch (error: any) {
      throw this.handleAuthError(error)
    }
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<AuthUser> {
    if (!this.isAvailable()) {
      throw new Error('Firebase authentication not configured')
    }

    try {
      const credential = await signInWithPopup(auth!, this.googleProvider)

      try {
        if (database) {
          const snap = await get(ref(database, `users/${credential.user.uid}`))
          if (!snap.exists()) {
            await this.createUserDocument(credential.user)
          } else {
            await this.updateUserDocument(credential.user.uid, {
              lastLoginAt: serverTimestamp(),
            })
          }
        }
      } catch (e) {
        console.warn('Failed to sync user document on Google sign-in:', e)
      }

      return this.toAuthUser(credential.user)
    } catch (error: any) {
      throw this.handleAuthError(error)
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    if (!this.isAvailable()) {
      return
    }

    try {
      await firebaseSignOut(auth!)
    } catch (error: any) {
      throw this.handleAuthError(error)
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('Firebase authentication not configured')
    }

    try {
      await sendPasswordResetEmail(auth!, email)
    } catch (error: any) {
      throw this.handleAuthError(error)
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return auth?.currentUser || null
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    if (!auth) {
      callback(null)
      return () => {}
    }

    return onAuthStateChanged(auth, (user) => {
      callback(user ? this.toAuthUser(user) : null)
    })
  }

  /**
   * Create user document in Firestore
   */
  private async createUserDocument(user: User): Promise<void> {
    if (!database) return
    await set(ref(database, `users/${user.uid}`), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      settings: {
        theme: 'system',
        dailyGoal: 20,
        notifications: true,
        sound: true,
        autoplay: false,
        showFurigana: true,
        language: 'en',
      },
    })
  }

  /**
   * Update user document in Realtime Database (merge semantics).
   */
  private async updateUserDocument(
    uid: string,
    updates: Record<string, any>
  ): Promise<void> {
    if (!database) return
    await update(ref(database, `users/${uid}`), updates)
  }

  /**
   * Convert Firebase User to AuthUser
   */
  private toAuthUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    }
  }

  /**
   * Handle authentication errors
   */
  private handleAuthError(error: any): Error {
    const errorCode = error.code
    const errorMessage = error.message

    // Map Firebase error codes to user-friendly messages
    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use': 'This email is already registered',
      'auth/invalid-email': 'Invalid email address',
      'auth/operation-not-allowed': 'Operation not allowed',
      'auth/weak-password': 'Password is too weak (min 6 characters)',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/invalid-credential': 'Invalid email or password',
      'auth/popup-closed-by-user': 'Sign-in popup was closed',
      'auth/cancelled-popup-request': 'Sign-in cancelled',
      'auth/network-request-failed': 'Network error. Please check your connection',
    }

    const message = errorMessages[errorCode] || errorMessage || 'Authentication error'
    return new Error(message)
  }
}

// Create singleton instance
export const authService = new AuthService()

// Export for debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).authService = authService
}
