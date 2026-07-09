import { StyleProp, Text, TextStyle } from 'react-native';

type SectionTitleProps = {
  children: string;
  style?: StyleProp<TextStyle>;
};

export function SectionTitle({ children, style }: SectionTitleProps) {
  return <Text style={style}>{children}</Text>;
}
