import { Platform } from 'react-native';

/**
 * NativeWind configuration for cross-platform consistency
 * This actually gets applied to React Native components
 */
export const nativewindConfig = {
  // Default font scaling behavior
  text: {
    allowFontScaling: false, // Disable Android font scaling globally
  },
  // Platform-specific font sizes (reduce Android by 5%)
  fontSize: Platform.OS === 'android' ? {
    xs: 11.4,    // 12 * 0.95
    sm: 13.3,    // 14 * 0.95
    base: 15.2,  // 16 * 0.95
    lg: 17.1,    // 18 * 0.95
    xl: 19,      // 20 * 0.95
    '2xl': 22.8, // 24 * 0.95
    '3xl': 28.5, // 30 * 0.95
    '4xl': 34.2, // 36 * 0.95
  } : undefined,
};
