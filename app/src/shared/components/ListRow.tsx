import type { ReactNode } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';

type ListRowProps = {
  children: ReactNode;
  divider?: ReactNode;
  onPress?: () => void;
  pressedStyle?: StyleProp<ViewStyle>;
  rowStyle?: StyleProp<ViewStyle>;
};

export function ListRow({ children, divider, onPress, pressedStyle, rowStyle }: ListRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => pressed ? pressedStyle : null}>
      <View style={rowStyle}>{children}</View>
      {divider}
    </Pressable>
  );
}
