import { Tabs } from 'expo-router'
import { View, TouchableOpacity, Platform } from 'react-native'
import { Home, Lightbulb, History, Settings, Plus } from 'lucide-react-native'
import { useState } from 'react'

import LogModal from '../../components/LogModal'
import { PointsAnimation } from '../../components/PointsAnimation'

const TabIcon = ({ Icon, focused }: { Icon: any; focused: boolean }) => (
	<Icon
		size={24}
		color={focused ? '#0f172a' : '#94a3b8'}
		strokeWidth={focused ? 2.5 : 2}
	/>
)

export default function TabLayout() {
	const [modalVisible, setModalVisible] = useState(false)
	const [showPoints, setShowPoints] = useState(false)
	const [earnedPoints, setEarnedPoints] = useState(0)

	const handleLogSuccess = (points: number) => {
		setEarnedPoints(points)
		setShowPoints(true)
	}

	return (
		<>
			<Tabs
				screenOptions={{
					headerShown: false,
					tabBarStyle: {
						position: 'absolute',
						bottom: 30,
						left: 40,
						right: 40,
						height: 70,
						backgroundColor: 'rgba(248, 250, 252, 0.95)',
						borderRadius: 35,
						borderWidth: 1,
						borderColor: 'rgba(148, 163, 184, 0.2)',
						paddingBottom: 10,
						paddingTop: 10,
						marginLeft: 25,
						marginRight: 25,
						// Unified shadow for both platforms
						shadowColor: '#000',
						shadowOffset: { width: 0, height: 10 },
						shadowOpacity: 0.1,
						shadowRadius: 20,
						elevation: 10,
					},
					tabBarShowLabel: false,
					tabBarActiveTintColor: '#0f172a',
					tabBarInactiveTintColor: '#94a3b8',
					// Smoother animations
					animation: 'shift',
				}}
			>
				<Tabs.Screen
					name='index'
					options={{
						tabBarIcon: ({ focused }) => (
							<TabIcon Icon={Home} focused={focused} />
						),
					}}
				/>
				<Tabs.Screen
					name='insights'
					options={{
						tabBarIcon: ({ focused }) => (
							<TabIcon Icon={Lightbulb} focused={focused} />
						),
					}}
				/>
				<Tabs.Screen
					name='add'
					options={{
						tabBarButton: () => (
							<TouchableOpacity
								onPress={() => setModalVisible(true)}
								className='items-center justify-center -mt-6'
								activeOpacity={0.8}
							>
								<View className='w-16 h-16 bg-slate-900 rounded-full items-center justify-center shadow-lg'>
									<Plus
										size={28}
										color='#fff'
										strokeWidth={2.5}
									/>
								</View>
							</TouchableOpacity>
						),
					}}
				/>
				<Tabs.Screen
					name='journal'
					options={{
						tabBarIcon: ({ focused }) => (
							<TabIcon Icon={History} focused={focused} />
						),
					}}
				/>
				<Tabs.Screen
					name='settings'
					options={{
						tabBarIcon: ({ focused }) => (
							<TabIcon Icon={Settings} focused={focused} />
						),
					}}
				/>
			</Tabs>

			<LogModal
				visible={modalVisible}
				onClose={() => setModalVisible(false)}
				onLogSuccess={handleLogSuccess}
			/>

			<PointsAnimation
				points={earnedPoints}
				visible={showPoints}
				onComplete={() => setShowPoints(false)}
			/>
		</>
	)
}
