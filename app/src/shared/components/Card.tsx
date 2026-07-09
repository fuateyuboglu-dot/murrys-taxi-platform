import type { PropsWithChildren } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

type CardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function Card({ children, style }: CardProps) {
  return <View style={style}>{children}</View>;
}
