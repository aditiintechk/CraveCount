import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Zap, Brain, CheckCircle, Youtube, Instagram, Cookie, Lightbulb, Target } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore, Category } from '../store/useStore';
import { PointsAnimation } from '../components/PointsAnimation';
import { CravingSelector } from '../components/CravingSelector';

const ONBOARDING_KEY = '@crave_count_onboarding_complete';

// Helper to render text with bold markdown (same as insights screen)
const renderTextWithBold = (text: string, className: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <Text className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const boldText = part.slice(2, -2);
          return (
            <Text key={index} className="font-bold">
              {boldText}
            </Text>
          );
        }
        return <Text key={index}>{part}</Text>;
      })}
    </Text>
  );
};

// Preview insights to show in onboarding
const PREVIEW_INSIGHTS = [
  {
    title: 'Emotional Trigger • Sugar',
    description: '75% of your **Sugar** cravings happen when you\'re **Stressed**.',
    actionable: 'Deep breathing for 2 minutes, take a walk, or text a friend.',
    type: 'Emotional Pattern',
  },
  {
    title: 'Time Pattern • Willpower',
    description: 'You resist **80%** in **morning** but only **20%** at **night**.',
    actionable: 'Schedule important tasks in the morning when willpower is strongest.',
    type: 'Time-Based',
  },
  {
    title: 'Substitution • Instagram → TikTok',
    description: '60% of the time you resist **Instagram**, you reach for **TikTok** within 2 hours.',
    actionable: 'Address the real need: connection, stimulation, or rest.',
    type: 'Habit Chain',
  },
  {
    title: 'Hidden Trigger • YouTube',
    description: 'You wrote **"tired"** in 40% of reflections, always followed by **YouTube** cravings.',
    actionable: 'Sleep more or take a real nap instead of reaching for quick fixes.',
    type: 'Root Cause',
  },
];

const QUICK_CATEGORIES: { name: Category; icon: any; color: string }[] = [
  { name: 'YouTube', icon: Youtube, color: '#ef4444' },
  { name: 'Instagram', icon: Instagram, color: '#ec4899' },
  { name: 'Sugar', icon: Cookie, color: '#f59e0b' },
];

