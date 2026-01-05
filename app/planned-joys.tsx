import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Plus, Calendar, Sparkles, Trash2, Edit2 } from 'lucide-react-native';
import { useStore, PlannedJoy } from '../store/useStore';
import EventModal from '../components/EventModal';

export default function PlannedJoysScreen() {
  const router = useRouter();
  const plannedJoys = useStore((state) => state.plannedJoys);
  const deletePlannedJoy = useStore((state) => state.deletePlannedJoy);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingJoy, setEditingJoy] = useState<PlannedJoy | undefined>();

  const handleEdit = (joy: PlannedJoy) => {
    setEditingJoy(joy);
    setModalVisible(true);
  };

  const handleAddNew = () => {
    setEditingJoy(undefined);
    setModalVisible(true);
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      'Delete Planned Joy',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deletePlannedJoy(id),
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const joyDate = new Date(date);

    // Reset time to compare dates only
    const todayDateOnly = new Date(today);
    todayDateOnly.setHours(0, 0, 0, 0);
    const joyDateOnly = new Date(joyDate);
    joyDateOnly.setHours(0, 0, 0, 0);

    const diffTime = joyDateOnly.getTime() - todayDateOnly.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today! 🎉';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;

    return joyDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: joyDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const joyDate = new Date(date);
    joyDate.setHours(0, 0, 0, 0);
    return joyDate < today;
  };

  const upcomingJoys = plannedJoys.filter(joy => !isPast(joy.date));
  const pastJoys = plannedJoys.filter(joy => isPast(joy.date));

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      {/* Header */}
      <View className="bg-white border-b border-slate-200 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full bg-slate-100"
              activeOpacity={0.7}
            >
              <ChevronLeft size={24} color="#0f172a" strokeWidth={2.5} />
            </TouchableOpacity>
            <View className="flex-row items-center gap-2">
              <Sparkles size={24} color="#6366f1" strokeWidth={2} />
              <Text className="text-2xl font-bold text-slate-900">
                Planned Joys
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleAddNew}
            className="bg-indigo-500 rounded-full w-10 h-10 items-center justify-center"
            activeOpacity={0.8}
            style={{
              shadowColor: '#6366f1',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Plus size={20} color="white" strokeWidth={3} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Empty State */}
        {plannedJoys.length === 0 && (
          <View className="items-center justify-center py-12">
            <Sparkles size={64} color="#cbd5e1" strokeWidth={1.5} />
            <Text className="text-slate-500 text-lg font-semibold mt-4 mb-2">
              No Planned Joys Yet
            </Text>
            <Text className="text-slate-400 text-center px-8 mb-6 leading-5">
              Schedule moments to enjoy guilt-free. You deserve joy!
            </Text>
            <TouchableOpacity
              onPress={handleAddNew}
              className="bg-indigo-500 rounded-full px-6 py-3"
              activeOpacity={0.8}
              style={{
                shadowColor: '#6366f1',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Text className="text-white font-semibold">Plan Your First Joy</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Upcoming Joys */}
        {upcomingJoys.length > 0 && (
          <View className="mb-6">
            <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Upcoming
            </Text>
            {upcomingJoys.map((joy) => (
              <View
                key={joy.id}
                className="bg-white rounded-3xl p-4 mb-3"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1 mr-3">
                    <Text className="text-slate-900 font-bold text-lg mb-1">
                      {joy.title}
                    </Text>
                    {joy.description && (
                      <Text className="text-slate-600 text-sm leading-5 mb-2">
                        {joy.description}
                      </Text>
                    )}
                    <View className="flex-row items-center gap-2">
                      <Calendar size={14} color="#6366f1" strokeWidth={2} />
                      <Text className="text-indigo-600 font-semibold text-sm">
                        {formatDate(joy.date)} • {formatTime(joy.date)}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => handleEdit(joy)}
                      className="w-9 h-9 items-center justify-center rounded-full bg-slate-100"
                      activeOpacity={0.7}
                    >
                      <Edit2 size={16} color="#0f172a" strokeWidth={2} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(joy.id, joy.title)}
                      className="w-9 h-9 items-center justify-center rounded-full bg-red-50"
                      activeOpacity={0.7}
                    >
                      <Trash2 size={16} color="#ef4444" strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Past Joys */}
        {pastJoys.length > 0 && (
          <View className="mb-6">
            <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Past Joys
            </Text>
            {pastJoys.map((joy) => (
              <View
                key={joy.id}
                className="bg-slate-100 rounded-3xl p-4 mb-3 opacity-60"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.03,
                  shadowRadius: 4,
                  elevation: 1,
                }}
              >
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1 mr-3">
                    <Text className="text-slate-700 font-bold text-lg mb-1">
                      {joy.title}
                    </Text>
                    {joy.description && (
                      <Text className="text-slate-600 text-sm leading-5 mb-2">
                        {joy.description}
                      </Text>
                    )}
                    <View className="flex-row items-center gap-2">
                      <Calendar size={14} color="#64748b" strokeWidth={2} />
                      <Text className="text-slate-500 font-semibold text-sm">
                        {new Date(joy.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })} • {formatTime(joy.date)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(joy.id, joy.title)}
                    className="w-9 h-9 items-center justify-center rounded-full bg-slate-200"
                    activeOpacity={0.7}
                  >
                    <Trash2 size={16} color="#64748b" strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Event Modal */}
      <EventModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingJoy(undefined);
        }}
        editingJoy={editingJoy}
      />
    </SafeAreaView>
  );
}
