import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Anonymous Authentication Service
 *
 * This service handles automatic anonymous authentication.
 * Users are signed in automatically on app launch - they never see a login screen.
 * Each device gets a unique anonymous user ID that persists across app restarts.
 *
 * Note: We manually persist the user ID in AsyncStorage because Firebase JS SDK
 * doesn't reliably persist auth in React Native (especially in Expo Go).
 */

const AUTH_USER_ID_KEY = '@crave_count_user_id';
let currentUser: User | null = null;

/**
 * Sign in anonymously
 * This is called automatically when the app starts
 * Returns the authenticated user
 */
export async function signInAnonymous(): Promise<User | null> {
  try {
    console.log('🔐 Signing in anonymously...');
    const userCredential = await signInAnonymously(auth);
    currentUser = userCredential.user;

    // Persist user ID to AsyncStorage for future sessions
    await AsyncStorage.setItem(AUTH_USER_ID_KEY, currentUser.uid);

    console.log('✅ Anonymous sign-in successful. User ID:', currentUser.uid);
    return currentUser;
  } catch (error) {
    console.error('❌ Error signing in anonymously:', error);
    return null;
  }
}

/**
 * Get the current authenticated user
 * Returns null if not signed in
 */
export function getCurrentUser(): User | null {
  return auth.currentUser || currentUser;
}

/**
 * Get the current user's UID
 * Returns null if not signed in
 */
export function getCurrentUserId(): string | null {
  const user = getCurrentUser();
  return user ? user.uid : null;
}

/**
 * Listen to authentication state changes
 * Calls the callback whenever the user signs in or out
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, (user) => {
    currentUser = user;
    callback(user);
  });
}

/**
 * Initialize authentication
 * This should be called when the app starts
 * It will automatically sign in the user if they're not already signed in
 */
export async function initializeAuth(): Promise<User | null> {
  try {
    // Check if we have a persisted user ID from a previous session
    const persistedUserId = await AsyncStorage.getItem(AUTH_USER_ID_KEY);

    if (persistedUserId) {
      console.log('📱 Found persisted user ID:', persistedUserId);

      // Check if Firebase has this user already signed in
      const existingUser = auth.currentUser;
      if (existingUser && existingUser.uid === persistedUserId) {
        console.log('✅ User already authenticated in Firebase');
        currentUser = existingUser;
        return existingUser;
      }

      // Firebase doesn't have the user, but we have a persisted ID
      // This is expected in Expo Go - Firebase will handle re-auth automatically
      console.log('⏳ Waiting for Firebase to restore session...');
    }

    // Wait for Firebase auth state to initialize
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.warn('⚠️ Auth initialization timeout');
        resolve(null);
      }, 5000);

      let hasResolved = false;

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (hasResolved) return;

        clearTimeout(timeout);

        if (user) {
          // Verify this is our persisted user or save new user
          const persistedId = await AsyncStorage.getItem(AUTH_USER_ID_KEY);

          if (persistedId && user.uid !== persistedId) {
            // Different user - this shouldn't happen, but clear old data
            console.warn('⚠️ User ID mismatch, clearing old session');
            await AsyncStorage.removeItem(AUTH_USER_ID_KEY);
          }

          // Save user ID
          await AsyncStorage.setItem(AUTH_USER_ID_KEY, user.uid);

          console.log('✅ User authenticated:', user.uid);
          currentUser = user;
          hasResolved = true;
          unsubscribe();
          resolve(user);
        } else {
          // No user in Firebase - create new anonymous user
          console.log('👤 No user found, signing in anonymously...');
          const newUser = await signInAnonymous();
          hasResolved = true;
          unsubscribe();
          resolve(newUser);
        }
      }, (error) => {
        if (hasResolved) return;
        clearTimeout(timeout);
        console.error('❌ Auth error:', error);
        hasResolved = true;
        unsubscribe();
        resolve(null);
      });
    });
  } catch (error) {
    console.error('❌ Error initializing auth:', error);
    return null;
  }
}
