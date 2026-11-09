import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Web app Firebase configuration
// Fallbacks ensure it connects reliably while prioritizing .env values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDQ1DEogqOgIybCkQmmIhuCtlScTiyWCtA',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'yoav-c53ef.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'yoav-c53ef',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'yoav-c53ef.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '298964299982',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:298964299982:web:94d9fa31ed74653dd9e09f',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-CSVM5MZGME',
};

// Initialize Firebase (singleton pattern prevents duplicate initializations in hot reloading)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
