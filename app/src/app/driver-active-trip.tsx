import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Linking, Platform, StyleSheet, Text, View } from 'react-native';

import { Card, PrimaryButton, ScreenContainer, SecondaryButton } from '@/shared/components';
import { setDriverState } from '@/domains/drivers';
import { formatDemoRouteDistance, formatDemoRouteDuration } from '@/shared/demo/driverTripDemo';
import { getSelectedDestinationFromParams, toDestinationRouteParams } from '@/domains/places';
import { calculateFare, toFareRouteParams } from '@/domains/pricing';
import { locationService, toRouteMetricParams, type Route } from '@/domains/locations';
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

export default function DriverActiveTripScreen() {
  const routeParams = useLocalSearchParams();
  const selectedDestination = getSelectedDestinationFromParams(routeParams);
  const trip = getDemoTripFromParams(routeParams);
  const driver = trip.driver;
  const [route, setRoute] = useState<Route | null>(null);
  const destinationCoordinates = selectedDestination.coordinates;
  const destinationLatitude = destinationCoordinates?.latitude;
  const destinationLongitude = destinationCoordinates?.longitude;
  const pickupLatitude = trip.pickup.coordinates?.latitude;
  const pickupLongitude = trip.pickup.coordinates?.longitude;
  const fareEstimate = route
    ? calculateFare({
        destination: selectedDestination,
        distanceMeters: route.distanceMeters,
      })
    : trip.fare;
  const distanceLabel = formatDemoRouteDistance(route?.distanceMeters);
  const durationLabel = formatDemoRouteDuration(route?.durationSeconds, driver?.eta ?? '4 min');

  useEffect(() => {
    let isMounted = true;

    if (
      typeof destinationLatitude !== 'number' ||
      typeof destinationLongitude !== 'number'
    ) {
      return;
    }

    if (
      typeof pickupLatitude !== 'number' ||
      typeof pickupLongitude !== 'number'
    ) {
      return;
    }

    void locationService
      .getRoute({
        latitude: pickupLatitude,
        longitude: pickupLongitude,
      }, {
        latitude: destinationLatitude,
        longitude: destinationLongitude,
      })
      .then((nextRoute) => {
        if (isMounted) {
          setRoute(nextRoute);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [destinationLatitude, destinationLongitude, pickupLatitude, pickupLongitude]);

  return (
    <ScreenContainer contentStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Active trip</Text>
        <Text style={styles.title}>Pickup passenger</Text>
      </View>

      <Card style={styles.passengerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{trip.customer.name.charAt(0)}</Text>
        </View>
        <View style={styles.passengerCopy}>
          <Text style={styles.passengerLabel}>Passenger</Text>
          <Text style={styles.passengerName}>{trip.customer.name}</Text>
        </View>
      </Card>

      <Card style={styles.routeCard}>
        <View style={styles.routeRow}>
          <View style={styles.pickupMarker} />
          <View style={styles.routeCopy}>
            <Text style={styles.routeLabel}>Pickup address</Text>
            <Text style={styles.routeValue}>{trip.pickup.address}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.routeRow}>
          <View style={styles.destinationMarker} />
          <View style={styles.routeCopy}>
            <Text style={styles.routeLabel}>Destination address</Text>
            <Text style={styles.routeValue}>{trip.destination.address}</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.detailsCard}>
        <DetailRow label="Estimated fare" value={fareEstimate.displayAmountWithCurrency} />
        <DetailRow label="Estimated distance" value={distanceLabel} />
        <DetailRow label="Estimated duration" value={durationLabel} />
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
          setDriverState('waiting_for_passenger');
          router.push({
            pathname: '/driver-pickup',
            params: {
              ...toDestinationRouteParams(selectedDestination),
              ...toFareRouteParams(fareEstimate),
              ...toRouteMetricParams(route),
            },
          });
        }}
        pressedStyle={styles.buttonPressed}
        style={styles.primaryButton}
        textStyle={styles.primaryButtonText}>
        Arrived at Pickup
      </PrimaryButton>
    </ScreenContainer>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.r25,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  avatarText: {
    color: colors.black,
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: 0,
  },
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
  detailLabel: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
  },
  detailRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  detailValue: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'right',
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.r30,
    padding: spacing.s18,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
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
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.r30,
    flexDirection: 'row',
    gap: spacing.s14,
    padding: spacing.s18,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
  },
  passengerCopy: {
    flex: 1,
    gap: spacing.xs,
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
    fontSize: 22,
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
  title: {
    color: colors.black,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 41,
  },
});
