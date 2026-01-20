import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Switch,
	Alert,
	Modal,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import {
	Settings as SettingsIcon,
	Bell,
	User,
	LogOut,
	ChevronRight,
	Calendar,
	Cloud,
	CloudOff,
	Target,
	X,
	Smile,
} from 'lucide-react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useState } from 'react'
import { useStore, Category } from '../../store/useStore'
import { CravingSelector } from '../../components/CravingSelector'
import { EmotionSelector } from '../../components/EmotionSelector'

export default function Settings() {
	const router = useRouter()
	const [notificationsEnabled, setNotificationsEnabled] = useState(false)
	const [cravingsModalVisible, setCravingsModalVisible] = useState(false)
	const [emotionsModalVisible, setEmotionsModalVisible] = useState(false)
	const [tempSelectedCravings, setTempSelectedCravings] = useState<
		Category[]
	>([])
	const [tempSelectedEmotions, setTempSelectedEmotions] = useState<string[]>(
		[],
	)
	const [keyboardHeight, setKeyboardHeight] = useState(0)

	const willpowerPoints = useStore((state) => state.willpowerPoints)
	const isSyncing = useStore((state) => state.isSyncing)
	const lastSyncedAt = useStore((state) => state.lastSyncedAt)
	const customCravings = useStore((state) => state.customCravings)
	const setCustomCravings = useStore((state) => state.setCustomCravings)
	const customEmotions = useStore((state) => state.customEmotions)
	const setCustomEmotions = useStore((state) => state.setCustomEmotions)

	const formatSyncTime = () => {
		if (!lastSyncedAt) return 'Not synced yet'
		const now = Date.now()
		const diff = now - lastSyncedAt
		const seconds = Math.floor(diff / 1000)
		const minutes = Math.floor(seconds / 60)
		const hours = Math.floor(minutes / 60)

		if (seconds < 10) return 'Just now'
		if (seconds < 60) return `${seconds}s ago`
		if (minutes < 60) return `${minutes}m ago`
		if (hours < 24) return `${hours}h ago`
		return 'Synced'
	}

	const handleOpenCravingsModal = () => {
		setTempSelectedCravings(customCravings)
		setCravingsModalVisible(true)
	}

	const handleSaveCravings = async () => {
		if (
			tempSelectedCravings.length >= 1 &&
			tempSelectedCravings.length <= 10
		) {
			await setCustomCravings(tempSelectedCravings)
			setCravingsModalVisible(false)
			Alert.alert('Success', 'Your cravings have been updated!')
		} else {
			Alert.alert('Error', 'Please select between 1-10 cravings')
		}
	}

	const handleOpenEmotionsModal = () => {
		setTempSelectedEmotions(customEmotions)
		setEmotionsModalVisible(true)
	}

	const handleSaveEmotions = async () => {
		if (
			tempSelectedEmotions.length >= 1 &&
			tempSelectedEmotions.length <= 10
		) {
			await setCustomEmotions(tempSelectedEmotions)
			setEmotionsModalVisible(false)
			Alert.alert('Success', 'Your emotions have been updated!')
		} else {
			Alert.alert('Error', 'Please select between 1-10 emotions')
		}
	}

	// Track keyboard height
	useState(() => {
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
	})

	return (
		<View className='flex-1 bg-white'>
			<StatusBar style='dark' />

			<ScrollView
				className='flex-1'
				contentContainerStyle={{ paddingBottom: 120 }}
				showsVerticalScrollIndicator={false}
			>
				{/* Header */}
				<View className='px-6 pt-16 pb-6'>
					<View className='flex-row items-center'>
						<SettingsIcon
							size={32}
							color='#0f172a'
							strokeWidth={2}
						/>
						<View className='ml-4'>
							<Text className='text-4xl font-bold text-slate-900 tracking-tight'>
								Settings
							</Text>
							<Text className='text-base text-slate-500 mt-1'>
								Customize your experience.
							</Text>
						</View>
					</View>
				</View>

				{/* Profile Card */}
				<View className='mx-6 mb-6'>
					<View
						className='bg-white rounded-4xl p-6 border border-slate-100'
						style={{
							shadowColor: '#000',
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.05,
							shadowRadius: 10,
							elevation: 2,
						}}
					>
						<View className='flex-row items-center'>
							<View className='w-16 h-16 bg-slate-900 rounded-full items-center justify-center'>
								<User size={28} color='#fff' strokeWidth={2} />
							</View>
							<View className='ml-4 flex-1'>
								<Text className='text-slate-900 text-xl font-bold'>
									Your Journey
								</Text>
								<Text className='text-slate-500 text-sm mt-0.5'>
									{willpowerPoints} Willpower Points
								</Text>
								<View className='flex-row items-center mt-1'>
									{isSyncing ? (
										<Cloud size={12} color='#10b981' />
									) : (
										<Cloud size={12} color='#10b981' />
									)}
									<Text className='text-emerald-600 text-xs ml-1'>
										{isSyncing
											? 'Syncing...'
											: formatSyncTime()}
									</Text>
								</View>
							</View>
						</View>
					</View>
				</View>

				{/* Settings Sections */}
				<View className='px-6 gap-6'>
					{/* Notifications */}
					<View>
						<Text className='text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3'>
							Preferences
						</Text>
						<View className='bg-white rounded-3xl overflow-hidden border border-slate-100'>
							<View className='flex-row items-center justify-between px-5 py-4'>
								<View className='flex-row items-center flex-1'>
									<Bell size={20} color='#0f172a' />
									<Text className='text-slate-900 text-base font-medium ml-3'>
										Notifications
									</Text>
								</View>
								<Switch
									value={notificationsEnabled}
									onValueChange={setNotificationsEnabled}
									trackColor={{
										false: '#e2e8f0',
										true: '#10b981',
									}}
									thumbColor='#fff'
								/>
							</View>
						</View>
					</View>

					{/* Tracking */}
					<View>
						<Text className='text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3'>
							Tracking
						</Text>
						<View className='bg-white rounded-3xl overflow-hidden border border-slate-100'>
							<TouchableOpacity
								activeOpacity={0.7}
								onPress={handleOpenCravingsModal}
								className='px-5 py-4 border-b border-slate-100 flex-row items-center justify-between'
							>
								<View className='flex-row items-center flex-1'>
									<Target size={20} color='#6366f1' />
									<View className='ml-3 flex-1'>
										<Text className='text-slate-900 text-base font-medium'>
											My Cravings
										</Text>
										<Text className='text-slate-500 text-xs mt-0.5'>
											{customCravings.length > 0
												? customCravings.join(', ')
												: 'Not set'}
										</Text>
									</View>
								</View>
								<ChevronRight size={20} color='#94a3b8' />
							</TouchableOpacity>

							<TouchableOpacity
								activeOpacity={0.7}
								onPress={handleOpenEmotionsModal}
								className='px-5 py-4 flex-row items-center justify-between'
							>
								<View className='flex-row items-center flex-1'>
									<Smile size={20} color='#ec4899' />
									<View className='ml-3 flex-1'>
										<Text className='text-slate-900 text-base font-medium'>
											My Emotions
										</Text>
										<Text className='text-slate-500 text-xs mt-0.5'>
											{customEmotions.length > 0
												? customEmotions.join(', ')
												: 'Not set'}
										</Text>
									</View>
								</View>
								<ChevronRight size={20} color='#94a3b8' />
							</TouchableOpacity>

							<TouchableOpacity
								activeOpacity={0.7}
								onPress={() => router.push('/planned-joys')}
								className='px-5 py-4 flex-row items-center justify-between'
							>
								<View className='flex-row items-center flex-1'>
									<Calendar size={20} color='#6366f1' />
									<Text className='text-slate-900 text-base font-medium ml-3'>
										Planned Joys
									</Text>
								</View>
								<ChevronRight size={20} color='#94a3b8' />
							</TouchableOpacity>
						</View>
					</View>

					{/* Developer Tools */}
					<View className='mb-6'>
						<Text className='text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-6'>
							Developer
						</Text>
						<TouchableOpacity
							onPress={async () => {
								await AsyncStorage.removeItem(
									'@crave_count_onboarding_complete',
								)
								router.replace('/onboarding')
							}}
							className='mx-6 bg-white rounded-2xl p-4 border border-slate-200'
							activeOpacity={0.7}
						>
							<Text className='text-slate-900 font-medium'>
								View Onboarding
							</Text>
							<Text className='text-slate-500 text-xs mt-1'>
								See the onboarding screens
							</Text>
						</TouchableOpacity>
					</View>

					{/* App Info */}
					<View>
						<View className='items-center py-6'>
							<Text className='text-slate-400 text-sm'>
								Crave Count v1.0.0
							</Text>
							<Text className='text-slate-400 text-xs mt-1'>
								Gently build resistance.
							</Text>
						</View>
					</View>
				</View>
			</ScrollView>

			{/* Cravings Modal */}
			<Modal
				visible={cravingsModalVisible}
				transparent
				animationType='slide'
				onRequestClose={() => setCravingsModalVisible(false)}
			>
				<View
					className='flex-1 bg-black/40'
					style={{ paddingBottom: keyboardHeight }}
				>
					<View style={{ flex: 1 }} />
					<View
						className='bg-white rounded-t-4xl p-6'
						style={{
							maxHeight: keyboardHeight > 0 ? '100%' : '85%',
							shadowColor: '#000',
							shadowOffset: { width: 0, height: -10 },
							shadowOpacity: 0.1,
							shadowRadius: 20,
							elevation: 20,
						}}
					>
						<View className='flex-row items-center justify-between mb-6'>
							<Text className='text-2xl font-bold text-slate-900'>
								Update Your Cravings
							</Text>
							<TouchableOpacity
								onPress={() => setCravingsModalVisible(false)}
								className='w-10 h-10 items-center justify-center rounded-full bg-slate-100'
							>
								<X size={20} color='#0f172a' />
							</TouchableOpacity>
						</View>

						<CravingSelector
							selectedCravings={tempSelectedCravings}
							onSelect={setTempSelectedCravings}
							maxSelections={10}
						/>

						<TouchableOpacity
							onPress={handleSaveCravings}
							disabled={
								tempSelectedCravings.length < 1 ||
								tempSelectedCravings.length > 10
							}
							className={`mt-6 rounded-xl py-4 mb-8 items-center ${
								tempSelectedCravings.length >= 1 &&
								tempSelectedCravings.length <= 10
									? 'bg-indigo-600'
									: 'bg-slate-300'
							}`}
							activeOpacity={0.7}
						>
							<Text className='text-white font-bold text-base'>
								Save Changes
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			{/* Emotions Modal */}
			<Modal
				visible={emotionsModalVisible}
				transparent
				animationType='slide'
				onRequestClose={() => setEmotionsModalVisible(false)}
			>
				<View
					className='flex-1 bg-black/40'
					style={{ paddingBottom: keyboardHeight }}
				>
					<View style={{ flex: 1 }} />
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
							contentContainerStyle={{ paddingBottom: 20 }}
						>
							<View className='p-6'>
								<View className='flex-row items-center justify-between mb-6'>
									<Text className='text-2xl font-bold text-slate-900'>
										Update Your Emotions
									</Text>
									<TouchableOpacity
										onPress={() =>
											setEmotionsModalVisible(false)
										}
										className='w-10 h-10 items-center justify-center rounded-full bg-slate-100'
									>
										<X size={20} color='#0f172a' />
									</TouchableOpacity>
								</View>

								<EmotionSelector
									selectedEmotions={tempSelectedEmotions}
									onSelect={setTempSelectedEmotions}
									maxSelections={10}
								/>

								<TouchableOpacity
									onPress={handleSaveEmotions}
									disabled={
										tempSelectedEmotions.length < 1 ||
										tempSelectedEmotions.length > 10
									}
									className={`mt-6 rounded-xl py-4 mb-8 items-center ${
										tempSelectedEmotions.length >= 1 &&
										tempSelectedEmotions.length <= 10
											? 'bg-indigo-600'
											: 'bg-slate-300'
									}`}
									activeOpacity={0.7}
								>
									<Text className='text-white font-bold text-base'>
										Save Changes
									</Text>
								</TouchableOpacity>
							</View>
						</ScrollView>
					</View>
				</View>
			</Modal>
		</View>
	)
}
