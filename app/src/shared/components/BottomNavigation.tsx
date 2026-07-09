import { Pressable, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

export type BottomNavigationItem = {
  glyph: string;
  isActive?: boolean;
  label: string;
  onPress?: () => void;
};

type BottomNavigationProps = {
  activeGlyphStyle?: StyleProp<TextStyle>;
  activeItemStyle?: StyleProp<ViewStyle>;
  activeLabelStyle?: StyleProp<TextStyle>;
  glyphStyle?: StyleProp<TextStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  items: BottomNavigationItem[];
  labelStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
};

export function BottomNavigation({
  activeGlyphStyle,
  activeItemStyle,
  activeLabelStyle,
  glyphStyle,
  itemStyle,
  items,
  labelStyle,
  style,
}: BottomNavigationProps) {
  return (
    <View style={style}>
      {items.map((item) => (
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: Boolean(item.isActive) }}
          key={item.label}
          onPress={item.onPress}
          style={item.isActive ? activeItemStyle : itemStyle}>
          <Text style={item.isActive ? activeGlyphStyle : glyphStyle}>{item.glyph}</Text>
          <Text style={item.isActive ? activeLabelStyle : labelStyle}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
