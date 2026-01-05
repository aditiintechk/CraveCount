import { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Pressable,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { X } from 'lucide-react-native';

import { useStore, Category, Emotion } from '../store/useStore';

const categories: Category[] = ['Sugar', 'Junk Food', 'Instagram', 'TikTok', 'YouTube', 'Other'];

const emotions: { name: Emotion; emoji: string }[] = [
  { name: 'Curious', emoji: '🤔' },
  { name: 'Restless', emoji: '😤' },
  { name: 'Stressed', emoji: '😰' },
  { name: 'Bored', emoji: '😑' },
  { name: 'Excited', emoji: '✨' },
];

interface LogModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function LogModal({ visible, onClose }: LogModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Sugar');
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | undefined>(undefined);
  const [reflection, setReflection] = useState('');
  const [selectedType, setSelectedType] = useState<'observed' | 'resisted'>('resisted');

  const addLog = useStore((state) => state.addLog);

  const handleSubmit = (type: 'observed' | 'resisted') => {
    addLog(selectedCategory, type, selectedEmotion, reflection);
    setReflection('');
    setSelectedCategory('Sugar');
    setSelectedEmotion(undefined);
    setSelectedType('resisted');
    onClose();
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
          <Pressable
            className="flex-1"
            onPress={onClose}
          />
          <View
            className="bg-white rounded-t-4xl overflow-hidden"
            style={{
              maxHeight: '85%',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -10 },
              shadowOpacity: 0.1,
              shadowRadius: 20,
              elevation: 20,
            }}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Header */}
              <View className="px-6 pt-6 pb-2">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-2xl font-bold text-slate-900">
                    Check In
                  </Text>
                  <TouchableOpacity
                    onPress={onClose}
                    className="w-10 h-10 items-center justify-center rounded-full bg-slate-100"
                    activeOpacity={0.7}
                  >
                    <X size={20} color="#0f172a" strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
                <Text className="text-sm text-slate-500">
                  You're doing great by noticing 🌱
                </Text>
              </View>

              {/* Category Selection */}
              <View className="px-6 pt-4">
                <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  WHAT ARE YOU CRAVING?
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      onPress={() => setSelectedCategory(category)}
                      activeOpacity={0.7}
                      className={`px-5 py-3 rounded-full ${
                        selectedCategory === category
                          ? 'bg-slate-900'
                          : 'bg-slate-100'
                      }`}
                    >
                      <Text
                        className={`font-semibold ${
                          selectedCategory === category
                            ? 'text-white'
                            : 'text-slate-600'
                        }`}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Emotion Selection */}
              <View className="px-6 pt-6">
                <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  HOW ARE YOU FEELING? (OPTIONAL)
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {emotions.map((emotion) => (
                    <TouchableOpacity
                      key={emotion.name}
                      onPress={() => setSelectedEmotion(emotion.name)}
                      activeOpacity={0.7}
                      className={`px-4 py-3 rounded-full flex-row items-center gap-2 ${
                        selectedEmotion === emotion.name
                          ? 'bg-indigo-50 border-2 border-indigo-500'
                          : 'bg-slate-50 border border-slate-200'
                      }`}
                    >
                      <Text className="text-lg">{emotion.emoji}</Text>
                      <Text
                        className={`font-semibold ${
                          selectedEmotion === emotion.name
                            ? 'text-indigo-600'
                            : 'text-slate-600'
                        }`}
                      >
                        {emotion.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Reflection Input */}
              <View className="px-6 pt-6">
                <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  WHAT DO YOU REALLY NEED? (OPTIONAL)
                </Text>
                <TextInput
                  value={reflection}
                  onChangeText={setReflection}
                  placeholder="Rest? Connection? Fun? Let it out..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  numberOfLines={4}
                  className="bg-slate-50 rounded-3xl p-5 text-slate-900 text-base border border-slate-200"
                  style={{
                    textAlignVertical: 'top',
                    minHeight: 120,
                    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
                  }}
                />
              </View>

              {/* Action Buttons */}
              <View className="px-6 pt-6 pb-8 flex-row gap-3">
                <TouchableOpacity
                  onPress={() => handleSubmit('observed')}
                  activeOpacity={0.8}
                  className="flex-1 bg-amber-50 rounded-3xl p-5 border-2 border-amber-100"
                >
                  <Text className="text-amber-700 font-bold text-center text-base mb-1">
                    Just Noticed
                  </Text>
                  <Text className="text-amber-600 text-xs text-center font-semibold">
                    +10 PTS
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSubmit('resisted')}
                  activeOpacity={0.8}
                  className="flex-1 bg-slate-900 rounded-3xl p-5"
                  style={{
                    shadowColor: '#0f172a',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                    elevation: 8,
                  }}
                >
                  <Text className="text-white font-bold text-center text-base mb-1">
                    Chose Differently
                  </Text>
                  <Text className="text-emerald-400 text-xs text-center font-semibold">
                    +30 PTS
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
  }
