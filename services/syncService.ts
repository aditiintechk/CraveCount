import { doc, setDoc, getDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getCurrentUserId } from './authService';

/**
 * Firestore Sync Service
 *
 * This service handles automatic backup and sync of user data to Firestore.
 * Data structure in Firestore:
 *
 * users/{userId}/
 *   - willpowerPoints: number
 *   - logs: array of log objects
 *   - plannedJoys: array of planned joy objects
 *   - lastSyncedAt: timestamp
 */

export interface UserData {
  willpowerPoints: number;
  logs: any[];
  plannedJoys: any[];
  lastSyncedAt?: number;
}

/**
 * Save user data to Firestore
 * This backs up all user data to the cloud
 */
export async function saveUserData(data: UserData): Promise<boolean> {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      console.warn('⚠️ Cannot save data: User not authenticated');
      return false;
    }

    const userDocRef = doc(db, 'users', userId);

    // Helper to safely convert date to ISO string
    const safeToISOString = (date: any): string => {
      try {
        if (!date) return new Date().toISOString();
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return new Date().toISOString();
        return d.toISOString();
      } catch {
        return new Date().toISOString();
      }
    };

    // Serialize data to remove undefined values and convert Dates to timestamps
    const serializedData = {
      willpowerPoints: data.willpowerPoints || 0,
      logs: (data.logs || []).map((log: any) => ({
        id: log.id,
        category: log.category,
        type: log.type,
        emotion: log.emotion || null,
        reflection: log.reflection || null,
        timestamp: safeToISOString(log.timestamp),
        points: log.points,
      })),
      plannedJoys: (data.plannedJoys || []).map((joy: any) => ({
        id: joy.id,
        title: joy.title,
        description: joy.description || null,
        date: safeToISOString(joy.date),
        notificationId: joy.notificationId || null,
      })),
      lastSyncedAt: Date.now(),
    };

    await setDoc(userDocRef, serializedData);
    console.log('☁️ Data saved to Firestore successfully');
    return true;
  } catch (error) {
    console.error('❌ Error saving data to Firestore:', error);
    return false;
  }
}

/**
 * Load user data from Firestore
 * This retrieves backed up data from the cloud
 */
export async function loadUserData(): Promise<UserData | null> {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      console.warn('⚠️ Cannot load data: User not authenticated');
      return null;
    }

    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as UserData;
      console.log('☁️ Data loaded from Firestore successfully');
      return data;
    } else {
      console.log('📭 No data found in Firestore (new user)');
      return null;
    }
  } catch (error) {
    console.error('❌ Error loading data from Firestore:', error);
    return null;
  }
}

/**
 * Listen to real-time updates from Firestore
 * This allows the app to sync data across multiple devices in real-time
 */
export function subscribeToUserData(
  callback: (data: UserData | null) => void
): Unsubscribe | null {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      console.warn('⚠️ Cannot subscribe: User not authenticated');
      return null;
    }

    const userDocRef = doc(db, 'users', userId);

    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as UserData;
          console.log('🔄 Real-time update received from Firestore');
          callback(data);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('❌ Error in Firestore subscription:', error);
        callback(null);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('❌ Error setting up Firestore subscription:', error);
    return null;
  }
}

/**
 * Check if user has any data in Firestore
 */
export async function hasCloudData(): Promise<boolean> {
  try {
    const userId = getCurrentUserId();
    if (!userId) return false;

    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);
    return docSnap.exists();
  } catch (error) {
    console.error('❌ Error checking cloud data:', error);
    return false;
  }
}
