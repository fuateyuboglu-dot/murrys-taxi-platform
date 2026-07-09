import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { BottomNavigation } from '@/shared/components/BottomNavigation';
import { colors, radius, spacing } from '@/shared/theme';

type CustomerTab = 'Home' | 'Bookings' | 'Support' | 'Profile';

type CustomerBottomTabsProps = {
  activeTab: CustomerTab;
};

export function CustomerBottomTabs({ activeTab }: CustomerBottomTabsProps) {
  return (
    <BottomNavigation
      activeGlyphStyle={styles.navGlyphActive}
      activeItemStyle={styles.navItemActive}
      activeLabelStyle={styles.navLabelActive}
      glyphStyle={styles.navGlyph}
      itemStyle={styles.navItem}
      items={[
        { glyph: 'H', isActive: activeTab === 'Home', label: 'Home', onPress: () => router.push('/home') },
        {
          glyph: 'B',
          isActive: activeTab === 'Bookings',
          label: 'Bookings',
          onPress: () => router.push('/bookings'),
        },
        {
          glyph: 'S',
          isActive: activeTab === 'Support',
          label: 'Support',
          onPress: () => router.push('/support'),
        },
        {
          glyph: 'P',
          isActive: activeTab === 'Profile',
          label: 'Profile',
          onPress: () => router.push('/profile'),
        },
      ]}
      labelStyle={styles.navLabel}
      style={styles.bottomNav}
    />
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.r28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
  navGlyph: {
    color: colors.mutedIcon,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
  },
  navGlyphActive: {
    color: colors.black,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  navItemActive: {
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderRadius: radius.r22,
    flex: 1,
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  navLabel: {
    color: colors.mutedIcon,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0,
  },
  navLabelActive: {
    color: colors.black,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0,
  },
});
