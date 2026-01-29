import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkBadgeUnlocks, generateInsights, Badge, Insight } from '../utils/patterns';
import { schedulePlannedJoyNotification, cancelNotification, updatePlannedJoyNotification } from '../utils/notifications';
import { saveUserData, loadUserData } from '../services/syncService';
import { initializeAuth } from '../services/authService';

export type Category = 'Sugar' | 'Junk Food' | 'Instagram' | 'TikTok' | 'YouTube' | 'Alcohol' | 'Cigarettes' | 'Shopping' | 'Gaming' | 'Netflix' | 'Twitter' | 'Reddit' | 'Porn' | 'Coffee' | 'Other';

export type LogType = 'observed' | 'resisted';

// Emotion is now a string to allow custom emotions with emojis
export type Emotion = string;

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

export interface TreeLevel {
  level: number;
  name: string;
  emoji: string;
  min: number;
  max: number | null;
}

interface StoreState {
  willpowerPoints: number;
  logs: Log[];
  plannedJoys: PlannedJoy[];
  customCravings: Category[];
  customEmotions: string[]; // Array of custom emotions with emojis like ['Happy 😊', 'Stressed 😰']
  isSyncing: boolean;
  lastSyncedAt: number | null;
  addLog: (category: Category, type: LogType, emotion?: Emotion, reflection?: string, timestamp?: Date) => void;
  updateLog: (id: string, category: Category, type: LogType, emotion?: Emotion, reflection?: string, timestamp?: Date) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  addPlannedJoy: (title: string, description: string | undefined, date: Date) => Promise<void>;
  deletePlannedJoy: (id: string) => Promise<void>;
  updatePlannedJoy: (id: string, title: string, description: string | undefined, date: Date) => Promise<void>;
  setCustomCravings: (cravings: Category[]) => Promise<void>;
  setCustomEmotions: (emotions: string[]) => Promise<void>;
  loadData: () => Promise<void>;
  syncToCloud: () => Promise<void>;
  getAwarenessCount: () => number;
  getResistedCount: () => number;
  getBadges: () => Badge[];
  getInsights: () => Insight[];
  getTreeLevel: () => TreeLevel;
  getCurrentStreak: () => number;
  getLongestStreak: () => number;
  getResistanceRate: () => number;
}

const STORAGE_KEY = '@crave_count_data';

