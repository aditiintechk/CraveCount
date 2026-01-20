import {
	View,
	Text,
	ScrollView,
	Platform,
	TouchableOpacity,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { useStore } from '../../store/useStore'
import { Target, History, TrendingUp, Sparkles } from 'lucide-react-native'
import StreakCard from '../../components/StreakCard'
import { useRouter } from 'expo-router'

export default function Dashboard() {
	const { getAwarenessCount, getResistedCount } = useStore()
	const router = useRouter()

	const awarenessCount = getAwarenessCount()
	const resistedCount = getResistedCount()
	const totalCount = awarenessCount + resistedCount

	return (
		<View className='flex-1 bg-slate-50'>
			<StatusBar style='dark' />

			<ScrollView
				className='flex-1'
				contentContainerStyle={{ paddingBottom: 120 }}
				showsVerticalScrollIndicator={false}
			>
				{/* Header */}
				<View className='px-6 pt-16 pb-6'>
					<View className='flex-row items-center justify-between'>
						<View>
							<Text className='text-4xl font-bold text-slate-900 tracking-tight'>
								Crave Count
							</Text>
							<Text className='text-base text-slate-500 mt-1'>
								Gently build resistance.
							</Text>
						</View>
						<View className='flex-row items-center gap-2'>
							<View className='bg-indigo-50 rounded-full p-2.5'>
								<Target size={20} color='#6366f1' />
							</View>
							<Text className='text-slate-900 text-lg font-bold'>
								{totalCount}
							</Text>
						</View>
					</View>
				</View>

				{/* Streak Card */}
				<StreakCard />

				{/* Quick Actions */}
				<View className='px-6 gap-3'>
					{/* View Logs Button */}
					<TouchableOpacity
						onPress={() => router.push('/journal')}
						activeOpacity={0.95}
						className='bg-white rounded-3xl p-6 border border-slate-200'
						style={{
							shadowColor: '#000',
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.05,
							shadowRadius: 10,
							elevation: 2,
						}}
					>
						<View className='flex-row items-center'>
							<View className='bg-indigo-50 rounded-2xl p-3'>
								<History
									size={24}
									color='#6366f1'
									strokeWidth={2}
								/>
							</View>
							<View className='ml-4 flex-1'>
								<Text className='text-slate-900 text-lg font-bold'>
									View Logs
								</Text>
								<Text className='text-slate-500 text-sm mt-0.5'>
									See your journey history
								</Text>
							</View>
						</View>
					</TouchableOpacity>

					{/* Check Stats Button */}
					<TouchableOpacity
						onPress={() => router.push('/insights')}
						activeOpacity={0.95}
						className='bg-white rounded-3xl p-6 border border-slate-200'
						style={{
							shadowColor: '#000',
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.05,
							shadowRadius: 10,
							elevation: 2,
						}}
					>
						<View className='flex-row items-center'>
							<View className='bg-emerald-50 rounded-2xl p-3'>
								<TrendingUp
									size={24}
									color='#10b981'
									strokeWidth={2}
								/>
							</View>
							<View className='ml-4 flex-1'>
								<Text className='text-slate-900 text-lg font-bold'>
									Check Stats
								</Text>
								<Text className='text-slate-500 text-sm mt-0.5'>
									Review your progress
								</Text>
							</View>
						</View>
					</TouchableOpacity>

					{/* Plan Guilt-Free Joys Button */}
					<TouchableOpacity
						onPress={() => router.push('/planned-joys')}
						activeOpacity={0.95}
						className='bg-white rounded-3xl p-6 mb-8 border border-slate-200'
						style={{
							shadowColor: '#000',
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.05,
							shadowRadius: 10,
							elevation: 2,
						}}
					>
						<View className='flex-row items-center'>
							<View className='bg-amber-50 rounded-2xl p-3'>
								<Sparkles
									size={24}
									color='#f59e0b'
									strokeWidth={2}
								/>
							</View>
							<View className='ml-4 flex-1'>
								<Text className='text-slate-900 text-lg font-bold'>
									Plan Guilt-Free Joys
								</Text>
								<Text className='text-slate-500 text-sm mt-0.5'>
									Schedule mindful treats
								</Text>
							</View>
						</View>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	)
}
