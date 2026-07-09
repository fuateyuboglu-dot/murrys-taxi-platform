import type { ReactNode } from 'react';
import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from 'react-native';

type SecondaryButtonProps = {
  accessibilityLabel?: string;
  children: ReactNode;
  onPress?: () => void;
  pressedStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function SecondaryButton({
  accessibilityLabel,
  children,
  onPress,
  pressedStyle,
  style,
  textStyle,
}: SecondaryButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [style, pressed ? pressedStyle : null]}>
      <Text style={textStyle}>{children}</Text>
    </Pressable>
  );
}
