import { View, Text } from 'react-native';
import { Brain, Shield, Flame, Trophy, TrendingUp } from 'lucide-react-native';
import { useStore } from '../store/useStore';
import { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export default function TreeProgress() {
  const { willpowerPoints, getTreeLevel, getAwarenessCount, getResistedCount, getCurrentStreak, getLongestStreak, getResistanceRate } = useStore();
  const level = getTreeLevel();
  const awarenessToday = getAwarenessCount();
  const resistedToday = getResistedCount();
  const currentStreak = getCurrentStreak();
  const longestStreak = getLongestStreak();
  const resistanceRate = getResistanceRate();

  // Get next level name
  const getNextLevelName = () => {
    const levelNames = ['Aware', 'Steady', 'Grounded', 'Resilient', 'Unshakeable'];
    return levelNames[level.level] || 'Unshakeable';
  };

  // Calculate progress to next level
  const currentProgress = level.max
    ? willpowerPoints - level.min
    : 0;
  const totalNeeded = level.max
    ? level.max - level.min
    : 1;
  const progressPercentage = level.max
    ? Math.min((currentProgress / totalNeeded) * 100, 100)
    : 100;

  // Animated progress bar
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withSpring(progressPercentage, {
      damping: 15,
      stiffness: 90,
    });
  }, [progressPercentage]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <View className="mx-6 mb-6">
      <View
        className="bg-white rounded-4xl p-8 border border-slate-200"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        {/* Level Display */}
        <View className="items-center mb-6">
          <Text className="text-slate-900 text-3xl font-bold tracking-tight mb-2">
            {level.name}
          </Text>
          <Text className="text-slate-600 text-base font-medium">
            {willpowerPoints} Points
          </Text>
        </View>

        {/* Progress Bar */}
        {level.max && (
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-slate-600 text-xs font-semibold uppercase tracking-wide">
                Progress
              </Text>
              <Text className="text-slate-900 text-sm font-bold">
                {currentProgress}/{totalNeeded}
              </Text>
            </View>
            <View className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <Animated.View
                className="h-full bg-indigo-500 rounded-full"
                style={animatedProgressStyle}
              />
            </View>
            <Text className="text-slate-500 text-xs mt-2 text-center">
              {level.max - willpowerPoints} more to reach {getNextLevelName()}
            </Text>
          </View>
        )}

        {/* Streaks & Stats Row */}
        <View className="flex-row gap-2 mb-4">
          <View className="flex-1 bg-orange-50 rounded-2xl p-3 border border-orange-100">
            <View className="flex-row items-center mb-1">
              <Flame size={14} color="#f97316" fill="#f97316" />
              <Text className="text-orange-600 text-xs ml-1 font-semibold">
                Streak
              </Text>
            </View>
            <Text className="text-slate-900 text-2xl font-bold">
              {currentStreak}
            </Text>
            <Text className="text-slate-500 text-xs">
              days
            </Text>
          </View>

          <View className="flex-1 bg-yellow-50 rounded-2xl p-3 border border-yellow-100">
            <View className="flex-row items-center mb-1">
              <Trophy size={14} color="#eab308" />
              <Text className="text-yellow-600 text-xs ml-1 font-semibold">
                Best
              </Text>
            </View>
            <Text className="text-slate-900 text-2xl font-bold">
              {longestStreak}
            </Text>
            <Text className="text-slate-500 text-xs">
              days
            </Text>
          </View>

          <View className="flex-1 bg-blue-50 rounded-2xl p-3 border border-blue-100">
            <View className="flex-row items-center mb-1">
              <TrendingUp size={14} color="#3b82f6" />
              <Text className="text-blue-600 text-xs ml-1 font-semibold">
                Rate
              </Text>
            </View>
            <Text className="text-slate-900 text-2xl font-bold">
              {resistanceRate}%
            </Text>
            <Text className="text-slate-500 text-xs">
              resist
            </Text>
          </View>
        </View>

        {/* Daily Stats */}
        <View className="flex-row gap-3">
          <View className="flex-1 bg-amber-50 rounded-2xl p-4 border border-amber-100">
            <View className="flex-row items-center mb-2">
              <Brain size={16} color="#f59e0b" />
              <Text className="text-amber-600 text-xs ml-2 font-semibold uppercase tracking-wide">
                Observed
              </Text>
            </View>
            <Text className="text-slate-900 text-3xl font-bold">
              {awarenessToday}
            </Text>
          </View>

          <View className="flex-1 bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <View className="flex-row items-center mb-2">
              <Shield size={16} color="#10b981" />
              <Text className="text-emerald-600 text-xs ml-2 font-semibold uppercase tracking-wide">
                Resisted
              </Text>
            </View>
            <Text className="text-slate-900 text-3xl font-bold">
              {resistedToday}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
