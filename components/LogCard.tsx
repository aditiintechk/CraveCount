import { View, Text, TouchableOpacity, Alert, Animated } from 'react-native';
import { Log, useStore } from '../store/useStore';
import { Youtube, Instagram, Cookie, Smartphone, Globe, Trash2, Edit3 } from 'lucide-react-native';
import { TikTokIcon } from './TikTokIcon';
import { Swipeable } from 'react-native-gesture-handler';
import { useRef } from 'react';

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

interface LogCardProps {
  log: Log;
  onEdit?: (log: Log) => void;
}

export default function LogCard({ log, onEdit }: LogCardProps) {
  const { Icon, color } = getCategoryIcon(log.category);
  const isResisted = log.type === 'resisted';
  const deleteLog = useStore((state) => state.deleteLog);
  const swipeableRef = useRef<Swipeable>(null);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(log);
      // Close the swipeable after opening edit modal
      swipeableRef.current?.close();
    }
  };

  const handleDelete = () => {
    // Close the swipeable first
    swipeableRef.current?.close();

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

  // Render right swipe actions (Edit and Delete buttons)
  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const trans = dragX.interpolate({
      inputRange: [-160, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View className="flex-row items-center justify-end" style={{ width: 160 }}>
        {onEdit && (
          <TouchableOpacity
            onPress={handleEdit}
            className="bg-indigo-500 h-full justify-center items-center px-6 ml-1"
            style={{
              borderTopLeftRadius: 12,
              borderBottomLeftRadius: 12,
            }}
            activeOpacity={0.7}
          >
            <Edit3 size={20} color="#ffffff" />
            <Text className="text-white text-xs font-semibold mt-1">Edit</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleDelete}
          className="bg-red-500 h-full justify-center items-center px-6 mr-2"
          style={{
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
          }}
          activeOpacity={0.7}
        >
          <Trash2 size={20} color="#ffffff" />
          <Text className="text-white text-xs font-semibold mt-1">Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
    >
      <View
        className={`rounded-xl p-5 border ${
          isResisted
            ? 'bg-emerald-50 border-emerald-100'
            : 'bg-white border-slate-100'
        }`}
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
              {log.emotion && (
                <Text className="text-sm text-slate-600">{log.emotion}</Text>
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

      <View className="ml-16 mt-1">
        <Text className={`text-xs font-semibold ${isResisted ? 'text-emerald-600' : 'text-amber-600'}`}>
          +{log.points} pts
        </Text>
      </View>

      {log.reflection && (
        <View className="ml-16 mt-3 bg-white/50 rounded-2xl p-3">
          <Text className="text-slate-600 text-sm leading-5">
            {log.reflection}
          </Text>
        </View>
      )}
      </View>
    </Swipeable>
  );
}
