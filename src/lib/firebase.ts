/**
 * Firebase Configuration and Initialization
 *
 * This file initializes Firebase app with Auth and Firestore.
 * Environment variables are required for production.
 * Falls back gracefully if Firebase is not configured.
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getDatabase, Database } from 'firebase/database'

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Check if Firebase is properly configured
export const isFirebaseConfigured = (): boolean => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  )
}

// Initialize Firebase app (singleton pattern)
let app: FirebaseApp | undefined
let auth: Auth | undefined
let firestore: Firestore | undefined
let database: Database | undefined

if (typeof window !== 'undefined') {
  if (isFirebaseConfigured()) {
    // Initialize only if not already initialized
    if (!getApps().length) {
      try {
        app = initializeApp(firebaseConfig)
        auth = getAuth(app)
        // Firestore stays disabled — the project uses Realtime Database for
        // cross-device sync (free Spark plan, no Blaze required). Any code
        // that still imports `firestore` will see undefined and skip.
        firestore = undefined
        if (firebaseConfig.databaseURL) {
          database = getDatabase(app)
          console.log('✓ Firebase Auth + Realtime Database initialized')
        } else {
          console.warn(
            '⚠ NEXT_PUBLIC_FIREBASE_DATABASE_URL not set — cloud sync disabled. ' +
            'Add it to .env.local and Vercel env vars.',
          )
        }
      } catch (error) {
        console.error('✗ Firebase initialization error:', error)
      }
    } else {
      app = getApps()[0]
      auth = getAuth(app)
      firestore = undefined
      if (firebaseConfig.databaseURL) database = getDatabase(app)
    }
  } else {
    console.warn(
      '⚠ Firebase not configured. App will work in offline-only mode.\n' +
      'To enable cloud sync, add Firebase config to .env.local:\n' +
      '  NEXT_PUBLIC_FIREBASE_API_KEY=...\n' +
      '  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...\n' +
      '  NEXT_PUBLIC_FIREBASE_PROJECT_ID=...\n' +
      '  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...\n' +
      '  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...\n' +
      '  NEXT_PUBLIC_FIREBASE_APP_ID=...'
    )
  }
}

// Export Firebase instances
export { app, auth, firestore, database }

// Export for debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).firebase = { app, auth, firestore, database, isConfigured: isFirebaseConfigured() }
}
