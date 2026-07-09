import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { assignedDemoDriver } from '@/shared/demo/demoData';
import { colors, radius, spacing } from '@/shared/theme';
import { Map, PrimaryButton, ScreenContainer, SecondaryButton } from '@/shared/components';
import { callDriver, messageDriver } from '@/shared/utils/driverContact';
import { getSelectedDestinationFromParams, toDestinationRouteParams } from '@/domains/places';
import { useUserLocation } from '@/shared/hooks/useUserLocation';
import { locationService, type Route } from '@/domains/locations';
import { calculateFare, getFareFromParams, toFareRouteParams } from '@/domains/pricing';


const driverInitials = assignedDemoDriver.name
  .split(' ')
  .map((namePart) => namePart.charAt(0))
  .join('');

function formatRouteDuration(durationSeconds: number) {
  const minutes = Math.max(1, Math.round(durationSeconds / 60));

  return `${minutes} min`;
}

function formatRouteDistance(distanceMeters: number) {
  if (distanceMeters >= 1000) {
    return `${(distanceMeters / 1000).toFixed(1)} km`;
  }

  return `${Math.round(distanceMeters)} m`;
}

export default function LiveTripScreen() {
  const routeParams = useLocalSearchParams();
  const selectedDestination = getSelectedDestinationFromParams(routeParams);
  const { userLocation } = useUserLocation();
  const [route, setRoute] = useState<Route | null>(null);
  const initialFare = routeParams.fareAmountCents
    ? getFareFromParams(routeParams)
    : calculateFare({ destination: selectedDestination });
  const destinationCoordinates = selectedDestination.coordinates;
  const destinationLatitude = destinationCoordinates?.latitude;
  const destinationLongitude = destinationCoordinates?.longitude;
  const pickupLatitude = userLocation.coordinates.latitude;
  const pickupLongitude = userLocation.coordinates.longitude;
  const destinationLocation = selectedDestination.coordinates
    ? {
        addressLabel: selectedDestination.displayName,
        coordinates: selectedDestination.coordinates,
        placeId: selectedDestination.placeId,
        source: selectedDestination.source,
      }
    : undefined;
  const fareEstimate = route
    ? calculateFare({
        destination: selectedDestination,
        distanceMeters: route.distanceMeters,
      })
    : initialFare;
  const destinationParams = toDestinationRouteParams(selectedDestination);
  const routeEtaLabel = route ? formatRouteDuration(route.durationSeconds) : assignedDemoDriver.eta;
  const routeDistanceLabel = route ? formatRouteDistance(route.distanceMeters) : 'Demo route';

  useEffect(() => {
    let isMounted = true;

    if (
      typeof destinationLatitude !== 'number' ||
      typeof destinationLongitude !== 'number'
    ) {
      return;
    }

    void locationService
      .getRoute(
        {
          latitude: pickupLatitude,
          longitude: pickupLongitude,
        },
        {
          latitude: destinationLatitude,
          longitude: destinationLongitude,
        },
      )
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
          <Text style={styles.eyebrow}>Live trip</Text>
          <Text style={styles.title}>On the way</Text>
        </View>

        <Map
          destinationLocation={destinationLocation}
          etaLabel={routeEtaLabel}
          route={route ?? undefined}
          style={styles.mapCard}
          userLocation={userLocation}
          variant="liveTrip"
        />

        <View style={styles.tripCard}>
          <View style={styles.driverRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{driverInitials}</Text>
            </View>
            <View style={styles.driverCopy}>
              <Text style={styles.driverName}>{assignedDemoDriver.name}</Text>
              <Text style={styles.vehicle}>
                {assignedDemoDriver.color} {assignedDemoDriver.vehicle}
              </Text>
              <Text style={styles.plate}>{assignedDemoDriver.plate}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Estimated fare</Text>
            <Text style={styles.fareValue}>{fareEstimate.displayAmountWithCurrency}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Route ETA</Text>
            <Text style={styles.fareValue}>{routeEtaLabel}</Text>
          </View>

          <View style={styles.detailSpacer} />

          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Distance</Text>
            <Text style={styles.fareValue}>{routeDistanceLabel}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.routeRow}>
            <View style={styles.pickupDot} />
            <View style={styles.routeCopy}>
              <Text style={styles.routeLabel}>Pickup</Text>
              <Text style={styles.routeValue}>Current Location</Text>
            </View>
          </View>

          <View style={styles.routeDivider} />

          <View style={styles.routeRow}>
            <View style={styles.destinationDot} />
            <View style={styles.routeCopy}>
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
                pathname: '/trip-complete',
                params: {
                  ...destinationParams,
                  ...toFareRouteParams(fareEstimate),
                },
              });
            }}
            pressedStyle={styles.buttonPressed}
            style={styles.primaryButton}
            textStyle={styles.primaryButtonText}>
            Complete Demo Trip
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
    gap: spacing.s16,
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
  mapCard: {
    flex: 1,
    minHeight: 270,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.16,
    shadowRadius: 32,
  },
  tripCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.r32,
    padding: spacing.s18,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.08,
    shadowRadius: 28,
  },
  driverRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.s14,
  },
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
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0,
  },
  driverCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  driverName: {
    color: colors.black,
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0,
  },
  vehicle: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0,
  },
  plate: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
  },
  divider: {
    backgroundColor: colors.divider,
    height: 1,
    marginVertical: spacing.s16,
  },
  detailSpacer: {
    height: spacing.xxl,
  },
  fareLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  fareRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fareValue: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  routeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.s14,
    minHeight: 48,
  },
  pickupDot: {
    backgroundColor: colors.brand,
    borderColor: colors.black,
    borderRadius: radius.sm,
    borderWidth: 3,
    height: 18,
    width: 18,
  },
  destinationDot: {
    backgroundColor: colors.black,
    borderRadius: radius.xs,
    height: 18,
    width: 18,
  },
  routeCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  routeLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  routeValue: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
  },
  routeDivider: {
    backgroundColor: colors.divider,
    height: 1,
    marginLeft: spacing.s32,
  },
  actions: {
    gap: spacing.s12,
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
    minHeight: 56,
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
