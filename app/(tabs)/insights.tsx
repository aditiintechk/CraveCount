import { View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Lightbulb, Lock, Award } from 'lucide-react-native';
import { useStore } from '../../store/useStore';
import { checkBadgeUnlocks, generateInsights } from '../../utils/patterns';
import { useMemo } from 'react';

export default function Insights() {
  const logs = useStore((state) => state.logs);

  // Recalculate badges and insights whenever logs change
  const badges = useMemo(() => checkBadgeUnlocks(logs), [logs]);
  const insights = useMemo(() => generateInsights(logs), [logs]);

  const unlockedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);

  const beginnerBadges = badges.filter(b => b.category === 'beginner');
  const intermediateBadges = badges.filter(b => b.category === 'intermediate');
  const advancedBadges = badges.filter(b => b.category === 'advanced');

  const totalUnlocked = unlockedBadges.length;
  const totalBadges = badges.length;

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar style="dark" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-16 pb-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Lightbulb size={32} color="#0f172a" strokeWidth={2} />
              <View className="ml-4">
                <Text className="text-4xl font-bold text-slate-900 tracking-tight">
                  Insights
                </Text>
                <Text className="text-base text-slate-500 mt-1">
                  Patterns you've discovered.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Progress Summary */}
        <View className="px-6 mb-6">
          <View
            className="bg-white rounded-4xl p-6 border border-slate-200"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <View className="flex-row items-center mb-2">
                  <View className="w-10 h-10 rounded-full bg-indigo-50 items-center justify-center mr-3">
                    <Award size={20} color="#6366f1" />
                  </View>
                  <Text className="text-slate-600 text-sm font-semibold uppercase tracking-wide">
                    Progress
                  </Text>
                </View>
                <Text className="text-slate-900 text-5xl font-bold tracking-tight">
                  {totalUnlocked}/{totalBadges}
                </Text>
                <Text className="text-slate-500 text-sm mt-2">
                  badges unlocked
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Insights Section */}
        {insights.length > 0 && (
          <View className="px-6 mb-8">
            <Text className="text-xl font-bold text-slate-900 mb-4">
              Your Patterns
            </Text>
            <View className="gap-3">
              {insights.map((insight) => (
                <View
                  key={insight.id}
                  className="bg-white rounded-3xl p-5 border border-slate-100"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 10,
                    elevation: 2,
                  }}
                >
                  <Text className="text-slate-900 text-lg font-bold mb-2">
                    {insight.title}
                  </Text>
                  <Text className="text-slate-600 text-sm leading-5">
                    {insight.message}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Beginner Badges */}
        <View className="px-6 mb-8">
          <Text className="text-xl font-bold text-slate-900 mb-4">
            Beginner Badges
          </Text>
          <View className="gap-3">
            {beginnerBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </View>
        </View>

        {/* Intermediate Badges */}
        <View className="px-6 mb-8">
          <Text className="text-xl font-bold text-slate-900 mb-4">
            Intermediate Badges
          </Text>
          <View className="gap-3">
            {intermediateBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </View>
        </View>

        {/* Advanced Badges */}
        <View className="px-6 mb-8">
          <Text className="text-xl font-bold text-slate-900 mb-4">
            Advanced Badges
          </Text>
          <View className="gap-3">
            {advancedBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

interface BadgeCardProps {
  badge: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    progress?: number;
    total?: number;
  };
}

function BadgeCard({ badge }: BadgeCardProps) {
  const progressPercentage = badge.total
    ? Math.round((badge.progress! / badge.total) * 100)
    : 0;

  return (
    <View
      className={`rounded-3xl p-5 border ${
        badge.unlocked
          ? 'bg-white border-slate-100'
          : 'bg-slate-100 border-slate-200'
      }`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: badge.unlocked ? 0.05 : 0.02,
        shadowRadius: 10,
        elevation: badge.unlocked ? 2 : 1,
      }}
    >
      <View className="flex-row items-start">
        <View
          className={`w-14 h-14 rounded-full items-center justify-center ${
            badge.unlocked ? 'bg-indigo-50' : 'bg-slate-200'
          }`}
        >
          {badge.unlocked ? (
            <Text className="text-3xl">{badge.icon}</Text>
          ) : (
            <Lock size={20} color="#94a3b8" />
          )}
        </View>

        <View className="flex-1 ml-4">
          <View className="flex-row items-center justify-between mb-1">
            <Text
              className={`text-lg font-bold ${
                badge.unlocked ? 'text-slate-900' : 'text-slate-500'
              }`}
            >
              {badge.title}
            </Text>
            {badge.unlocked && (
              <View className="bg-emerald-100 px-3 py-1 rounded-full">
                <Text className="text-emerald-700 text-xs font-bold uppercase tracking-wide">
                  UNLOCKED
                </Text>
              </View>
            )}
          </View>

          <Text
            className={`text-sm mb-3 ${
              badge.unlocked ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            {badge.description}
          </Text>

          {/* Progress Bar */}
          {!badge.unlocked && badge.total && (
            <View>
              <View className="h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                <View
                  className="h-full bg-indigo-400 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </View>
              <Text className="text-slate-500 text-xs">
                {badge.progress} / {badge.total}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
