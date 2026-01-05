import { Platform, Text, TextInput } from 'react-native';

// Disable font scaling on Android to match iOS behavior
export const disableFontScaling = () => {
  if (Platform.OS === 'android') {
    console.log('🔧 DISABLING FONT SCALING ON ANDROID');

    // @ts-ignore
    Text.defaultProps = Text.defaultProps || {};
    // @ts-ignore
    Text.defaultProps.allowFontScaling = false;

    // @ts-ignore
    TextInput.defaultProps = TextInput.defaultProps || {};
    // @ts-ignore
    TextInput.defaultProps.allowFontScaling = false;

    // @ts-ignore
    console.log('✅ Font scaling disabled. Text.defaultProps:', Text.defaultProps);
  } else {
    console.log('ℹ️ Platform is iOS, skipping font scaling disable');
  }
};

// Get platform-specific font family for consistent rendering
export const getPlatformFont = () => {
  if (Platform.OS === 'ios') {
    return 'System';
  }
  // Use Roboto on Android for cleaner, iOS-like appearance
  return 'sans-serif';
};

// Normalize font size - Android tends to render slightly larger
export const normalizeFont = (size: number) => {
  if (Platform.OS === 'android') {
    return size * 0.95; // Reduce by 5% on Android
  }
  return size;
};
