import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkBadgeUnlocks, generateInsights, Badge, Insight } from '../utils/patterns';
import { schedulePlannedJoyNotification, cancelNotification, updatePlannedJoyNotification } from '../utils/notifications';
import { saveUserData, loadUserData } from '../services/syncService';
import { initializeAuth } from '../services/authService';

export type Category = 'Sugar' | 'Junk Food' | 'Instagram' | 'TikTok' | 'YouTube' | 'Alcohol' | 'Cigarettes' | 'Shopping' | 'Gaming' | 'Netflix' | 'Twitter' | 'Reddit' | 'Porn' | 'Coffee' | 'Other';

export type LogType = 'observed' | 'resisted';

export type Emotion = 'Curious' | 'Restless' | 'Stressed' | 'Bored' | 'Excited';

export interface Log {
  id: string;
  category: Category;
  type: LogType;
  emotion?: Emotion;
  reflection?: string;
  timestamp: Date;
  points: number;
}

export interface PlannedJoy {
  id: string;
  title: string;
  description?: string;
  date: Date;
  notificationId?: string;
}

interface StoreState {
  willpowerPoints: number;
  logs: Log[];
  plannedJoys: PlannedJoy[];
  customCravings: Category[];
  isSyncing: boolean;
  lastSyncedAt: number | null;
  addLog: (category: Category, type: LogType, emotion?: Emotion, reflection?: string) => void;
  deleteLog: (id: string) => Promise<void>;
  addPlannedJoy: (title: string, description: string | undefined, date: Date) => Promise<void>;
  deletePlannedJoy: (id: string) => Promise<void>;
  updatePlannedJoy: (id: string, title: string, description: string | undefined, date: Date) => Promise<void>;
  setCustomCravings: (cravings: Category[]) => Promise<void>;
  loadData: () => Promise<void>;
  syncToCloud: () => Promise<void>;
  getAwarenessCount: () => number;
  getResistedCount: () => number;
  getBadges: () => Badge[];
  getInsights: () => Insight[];
}

const STORAGE_KEY = '@crave_count_data';

