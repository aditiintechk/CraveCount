import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// @ts-ignore - React Native specific export
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with React Native persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };
