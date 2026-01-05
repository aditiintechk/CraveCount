import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Zap, Brain, CheckCircle, Youtube, Instagram, Cookie, Award, Lock } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore, Category } from '../store/useStore';

const ONBOARDING_KEY = '@crave_count_onboarding_complete';

// Preview badges to show in onboarding
const PREVIEW_BADGES = [
  {
    icon: '🌱',
    title: 'First Step',
    description: 'Log your first moment of awareness',
    color: 'emerald',
  },
  {
    icon: '🛡️',
    title: 'First Resistance',
    description: 'Choose differently for the first time',
    color: 'indigo',
  },
  {
    icon: '💪',
    title: 'Committed',
    description: 'Track 25 moments of awareness',
    color: 'amber',
  },
  {
    icon: '🎯',
    title: 'Pattern Master',
    description: 'Reach 50 total moments logged',
    color: 'rose',
  },
];

const QUICK_CATEGORIES: { name: Category; icon: any; color: string }[] = [
  { name: 'YouTube', icon: Youtube, color: '#ef4444' },
  { name: 'Instagram', icon: Instagram, color: '#ec4899' },
  { name: 'Sugar', icon: Cookie, color: '#f59e0b' },
];

export default function Onboarding() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedType, setSelectedType] = useState<'observed' | 'resisted' | null>(null);
  const router = useRouter();
  const addLog = useStore((state) => state.addLog);

  useEffect(() => {
    // Check if onboarding is already complete
    async function checkOnboarding() {
      const complete = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (complete === 'true') {
        router.replace('/(tabs)');
      }
    }
    checkOnboarding();
  }, []);

  const completeOnboarding = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/(tabs)');
  };

  const handleLogCraving = () => {
    if (selectedCategory && selectedType) {
      addLog(selectedCategory, selectedType);
      setCurrentScreen(2); // Go to success screen
    }
  };

  const handleSuccessContinue = () => {
    setCurrentScreen(3); // Go to badge preview screen
  };

  const isLastScreen = currentScreen === 3;

  const renderScreen = () => {
    if (currentScreen === 0) {
      // Screen 1: Welcome
      return (
        <View className="flex-1 justify-center px-6">
          <View className="items-center mb-6">
            <Zap size={56} color="#6366f1" fill="#6366f1" />
          </View>
          <Text className="text-3xl font-bold text-slate-900 text-center mb-3">
            Welcome to Crave Count
          </Text>
          <Text className="text-base text-slate-600 text-center leading-relaxed">
            A gentle approach to building resistance against digital distractions and unhealthy habits.
          </Text>
        </View>
      );
    }

    if (currentScreen === 1) {
      // Screen 2: Try It - Interactive
      return (
        <ScrollView className="flex-1 px-6 pt-12" showsVerticalScrollIndicator={false}>
          <View className="items-center mb-6">
            <Brain size={48} color="#f59e0b" />
          </View>
          <Text className="text-2xl font-bold text-slate-900 text-center mb-2">
            Try It Out
          </Text>
          <Text className="text-sm text-slate-600 text-center mb-8">
            Log a craving right now to see how it works
          </Text>

          {/* Category Selection */}
          <Text className="text-sm font-semibold text-slate-700 mb-3">What did you crave?</Text>
          <View className="flex-row gap-3 mb-6">
            {QUICK_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.name;
              return (
                <TouchableOpacity
                  key={cat.name}
                  onPress={() => setSelectedCategory(cat.name)}
                  className={`flex-1 rounded-2xl p-4 items-center border-2 ${
                    isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'
                  }`}
                  activeOpacity={0.7}
                >
                  <Icon size={28} color={cat.color} />
                  <Text className={`text-xs font-medium mt-2 ${isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Type Selection */}
          <Text className="text-sm font-semibold text-slate-700 mb-3">What happened?</Text>
          <TouchableOpacity
            onPress={() => setSelectedType('observed')}
            className={`rounded-2xl p-4 mb-3 border-2 ${
              selectedType === 'observed' ? 'border-amber-500 bg-amber-50' : 'border-slate-200 bg-white'
            }`}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text className={`font-bold text-base ${selectedType === 'observed' ? 'text-amber-700' : 'text-slate-900'}`}>
                  I just noticed it
                </Text>
                <Text className="text-xs text-slate-600 mt-1">Observed • +10 pts</Text>
              </View>
              {selectedType === 'observed' && <CheckCircle size={24} color="#f59e0b" />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedType('resisted')}
            className={`rounded-2xl p-4 mb-6 border-2 ${
              selectedType === 'resisted' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white'
            }`}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text className={`font-bold text-base ${selectedType === 'resisted' ? 'text-emerald-700' : 'text-slate-900'}`}>
                  I resisted it!
                </Text>
                <Text className="text-xs text-slate-600 mt-1">Resisted • +30 pts</Text>
              </View>
              {selectedType === 'resisted' && <CheckCircle size={24} color="#10b981" />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogCraving}
            disabled={!selectedCategory || !selectedType}
            className={`rounded-xl py-3 items-center mb-6 ${
              selectedCategory && selectedType ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
            activeOpacity={0.7}
          >
            <Text className="text-white font-bold text-sm">
              Log This Craving
            </Text>
          </TouchableOpacity>
        </ScrollView>
      );
    }

    if (currentScreen === 2) {
      // Screen 3: Success
      return (
        <View className="flex-1 justify-center px-6">
          <View className="items-center mb-6">
            <CheckCircle size={56} color="#10b981" />
          </View>
          <Text className="text-3xl font-bold text-slate-900 text-center mb-3">
            Nice! You just logged your first craving
          </Text>
          <Text className="text-base text-slate-600 text-center leading-relaxed mb-4">
            Keep tracking to unlock badges, discover patterns, and build lasting habits.
          </Text>
          <Text className="text-sm text-slate-500 text-center">
            Both noticing AND resisting build awareness.{'\n'}You're growing stronger either way.
          </Text>
        </View>
      );
    }

    // Screen 4: Badge Preview
    return (
      <ScrollView className="flex-1 px-6 pt-12" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-6">
          <Award size={48} color="#6366f1" />
        </View>
        <Text className="text-2xl font-bold text-slate-900 text-center mb-2">
          Unlock Achievements
        </Text>
        <Text className="text-sm text-slate-600 text-center mb-8">
          Track your progress and earn badges as you grow
        </Text>

        <View className="gap-3 mb-6">
          {PREVIEW_BADGES.map((badge, index) => (
            <View
              key={index}
              className="bg-white rounded-3xl p-4 border-2 border-slate-200"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-full bg-slate-100 items-center justify-center">
                  <Text className="text-2xl">{badge.icon}</Text>
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-base font-bold text-slate-900 mb-1">
                    {badge.title}
                  </Text>
                  <Text className="text-xs text-slate-600">
                    {badge.description}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View className="bg-indigo-50 rounded-2xl p-4 mb-6 border border-indigo-200">
          <Text className="text-sm text-indigo-900 text-center font-medium">
            You've already earned your first badge! 🌱
          </Text>
        </View>
      </ScrollView>
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar style="dark" />

      {renderScreen()}

      {/* Bottom Section */}
      <View className="px-6 pb-8">
        {/* Pagination Dots */}
        <View className="flex-row justify-center mb-6 gap-2">
          {[0, 1, 2, 3].map((index) => (
            <View
              key={index}
              className={`h-1.5 rounded-full ${
                index === currentScreen ? 'bg-indigo-600 w-6' : 'bg-slate-300 w-1.5'
              }`}
            />
          ))}
        </View>

        {/* Buttons */}
        {currentScreen === 0 && (
          <TouchableOpacity
            onPress={() => setCurrentScreen(1)}
            className="bg-indigo-600 rounded-xl py-3 items-center"
            activeOpacity={0.7}
          >
            <Text className="text-white font-bold text-sm">Next</Text>
          </TouchableOpacity>
        )}

        {currentScreen === 2 && (
          <TouchableOpacity
            onPress={handleSuccessContinue}
            className="bg-indigo-600 rounded-xl py-3 items-center"
            activeOpacity={0.7}
          >
            <Text className="text-white font-bold text-sm">Continue</Text>
          </TouchableOpacity>
        )}

        {currentScreen === 3 && (
          <TouchableOpacity
            onPress={completeOnboarding}
            className="bg-indigo-600 rounded-xl py-3 items-center"
            activeOpacity={0.7}
          >
            <Text className="text-white font-bold text-sm">Get Started</Text>
          </TouchableOpacity>
        )}

        {/* Skip Button */}
        {currentScreen !== 3 && (
          <TouchableOpacity
            onPress={completeOnboarding}
            className="mt-3 py-2"
            activeOpacity={0.7}
          >
            <Text className="text-slate-500 text-center text-xs">Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
