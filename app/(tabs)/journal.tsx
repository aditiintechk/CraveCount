import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useStore, Category } from '../../store/useStore';
import { BookOpen } from 'lucide-react-native';

import LogCard from '../../components/LogCard';
import { useState } from 'react';

export default function Journal() {
  const logs = useStore((state) => state.logs);
  const customCravings = useStore((state) => state.customCravings);
  const [selectedFilter, setSelectedFilter] = useState<Category | 'All'>('All');

  const categories: (Category | 'All')[] = ['All', ...customCravings];

  const filteredLogs = selectedFilter === 'All'
    ? logs
    : logs.filter(log => log.category === selectedFilter);

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
            <BookOpen size={32} color="#0f172a" strokeWidth={2} />
            <View className="ml-4">
              <Text className="text-4xl font-bold text-slate-900 tracking-tight">
                Journal
              </Text>
              <Text className="text-base text-slate-500 mt-1">
                Your complete history.
              </Text>
            </View>
          </View>
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-6 mb-6"
          contentContainerStyle={{ gap: 8 }}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedFilter(category)}
              activeOpacity={0.7}
              className={`px-5 py-2.5 rounded-full ${
                selectedFilter === category
                  ? 'bg-slate-900'
                  : 'bg-white border border-slate-200'
              }`}
            >
              <Text
                className={`font-semibold text-sm ${
                  selectedFilter === category
                    ? 'text-white'
                    : 'text-slate-600'
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Logs List */}
        <View className="px-6">
          {filteredLogs.length === 0 ? (
            <View className="bg-white rounded-4xl p-12 items-center border border-slate-100">
              <BookOpen size={48} color="#cbd5e1" strokeWidth={1.5} />
              <Text className="text-slate-400 text-center text-sm mt-4">
                No logs found.{'\n'}Start tracking your journey!
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {filteredLogs.map((log, index) => (
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
