import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const env = (import.meta as any).env || {};

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyDTJ5KOhlQ-RrB4N3b3_ysAF9HP3YYGN1Y",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "test-3df62.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "test-3df62",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "test-3df62.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "479633712893",
  appId: env.VITE_FIREBASE_APP_ID || "1:479633712893:web:ee4642101943a3a0370094",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || "G-VVE5RRFLNE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const isAiStudioProject = firebaseConfig.projectId === "intricate-talent-tln7n";
export const db = isAiStudioProject
  ? getFirestore(app, "ai-studio-remixuagen-be6bdb46-b4d6-4851-8533-b4f8d6921c30")
  : getFirestore(app);

// Initialize Analytics if supported
export let analytics: any = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch((err) => {
  console.warn("Analytics initialization failed or is not supported:", err);
});

