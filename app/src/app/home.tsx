import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/shared/theme';
import { useUserLocation } from '@/shared/hooks/useUserLocation';
import { getDemoFavouritePlaces } from '@/shared/demo/demoData';
import {
  Card,
  CustomerBottomTabs,
  Map,
  ScreenContainer,
  SecondaryButton,
} from '@/shared/components';

type QuickBookItem = {
  destination?: string;
  favouriteId?: string;
  id: string;
  label: string;
};

const quickBookItems: QuickBookItem[] = [
  { destination: 'Ottawa Airport', id: 'airport', label: 'Airport' },
  { destination: 'Arnprior Regional Health', id: 'hospital', label: 'Hospital' },
  { destination: 'Arnprior Shopping Centre', id: 'shopping', label: 'Shopping' },
  { favouriteId: 'home', id: 'home', label: 'Home' },
  { favouriteId: 'work', id: 'work', label: 'Work' },
];


export default function HomeScreen() {
  const favouritePlaces = getDemoFavouritePlaces();
  const { userLocation } = useUserLocation();
  const pickupLabel = userLocation.source === 'demo' ? 'Arnprior demo location' : 'Current Location';

  function quickBook(_destination: string) {
    router.push('/ride-selection');
  }

  function getQuickBookDestination(item: QuickBookItem) {
    if (item.destination) {
      return item.destination;
    }

    return favouritePlaces.find((place) => place.id === item.favouriteId)?.address ?? item.label;
  }

  return (
    <ScreenContainer contentStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Afternoon</Text>
            <Text style={styles.title}>Where do you need to go?</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>M</Text>
          </View>
        </View>

        <Map
          label="Map preview"
          style={styles.mapCard}
          subtitle="Live map coming soon"
          userLocation={userLocation}
        />

        <Card style={styles.bookingCard}>
          <View style={styles.locationRow}>
            <View style={styles.pickupMarker} />
            <View style={styles.locationCopy}>
              <Text style={styles.locationLabel}>Pickup</Text>
              <Text style={styles.locationValue}>{pickupLabel}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/destination-search')}
            style={({ pressed }) => [styles.locationRow, pressed ? styles.rowPressed : null]}>
            <View style={styles.destinationMarker} />
            <View style={styles.locationCopy}>
              <Text style={styles.locationLabel}>Destination</Text>
              <Text style={styles.locationPlaceholder}>Enter destination</Text>
            </View>
            <Text style={styles.locationChevron}>›</Text>
          </Pressable>
        </Card>

        <View style={styles.quickBookSection}>
          <Text style={styles.quickBookTitle}>Quick Book</Text>
          <View style={styles.quickBookList}>
            {quickBookItems.map((item) => {
              const destination = getQuickBookDestination(item);

              return (
                <Pressable
                  accessibilityRole="button"
                  key={item.id}
                  onPress={() => quickBook(destination)}
                  style={({ pressed }) => [styles.quickBookChip, pressed ? styles.buttonPressed : null]}>
                  <Text style={styles.quickBookChipText}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.actions}>
          <SecondaryButton
            onPress={() => router.push('/schedule-ride')}
            pressedStyle={styles.buttonPressed}
            style={styles.bookLaterButton}
            textStyle={styles.bookLaterText}>
            Book Later
          </SecondaryButton>
        </View>

        <CustomerBottomTabs activeTab="Home" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    alignSelf: 'center',
    flex: 1,
    gap: spacing.s15,
    maxWidth: 430,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.s20,
    paddingTop: spacing.s16,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.s16,
    justifyContent: 'space-between',
  },
  greeting: {
    color: colors.mutedAlt,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: spacing.md,
  },
  title: {
    color: colors.black,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 39,
    maxWidth: 285,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.r22,
    height: 52,
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    width: 52,
  },
  avatarText: {
    color: colors.black,
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0,
  },
  mapCard: {
    flex: 1,
    minHeight: 250,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.16,
    shadowRadius: 32,
  },
  bookingCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.r30,
    padding: spacing.s18,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.09,
    shadowRadius: 30,
  },
  locationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.s14,
    minHeight: 58,
  },
  rowPressed: {
    opacity: 0.64,
  },
  pickupMarker: {
    backgroundColor: colors.brand,
    borderColor: colors.black,
    borderRadius: radius.md,
    borderWidth: 3,
    height: 18,
    width: 18,
  },
  destinationMarker: {
    backgroundColor: colors.black,
    borderRadius: radius.xs,
    height: 18,
    width: 18,
  },
  locationCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  locationLabel: {
    color: colors.label,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
  locationValue: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  locationPlaceholder: {
    color: colors.placeholder,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
  },
  locationChevron: {
    color: colors.black,
    fontSize: 27,
    fontWeight: '600',
    lineHeight: 30,
  },
  divider: {
    backgroundColor: colors.dividerStrong,
    height: 1,
    marginLeft: spacing.s32,
  },
  quickBookSection: {
    gap: spacing.lg,
  },
  quickBookTitle: {
    color: colors.black,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
  },
  quickBookList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xxl,
  },
  quickBookChip: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.r20,
    flexBasis: '31%',
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: spacing.s16,
    paddingVertical: spacing.xxl,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.07,
    shadowRadius: 18,
  },
  quickBookChipText: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0,
  },
  actions: {
    flexDirection: 'row',
  },
  bookLaterButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.r20,
    flex: 1,
    justifyContent: 'center',
    minHeight: 58,
    shadowColor: colors.brand,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.22,
    shadowRadius: 22,
  },
  bookLaterText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
  },
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
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
