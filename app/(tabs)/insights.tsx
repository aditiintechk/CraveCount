import { View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Lightbulb } from 'lucide-react-native';
import { useStore } from '../../store/useStore';
import { generateInsights } from '../../utils/patterns';
import { useMemo } from 'react';

// Helper to render text with bold markdown
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

export default function Insights() {
  const logs = useStore((state) => state.logs);

  // Recalculate insights whenever logs change
  const insights = useMemo(() => generateInsights(logs), [logs]);

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


        {/* Insights Section */}
        {insights.length > 0 ? (
          <View className="px-6 mb-8">
            <Text className="text-xl font-bold text-slate-900 mb-6">
              Your Patterns
            </Text>
            <View className="gap-5">
              {insights.map((insight) => (
                <View
                  key={insight.id}
                  className="bg-white rounded-3xl p-7 border border-slate-100"
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
                        {insight.typeLabel}
                      </Text>
                    </View>
                  </View>

                  {/* Title */}
                  <Text className="text-slate-900 text-xl font-bold mb-4">
                    {insight.title}
                  </Text>

                  {/* Main insight text */}
                  <View className="mb-5">
                    {insight.message.split('\n').map((line, idx) => (
                      <View key={idx}>
                        {line.trim() ? renderTextWithBold(line, "text-slate-700 text-base leading-7") : <View style={{ height: 8 }} />}
                      </View>
                    ))}
                  </View>

                  {/* Actionable - visual callout */}
                  {insight.actionable && (
                    <View className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
                      <Text className="text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
                        💡 What to do
                      </Text>
                      <View>
                        {insight.actionable.split('\n').map((line, idx) => (
                          <View key={idx}>
                            {line.trim() ? renderTextWithBold(line, "text-slate-700 text-sm leading-7") : <View style={{ height: 8 }} />}
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View className="px-6 mb-8">
            <View className="bg-white rounded-3xl p-6 border border-slate-100">
              <Text className="text-slate-900 text-lg font-bold mb-2">
                Keep Tracking
              </Text>
              <Text className="text-slate-600 text-sm leading-5">
                Log at least 15-25 moments with emotions and reflections to unlock powerful insights about your patterns.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
