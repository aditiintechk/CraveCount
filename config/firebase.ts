import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJEdWFJKgL0I3GQbWzPzfpvQzESHGcBjE",
  authDomain: "crave-count.firebaseapp.com",
  projectId: "crave-count",
  storageBucket: "crave-count.firebasestorage.app",
  messagingSenderId: "977163459752",
  appId: "1:977163459752:web:8922551eb815cb97b0f69d"
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with React Native persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  // Auth already initialized (happens during hot reload in dev)
  auth = getAuth(app);
}

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };
