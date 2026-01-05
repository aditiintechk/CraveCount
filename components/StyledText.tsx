import { Text as RNText, TextProps, Platform } from 'react-native';
import { ComponentProps } from 'react';

/**
 * Custom Text component with consistent styling across platforms
 * - Disables font scaling on Android
 * - Uses platform-specific fonts
 * - Maintains consistent sizing
 */
export function Text(props: TextProps & ComponentProps<typeof RNText>) {
  const { style, ...rest } = props;

  const defaultStyle = {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    // Slightly reduce Android font size to match iOS visual weight
    fontSize: Platform.OS === 'android' && typeof (style as any)?.fontSize === 'number'
      ? (style as any).fontSize * 0.95
      : undefined,
  };

  return (
    <RNText
      {...rest}
      allowFontScaling={false}
      style={[defaultStyle, style]}
    />
  );
}
