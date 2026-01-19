import { View, Text, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useStore } from '../../store/useStore';
import { Zap, Brain, Shield, Target } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LogCard from '../../components/LogCard';

export default function Dashboard() {
  const { willpowerPoints, logs, getAwarenessCount, getResistedCount } = useStore();

  const awarenessCount = getAwarenessCount();
  const resistedCount = getResistedCount();
  const totalCount = awarenessCount + resistedCount;
  const recentLogs = logs.slice(0, 5);

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
            <View>
              <Text className="text-4xl font-bold text-slate-900 tracking-tight">
                Crave Count
              </Text>
              <Text className="text-base text-slate-500 mt-1">
                Gently building resistance.
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="bg-indigo-50 rounded-full p-2.5">
                <Target size={20} color="#6366f1" />
              </View>
              <Text className="text-slate-900 text-lg font-bold">{totalCount}</Text>
            </View>
          </View>
        </View>

        {/* Willpower Points Card */}
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
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <View className="flex-row items-center mb-2">
                  <View className="w-10 h-10 rounded-full bg-indigo-50 items-center justify-center mr-3">
                    <Zap size={20} color="#6366f1" fill="#6366f1" />
                  </View>
                  <Text className="text-slate-600 text-sm font-semibold uppercase tracking-wide">
                    Willpower Points
                  </Text>
                </View>
                <Text className="text-slate-900 text-6xl font-bold tracking-tight">
                  {willpowerPoints}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="flex-row px-6 mb-8 gap-4">
          <View

            className="flex-1"
          >
            <View className="bg-amber-50 rounded-3xl p-5 border border-amber-100">
              <View className="flex-row items-center mb-3">
                <Brain size={18} color="#f59e0b" />
                <Text className="text-amber-600 text-xs ml-2 font-semibold uppercase tracking-wide">
                  Observed
                </Text>
              </View>
              <Text className="text-slate-900 text-4xl font-bold">
                {awarenessCount}
              </Text>
            </View>
          </View>

          <View
            
            className="flex-1"
          >
            <View className="bg-emerald-50 rounded-3xl p-5 border border-emerald-100">
              <View className="flex-row items-center mb-3">
                <Shield size={18} color="#10b981" />
                <Text className="text-emerald-600 text-xs ml-2 font-semibold uppercase tracking-wide">
                  Resisted
                </Text>
              </View>
              <Text className="text-slate-900 text-4xl font-bold">
                {resistedCount}
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Moments */}
        <View className="px-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-slate-900">
              Recent Moments
            </Text>
          </View>

          {recentLogs.length === 0 ? (
            <View className="bg-white rounded-3xl p-12 items-center border border-slate-100">
              <Text className="text-slate-400 text-center text-sm">
                No logs yet. Start gently.
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {recentLogs.map((log, index) => (
                <View
                  key={log.id}
                  
                >
                  <LogCard log={log} />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
