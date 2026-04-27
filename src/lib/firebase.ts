/**
 * Firebase Configuration and Initialization
 *
 * Initializes Firebase Auth + Realtime Database. Firestore is intentionally
 * not used — the project runs on the free Spark plan (no Blaze required),
 * which only includes RTDB for cloud data.
 *
 * Required env vars:
 *   NEXT_PUBLIC_FIREBASE_API_KEY
 *   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *   NEXT_PUBLIC_FIREBASE_DATABASE_URL  (RTDB endpoint, e.g.
 *     https://<project>-default-rtdb.<region>.firebasedatabase.app)
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 *   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 *   NEXT_PUBLIC_FIREBASE_APP_ID
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getDatabase, Database } from 'firebase/database'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = (): boolean => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  )
}

let app: FirebaseApp | undefined
let auth: Auth | undefined
let database: Database | undefined

if (typeof window !== 'undefined') {
  if (isFirebaseConfigured()) {
    if (!getApps().length) {
      try {
        app = initializeApp(firebaseConfig)
        auth = getAuth(app)
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
      if (firebaseConfig.databaseURL) database = getDatabase(app)
    }
  } else {
    console.warn(
      '⚠ Firebase not configured. App will work in offline-only mode.\n' +
        'To enable cloud sync, add Firebase config to .env.local.',
    )
  }
}

export { app, auth, database }

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  ;(window as any).firebase = {
    app,
    auth,
    database,
    isConfigured: isFirebaseConfigured(),
  }
}
