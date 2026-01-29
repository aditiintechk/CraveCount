import { View, Text } from 'react-native'
import Svg, { Circle } from 'react-native-svg'

interface DualCircularProgressProps {
	size?: number
	outerStrokeWidth?: number
	innerStrokeWidth?: number
	outerProgress: number // 0-100 (resisted)
	innerProgress: number // 0-100 (observed)
	outerColor?: string
	innerColor?: string
	backgroundColor?: string
	label?: string
	outerValue?: string | number
	innerValue?: string | number
	subtitle?: string
}

export default function DualCircularProgress({
	size = 200,
	outerStrokeWidth = 14,
	innerStrokeWidth = 12,
	outerProgress,
	innerProgress,
	outerColor = '#6366f1', // Indigo for resisted
	innerColor = '#f59e0b', // Amber for observed
	backgroundColor = '#f1f5f9',
	label,
	outerValue,
	innerValue,
	subtitle,
}: DualCircularProgressProps) {
	const outerRadius = (size - outerStrokeWidth) / 2
	const innerRadius = outerRadius - outerStrokeWidth - 8 // Gap between rings

	const outerCircumference = 2 * Math.PI * outerRadius
	const innerCircumference = 2 * Math.PI * innerRadius

	const outerStrokeDashoffset = outerCircumference - (outerProgress / 100) * outerCircumference
	const innerStrokeDashoffset = innerCircumference - (innerProgress / 100) * innerCircumference

	return (
		<View className='items-center justify-center' style={{ width: size, height: size }}>
			<Svg width={size} height={size}>
				{/* Outer Background Circle (Resisted) */}
				<Circle
					cx={size / 2}
					cy={size / 2}
					r={outerRadius}
					stroke={backgroundColor}
					strokeWidth={outerStrokeWidth}
					fill='transparent'
				/>
				{/* Outer Progress Circle (Resisted) */}
				<Circle
					cx={size / 2}
					cy={size / 2}
					r={outerRadius}
					stroke={outerColor}
					strokeWidth={outerStrokeWidth}
					fill='transparent'
					strokeDasharray={outerCircumference}
					strokeDashoffset={outerStrokeDashoffset}
					strokeLinecap='round'
					rotation='-90'
					origin={`${size / 2}, ${size / 2}`}
				/>

				{/* Inner Background Circle (Observed) */}
				<Circle
					cx={size / 2}
					cy={size / 2}
					r={innerRadius}
					stroke={backgroundColor}
					strokeWidth={innerStrokeWidth}
					fill='transparent'
				/>
				{/* Inner Progress Circle (Observed) */}
				<Circle
					cx={size / 2}
					cy={size / 2}
					r={innerRadius}
					stroke={innerColor}
					strokeWidth={innerStrokeWidth}
					fill='transparent'
					strokeDasharray={innerCircumference}
					strokeDashoffset={innerStrokeDashoffset}
					strokeLinecap='round'
					rotation='-90'
					origin={`${size / 2}, ${size / 2}`}
				/>
			</Svg>

			{/* Center Content */}
			<View className='absolute items-center justify-center' style={{ width: size, height: size }}>
				{label && (
					<Text className='text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1'>
						{label}
					</Text>
				)}
				{outerValue !== undefined && innerValue !== undefined && (
					<View className='items-center'>
						<View className='flex-row items-baseline gap-1'>
							<View className='w-2 h-2 rounded-full bg-indigo-500' />
							<Text className='text-slate-900 text-3xl font-bold'>
								{outerValue}
							</Text>
						</View>
						<View className='flex-row items-baseline gap-1 mt-2'>
							<View className='w-2 h-2 rounded-full bg-amber-500' />
							<Text className='text-slate-900 text-3xl font-bold'>
								{innerValue}
							</Text>
						</View>
					</View>
				)}
				{subtitle && (
					<Text className='text-slate-500 text-sm font-medium mt-2'>
						{subtitle}
					</Text>
				)}
			</View>
		</View>
	)
}
