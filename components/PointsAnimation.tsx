import { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
// import { Audio } from 'expo-av'; // Uncomment when adding sound

interface PointsAnimationProps {
  points: number; // 10 or 30
  visible: boolean;
  onComplete: () => void;
}

export function PointsAnimation({ points, visible, onComplete }: PointsAnimationProps) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Play sound effect
      playSound();

      // Reset values
      translateY.value = 0;
      opacity.value = 0;

      // Fade in and float up
      opacity.value = withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.ease)
      });

      translateY.value = withTiming(-150, {
        duration: 1200,
        easing: Easing.out(Easing.cubic)
      });

      // Fade out near the end
      setTimeout(() => {
        opacity.value = withTiming(0, {
          duration: 400,
          easing: Easing.in(Easing.ease)
        });
      }, 800);

      // Call onComplete after animation
      setTimeout(onComplete, 1400);
    }
  }, [visible]);

  const playSound = async () => {
    // TODO: Add sound effect
    // Uncomment when you add point.mp3 to assets folder
    // See assets/SOUND_INSTRUCTIONS.md for details

    /*
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/point.mp3'),
        { shouldPlay: true, volume: 0.5 }
      );
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      // Sound file error - fail silently
    }
    */
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  const isHighPoints = points === 30;

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 120,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <Animated.View style={animatedStyle}>
        <Text
          style={{
            fontSize: 48,
            fontWeight: '700',
            color: isHighPoints ? '#10b981' : '#f59e0b',
          }}
        >
          +{points}
        </Text>
      </Animated.View>
    </View>
  );
}
