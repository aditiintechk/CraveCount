import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	TextInput,
	Alert,
	KeyboardAvoidingView,
	Platform,
} from 'react-native'
import { useState, useRef } from 'react'

interface EmotionSelectorProps {
	selectedEmotions: string[]
	onSelect: (emotions: string[]) => void
	maxSelections?: number
}

const PRESET_EMOTIONS = [
	'Stressed 😰',
	'Anxious 😟',
	'Bored 😑',
	'Tired 😴',
	'Frustrated 😤',
	'Lonely 😔',
	'Restless 😬',
	'Overwhelmed 😵',
	'Sad 😢',
	'Angry 😠',
]

export function EmotionSelector({
	selectedEmotions,
	onSelect,
	maxSelections = 10,
}: EmotionSelectorProps) {
	const [customInput, setCustomInput] = useState('')
	const [showCustomInput, setShowCustomInput] = useState(false)
	const scrollViewRef = useRef<ScrollView>(null)

	const handleToggle = (emotion: string) => {
		if (selectedEmotions.includes(emotion)) {
			// Deselect
			onSelect(selectedEmotions.filter((e) => e !== emotion))
		} else {
			// Select (only if under max)
			if (selectedEmotions.length < maxSelections) {
				onSelect([...selectedEmotions, emotion])
			}
		}
	}

	const handleAddCustom = () => {
		const trimmed = customInput.trim()
		if (!trimmed) {
			Alert.alert('Error', 'Please enter an emotion')
			return
		}

		if (trimmed.length > 20) {
			Alert.alert('Error', 'Emotion must be 20 characters or less')
			return
		}

		if (selectedEmotions.length >= maxSelections) {
			Alert.alert(
				'Error',
				`You can only select ${maxSelections} emotions`,
			)
			return
		}

		// Add custom emotion (should include emoji)
		onSelect([...selectedEmotions, trimmed])
		setCustomInput('')
		setShowCustomInput(false)
	}

	// Combine preset emotions with custom ones
	const allEmotions = [...PRESET_EMOTIONS]

	// Add custom emotions that aren't in presets
	selectedEmotions.forEach((emotion) => {
		if (!PRESET_EMOTIONS.includes(emotion)) {
			allEmotions.push(emotion)
		}
	})

	const handleShowCustomInput = () => {
		setShowCustomInput(true)
		// Scroll to bottom after a short delay to ensure layout is updated
		setTimeout(() => {
			scrollViewRef.current?.scrollToEnd({ animated: true })
		}, 100)
	}

	return (
		<View style={{ flex: 1 }}>
			<Text className='text-sm font-semibold text-slate-700 mb-3'>
				Select up to {maxSelections} emotions ({selectedEmotions.length}{' '}
				selected)
			</Text>

			<ScrollView
				ref={scrollViewRef}
				style={{ maxHeight: 350 }}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps='handled'
				contentContainerStyle={{ paddingBottom: 20 }}
			>
				<View className='flex-row flex-wrap gap-2'>
					{allEmotions.map((emotion) => {
						const isSelected = selectedEmotions.includes(emotion)
						const isDisabled =
							!isSelected &&
							selectedEmotions.length >= maxSelections

						return (
							<TouchableOpacity
								key={emotion}
								onPress={() => handleToggle(emotion)}
								disabled={isDisabled}
								className={`rounded-2xl px-4 py-3 border-2 ${
									isSelected
										? 'border-indigo-500 bg-indigo-50'
										: isDisabled
											? 'border-slate-100 bg-slate-50'
											: 'border-slate-200 bg-white'
								}`}
								activeOpacity={0.7}
							>
								<Text
									className={`text-sm font-medium ${
										isSelected
											? 'text-indigo-700'
											: isDisabled
												? 'text-slate-400'
												: 'text-slate-700'
									}`}
								>
									{emotion}
								</Text>
							</TouchableOpacity>
						)
					})}

					{/* Add Custom Button */}
					{!showCustomInput && (
						<TouchableOpacity
							onPress={handleShowCustomInput}
							disabled={selectedEmotions.length >= maxSelections}
							className={`rounded-2xl px-4 py-3 border-2 border-dashed ${
								selectedEmotions.length >= maxSelections
									? 'border-slate-100 bg-slate-50'
									: 'border-indigo-300 bg-indigo-50'
							}`}
							activeOpacity={0.7}
						>
							<Text
								className={`text-sm font-medium ${
									selectedEmotions.length >= maxSelections
										? 'text-slate-400'
										: 'text-indigo-700'
								}`}
							>
								+ Add Custom
							</Text>
						</TouchableOpacity>
					)}
				</View>

				<View style={{ height: 10 }} />

				{/* Custom Input */}
				{showCustomInput && (
					<View className='mt-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100'>
						<Text className='text-sm font-semibold text-indigo-900 mb-3'>
							Add Your Custom Emotion
						</Text>
						<Text className='text-xs text-slate-600 mb-3'>
							Include an emoji!
						</Text>
						<TextInput
							value={customInput}
							onChangeText={setCustomInput}
							placeholder='Sad 😢'
							maxLength={20}
							className='bg-white rounded-xl px-4 py-3 text-slate-900 border border-indigo-200 mb-3'
							autoFocus
						/>
						<View className='flex-row gap-2'>
							<TouchableOpacity
								onPress={handleAddCustom}
								className='flex-1 bg-indigo-600 rounded-xl py-2 items-center'
								activeOpacity={0.7}
							>
								<Text className='text-white font-semibold text-sm'>
									Add
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									setShowCustomInput(false)
									setCustomInput('')
								}}
								className='flex-1 bg-slate-200 rounded-xl py-2 items-center'
								activeOpacity={0.7}
							>
								<Text className='text-slate-700 font-semibold text-sm'>
									Cancel
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}
			</ScrollView>
		</View>
	)
}
