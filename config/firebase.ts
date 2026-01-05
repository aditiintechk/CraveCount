import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

// Initialize Auth
// Firebase JS SDK automatically persists auth state in React Native
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };
