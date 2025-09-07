// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Firebase configuration with fallback values
const firebaseConfig = {
  apiKey: import.meta?.env?.VITE_FIREBASE_API_KEY || "AIzaSyDnlfZF01rKU6h80hsoxKTcWvl3Xcq81uk",
  authDomain: import.meta?.env?.VITE_FIREBASE_AUTH_DOMAIN || "typing-website-44c98.firebaseapp.com",
  projectId: import.meta?.env?.VITE_FIREBASE_PROJECT_ID || "typing-website-44c98",
  storageBucket: import.meta?.env?.VITE_FIREBASE_STORAGE_BUCKET || "typing-website-44c98.firebasestorage.app",
  messagingSenderId: import.meta?.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "683451576727",
  appId: import.meta?.env?.VITE_FIREBASE_APP_ID || "1:683451576727:web:7c6da6622588dbd17dd4d2",
};

// Initialize Firebase core app
export const app = initializeApp(firebaseConfig);

// Initialize Auth with error handling
export const auth = getAuth(app);

// Initialize Firestore with error handling and connection settings
export const db = getFirestore(app);

// Configure Firestore settings for better connection handling
import { enableNetwork, disableNetwork } from "firebase/firestore";

// Add connection state management
let isOnline = navigator.onLine;

// Monitor online/offline status
window.addEventListener('online', () => {
  isOnline = true;
  enableNetwork(db).catch(console.error);
});

window.addEventListener('offline', () => {
  isOnline = false;
  disableNetwork(db).catch(console.error);
});

// Export connection status
export const getConnectionStatus = () => isOnline;

export default app;