export const useStore = create<StoreState>((set, get) => ({
  willpowerPoints: 0,
  logs: [],
  plannedJoys: [],
  customCravings: [], // Will be set during onboarding
  isSyncing: false,
  lastSyncedAt: null,

  addLog: async (category: Category, type: LogType, emotion?: Emotion, reflection?: string) => {
    const points = type === 'observed' ? 10 : 30;
    const newLog: Log = {
      id: Date.now().toString(),
      category,
      type,
      emotion,
      reflection,
      timestamp: new Date(),
      points,
    };

    set((state) => ({
      willpowerPoints: state.willpowerPoints + points,
      logs: [newLog, ...state.logs],
    }));

    // Persist to AsyncStorage and sync to cloud
    const currentState = get();
    const dataToSave = {
      willpowerPoints: currentState.willpowerPoints,
      logs: currentState.logs,
      plannedJoys: currentState.plannedJoys,
      customCravings: currentState.customCravings,
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    await get().syncToCloud();
  },

  deleteLog: async (id: string) => {
    const logToDelete = get().logs.find(log => log.id === id);
    if (!logToDelete) return;

    set((state) => ({
      willpowerPoints: state.willpowerPoints - logToDelete.points,
      logs: state.logs.filter(log => log.id !== id),
    }));

    // Persist to AsyncStorage and sync to cloud
    const currentState = get();
    const dataToSave = {
      willpowerPoints: currentState.willpowerPoints,
      logs: currentState.logs,
      plannedJoys: currentState.plannedJoys,
      customCravings: currentState.customCravings,
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    await get().syncToCloud();
  },

  addPlannedJoy: async (title: string, description: string | undefined, date: Date) => {
    const newJoyId = Date.now().toString();

    // Schedule notification
    const notificationId = await schedulePlannedJoyNotification(newJoyId, title, date);

    const newJoy: PlannedJoy = {
      id: newJoyId,
      title,
      description,
      date,
      notificationId: notificationId || undefined,
    };

    set((state) => ({
      plannedJoys: [...state.plannedJoys, newJoy].sort((a, b) => a.date.getTime() - b.date.getTime()),
    }));

    // Persist to AsyncStorage and sync to cloud
    const currentState = get();
    const dataToSave = {
      willpowerPoints: currentState.willpowerPoints,
      logs: currentState.logs,
      plannedJoys: currentState.plannedJoys,
      customCravings: currentState.customCravings,
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    await get().syncToCloud();
  },

  updatePlannedJoy: async (id: string, title: string, description: string | undefined, date: Date) => {
    const existingJoy = get().plannedJoys.find(joy => joy.id === id);

    // Update notification
    const notificationId = await updatePlannedJoyNotification(
      existingJoy?.notificationId,
      id,
      title,
      date
    );

    set((state) => ({
      plannedJoys: state.plannedJoys
        .map(joy => joy.id === id ? { ...joy, title, description, date, notificationId: notificationId || undefined } : joy)
        .sort((a, b) => a.date.getTime() - b.date.getTime()),
    }));

    // Persist to AsyncStorage and sync to cloud
    const currentState = get();
    const dataToSave = {
      willpowerPoints: currentState.willpowerPoints,
      logs: currentState.logs,
      plannedJoys: currentState.plannedJoys,
      customCravings: currentState.customCravings,
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    await get().syncToCloud();
  },

  deletePlannedJoy: async (id: string) => {
    const joyToDelete = get().plannedJoys.find(joy => joy.id === id);

    // Cancel notification if exists
    if (joyToDelete?.notificationId) {
      await cancelNotification(joyToDelete.notificationId);
    }

    set((state) => ({
      plannedJoys: state.plannedJoys.filter(joy => joy.id !== id),
    }));

    // Persist to AsyncStorage and sync to cloud
    const currentState = get();
    const dataToSave = {
      willpowerPoints: currentState.willpowerPoints,
      logs: currentState.logs,
      plannedJoys: currentState.plannedJoys,
      customCravings: currentState.customCravings,
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    await get().syncToCloud();
  },

  setCustomCravings: async (cravings: Category[]) => {
    if (cravings.length > 3) {
      console.warn('Cannot set more than 3 custom cravings');
      return;
    }

    set({ customCravings: cravings });

    // Persist to AsyncStorage and sync to cloud
    const currentState = get();
    const dataToSave = {
      willpowerPoints: currentState.willpowerPoints,
      logs: currentState.logs,
      plannedJoys: currentState.plannedJoys,
      customCravings: currentState.customCravings,
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    await get().syncToCloud();
  },

  loadData: async () => {
    try {
      console.log('📂 Loading data...');

      // Initialize Firebase auth first
      await initializeAuth();

      // Try to load from Firestore first
      const cloudData = await loadUserData();

      if (cloudData) {
        console.log('☁️ Loading data from cloud');
        set({
          willpowerPoints: cloudData.willpowerPoints || 0,
          logs: cloudData.logs?.map((log: any) => ({
            ...log,
            timestamp: new Date(log.timestamp),
          })) || [],
          plannedJoys: cloudData.plannedJoys?.map((joy: any) => ({
            ...joy,
            date: new Date(joy.date),
          })).sort((a: PlannedJoy, b: PlannedJoy) => a.date.getTime() - b.date.getTime()) || [],
          customCravings: cloudData.customCravings || [],
          lastSyncedAt: cloudData.lastSyncedAt || null,
        });

        // Also save to local storage as backup
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
      } else {
        // No cloud data, try local storage
        console.log('📱 Loading data from local storage');
        const localData = await AsyncStorage.getItem(STORAGE_KEY);
        if (localData) {
          const parsed = JSON.parse(localData);
          set({
            willpowerPoints: parsed.willpowerPoints || 0,
            logs: parsed.logs?.map((log: any) => ({
              ...log,
              timestamp: new Date(log.timestamp),
            })) || [],
            plannedJoys: parsed.plannedJoys?.map((joy: any) => ({
              ...joy,
              date: new Date(joy.date),
            })).sort((a: PlannedJoy, b: PlannedJoy) => a.date.getTime() - b.date.getTime()) || [],
            customCravings: parsed.customCravings || [],
          });

          // Upload local data to cloud
          await get().syncToCloud();
        }
      }
    } catch (error) {
      console.error('❌ Error loading data:', error);
    }
  },

  syncToCloud: async () => {
    try {
      set({ isSyncing: true });

      const currentState = get();
      const success = await saveUserData({
        willpowerPoints: currentState.willpowerPoints,
        logs: currentState.logs,
        plannedJoys: currentState.plannedJoys,
        customCravings: currentState.customCravings,
      });

      if (success) {
        set({ lastSyncedAt: Date.now(), isSyncing: false });
      } else {
        set({ isSyncing: false });
      }
    } catch (error) {
      console.error('❌ Error syncing to cloud:', error);
      set({ isSyncing: false });
    }
  },

  getAwarenessCount: () => {
    return get().logs.filter(log => log.type === 'observed').length;
  },

  getResistedCount: () => {
    return get().logs.filter(log => log.type === 'resisted').length;
  },

  getBadges: () => {
    return checkBadgeUnlocks(get().logs);
  },

  getInsights: () => {
    return generateInsights(get().logs);
  },
}));
