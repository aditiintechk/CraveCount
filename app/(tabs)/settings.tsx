import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Settings as SettingsIcon, Bell, Lock, User, LogOut, ChevronRight, Calendar, Cloud, CloudOff, RotateCcw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useState } from 'react';
import { useStore } from '../../store/useStore';

export default function Settings() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);
  const willpowerPoints = useStore((state) => state.willpowerPoints);
  const isSyncing = useStore((state) => state.isSyncing);
  const lastSyncedAt = useStore((state) => state.lastSyncedAt);

  const formatSyncTime = () => {
    if (!lastSyncedAt) return 'Not synced yet';
    const now = Date.now();
    const diff = now - lastSyncedAt;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 10) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return 'Synced';
  };

  const handleResetOnboarding = async () => {
    Alert.alert(
      'Reset Onboarding',
      'This will show the onboarding screens again. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('@crave_count_onboarding_complete');
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-16 pb-6">
          <View className="flex-row items-center">
            <SettingsIcon size={32} color="#0f172a" strokeWidth={2} />
            <View className="ml-4">
              <Text className="text-4xl font-bold text-slate-900 tracking-tight">
                Settings
              </Text>
              <Text className="text-base text-slate-500 mt-1">
                Customize your experience.
              </Text>
            </View>
          </View>
        </View>

        {/* Profile Card */}
        <View

          className="mx-6 mb-6"
        >
          <View
            className="bg-white rounded-4xl p-6 border border-slate-100"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 2,
            }}
          >
            <View className="flex-row items-center">
              <View className="w-16 h-16 bg-slate-900 rounded-full items-center justify-center">
                <User size={28} color="#fff" strokeWidth={2} />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-slate-900 text-xl font-bold">
                  Your Journey
                </Text>
                <Text className="text-slate-500 text-sm mt-0.5">
                  {willpowerPoints} Willpower Points
                </Text>
                <View className="flex-row items-center mt-1">
                  {isSyncing ? (
                    <Cloud size={12} color="#10b981" />
                  ) : (
                    <Cloud size={12} color="#10b981" />
                  )}
                  <Text className="text-emerald-600 text-xs ml-1">
                    {isSyncing ? 'Syncing...' : formatSyncTime()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Settings Sections */}
        <View className="px-6 gap-6">
          {/* Notifications */}
          <View >
            <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Preferences
            </Text>
            <View className="bg-white rounded-3xl overflow-hidden border border-slate-100">
              <View className="flex-row items-center justify-between px-5 py-4 border-b border-slate-100">
                <View className="flex-row items-center flex-1">
                  <Bell size={20} color="#0f172a" />
                  <Text className="text-slate-900 text-base font-medium ml-3">
                    Notifications
                  </Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#e2e8f0', true: '#10b981' }}
                  thumbColor="#fff"
                />
              </View>

              <View className="flex-row items-center justify-between px-5 py-4">
                <View className="flex-row items-center flex-1">
                  <Lock size={20} color="#0f172a" />
                  <Text className="text-slate-900 text-base font-medium ml-3">
                    Privacy Mode
                  </Text>
                </View>
                <Switch
                  value={privacyMode}
                  onValueChange={setPrivacyMode}
                  trackColor={{ false: '#e2e8f0', true: '#10b981' }}
                  thumbColor="#fff"
                />
              </View>
            </View>
          </View>

          {/* Planned Joys */}
          <View >
            <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Rewards
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/planned-joys')}
              className="bg-white rounded-3xl px-5 py-4 border border-slate-100 flex-row items-center justify-between"
            >
              <View className="flex-row items-center flex-1">
                <Calendar size={20} color="#6366f1" />
                <Text className="text-slate-900 text-base font-medium ml-3">
                  Planned Joys
                </Text>
              </View>
              <ChevronRight size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>


          {/* Developer Options */}
          <View className="mx-6 mb-6">
            <Text className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3 px-1">
              Developer
            </Text>
            <TouchableOpacity
              onPress={handleResetOnboarding}
              activeOpacity={0.7}
              className="bg-white rounded-2xl px-5 py-4 border border-slate-100"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
                elevation: 1,
              }}
            >
              <View className="flex-row items-center">
                <RotateCcw size={20} color="#64748b" />
                <Text className="text-slate-900 text-base font-medium ml-3">
                  Reset Onboarding
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* App Info */}
          <View >
            <View className="items-center py-6">
              <Text className="text-slate-400 text-sm">
                Crave Count v1.0.0
              </Text>
              <Text className="text-slate-400 text-xs mt-1">
                Gently building resistance.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
