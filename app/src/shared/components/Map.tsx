import { Platform, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import type { Coordinates, DestinationLocation, DriverLocation, Route, UserLocation } from '@/domains/locations';
import { colors, radius, spacing } from '@/shared/theme';

type MapVariant = 'home' | 'liveTrip';

type MapProps = {
  destinationLocation?: DestinationLocation;
  driverLocation?: DriverLocation;
  etaLabel?: string;
  isLoading?: boolean;
  label?: string;
  route?: Route;
  style?: StyleProp<ViewStyle>;
  subtitle?: string;
  userLocation?: UserLocation;
  variant?: MapVariant;
};

const MURRYS_TAXI_HQ: Coordinates = {
  latitude: 45.4334,
  longitude: -76.3518,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getMapCoordinates(
  userLocation?: UserLocation,
  destinationLocation?: DestinationLocation,
  driverLocation?: DriverLocation,
) {
  return [
    MURRYS_TAXI_HQ,
    userLocation?.coordinates,
    destinationLocation?.coordinates,
    driverLocation?.coordinates,
  ].filter((coordinate): coordinate is Coordinates => Boolean(coordinate));
}

function getProjectedMarkerStyle(coordinate: Coordinates, mapCoordinates: Coordinates[]) {
  const latitudes = mapCoordinates.map((item) => item.latitude);
  const longitudes = mapCoordinates.map((item) => item.longitude);
  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  const minLongitude = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes);
  const latitudeRange = Math.max(maxLatitude - minLatitude, 0.01);
  const longitudeRange = Math.max(maxLongitude - minLongitude, 0.01);
  const left = clamp(((coordinate.longitude - minLongitude) / longitudeRange) * 76 + 12, 12, 88);
  const top = clamp((1 - (coordinate.latitude - minLatitude) / latitudeRange) * 76 + 12, 12, 88);

  return {
    left: `${left}%` as ViewStyle['left'],
    top: `${top}%` as ViewStyle['top'],
  };
}

export function Map({
  destinationLocation,
  driverLocation,
  etaLabel,
  isLoading = false,
  label = 'Map preview',
  route,
  style,
  subtitle,
  userLocation,
  variant = 'home',
}: MapProps) {
  const isLiveTrip = variant === 'liveTrip';
  const mapCoordinates = getMapCoordinates(userLocation, destinationLocation, driverLocation);

  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.webMap}>
        <View style={[styles.road, styles.roadPrimary]} />
        <View style={[styles.road, styles.roadSecondary]} />
        <View style={[styles.road, styles.roadTertiary]} />
        <View style={[styles.block, styles.blockTop]} />
        <View style={[styles.block, styles.blockBottom]} />
        <View style={styles.routeLine} />
        <View style={[styles.hqMarker, getProjectedMarkerStyle(MURRYS_TAXI_HQ, mapCoordinates)]}>
          <View style={styles.hqMarkerCore} />
        </View>
        {userLocation ? (
          <View style={[styles.pickupMarker, getProjectedMarkerStyle(userLocation.coordinates, mapCoordinates)]} />
        ) : null}
        {destinationLocation ? (
          <View
            style={[
              styles.destinationMarker,
              getProjectedMarkerStyle(destinationLocation.coordinates, mapCoordinates),
            ]}
          />
        ) : null}
        {driverLocation ? (
          <View style={[styles.driverMarker, getProjectedMarkerStyle(driverLocation.coordinates, mapCoordinates)]} />
        ) : null}
      </View>

      {isLiveTrip && etaLabel ? (
        <View style={styles.etaPill}>
          <Text style={styles.etaValue}>{etaLabel}</Text>
          <Text style={styles.etaText}>ETA</Text>
        </View>
      ) : null}

      {!isLiveTrip ? (
        <View style={styles.homeLabel}>
          <Text style={styles.homeLabelTitle}>{isLoading ? 'Loading map' : label}</Text>
          {subtitle ? <Text style={styles.homeLabelSubtitle}>{subtitle}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.surface,
    opacity: 0.08,
    position: 'absolute',
  },
  blockBottom: {
    borderRadius: radius.r30,
    bottom: -28,
    height: 120,
    right: -18,
    transform: [{ rotate: '-12deg' }],
    width: 170,
  },
  blockTop: {
    borderRadius: radius.r24,
    height: 92,
    left: -16,
    top: 28,
    transform: [{ rotate: '-12deg' }],
    width: 150,
  },
  container: {
    backgroundColor: colors.black,
    borderRadius: radius.r34,
    overflow: 'hidden',
  },
  destinationMarker: {
    backgroundColor: colors.black,
    borderColor: colors.surface,
    borderRadius: radius.xs,
    borderWidth: 4,
    height: 24,
    position: 'absolute',
    width: 24,
  },
  driverMarker: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderColor: colors.black,
    borderRadius: radius.r20,
    borderWidth: 4,
    height: 34,
    justifyContent: 'center',
    position: 'absolute',
    width: 34,
  },
  etaPill: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.r24,
    paddingHorizontal: spacing.s16,
    paddingVertical: spacing.xxl,
    position: 'absolute',
    right: spacing.s18,
    top: spacing.s18,
  },
  etaText: {
    color: colors.black,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0,
  },
  etaValue: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  pickupMarker: {
    backgroundColor: colors.surface,
    borderColor: colors.brand,
    borderRadius: radius.lg,
    borderWidth: 4,
    height: 24,
    position: 'absolute',
    width: 24,
  },
  homeLabel: {
    backgroundColor: colors.black,
    borderRadius: radius.r20,
    bottom: spacing.s18,
    left: spacing.s18,
    paddingHorizontal: spacing.s14,
    paddingVertical: spacing.xxl,
    position: 'absolute',
    right: spacing.s18,
  },
  homeLabelSubtitle: {
    color: colors.routeCaption,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
    marginTop: spacing.xs,
  },
  homeLabelTitle: {
    color: colors.surface,
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0,
  },
  hqMarker: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderColor: colors.surface,
    borderRadius: radius.xxl,
    borderWidth: 4,
    height: 36,
    justifyContent: 'center',
    position: 'absolute',
    width: 36,
  },
  hqMarkerCore: {
    backgroundColor: colors.black,
    borderRadius: radius.xs,
    height: 10,
    width: 10,
  },
  road: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    opacity: 0.16,
    position: 'absolute',
  },
  roadPrimary: {
    height: 36,
    left: -40,
    right: -44,
    top: '48%',
    transform: [{ rotate: '-14deg' }],
  },
  roadSecondary: {
    bottom: '18%',
    height: 22,
    left: 44,
    right: -24,
    transform: [{ rotate: '28deg' }],
  },
  roadTertiary: {
    bottom: -12,
    left: '36%',
    top: -20,
    transform: [{ rotate: '18deg' }],
    width: 24,
  },
  routeLine: {
    backgroundColor: colors.brand,
    borderRadius: radius.lg,
    height: 8,
    left: '26%',
    opacity: 0.92,
    position: 'absolute',
    right: '22%',
    top: '52%',
    transform: [{ rotate: '-14deg' }],
  },
  webMap: {
    flex: 1,
  },
});
