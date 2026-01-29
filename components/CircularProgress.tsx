import { View, Text } from 'react-native'
import Svg, { Circle } from 'react-native-svg'

interface CircularProgressProps {
	size?: number
	strokeWidth?: number
	progress: number // 0-100
	color?: string
	backgroundColor?: string
	label?: string
	value?: string | number
	subtitle?: string
}

export default function CircularProgress({
	size = 180,
	strokeWidth = 12,
	progress,
	color = '#6366f1',
	backgroundColor = '#f1f5f9',
	label,
	value,
	subtitle,
}: CircularProgressProps) {
	const radius = (size - strokeWidth) / 2
	const circumference = 2 * Math.PI * radius
	const strokeDashoffset = circumference - (progress / 100) * circumference

	return (
		<View className='items-center justify-center' style={{ width: size, height: size }}>
			<Svg width={size} height={size}>
				{/* Background Circle */}
				<Circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke={backgroundColor}
					strokeWidth={strokeWidth}
					fill='transparent'
				/>
				{/* Progress Circle */}
				<Circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke={color}
					strokeWidth={strokeWidth}
					fill='transparent'
					strokeDasharray={circumference}
					strokeDashoffset={strokeDashoffset}
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
				{value !== undefined && (
					<Text className='text-slate-900 text-5xl font-bold'>
						{value}
					</Text>
				)}
				{subtitle && (
					<Text className='text-slate-500 text-sm font-medium mt-1'>
						{subtitle}
					</Text>
				)}
			</View>
		</View>
	)
}
