import { View, Text, Dimensions } from 'react-native'
import { useStore } from '../store/useStore'
import Svg, { Path, Defs, LinearGradient, Stop, Line, Text as SvgText } from 'react-native-svg'

const SCREEN_WIDTH = Dimensions.get('window').width
const CHART_WIDTH = SCREEN_WIDTH - 60
const CHART_HEIGHT = 180

export default function WeeklyAreaChart() {
	const getChartDataForPeriod = useStore((state) => state.getChartDataForPeriod)
	const chartData = getChartDataForPeriod(7)

	if (chartData.length === 0) {
		return (
			<View className='bg-white rounded-3xl p-6 mx-6 items-center justify-center' style={{ height: 200 }}>
				<Text className='text-slate-400 text-center'>
					No data for the past week
				</Text>
			</View>
		)
	}

	// Find max value for scaling
	const maxValue = Math.max(...chartData.map(d => d.total), 1)
	const padding = { top: 20, right: 10, bottom: 30, left: 30 }
	const graphWidth = CHART_WIDTH - padding.left - padding.right
	const graphHeight = CHART_HEIGHT - padding.top - padding.bottom

	// Calculate points for the area path
	const xStep = graphWidth / (chartData.length - 1)

	// Create smooth curve path
	const pathData = chartData.map((d, i) => {
		const x = padding.left + i * xStep
		const y = padding.top + graphHeight - (d.total / maxValue) * graphHeight
		return { x, y, value: d.total }
	})

	// Build SVG path string for area chart
	let areaPath = `M ${pathData[0].x} ${CHART_HEIGHT - padding.bottom}`
	pathData.forEach((point, i) => {
		if (i === 0) {
			areaPath += ` L ${point.x} ${point.y}`
		} else {
			// Add smooth curve using quadratic bezier
			const prevPoint = pathData[i - 1]
			const midX = (prevPoint.x + point.x) / 2
			areaPath += ` Q ${prevPoint.x} ${prevPoint.y}, ${midX} ${(prevPoint.y + point.y) / 2}`
			areaPath += ` Q ${point.x} ${point.y}, ${point.x} ${point.y}`
		}
	})
	areaPath += ` L ${pathData[pathData.length - 1].x} ${CHART_HEIGHT - padding.bottom}`
	areaPath += ' Z'

	// Build line path (no fill, just stroke)
	let linePath = `M ${pathData[0].x} ${pathData[0].y}`
	pathData.forEach((point, i) => {
		if (i > 0) {
			const prevPoint = pathData[i - 1]
			const midX = (prevPoint.x + point.x) / 2
			linePath += ` Q ${prevPoint.x} ${prevPoint.y}, ${midX} ${(prevPoint.y + point.y) / 2}`
			linePath += ` Q ${point.x} ${point.y}, ${point.x} ${point.y}`
		}
	})

	// Get first, middle, last labels
	const labels = [
		{ text: chartData[0].date.split(' ')[1], x: pathData[0].x },
		{ text: chartData[Math.floor(chartData.length / 2)].date.split(' ')[1], x: pathData[Math.floor(chartData.length / 2)].x },
		{ text: chartData[chartData.length - 1].date.split(' ')[1], x: pathData[pathData.length - 1].x },
	]

	return (
		<View className='bg-white rounded-3xl mx-6 p-6 border border-slate-100'
			style={{
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.05,
				shadowRadius: 12,
				elevation: 3,
			}}
		>
			<Text className='text-slate-500 text-xs font-semibold uppercase tracking-wide mb-4'>
				Past 7 Days
			</Text>

			<Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
				{/* Gradient Definition */}
				<Defs>
					<LinearGradient id='areaGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
						<Stop offset='0%' stopColor='#a5b4fc' stopOpacity='0.4' />
						<Stop offset='100%' stopColor='#c7d2fe' stopOpacity='0.05' />
					</LinearGradient>
				</Defs>

				{/* Horizontal grid lines */}
				{[0, 0.25, 0.5, 0.75, 1].map((percent, i) => {
					const y = padding.top + graphHeight * (1 - percent)
					return (
						<Line
							key={i}
							x1={padding.left}
							y1={y}
							x2={CHART_WIDTH - padding.right}
							y2={y}
							stroke='#f1f5f9'
							strokeWidth='1'
						/>
					)
				})}

				{/* Area fill */}
				<Path
					d={areaPath}
					fill='url(#areaGradient)'
				/>

				{/* Line stroke */}
				<Path
					d={linePath}
					fill='none'
					stroke='#6366f1'
					strokeWidth='3'
					strokeLinecap='round'
					strokeLinejoin='round'
				/>

				{/* X-axis labels */}
				{labels.map((label, i) => (
					<SvgText
						key={i}
						x={label.x}
						y={CHART_HEIGHT - padding.bottom + 20}
						fontSize='11'
						fill='#94a3b8'
						textAnchor='middle'
						fontWeight='500'
					>
						{label.text}
					</SvgText>
				))}
			</Svg>
		</View>
	)
}
