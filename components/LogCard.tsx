import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Log, useStore } from '../store/useStore';
import { Youtube, Instagram, Cookie, Smartphone, Globe, Trash2 } from 'lucide-react-native';
import { TikTokIcon } from './TikTokIcon';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'YouTube':
      return { Icon: Youtube, color: '#ef4444' };
    case 'Instagram':
      return { Icon: Instagram, color: '#ec4899' };
    case 'Sugar':
      return { Icon: Cookie, color: '#f59e0b' };
    case 'Junk Food':
      return { Icon: Cookie, color: '#f97316' };
    case 'TikTok':
      return { Icon: TikTokIcon, color: '#000' };
    default:
      return { Icon: Globe, color: '#6366f1' };
  }
};

const formatTime = (date: Date) => {
  try {
    // Validate and ensure we have a proper Date object
    const validDate = date instanceof Date ? date : new Date(date);
    if (isNaN(validDate.getTime())) {
      return 'Just now';
    }

    const now = new Date();
    const diffMs = now.getTime() - validDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';

    const month = validDate.toLocaleDateString('en-US', { month: 'short' });
    const day = validDate.getDate();
    const time = validDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return `${month} ${day} • ${time}`;
  } catch (error) {
    return 'Just now';
  }
};

const getEmotionEmoji = (emotion?: string) => {
  switch (emotion) {
    case 'Curious': return '🤔';
    case 'Restless': return '😤';
    case 'Stressed': return '😰';
    case 'Bored': return '😑';
    case 'Excited': return '✨';
    default: return null;
  }
};

export default function LogCard({ log }: { log: Log }) {
  const { Icon, color } = getCategoryIcon(log.category);
  const isResisted = log.type === 'resisted';
  const emotionEmoji = getEmotionEmoji(log.emotion);
  const deleteLog = useStore((state) => state.deleteLog);

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry? Your points will be adjusted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteLog(log.id),
        },
      ]
    );
  };

  return (
    <View
      className={`rounded-3xl p-5 border ${
        isResisted
          ? 'bg-emerald-50 border-emerald-100'
          : 'bg-white border-slate-100'
      }`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center flex-1">
          <View
            className="w-12 h-12 rounded-2xl items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon size={24} color={color} />
          </View>

          <View className="ml-4 flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-slate-900 text-base font-semibold">
                {log.category}
              </Text>
              {emotionEmoji && (
                <Text className="text-base">{emotionEmoji}</Text>
              )}
            </View>
            <Text className="text-slate-500 text-sm mt-0.5">
              {formatTime(log.timestamp)}
            </Text>
          </View>
        </View>

        <View
          className={`px-4 py-2 rounded-full ${
            isResisted ? 'bg-emerald-500' : 'bg-amber-100'
          }`}
        >
          <Text
            className={`text-xs font-bold uppercase tracking-wide ${
              isResisted ? 'text-white' : 'text-amber-700'
            }`}
          >
            {isResisted ? 'RESISTED' : 'OBSERVED'}
          </Text>
        </View>
      </View>

      <View className="ml-16 mt-1 flex-row items-center justify-between">
        <Text className={`text-xs font-semibold ${isResisted ? 'text-emerald-600' : 'text-amber-600'}`}>
          +{log.points} pts
        </Text>
        <TouchableOpacity
          onPress={handleDelete}
          className="p-2 rounded-full bg-slate-100"
          activeOpacity={0.7}
        >
          <Trash2 size={14} color="#64748b" />
        </TouchableOpacity>
      </View>

      {log.reflection && (
        <View className="ml-16 mt-3 bg-white/50 rounded-2xl p-3">
          <Text className="text-slate-600 text-sm leading-5">
            {log.reflection}
          </Text>
        </View>
      )}
    </View>
  );
}
