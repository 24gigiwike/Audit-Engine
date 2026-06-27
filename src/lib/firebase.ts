import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "capable-skill-bwjkk",
  appId: "1:1033128340535:web:85c25767f2dc51ccafa3b2",
  apiKey: "AIzaSyDncdAi6AXPCOTjE2a7BH_PETaT_ZtFjJY",
  authDomain: "capable-skill-bwjkk.firebaseapp.com",
  storageBucket: "capable-skill-bwjkk.firebasestorage.app",
  messagingSenderId: "1033128340535"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId if provided
// In firebase-applet-config.json, firestoreDatabaseId is "ai-studio-digitalpresencea-5a244154-678a-4c11-a530-1f77ac3dd858"
export const db = getFirestore(app, "ai-studio-digitalpresencea-5a244154-678a-4c11-a530-1f77ac3dd858");
