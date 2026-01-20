import { View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TrendingUp } from 'lucide-react-native';
import StatsCard from '../../components/StatsCard';

export default function Stats() {
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

        {/* Stats Content */}
        <StatsCard />
      </ScrollView>
    </View>
  );
}
