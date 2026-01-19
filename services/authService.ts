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
    console.log('🔐 Initializing auth...');

    // Wait for Firebase to restore the persisted session
    // The getReactNativePersistence we configured should handle this automatically
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.warn('⚠️ Auth restore timeout, creating new user');
        signInAnonymous().then(resolve);
      }, 3000); // Reduced to 3 seconds

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        clearTimeout(timeout);
        unsubscribe();

        if (user) {
          // User session restored successfully
          console.log('✅ Auth session restored:', user.uid);
          currentUser = user;
          await AsyncStorage.setItem(AUTH_USER_ID_KEY, user.uid);
          resolve(user);
        } else {
          // No persisted session, create new anonymous user
          console.log('👤 No session found, creating new anonymous user');
          const newUser = await signInAnonymous();
          resolve(newUser);
        }
      });
    });
  } catch (error) {
    console.error('❌ Error initializing auth:', error);
    return null;
  }
}
