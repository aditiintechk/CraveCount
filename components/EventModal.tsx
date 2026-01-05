import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { X, Calendar, Sparkles, Clock } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useStore, PlannedJoy } from '../store/useStore';

interface EventModalProps {
  visible: boolean;
  onClose: () => void;
  editingJoy?: PlannedJoy;
}

export default function EventModal({ visible, onClose, editingJoy }: EventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const addPlannedJoy = useStore((state) => state.addPlannedJoy);
  const updatePlannedJoy = useStore((state) => state.updatePlannedJoy);

  // Set initial values when editing
  useEffect(() => {
    if (editingJoy) {
      setTitle(editingJoy.title);
      setDescription(editingJoy.description || '');
      setDate(new Date(editingJoy.date));
    } else {
      // Reset to defaults when creating new
      setTitle('');
      setDescription('');
      setDate(new Date());
    }
  }, [editingJoy, visible]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      return;
    }

    if (editingJoy) {
      await updatePlannedJoy(
        editingJoy.id,
        title.trim(),
        description.trim() || undefined,
        date
      );
    } else {
      await addPlannedJoy(title.trim(), description.trim() || undefined, date);
    }

    // Reset form
    setTitle('');
    setDescription('');
    setDate(new Date());
    onClose();
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      // Preserve the time when changing date
      const newDate = new Date(selectedDate);
      newDate.setHours(date.getHours(), date.getMinutes(), 0, 0);
      setDate(newDate);
    }
  };

  const handleTimeChange = (_event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      // Preserve the date when changing time
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
      setDate(newDate);
    }
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-end bg-black/40">
          <View
            className="bg-white rounded-t-4xl p-6"
            style={{
              maxHeight: '90%',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -10 },
              shadowOpacity: 0.1,
              shadowRadius: 20,
              elevation: 20,
            }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center gap-2">
                  <Sparkles size={24} color="#6366f1" strokeWidth={2} />
                  <Text className="text-2xl font-bold text-slate-900">
                    {editingJoy ? 'Edit Joy' : 'Plan a Joy'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  className="w-10 h-10 items-center justify-center rounded-full bg-slate-100"
                  activeOpacity={0.7}
                >
                  <X size={20} color="#0f172a" strokeWidth={2.5} />
                </TouchableOpacity>
              </View>

              {/* Subtitle */}
              <Text className="text-slate-600 mb-6 leading-5">
                Schedule moments to enjoy guilt-free. You deserve it! 💛
              </Text>

              {/* Event Title */}
              <View className="mb-4">
                <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  What are you looking forward to?
                </Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Mom's birthday, Beach weekend, Movie night..."
                  placeholderTextColor="#94a3b8"
                  className="bg-slate-50 rounded-3xl p-4 text-slate-900 text-base border border-slate-200"
                  style={{
                    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
                  }}
                />
              </View>

              {/* Description (Optional) */}
              <View className="mb-4">
                <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Details (Optional)
                </Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Dinner at favorite restaurant, celebrate with cake..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  className="bg-slate-50 rounded-3xl p-4 text-slate-900 text-base border border-slate-200"
                  style={{
                    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
                    minHeight: 80,
                  }}
                />
              </View>

              {/* Date & Time Picker */}
              <View className="mb-6">
                <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  When?
                </Text>
                <View className="flex-row gap-3">
                  {/* Date */}
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.7}
                    className="flex-1 bg-slate-50 rounded-3xl p-4 border border-slate-200 flex-row items-center gap-3"
                  >
                    <Calendar size={20} color="#6366f1" strokeWidth={2} />
                    <Text className="text-slate-900 text-base flex-1">
                      {formatDate(date)}
                    </Text>
                  </TouchableOpacity>

                  {/* Time */}
                  <TouchableOpacity
                    onPress={() => setShowTimePicker(true)}
                    activeOpacity={0.7}
                    className="bg-slate-50 rounded-3xl p-4 border border-slate-200 flex-row items-center gap-2"
                  >
                    <Clock size={20} color="#6366f1" strokeWidth={2} />
                    <Text className="text-slate-900 text-base font-semibold">
                      {formatTime(date)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  value={date}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                  is24Hour={false}
                />
              )}

              {/* Info Box */}
              <View className="bg-indigo-50 rounded-2xl p-4 mb-6 border border-indigo-100">
                <Text className="text-indigo-900 text-sm leading-5">
                  ✨ You'll get a gentle reminder at {formatTime(date)} saying: "Today is your planned joy! Enjoy guilt-free, you deserve it."
                </Text>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                activeOpacity={0.8}
                className="bg-indigo-500 rounded-3xl p-5 mb-4"
                style={{
                  shadowColor: '#6366f1',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  elevation: 8,
                }}
              >
                <Text className="text-white font-bold text-center text-base">
                  {editingJoy ? 'Update Joy' : 'Add to Planned Joys'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
