import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import { useState } from 'react'
import { useStore } from '../store/useStore'
import { StackedAreaChart } from 'react-native-chart-kit'
import { TrendingUp, TrendingDown } from 'lucide-react-native'

type Period = '7' | '30' | '90'

const SCREEN_WIDTH = Dimensions.get('window').width

export default function TrendsChart() {
	const [selectedPeriod, setSelectedPeriod] = useState<Period>('7')
	const getChartDataForPeriod = useStore((state) => state.getChartDataForPeriod)

	const chartData = getChartDataForPeriod(Number(selectedPeriod))

	const periods: { label: string; value: Period }[] = [
		{ label: 'Week', value: '7' },
		{ label: 'Month', value: '30' },
		{ label: '3 Months', value: '90' },
	]

	// Calculate totals and trends
	const totalCravings = chartData.reduce((sum, day) => sum + day.total, 0)
	const totalObserved = chartData.reduce((sum, day) => sum + day.observed, 0)
	const totalResisted = chartData.reduce((sum, day) => sum + day.resisted, 0)
	const successRate = totalCravings > 0 ? Math.round((totalResisted / totalCravings) * 100) : 0

	// Calculate trend (comparing first half vs second half of period)
	const halfPoint = Math.floor(chartData.length / 2)
	const firstHalf = chartData.slice(0, halfPoint)
	const secondHalf = chartData.slice(halfPoint)

	const firstHalfTotal = firstHalf.reduce((sum, day) => sum + day.total, 0)
	const secondHalfTotal = secondHalf.reduce((sum, day) => sum + day.total, 0)
	const trend = firstHalfTotal > 0
		? Math.round(((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100)
		: 0

	// Prepare minimal labels
	const getLabels = () => {
		if (selectedPeriod === '7') {
			return chartData.map((d, i) => {
				// Show only first, middle, and last
				if (i === 0 || i === Math.floor(chartData.length / 2) || i === chartData.length - 1) {
					return d.date.split(' ')[1]
				}
				return ''
			})
		} else if (selectedPeriod === '30') {
			return chartData.map((d, i) => {
				// Show every 5th day
				return i % 5 === 0 ? d.date.split(' ')[1] : ''
			})
		} else {
			// 3 months - show every 15th day
			return chartData.map((d, i) => {
				return i % 15 === 0 ? d.date.split(' ')[0].substring(0, 1) : ''
			})
		}
	}

	const data = {
		labels: getLabels(),
		legend: ['Resisted', 'Observed'],
		data: chartData.map((d) => [d.resisted, d.observed]),
		barColors: ['#10b981', '#f59e0b'],
	}

	const chartConfig = {
		backgroundColor: '#ffffff',
		backgroundGradientFrom: '#ffffff',
		backgroundGradientTo: '#fafafa',
		decimalPlaces: 0,
		color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
		labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
		style: {
			borderRadius: 16,
		},
		propsForBackgroundLines: {
			strokeWidth: 1,
			stroke: '#f1f5f9',
			strokeDasharray: '0',
		},
		fillShadowGradient: '#ffffff',
		fillShadowGradientOpacity: 0,
	}

	return (
		<View className='gap-4'>
			{/* Period Selector */}
			<View className='flex-row gap-2 px-6'>
				{periods.map((period) => (
					<TouchableOpacity
						key={period.value}
						onPress={() => setSelectedPeriod(period.value)}
						activeOpacity={0.7}
						className={`flex-1 py-3 rounded-2xl ${
							selectedPeriod === period.value
								? 'bg-indigo-500'
								: 'bg-white border border-slate-200'
						}`}
						style={selectedPeriod === period.value ? {
							shadowColor: '#6366f1',
							shadowOffset: { width: 0, height: 4 },
							shadowOpacity: 0.3,
							shadowRadius: 8,
							elevation: 4,
						} : {}}
					>
						<Text
							className={`text-center font-bold text-sm ${
								selectedPeriod === period.value
									? 'text-white'
									: 'text-slate-600'
							}`}
						>
							{period.label}
						</Text>
					</TouchableOpacity>
				))}
			</View>

			{/* Main Chart Card */}
			<View
				className='bg-white rounded-3xl mx-6 overflow-hidden border border-slate-100'
				style={{
					shadowColor: '#000',
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.05,
					shadowRadius: 12,
					elevation: 3,
				}}
			>
				{totalCravings === 0 ? (
					<View className='py-20 items-center'>
						<Text className='text-slate-400 text-center text-base'>
							No cravings logged yet
						</Text>
						<Text className='text-slate-300 text-center text-sm mt-2'>
							Start tracking to see your trends
						</Text>
					</View>
				) : (
					<View>
						{/* Chart Header */}
						<View className='px-6 pt-6 pb-2'>
							<View className='flex-row items-center justify-between'>
								<View>
									<Text className='text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1'>
										Total Cravings
									</Text>
									<Text className='text-slate-900 text-4xl font-bold'>
										{totalCravings}
									</Text>
								</View>
								<View className={`px-4 py-2 rounded-full ${trend > 0 ? 'bg-red-50' : trend < 0 ? 'bg-emerald-50' : 'bg-slate-50'}`}>
									<View className='flex-row items-center gap-1'>
										{trend > 0 ? (
											<TrendingUp size={16} color='#ef4444' />
										) : trend < 0 ? (
											<TrendingDown size={16} color='#10b981' />
										) : null}
										<Text className={`text-sm font-bold ${trend > 0 ? 'text-red-600' : trend < 0 ? 'text-emerald-600' : 'text-slate-600'}`}>
											{trend > 0 ? '+' : ''}{trend}%
										</Text>
									</View>
								</View>
							</View>
						</View>

						{/* Chart */}
						<View className='mt-4'>
							<StackedAreaChart
								data={data}
								width={SCREEN_WIDTH - 48}
								height={220}
								chartConfig={chartConfig}
								style={{
									paddingRight: 0,
								}}
								withDots={false}
								withInnerLines={true}
								withOuterLines={false}
								withVerticalLines={false}
								withHorizontalLines={true}
								segments={4}
								bezier
								fillShadowGradientFromOpacity={0.6}
								fillShadowGradientToOpacity={0.3}
							/>
						</View>

						{/* Stats Row */}
						<View className='px-6 pb-6 pt-4 flex-row gap-3'>
							{/* Resisted Card */}
							<View className='flex-1 bg-emerald-50 rounded-2xl p-4 border border-emerald-100'>
								<View className='flex-row items-center justify-between mb-2'>
									<Text className='text-emerald-700 text-xs font-semibold uppercase tracking-wide'>
										Resisted
									</Text>
									<View className='w-2 h-2 rounded-full bg-emerald-500' />
								</View>
								<Text className='text-emerald-900 text-3xl font-bold mb-1'>
									{totalResisted}
								</Text>
								<Text className='text-emerald-600 text-xs font-medium'>
									{successRate}% success rate
								</Text>
							</View>

							{/* Observed Card */}
							<View className='flex-1 bg-amber-50 rounded-2xl p-4 border border-amber-100'>
								<View className='flex-row items-center justify-between mb-2'>
									<Text className='text-amber-700 text-xs font-semibold uppercase tracking-wide'>
										Observed
									</Text>
									<View className='w-2 h-2 rounded-full bg-amber-500' />
								</View>
								<Text className='text-amber-900 text-3xl font-bold mb-1'>
									{totalObserved}
								</Text>
								<Text className='text-amber-600 text-xs font-medium'>
									{totalCravings > 0 ? Math.round((totalObserved / totalCravings) * 100) : 0}% of total
								</Text>
							</View>
						</View>
					</View>
				)}
			</View>
		</View>
	)
}
