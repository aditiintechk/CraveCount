import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native'
import {
	Brain,
	Shield,
	Flame,
	Trophy,
	TrendingUp,
	Target,
	Info,
	X,
} from 'lucide-react-native'
import { useStore } from '../store/useStore'
import { useEffect, useState } from 'react'
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
} from 'react-native-reanimated'

export default function StatsCard() {
	const {
		willpowerPoints,
		getTreeLevel,
		getAwarenessCount,
		getResistedCount,
		getCurrentStreak,
		getLongestStreak,
		getResistanceRate,
	} = useStore()
	const level = getTreeLevel()
	const logs = useStore((state) => state.logs)
	const awarenessToday = getAwarenessCount()
	const resistedToday = getResistedCount()
	const currentStreak = getCurrentStreak()
	const longestStreak = getLongestStreak()
	const resistanceRate = getResistanceRate()
	const [showLevelInfo, setShowLevelInfo] = useState(false)

	// Get next level name
	const getNextLevelName = () => {
		const levelNames = [
			'Aware',
			'Steady',
			'Grounded',
			'Resilient',
			'Unshakeable',
		]
		return levelNames[level.level] || 'Unshakeable'
	}

	// Calculate progress to next level
	const currentProgress = level.max ? willpowerPoints - level.min : 0
	const totalNeeded = level.max ? level.max - level.min : 1
	const progressPercentage = level.max
		? Math.min((currentProgress / totalNeeded) * 100, 100)
		: 100

	// Animated progress bar
	const progressWidth = useSharedValue(0)

	useEffect(() => {
		progressWidth.value = withSpring(progressPercentage, {
			damping: 15,
			stiffness: 90,
		})
	}, [progressPercentage])

	const animatedProgressStyle = useAnimatedStyle(() => ({
		width: `${progressWidth.value}%`,
	}))

	// Calculate category breakdown
	const getCategoryStats = () => {
		const categoryMap = new Map<
			string,
			{ observed: number; resisted: number }
		>()

		logs.forEach((log) => {
			const existing = categoryMap.get(log.category) || {
				observed: 0,
				resisted: 0,
			}
			if (log.type === 'observed') {
				existing.observed++
			} else {
				existing.resisted++
			}
			categoryMap.set(log.category, existing)
		})

		return Array.from(categoryMap.entries())
			.map(([category, stats]) => ({
				category,
				observed: stats.observed,
				resisted: stats.resisted,
				total: stats.observed + stats.resisted,
			}))
			.sort((a, b) => b.total - a.total)
	}

	const categoryStats = getCategoryStats()

	return (
		<View className='px-6 gap-6'>
			{/* Level Progress Card */}
			<View
				className='bg-white rounded-4xl p-8 border border-slate-200'
				style={{
					shadowColor: '#000',
					shadowOffset: { width: 0, height: 4 },
					shadowOpacity: 0.08,
					shadowRadius: 16,
					elevation: 8,
				}}
			>
				{/* Info Button */}
				<TouchableOpacity
					onPress={() => setShowLevelInfo(true)}
					className='absolute top-6 right-6 w-10 h-10 items-center justify-center rounded-full bg-slate-100'
					activeOpacity={0.7}
				>
					<Info size={20} color='#64748b' />
				</TouchableOpacity>

				{/* Level Display */}
				<View className='items-center mb-6'>
					<Text className='text-slate-900 text-3xl font-bold tracking-tight mb-2'>
						{level.name}
					</Text>
					<Text className='text-slate-600 text-base font-medium'>
						{willpowerPoints} Points
					</Text>
				</View>

				{/* Progress Bar */}
				{level.max && (
					<View className='mb-6'>
						<View className='flex-row items-center justify-between mb-2'>
							<Text className='text-slate-600 text-xs font-semibold uppercase tracking-wide'>
								Progress
							</Text>
							<Text className='text-slate-900 text-sm font-bold'>
								{currentProgress}/{totalNeeded}
							</Text>
						</View>
						<View className='h-3 bg-slate-100 rounded-full overflow-hidden'>
							<Animated.View
								className='h-full bg-indigo-500 rounded-full'
								style={animatedProgressStyle}
							/>
						</View>
						<Text className='text-slate-500 text-xs mt-2 text-center'>
							{level.max - willpowerPoints} more to reach{' '}
							{getNextLevelName()}
						</Text>
					</View>
				)}

				{/* Streaks & Stats Row */}
				<View className='flex-row gap-2 mb-4'>
					<View className='flex-1 bg-orange-50 rounded-2xl p-3 border border-orange-100'>
						<View className='flex-row items-center mb-1'>
							<Flame size={14} color='#f97316' fill='#f97316' />
							<Text className='text-orange-600 text-xs ml-1 font-semibold'>
								Streak
							</Text>
						</View>
						<Text className='text-slate-900 text-2xl font-bold'>
							{currentStreak}
						</Text>
						<Text className='text-slate-500 text-xs'>days</Text>
					</View>

					<View className='flex-1 bg-yellow-50 rounded-2xl p-3 border border-yellow-100'>
						<View className='flex-row items-center mb-1'>
							<Trophy size={14} color='#eab308' />
							<Text className='text-yellow-600 text-xs ml-1 font-semibold'>
								Best
							</Text>
						</View>
						<Text className='text-slate-900 text-2xl font-bold'>
							{longestStreak}
						</Text>
						<Text className='text-slate-500 text-xs'>days</Text>
					</View>

					<View className='flex-1 bg-blue-50 rounded-2xl p-3 border border-blue-100'>
						<View className='flex-row items-center mb-1'>
							<TrendingUp size={14} color='#3b82f6' />
							<Text className='text-blue-600 text-xs ml-1 font-semibold'>
								Rate
							</Text>
						</View>
						<Text className='text-slate-900 text-2xl font-bold'>
							{resistanceRate}%
						</Text>
						<Text className='text-slate-500 text-xs'>resist</Text>
					</View>
				</View>

				{/* Daily Stats */}
				<View className='flex-row gap-3'>
					<View className='flex-1 bg-amber-50 rounded-2xl p-4 border border-amber-100'>
						<View className='flex-row items-center mb-2'>
							<Brain size={16} color='#f59e0b' />
							<Text className='text-amber-600 text-xs ml-2 font-semibold uppercase tracking-wide'>
								Observed
							</Text>
						</View>
						<Text className='text-slate-900 text-3xl font-bold'>
							{awarenessToday}
						</Text>
					</View>

					<View className='flex-1 bg-emerald-50 rounded-2xl p-4 border border-emerald-100'>
						<View className='flex-row items-center mb-2'>
							<Shield size={16} color='#10b981' />
							<Text className='text-emerald-600 text-xs ml-2 font-semibold uppercase tracking-wide'>
								Resisted
							</Text>
						</View>
						<Text className='text-slate-900 text-3xl font-bold'>
							{resistedToday}
						</Text>
					</View>
				</View>
			</View>

			{/* Category Breakdown */}
			{categoryStats.length > 0 && (
				<View
					className='bg-white rounded-4xl p-8 mb-8 border border-slate-200'
					style={{
						shadowColor: '#000',
						shadowOffset: { width: 0, height: 4 },
						shadowOpacity: 0.08,
						shadowRadius: 16,
						elevation: 8,
					}}
				>
					<View className='flex-row items-center mb-6'>
						<Target size={20} color='#6366f1' />
						<Text className='text-slate-900 text-xl font-bold ml-2'>
							By Category
						</Text>
					</View>

					<View className='gap-4'>
						{categoryStats.map((stat) => (
							<View key={stat.category}>
								<View className='flex-row items-center justify-between mb-2'>
									<Text className='text-slate-900 font-semibold'>
										{stat.category}
									</Text>
									<Text className='text-slate-500 text-sm'>
										{stat.total} total
									</Text>
								</View>
								<View className='flex-row gap-2'>
									<View className='flex-1 bg-amber-50 rounded-xl p-3 border border-amber-100'>
										<Text className='text-amber-600 text-xs font-semibold mb-1'>
											Observed
										</Text>
										<Text className='text-slate-900 text-xl font-bold'>
											{stat.observed}
										</Text>
									</View>
									<View className='flex-1 bg-emerald-50 rounded-xl p-3 border border-emerald-100'>
										<Text className='text-emerald-600 text-xs font-semibold mb-1'>
											Resisted
										</Text>
										<Text className='text-slate-900 text-xl font-bold'>
											{stat.resisted}
										</Text>
									</View>
								</View>
							</View>
						))}
					</View>
				</View>
			)}

			{/* Level Info Modal */}
			<Modal
				visible={showLevelInfo}
				transparent
				animationType='slide'
				onRequestClose={() => setShowLevelInfo(false)}
			>
				<View className='flex-1 bg-black/40 justify-end'>
					<View
						className='bg-white rounded-t-4xl overflow-hidden'
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
							contentContainerStyle={{ paddingBottom: 20 }}
						>
							<View className='p-6'>
								{/* Header */}
								<View className='flex-row items-center justify-between mb-6'>
									<Text className='text-2xl font-bold text-slate-900'>
										Progression Levels
									</Text>
									<TouchableOpacity
										onPress={() => setShowLevelInfo(false)}
										className='w-10 h-10 items-center justify-center rounded-full bg-slate-100'
									>
										<X size={20} color='#0f172a' />
									</TouchableOpacity>
								</View>

								<Text className='text-slate-600 text-sm mb-6'>
									Track your journey through 5 levels of
									awareness and resistance. Each level
									represents your growing strength against
									cravings.
								</Text>

								{/* Level List */}
								<View className='gap-4'>
									{/* Level 1 - Aware */}
									<View className='bg-indigo-50 rounded-2xl p-5 border-2 border-indigo-200'>
										<View className='flex-row items-center justify-between mb-2'>
											<Text className='text-indigo-900 text-xl font-bold'>
												Level 1: Aware
											</Text>
											<Text className='text-indigo-600 text-sm font-semibold'>
												0-99 pts
											</Text>
										</View>
										<Text className='text-slate-700 text-sm leading-relaxed'>
											You're beginning to notice your
											cravings. Awareness is the first
											step to change.
										</Text>
									</View>

									{/* Level 2 - Steady */}
									<View className='bg-blue-50 rounded-2xl p-5 border-2 border-blue-200'>
										<View className='flex-row items-center justify-between mb-2'>
											<Text className='text-blue-900 text-xl font-bold'>
												Level 2: Steady
											</Text>
											<Text className='text-blue-600 text-sm font-semibold'>
												100-299 pts
											</Text>
										</View>
										<Text className='text-slate-700 text-sm leading-relaxed'>
											You're building consistency. Your
											tracking becomes a reliable habit.
										</Text>
									</View>

									{/* Level 3 - Grounded */}
									<View className='bg-green-50 rounded-2xl p-5 border-2 border-green-200'>
										<View className='flex-row items-center justify-between mb-2'>
											<Text className='text-green-900 text-xl font-bold'>
												Level 3: Grounded
											</Text>
											<Text className='text-green-600 text-sm font-semibold'>
												300-599 pts
											</Text>
										</View>
										<Text className='text-slate-700 text-sm leading-relaxed'>
											You're developing real strength.
											Resisting feels more natural now.
										</Text>
									</View>

									{/* Level 4 - Resilient */}
									<View className='bg-amber-50 rounded-2xl p-5 border-2 border-amber-200'>
										<View className='flex-row items-center justify-between mb-2'>
											<Text className='text-amber-900 text-xl font-bold'>
												Level 4: Resilient
											</Text>
											<Text className='text-amber-600 text-sm font-semibold'>
												600-999 pts
											</Text>
										</View>
										<Text className='text-slate-700 text-sm leading-relaxed'>
											You bounce back quickly from
											challenges. Your practice is deeply
											rooted.
										</Text>
									</View>

									{/* Level 5 - Unshakeable */}
									<View className='bg-purple-50 rounded-2xl p-5 border-2 border-purple-200'>
										<View className='flex-row items-center justify-between mb-2'>
											<Text className='text-purple-900 text-xl font-bold'>
												Level 5: Unshakeable
											</Text>
											<Text className='text-purple-600 text-sm font-semibold'>
												1000+ pts
											</Text>
										</View>
										<Text className='text-slate-700 text-sm leading-relaxed'>
											You've reached mastery. Cravings no
											longer control you—you control them.
										</Text>
									</View>
								</View>

								{/* Points Info */}
								<View className='mt-6 bg-slate-50 rounded-2xl p-4 mb-8 border border-slate-200'>
									<Text className='text-slate-900 font-semibold mb-2'>
										How to earn points:
									</Text>
									<View className='gap-2'>
										<View className='flex-row items-center'>
											<View className='w-2 h-2 rounded-full bg-amber-500 mr-3' />
											<Text className='text-slate-700 text-sm'>
												<Text className='font-semibold'>
													+10 points
												</Text>{' '}
												for observing a craving
											</Text>
										</View>
										<View className='flex-row items-center'>
											<View className='w-2 h-2 rounded-full bg-emerald-500 mr-3' />
											<Text className='text-slate-700 text-sm'>
												<Text className='font-semibold'>
													+30 points
												</Text>{' '}
												for resisting a craving
											</Text>
										</View>
									</View>
								</View>
							</View>
						</ScrollView>
					</View>
				</View>
			</Modal>
		</View>
	)
}
