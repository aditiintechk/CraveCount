import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { useStore, Category, Log } from '../../store/useStore'
import { BookOpen } from 'lucide-react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import LogCard from '../../components/LogCard'
import LogModal from '../../components/LogModal'
import { useState, useMemo } from 'react'

export default function Journal() {
	const logs = useStore((state) => state.logs)
	const customCravings = useStore((state) => state.customCravings)
	const [selectedFilter, setSelectedFilter] = useState<Category | 'All'>(
		'All',
	)
	const [editingLog, setEditingLog] = useState<Log | null>(null)
	const [showEditModal, setShowEditModal] = useState(false)

	const categories: (Category | 'All')[] = ['All', ...customCravings]

	const filteredLogs =
		selectedFilter === 'All'
			? logs
			: logs.filter((log) => log.category === selectedFilter)

	// Group logs by date
	const groupedLogs = useMemo(() => {
		const groups: { [key: string]: typeof filteredLogs } = {}

		filteredLogs.forEach((log) => {
			const date = new Date(log.timestamp)
			const dateKey = date.toDateString()

			if (!groups[dateKey]) {
				groups[dateKey] = []
			}
			groups[dateKey].push(log)
		})

		// Sort logs within each date group by time (most recent first)
		Object.keys(groups).forEach((dateKey) => {
			groups[dateKey].sort((a, b) =>
				new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
			)
		})

		// Sort groups by date (most recent first)
		const sortedGroups = Object.entries(groups).sort(
			([dateA], [dateB]) =>
				new Date(dateB).getTime() - new Date(dateA).getTime()
		)

		return sortedGroups
	}, [filteredLogs])

	const formatDateHeader = (dateStr: string) => {
		const date = new Date(dateStr)
		const today = new Date()

		if (date.toDateString() === today.toDateString()) {
			return 'Today'
		} else {
			return date.toLocaleDateString('en-US', {
				weekday: 'long',
				month: 'long',
				day: 'numeric',
			})
		}
	}

	const handleEditLog = (log: Log) => {
		setEditingLog(log)
		setShowEditModal(true)
	}

	const handleCloseEditModal = () => {
		setShowEditModal(false)
		setEditingLog(null)
	}

	return (
		<GestureHandlerRootView className='flex-1'>
			<View className='flex-1 bg-slate-50'>
				<StatusBar style='dark' />

				<ScrollView
					className='flex-1'
					contentContainerStyle={{ paddingBottom: 120 }}
					showsVerticalScrollIndicator={false}
				>
				{/* Header */}
				<View className='px-6 pt-16 pb-6'>
					<View className='flex-row items-center'>
						<BookOpen size={32} color='#0f172a' strokeWidth={2} />
						<View className='ml-4'>
							<Text className='text-4xl font-bold text-slate-900 tracking-tight'>
								Log History
							</Text>
						</View>
					</View>
				</View>

				{/* Filter Chips */}
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					className='px-6 mb-6'
					contentContainerStyle={{ gap: 8 }}
				>
					{categories.map((category) => (
						<TouchableOpacity
							key={category}
							onPress={() => setSelectedFilter(category)}
							activeOpacity={0.7}
							className={`px-5 py-2.5 rounded-full ${
								selectedFilter === category
									? 'bg-slate-900'
									: 'bg-white border border-slate-200'
							}`}
						>
							<Text
								className={`font-semibold text-sm ${
									selectedFilter === category
										? 'text-white'
										: 'text-slate-600'
								}`}
							>
								{category}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>

				{/* Logs List */}
				<View className='px-6'>
					{filteredLogs.length === 0 ? (
						<View className='bg-white rounded-4xl p-12 items-center border border-slate-100'>
							<BookOpen
								size={48}
								color='#cbd5e1'
								strokeWidth={1.5}
							/>
							<Text className='text-slate-400 text-center text-sm mt-4'>
								No logs found.{'\n'}Start tracking your journey!
							</Text>
						</View>
					) : (
						<View className='gap-6'>
							{groupedLogs.map(([dateKey, logsForDate]) => (
								<View key={dateKey}>
									{/* Date Header */}
									<View className='mb-3'>
										<Text className='text-sm font-bold text-slate-900 uppercase tracking-wider'>
											{formatDateHeader(dateKey)}
										</Text>
										<View className='h-0.5 bg-slate-200 mt-2' />
									</View>
									{/* Logs for this date */}
									<View className='gap-3'>
										{logsForDate.map((log) => (
											<LogCard
												key={log.id}
												log={log}
												onEdit={handleEditLog}
											/>
										))}
									</View>
								</View>
							))}
						</View>
					)}
				</View>
			</ScrollView>

				{/* Edit Modal */}
				<LogModal
					visible={showEditModal}
					onClose={handleCloseEditModal}
					editLog={editingLog}
				/>
			</View>
		</GestureHandlerRootView>
	)
}
