import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Object.values(firebaseConfig).every(
  (value) => typeof value === 'string' && value.length > 0
)

// initializeApp/getAuth throw synchronously on malformed config, so only touch
// the Firebase SDK when every env var is actually present. Consumers must gate
// on isFirebaseConfigured before using auth/db/storage (see App.tsx).
export const app: FirebaseApp | null = isFirebaseConfigured ? initializeApp(firebaseConfig) : null
export const auth = (app ? getAuth(app) : null) as Auth
export const db = (app ? getFirestore(app) : null) as Firestore
export const storage = (app ? getStorage(app) : null) as FirebaseStorage
