import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import { Category } from '../store/useStore';
import { Instagram, Youtube, Cookie, ShoppingBag, Gamepad2, Tv, Twitter, MessageCircle, Wine, Cigarette, Coffee, Plus } from 'lucide-react-native';

interface CravingSelectorProps {
  selectedCravings: Category[];
  onSelect: (cravings: Category[]) => void;
  maxSelections?: number;
}

const PRESET_CRAVINGS: { name: Category; icon: any; color: string }[] = [
  { name: 'Instagram', icon: Instagram, color: '#ec4899' },
  { name: 'TikTok', icon: MessageCircle, color: '#06b6d4' },
  { name: 'Twitter', icon: Twitter, color: '#3b82f6' },
  { name: 'Sugar', icon: Cookie, color: '#f59e0b' },
  { name: 'Junk Food', icon: Cookie, color: '#fb923c' },
  { name: 'Coffee', icon: Coffee, color: '#78350f' },
  { name: 'Alcohol', icon: Wine, color: '#7c2d12' },
  { name: 'Cigarettes', icon: Cigarette, color: '#57534e' },
  { name: 'Shopping', icon: ShoppingBag, color: '#be123c' },
];

export function CravingSelector({ selectedCravings, onSelect, maxSelections = 3 }: CravingSelectorProps) {
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleToggle = (craving: Category) => {
    if (selectedCravings.includes(craving)) {
      // Deselect
      onSelect(selectedCravings.filter(c => c !== craving));
    } else {
      // Select (only if under max)
      if (selectedCravings.length < maxSelections) {
        onSelect([...selectedCravings, craving]);
      }
    }
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed) {
      Alert.alert('Error', 'Please enter a craving name');
      return;
    }

    if (trimmed.length > 15) {
      Alert.alert('Error', 'Craving name must be 15 characters or less');
      return;
    }

    if (selectedCravings.length >= maxSelections) {
      Alert.alert('Error', `You can only select ${maxSelections} cravings`);
      return;
    }

    // Add as "Other" type but store the custom name
    const customCraving = trimmed as Category;
    onSelect([...selectedCravings, customCraving]);
    setCustomInput('');
    setShowCustomInput(false);
  };

  // Combine preset cravings with custom ones
  const allCravings = [...PRESET_CRAVINGS];

  // Add custom cravings that aren't in presets
  selectedCravings.forEach(craving => {
    if (!PRESET_CRAVINGS.find(p => p.name === craving)) {
      allCravings.push({ name: craving, icon: MessageCircle, color: '#6366f1' });
    }
  });

  return (
    <View>
      <Text className="text-sm font-semibold text-slate-700 mb-3">
        Pick {maxSelections} cravings you want to track ({selectedCravings.length}/{maxSelections})
      </Text>

      <ScrollView
        style={{ maxHeight: 500 }}
        showsVerticalScrollIndicator={true}
      >
        <View className="flex-row flex-wrap gap-3">
          {allCravings.map((craving) => {
            const Icon = craving.icon;
            const isSelected = selectedCravings.includes(craving.name);
            const isDisabled = !isSelected && selectedCravings.length >= maxSelections;

            return (
              <TouchableOpacity
                key={craving.name}
                onPress={() => handleToggle(craving.name)}
                disabled={isDisabled}
                className={`rounded-2xl p-4 items-center border-2 ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50'
                    : isDisabled
                    ? 'border-slate-100 bg-slate-50'
                    : 'border-slate-200 bg-white'
                }`}
                style={{ width: '30%' }}
                activeOpacity={0.7}
              >
                <Icon
                  size={28}
                  color={isDisabled ? '#cbd5e1' : craving.color}
                />
                <Text
                  className={`text-xs font-medium mt-2 text-center ${
                    isSelected
                      ? 'text-indigo-700'
                      : isDisabled
                      ? 'text-slate-400'
                      : 'text-slate-700'
                  }`}
                  numberOfLines={2}
                >
                  {craving.name}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Add Custom Button */}
          {!showCustomInput && (
            <TouchableOpacity
              onPress={() => setShowCustomInput(true)}
              disabled={selectedCravings.length >= maxSelections}
              className={`rounded-2xl p-4 items-center border-2 border-dashed ${
                selectedCravings.length >= maxSelections
                  ? 'border-slate-100 bg-slate-50'
                  : 'border-indigo-300 bg-indigo-50'
              }`}
              style={{ width: '30%' }}
              activeOpacity={0.7}
            >
              <Plus
                size={28}
                color={selectedCravings.length >= maxSelections ? '#cbd5e1' : '#6366f1'}
              />
              <Text
                className={`text-xs font-medium mt-2 text-center ${
                  selectedCravings.length >= maxSelections
                    ? 'text-slate-400'
                    : 'text-indigo-700'
                }`}
              >
                Add Custom
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Custom Input */}
        {showCustomInput && (
          <View className="mt-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
            <Text className="text-sm font-semibold text-indigo-900 mb-3">
              Add Your Custom Craving
            </Text>
            <TextInput
              value={customInput}
              onChangeText={setCustomInput}
              placeholder="e.g., Vaping, Snacking..."
              maxLength={15}
              className="bg-white rounded-xl px-4 py-3 text-slate-900 border border-indigo-200 mb-3"
              autoFocus
            />
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={handleAddCustom}
                className="flex-1 bg-indigo-600 rounded-xl py-2 items-center"
                activeOpacity={0.7}
              >
                <Text className="text-white font-semibold text-sm">Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowCustomInput(false);
                  setCustomInput('');
                }}
                className="flex-1 bg-slate-200 rounded-xl py-2 items-center"
                activeOpacity={0.7}
              >
                <Text className="text-slate-700 font-semibold text-sm">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
