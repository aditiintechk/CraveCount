import { View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TrendingUp } from 'lucide-react-native';
import StatsCard from '../../components/StatsCard';
import DualCircularProgress from '../../components/DualCircularProgress';
import WeeklyAreaChart from '../../components/WeeklyAreaChart';
import { useStore } from '../../store/useStore';

export default function Stats() {
  const { getPast7DaysStats } = useStore();

  const past7Days = getPast7DaysStats();

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
          <View className="flex-row items-center">
            <TrendingUp size={32} color="#0f172a" strokeWidth={2} />
            <View className="ml-4">
              <Text className="text-4xl font-bold text-slate-900 tracking-tight">
                Stats
              </Text>
              <Text className="text-base text-slate-500 mt-1">
                Your progress summary.
              </Text>
            </View>
          </View>
        </View>

        {/* Dual Circular Progress Ring */}
        <View className="items-center py-8">
          <DualCircularProgress
            size={220}
            outerStrokeWidth={16}
            innerStrokeWidth={14}
            outerProgress={past7Days.resistedPercent}
            innerProgress={past7Days.observedPercent}
            outerColor='#6366f1'
            innerColor='#f59e0b'
            backgroundColor='#e2e8f0'
            label='PAST 7 DAYS'
            outerValue={past7Days.resisted}
            innerValue={past7Days.observed}
            subtitle={`${past7Days.total} total`}
          />
        </View>

        {/* Weekly Area Chart */}
        <View className="mt-6 mb-6">
          <WeeklyAreaChart />
        </View>

        {/* Stats Content */}
        <StatsCard />
      </ScrollView>
    </View>
  );
}