export default function Onboarding() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [selectedCravings, setSelectedCravings] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedType, setSelectedType] = useState<'observed' | 'resisted' | null>(null);
  const [showPoints, setShowPoints] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const router = useRouter();
  const addLog = useStore((state) => state.addLog);
  const setCustomCravings = useStore((state) => state.setCustomCravings);

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

      // Show points animation
      const points = selectedType === 'resisted' ? 30 : 10;
      setEarnedPoints(points);
      setShowPoints(true);

      // Save custom cravings and go to success screen after a short delay
      setCustomCravings(selectedCravings);

      setTimeout(() => {
        setCurrentScreen(3);
      }, 1000);
    }
  };

  const handleSuccessContinue = () => {
    setCurrentScreen(4); // Go to insights preview screen
  };

  const isLastScreen = currentScreen === 4;

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
      // Screen 2: Pick Cravings
      return (
        <ScrollView className="flex-1 px-6 pt-12" showsVerticalScrollIndicator={false}>
          <View className="items-center mb-6">
            <Target size={48} color="#6366f1" />
          </View>
          <Text className="text-2xl font-bold text-slate-900 text-center mb-2">
            Choose Your Focus
          </Text>
          <Text className="text-sm text-slate-600 text-center mb-8">
            Select 3 cravings you want to track and understand
          </Text>

          <CravingSelector
            selectedCravings={selectedCravings}
            onSelect={setSelectedCravings}
            maxSelections={3}
          />
        </ScrollView>
      );
    }

    if (currentScreen === 2) {
      // Screen 3: Try It - Interactive
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

          {/* Category Selection - Use their custom cravings */}
          <Text className="text-sm font-semibold text-slate-700 mb-3">What did you crave?</Text>
          <View className="flex-row gap-3 mb-6">
            {selectedCravings.slice(0, 3).map((craving) => {
              const cat = QUICK_CATEGORIES.find(c => c.name === craving) || { name: craving, icon: Cookie, color: '#6366f1' };
              const Icon = cat.icon;
              const isSelected = selectedCategory === craving;
              return (
                <TouchableOpacity
                  key={craving}
                  onPress={() => setSelectedCategory(craving)}
                  className={`flex-1 rounded-2xl p-4 items-center border-2 ${
                    isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'
                  }`}
                  activeOpacity={0.7}
                >
                  <Icon size={28} color={cat.color} />
                  <Text className={`text-xs font-medium mt-2 ${isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>
                    {craving}
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

    if (currentScreen === 3) {
      // Screen 4: Success
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

    // Screen 5: Insights Preview
    return (
      <ScrollView className="flex-1 px-6 pt-12" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-6">
          <Lightbulb size={48} color="#6366f1" />
        </View>
        <Text className="text-2xl font-bold text-slate-900 text-center mb-2">
          Discover Your Patterns
        </Text>
        <Text className="text-sm text-slate-600 text-center mb-8">
          Track 15-25 moments to unlock powerful insights like these
        </Text>

        <View className="gap-4 mb-6">
          {PREVIEW_INSIGHTS.map((insight, index) => (
            <View
              key={index}
              className="bg-white rounded-3xl p-5 border border-slate-100"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 2,
              }}
            >
              {/* Type badge */}
              <View className="flex-row items-center mb-3">
                <View className="bg-indigo-50 rounded-full px-3 py-1">
                  <Text className="text-indigo-700 text-xs font-bold">
                    {insight.type}
                  </Text>
                </View>
              </View>

              {/* Title */}
              <Text className="text-slate-900 text-base font-bold mb-3">
                {insight.title}
              </Text>

              {/* Description with bold text */}
              <View className="mb-3">
                {renderTextWithBold(insight.description, "text-slate-600 text-sm leading-6")}
              </View>

              {/* Actionable tip */}
              <View className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
                <Text className="text-indigo-700 text-xs font-bold uppercase tracking-wider mb-1">
                  💡 What to do
                </Text>
                <Text className="text-slate-700 text-xs leading-5">
                  {insight.actionable}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className="bg-amber-50 rounded-2xl p-4 mb-6 border border-amber-200">
          <Text className="text-sm text-amber-900 text-center font-medium leading-5">
            Keep tracking to unlock real insights about YOUR patterns—not generic advice.
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
          {[0, 1, 2, 3, 4].map((index) => (
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

        {currentScreen === 1 && (
          <TouchableOpacity
            onPress={() => setCurrentScreen(2)}
            disabled={selectedCravings.length !== 3}
            className={`rounded-xl py-3 items-center ${
              selectedCravings.length === 3 ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
            activeOpacity={0.7}
          >
            <Text className="text-white font-bold text-sm">Continue</Text>
          </TouchableOpacity>
        )}

        {currentScreen === 3 && (
          <TouchableOpacity
            onPress={handleSuccessContinue}
            className="bg-indigo-600 rounded-xl py-3 items-center"
            activeOpacity={0.7}
          >
            <Text className="text-white font-bold text-sm">Continue</Text>
          </TouchableOpacity>
        )}

        {currentScreen === 4 && (
          <TouchableOpacity
            onPress={completeOnboarding}
            className="bg-indigo-600 rounded-xl py-3 items-center"
            activeOpacity={0.7}
          >
            <Text className="text-white font-bold text-sm">Get Started</Text>
          </TouchableOpacity>
        )}

        {/* Skip Button */}
        {currentScreen !== 4 && (
          <TouchableOpacity
            onPress={completeOnboarding}
            className="mt-3 py-2"
            activeOpacity={0.7}
          >
            <Text className="text-slate-500 text-center text-xs">Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Points Animation */}
      <PointsAnimation
        points={earnedPoints}
        visible={showPoints}
        onComplete={() => setShowPoints(false)}
      />
    </View>
  );
}
