import { useState, useEffect } from 'react'
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
	Keyboard,
} from 'react-native'
import { X } from 'lucide-react-native'

import { useStore, Category, Emotion } from '../store/useStore'

interface LogModalProps {
	visible: boolean
	onClose: () => void
	onLogSuccess?: (points: number) => void
}

export default function LogModal({
	visible,
	onClose,
	onLogSuccess,
}: LogModalProps) {
	const customCravings = useStore((state) => state.customCravings)
	const customEmotions = useStore((state) => state.customEmotions)
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null,
	)
	const [selectedEmotion, setSelectedEmotion] = useState<Emotion | undefined>(
		undefined,
	)
	const [reflection, setReflection] = useState('')
	const [selectedType, setSelectedType] = useState<'observed' | 'resisted'>(
		'resisted',
	)
	const [keyboardHeight, setKeyboardHeight] = useState(0)

	const addLog = useStore((state) => state.addLog)

	// Set default category when modal opens or customCravings change
	useEffect(() => {
		if (visible && customCravings.length > 0 && !selectedCategory) {
			setSelectedCategory(customCravings[0])
		}
	}, [visible, customCravings, selectedCategory])

	// Track keyboard height
	useEffect(() => {
		const showSubscription = Keyboard.addListener(
			'keyboardDidShow',
			(e) => {
				setKeyboardHeight(e.endCoordinates.height)
			},
		)
		const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
			setKeyboardHeight(0)
		})

		return () => {
			showSubscription.remove()
			hideSubscription.remove()
		}
	}, [])

	const handleSubmit = (type: 'observed' | 'resisted') => {
		if (!selectedCategory) return

		addLog(selectedCategory, type, selectedEmotion, reflection)

		// Calculate points earned
		const points = type === 'resisted' ? 30 : 10

		// Trigger animation
		if (onLogSuccess) {
			onLogSuccess(points)
		}

		// Reset form
		setReflection('')
		setSelectedCategory(customCravings[0] || null)
		setSelectedEmotion(undefined)
		setSelectedType('resisted')

		// Close modal
		onClose()
	}

	return (
		<Modal
			visible={visible}
			transparent
			animationType='slide'
			onRequestClose={onClose}
		>
			<View className='flex-1 bg-black/40' style={{ paddingBottom: keyboardHeight }}>
				<View style={{ flex: 1 }}>
					<Pressable
						className='flex-1'
						onPress={onClose}
					/>
				</View>
				<View
					className='bg-white rounded-t-4xl overflow-hidden'
					style={{
						maxHeight: keyboardHeight > 0 ? '100%' : '85%',
						shadowColor: '#000',
						shadowOffset: { width: 0, height: -10 },
						shadowOpacity: 0.1,
						shadowRadius: 20,
						elevation: 20,
					}}
				>
					<ScrollView
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps='handled'
						scrollEnabled={true}
						nestedScrollEnabled={true}
					>
						{/* Header */}
						<View className='px-6 pt-6 pb-2'>
							<View className='flex-row items-center justify-between mb-2'>
								<Text className='text-2xl font-bold text-slate-900'>
									Check In
								</Text>
								<TouchableOpacity
									onPress={onClose}
									className='w-10 h-10 items-center justify-center rounded-full bg-slate-100'
									activeOpacity={0.7}
								>
									<X
										size={20}
										color='#0f172a'
										strokeWidth={2.5}
									/>
								</TouchableOpacity>
							</View>
						</View>

						{/* Category Selection */}
						<View className='px-6 pt-2'>
							<Text className='text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3'>
								WHAT ARE YOU CRAVING?
							</Text>
							<View className='flex-row flex-wrap gap-2'>
								{customCravings.map((category) => (
									<TouchableOpacity
										key={category}
										onPress={() =>
											setSelectedCategory(category)
										}
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
						{customEmotions.length > 0 && (
							<View className='px-6 pt-6'>
								<Text className='text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3'>
									HOW ARE YOU FEELING? (OPTIONAL)
								</Text>
								<View className='flex-row flex-wrap gap-2'>
									{customEmotions.map((emotion) => (
										<TouchableOpacity
											key={emotion}
											onPress={() =>
												setSelectedEmotion(emotion)
											}
											activeOpacity={0.7}
											className={`px-4 py-3 rounded-full ${
												selectedEmotion === emotion
													? 'bg-indigo-50 border-2 border-indigo-500'
													: 'bg-slate-50 border border-slate-200'
											}`}
										>
											<Text
												className={`font-semibold ${
													selectedEmotion === emotion
														? 'text-indigo-600'
														: 'text-slate-600'
												}`}
											>
												{emotion}
											</Text>
										</TouchableOpacity>
									))}
								</View>
							</View>
						)}

						{/* Reflection Input */}
						<View className='px-6 pt-6'>
							<Text className='text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3'>
								WHAT DO YOU REALLY NEED? (OPTIONAL)
							</Text>
							<TextInput
								value={reflection}
								onChangeText={setReflection}
								placeholder='Rest? Connection? Fun? Let it out...'
								placeholderTextColor='#94a3b8'
								multiline
								numberOfLines={4}
								className='bg-slate-50 rounded-3xl p-5 text-slate-900 text-base border border-slate-200'
								style={{
									textAlignVertical: 'top',
									height: 120,
									fontFamily:
										Platform.OS === 'ios'
											? 'System'
											: 'sans-serif',
								}}
							/>
						</View>

						{/* Action Buttons */}
						<View className='px-6 pt-6 pb-20 flex-row gap-3'>
							<TouchableOpacity
								onPress={() => handleSubmit('observed')}
								activeOpacity={0.8}
								className='flex-1 bg-amber-50 rounded-xl p-4 border-2 border-amber-100'
							>
								<Text className='text-amber-700 font-bold text-center text-base mb-1'>
									I Just Noticed It.
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => handleSubmit('resisted')}
								activeOpacity={0.8}
								className='flex-1 bg-slate-900 rounded-xl p-4 border-2 border-gray-600'
								style={{
									shadowColor: '#0f172a',
									shadowOffset: { width: 0, height: 4 },
									shadowOpacity: 0.3,
									shadowRadius: 10,
									elevation: 8,
								}}
							>
								<Text className='text-white font-bold text-center text-base mb-1'>
									I Resisted it!
								</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</View>
			</View>
		</Modal>
	)
}
