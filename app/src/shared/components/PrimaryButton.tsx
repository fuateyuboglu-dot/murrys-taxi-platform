import type { ReactNode } from 'react';
import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from 'react-native';

type PrimaryButtonProps = {
  accessibilityLabel?: string;
  children: ReactNode;
  onPress?: () => void;
  pressedStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function PrimaryButton({
  accessibilityLabel,
  children,
  onPress,
  pressedStyle,
  style,
  textStyle,
}: PrimaryButtonProps) {
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
