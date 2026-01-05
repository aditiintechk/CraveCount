import '../global.css';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { disableFontScaling } from '../utils/normalize';

export default function RootLayout() {
  const loadData = useStore((state) => state.loadData);

  useEffect(() => {
    // Disable font scaling on Android for consistent UI
    disableFontScaling();
    loadData();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
