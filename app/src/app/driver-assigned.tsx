import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { assignedDemoDriver } from '@/shared/demo/demoData';
import { colors, radius, spacing } from '@/shared/theme';
import { PrimaryButton, ScreenContainer, SecondaryButton } from '@/shared/components';
import { callDriver, messageDriver } from '@/shared/utils/driverContact';
import { getSelectedDestinationFromParams, toDestinationRouteParams } from '@/domains/places';
import { calculateFare, getFareFromParams, toFareRouteParams } from '@/domains/pricing';


const driverInitials = assignedDemoDriver.name
  .split(' ')
  .map((namePart) => namePart.charAt(0))
  .join('');

export default function DriverAssignedScreen() {
  const routeParams = useLocalSearchParams();
  const selectedDestination = getSelectedDestinationFromParams(routeParams);
  const fareEstimate = routeParams.fareAmountCents
    ? getFareFromParams(routeParams)
    : calculateFare({ destination: selectedDestination });
  const destinationParams = toDestinationRouteParams(selectedDestination);

  return (
    <ScreenContainer contentStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Murrys Taxi</Text>
          <Text style={styles.title}>Driver assigned</Text>
        </View>

        <View style={styles.driverCard}>
          <View style={styles.driverTopRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{driverInitials}</Text>
            </View>
            <View style={styles.driverCopy}>
              <Text style={styles.driverName}>{assignedDemoDriver.name}</Text>
              <Text style={styles.driverMeta}>{assignedDemoDriver.vehicle}</Text>
              <Text style={styles.driverColor}>{assignedDemoDriver.color}</Text>
            </View>
            <View style={styles.etaBadge}>
              <Text style={styles.etaValue}>{assignedDemoDriver.eta}</Text>
              <Text style={styles.etaLabel}>ETA</Text>
            </View>
          </View>

          <View style={styles.driverStats}>
            <View style={styles.statPill}>
              <Text style={styles.statLabel}>Plate</Text>
              <Text style={styles.statValue}>{assignedDemoDriver.plate}</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statLabel}>Rating</Text>
              <Text style={styles.statValue}>{assignedDemoDriver.rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.routeRow}>
            <View style={styles.pickupMarker} />
            <View style={styles.routeText}>
              <Text style={styles.routeLabel}>Pickup</Text>
              <Text style={styles.routeValue}>Current Location</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.routeRow}>
            <View style={styles.destinationMarker} />
            <View style={styles.routeText}>
              <Text style={styles.routeLabel}>Destination</Text>
              <Text style={styles.routeValue}>{selectedDestination.displayName}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <View style={styles.quickActions}>
            <SecondaryButton
              onPress={() => {
                void callDriver(assignedDemoDriver);
              }}
              pressedStyle={styles.buttonPressed}
              style={styles.secondaryButton}
              textStyle={styles.secondaryButtonText}>
              Call Driver
            </SecondaryButton>
            <SecondaryButton
              onPress={() => {
                void messageDriver(assignedDemoDriver);
              }}
              pressedStyle={styles.buttonPressed}
              style={styles.secondaryButton}
              textStyle={styles.secondaryButtonText}>
              Message
            </SecondaryButton>
          </View>

          <PrimaryButton
            onPress={() => {
              router.push({
                pathname: '/live-trip',
                params: {
                  ...destinationParams,
                  ...toFareRouteParams(fareEstimate),
                },
              });
            }}
            pressedStyle={styles.buttonPressed}
            style={styles.primaryButton}
            textStyle={styles.primaryButtonText}>
            Start Demo Trip
          </PrimaryButton>
        </View>
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
    gap: spacing.s18,
    maxWidth: 430,
    paddingBottom: spacing.s28,
    paddingHorizontal: spacing.s20,
    paddingTop: spacing.s18,
    width: '100%',
  },
  header: {
    gap: spacing.md,
  },
  eyebrow: {
    color: colors.warmText,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.black,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 41,
  },
  driverCard: {
    backgroundColor: colors.black,
    borderRadius: radius.r34,
    gap: spacing.s20,
    padding: spacing.s20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.16,
    shadowRadius: 32,
  },
  driverTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.s14,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.r28,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  avatarText: {
    color: colors.black,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0,
  },
  driverCopy: {
    flex: 1,
    gap: spacing.sm,
  },
  driverName: {
    color: colors.surface,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
  },
  driverMeta: {
    color: colors.textOnDarkMuted,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
  },
  driverColor: {
    color: colors.brand,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  etaBadge: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.r22,
    minWidth: 70,
    paddingHorizontal: spacing.s12,
    paddingVertical: spacing.xxl,
  },
  etaValue: {
    color: colors.black,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  etaLabel: {
    color: colors.black,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0,
  },
  driverStats: {
    flexDirection: 'row',
    gap: spacing.xxl,
  },
  statPill: {
    backgroundColor: colors.darkElevated,
    borderRadius: radius.r22,
    flex: 1,
    gap: spacing.sm,
    padding: spacing.s14,
  },
  statLabel: {
    color: colors.brand,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  statValue: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.r30,
    padding: spacing.s18,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.08,
    shadowRadius: 28,
  },
  routeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.s14,
    minHeight: 58,
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
  routeText: {
    flex: 1,
    gap: spacing.xs,
  },
  routeLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  routeValue: {
    color: colors.black,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  divider: {
    backgroundColor: colors.divider,
    height: 1,
    marginLeft: spacing.s32,
  },
  actions: {
    gap: spacing.s12,
    marginTop: 'auto',
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.s12,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.r22,
    flex: 1,
    justifyContent: 'center',
    minHeight: 58,
  },
  secondaryButtonText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.r22,
    justifyContent: 'center',
    minHeight: 64,
    shadowColor: colors.brand,
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowOpacity: 0.26,
    shadowRadius: 26,
  },
  primaryButtonText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  buttonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
});