export const useStore = create<StoreState>((set, get) => ({
  willpowerPoints: 0,
  logs: [],
  plannedJoys: [],
  customCravings: [], // Will be set during onboarding
  customEmotions: [], // Will be set by user in settings
  isSyncing: false,
  lastSyncedAt: null,

  addLog: async (category: Category, type: LogType, emotion?: Emotion, reflection?: string, timestamp?: Date) => {
    const points = type === 'observed' ? 10 : 30;
    const newLog: Log = {
      id: Date.now().toString(),
      category,
      type,
      emotion,
      reflection,
      timestamp: timestamp || new Date(),
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
      customEmotions: currentState.customEmotions,
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    await get().syncToCloud();
  },

  updateLog: async (id: string, category: Category, type: LogType, emotion?: Emotion, reflection?: string, timestamp?: Date) => {
    const logToUpdate = get().logs.find(log => log.id === id);
    if (!logToUpdate) return;

    const newPoints = type === 'observed' ? 10 : 30;
    const pointsDifference = newPoints - logToUpdate.points;

    const updatedLog: Log = {
      ...logToUpdate,
      category,
      type,
      emotion,
      reflection,
      timestamp: timestamp || logToUpdate.timestamp,
      points: newPoints,
    };

    set((state) => ({
      willpowerPoints: state.willpowerPoints + pointsDifference,
      logs: state.logs.map(log => log.id === id ? updatedLog : log),
    }));

    // Persist to AsyncStorage and sync to cloud
    const currentState = get();
    const dataToSave = {
      willpowerPoints: currentState.willpowerPoints,
      logs: currentState.logs,
      plannedJoys: currentState.plannedJoys,
      customCravings: currentState.customCravings,
      customEmotions: currentState.customEmotions,
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
      customEmotions: currentState.customEmotions,
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
      customEmotions: currentState.customEmotions,
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
      customEmotions: currentState.customEmotions,
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
      customEmotions: currentState.customEmotions,
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    await get().syncToCloud();
  },

  setCustomCravings: async (cravings: Category[]) => {
    if (cravings.length > 10) {
      console.warn('Cannot set more than 10 custom cravings');
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
      customEmotions: currentState.customEmotions,
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    await get().syncToCloud();
  },

  setCustomEmotions: async (emotions: string[]) => {
    if (emotions.length > 10) {
      console.warn('Cannot set more than 10 custom emotions');
      return;
    }

    set({ customEmotions: emotions });

    // Persist to AsyncStorage and sync to cloud
    const currentState = get();
    const dataToSave = {
      willpowerPoints: currentState.willpowerPoints,
      logs: currentState.logs,
      plannedJoys: currentState.plannedJoys,
      customCravings: currentState.customCravings,
      customEmotions: currentState.customEmotions,
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
          customEmotions: cloudData.customEmotions || [],
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
            customEmotions: parsed.customEmotions || [],
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
        customEmotions: currentState.customEmotions,
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

  getTreeLevel: () => {
    const points = get().willpowerPoints;
    if (points < 100) return { level: 1, name: 'Aware', emoji: '🌱', min: 0, max: 100 };
    if (points < 300) return { level: 2, name: 'Steady', emoji: '🌿', min: 100, max: 300 };
    if (points < 600) return { level: 3, name: 'Grounded', emoji: '🌳', min: 300, max: 600 };
    if (points < 1000) return { level: 4, name: 'Resilient', emoji: '🌲', min: 600, max: 1000 };
    return { level: 5, name: 'Unshakeable', emoji: '🌲✨', min: 1000, max: null };
  },

  getCurrentStreak: () => {
    const logs = get().logs;
    if (logs.length === 0) return 0;

    // Sort logs by date (newest first)
    const sortedLogs = [...logs].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Check each day backwards
    for (let i = 0; i < 365; i++) { // Max 365 days
      const checkDate = new Date(currentDate);
      checkDate.setDate(checkDate.getDate() - i);

      const hasLogOnDate = sortedLogs.some(log => {
        const logDate = new Date(log.timestamp);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === checkDate.getTime();
      });

      if (hasLogOnDate) {
        streak++;
      } else if (i > 0) {
        // If we miss a day (and it's not today), break
        break;
      }
    }

    return streak;
  },

  getLongestStreak: () => {
    const logs = get().logs;
    if (logs.length === 0) return 0;

    // Group logs by date
    const dateMap = new Map<string, boolean>();
    logs.forEach(log => {
      const date = new Date(log.timestamp);
      date.setHours(0, 0, 0, 0);
      const dateKey = date.toISOString().split('T')[0];
      dateMap.set(dateKey, true);
    });

    const dates = Array.from(dateMap.keys()).sort();
    let longestStreak = 0;
    let currentStreak = 1;

    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }

    return Math.max(longestStreak, currentStreak);
  },

  getResistanceRate: () => {
    const logs = get().logs;
    if (logs.length === 0) return 0;

    const resistedCount = logs.filter(log => log.type === 'resisted').length;
    return Math.round((resistedCount / logs.length) * 100);
  },

  // Get logs for specific date ranges
  getLogsInDateRange: (startDate: Date, endDate: Date) => {
    const logs = get().logs;
    return logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= startDate && logDate <= endDate;
    });
  },

  getLogsForLastDays: (days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    return get().getLogsInDateRange(startDate, endDate);
  },

  // Get chart data grouped by date for the last N days
  getChartDataForPeriod: (days: number) => {
    const logs = get().getLogsForLastDays(days);
    const dateMap = new Map<string, { observed: number; resisted: number; total: number }>();

    // Initialize all dates with 0 counts
    const endDate = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(endDate.getDate() - i);
      const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dateMap.set(dateKey, { observed: 0, resisted: 0, total: 0 });
    }

    // Count logs for each date
    logs.forEach(log => {
      const logDate = new Date(log.timestamp);
      const dateKey = logDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const existing = dateMap.get(dateKey);
      if (existing) {
        if (log.type === 'observed') {
          existing.observed++;
        } else {
          existing.resisted++;
        }
        existing.total++;
      }
    });

    // Convert to array format for charts
    return Array.from(dateMap.entries()).map(([date, counts]) => ({
      date,
      observed: counts.observed,
      resisted: counts.resisted,
      total: counts.total,
    }));
  },

  // Get stats for past 7 days
  getPast7DaysStats: () => {
    const logs = get().getLogsForLastDays(7);
    const observed = logs.filter(log => log.type === 'observed').length;
    const resisted = logs.filter(log => log.type === 'resisted').length;
    const total = logs.length;

    return {
      observed,
      resisted,
      total,
      observedPercent: total > 0 ? Math.round((observed / total) * 100) : 0,
      resistedPercent: total > 0 ? Math.round((resisted / total) * 100) : 0,
    };
  },
}));
