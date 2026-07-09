import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Linking, Platform, StyleSheet, Text, View } from 'react-native';

import { Card, PrimaryButton, ScreenContainer, SecondaryButton } from '@/shared/components';
import { setDriverState } from '@/domains/drivers';
import { getSelectedDestinationFromParams, toDestinationRouteParams } from '@/domains/places';
import { toFareRouteParams } from '@/domains/pricing';
import { getDemoTripFromParams, type TripCustomer } from '@/domains/trips';
import { colors, radius, spacing } from '@/shared/theme';

function showPassengerAlert(message: string) {
  if (Platform.OS === 'web' && typeof globalThis.alert === 'function') {
    globalThis.alert(message);
    return;
  }

  Alert.alert('Passenger contact', message);
}

async function callPassenger(customer: TripCustomer) {
  if (Platform.OS === 'web') {
    showPassengerAlert(`Call ${customer.name}: ${customer.phoneNumber}`);
    return;
  }

  await Linking.openURL(`tel:${customer.phoneNumber}`);
}

async function messagePassenger(customer: TripCustomer) {
  if (Platform.OS === 'web') {
    showPassengerAlert(`Message ${customer.name}: ${customer.phoneNumber}`);
    return;
  }

  await Linking.openURL(`sms:${customer.phoneNumber}`);
}

export default function DriverPickupScreen() {
  const routeParams = useLocalSearchParams();
  const selectedDestination = getSelectedDestinationFromParams(routeParams);
  const trip = getDemoTripFromParams(routeParams);

  return (
    <ScreenContainer contentStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Pickup</Text>
        <Text style={styles.title}>Passenger pickup</Text>
      </View>

      <Card style={styles.passengerCard}>
        <Text style={styles.passengerLabel}>Passenger</Text>
        <Text style={styles.passengerName}>{trip.customer.name}</Text>
      </Card>

      <Card style={styles.routeCard}>
        <RouteRow label="Pickup address" marker="pickup" value={trip.pickup.address} />
        <View style={styles.divider} />
        <RouteRow label="Destination" marker="destination" value={trip.destination.address} />
      </Card>

      <Card style={styles.timerCard}>
        <Text style={styles.timerLabel}>Waiting timer</Text>
        <Text style={styles.timerValue}>00:00</Text>
      </Card>

      <View style={styles.quickActions}>
        <SecondaryButton
          onPress={() => {
            void callPassenger(trip.customer);
          }}
          pressedStyle={styles.buttonPressed}
          style={styles.secondaryButton}
          textStyle={styles.secondaryButtonText}>
          Call Passenger
        </SecondaryButton>
        <SecondaryButton
          onPress={() => {
            void messagePassenger(trip.customer);
          }}
          pressedStyle={styles.buttonPressed}
          style={styles.secondaryButton}
          textStyle={styles.secondaryButtonText}>
          Message Passenger
        </SecondaryButton>
      </View>

      <PrimaryButton
        onPress={() => {
          setDriverState('in_progress');
          router.push({
            pathname: '/driver-driving',
            params: {
              ...toDestinationRouteParams(selectedDestination),
              ...toFareRouteParams(trip.fare),
              routeDistanceMeters: trip.route.distanceMeters ? String(trip.route.distanceMeters) : undefined,
              routeDurationSeconds: trip.route.durationSeconds ? String(trip.route.durationSeconds) : undefined,
            },
          });
        }}
        pressedStyle={styles.buttonPressed}
        style={styles.primaryButton}
        textStyle={styles.primaryButtonText}>
        Start Trip
      </PrimaryButton>
    </ScreenContainer>
  );
}

type RouteRowProps = {
  label: string;
  marker: 'pickup' | 'destination';
  value: string;
};

function RouteRow({ label, marker, value }: RouteRowProps) {
  return (
    <View style={styles.routeRow}>
      <View style={marker === 'pickup' ? styles.pickupMarker : styles.destinationMarker} />
      <View style={styles.routeCopy}>
        <Text style={styles.routeLabel}>{label}</Text>
        <Text style={styles.routeValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
  content: {
    alignSelf: 'center',
    flex: 1,
    gap: spacing.s16,
    maxWidth: 430,
    paddingBottom: spacing.s28,
    paddingHorizontal: spacing.s20,
    paddingTop: spacing.s18,
    width: '100%',
  },
  destinationMarker: {
    backgroundColor: colors.surface,
    borderRadius: radius.xs,
    height: 18,
    width: 18,
  },
  divider: {
    backgroundColor: colors.routeDark,
    height: 1,
    marginLeft: spacing.s32,
  },
  eyebrow: {
    color: colors.warmText,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  header: {
    gap: spacing.md,
  },
  passengerCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.r30,
    gap: spacing.xs,
    padding: spacing.s18,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
  },
  passengerLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  passengerName: {
    color: colors.black,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
  },
  pickupMarker: {
    backgroundColor: colors.brand,
    borderColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 3,
    height: 18,
    width: 18,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.r28,
    justifyContent: 'center',
    minHeight: 62,
  },
  primaryButtonText: {
    color: colors.black,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.s12,
  },
  routeCard: {
    backgroundColor: colors.black,
    borderRadius: radius.r34,
    padding: spacing.s20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 32,
  },
  routeCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  routeLabel: {
    color: colors.brand,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  routeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.s14,
    minHeight: 58,
  },
  routeValue: {
    color: colors.surface,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.r24,
    flex: 1,
    justifyContent: 'center',
    minHeight: 58,
  },
  secondaryButtonText: {
    color: colors.black,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
  },
  timerCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.r30,
    gap: spacing.xs,
    padding: spacing.s20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
  },
  timerLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  timerValue: {
    color: colors.black,
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 0,
  },
  title: {
    color: colors.black,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 41,
  },
});
