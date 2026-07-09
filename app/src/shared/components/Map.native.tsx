import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

import type { Coordinates, DestinationLocation, DriverLocation, Route, UserLocation } from '@/domains/locations';
import { getActiveCompany } from '@/domains/company';
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

const ARNPRIOR_REGION = {
  latitude: 45.4334,
  latitudeDelta: 0.045,
  longitude: -76.3518,
  longitudeDelta: 0.045,
};

const COMPANY_HQ_COORDINATES: Coordinates = {
  latitude: 45.4334,
  longitude: -76.3518,
};

function getMarkerCoordinates(
  userLocation?: UserLocation,
  destinationLocation?: DestinationLocation,
  driverLocation?: DriverLocation,
) {
  return [
    userLocation?.coordinates,
    destinationLocation?.coordinates,
    driverLocation?.coordinates,
  ].filter((coordinate): coordinate is Coordinates => Boolean(coordinate));
}

function getMapRegion(
  userLocation?: UserLocation,
  destinationLocation?: DestinationLocation,
  driverLocation?: DriverLocation,
) {
  const markerCoordinates = getMarkerCoordinates(userLocation, destinationLocation, driverLocation);

  if (!markerCoordinates.length) {
    return ARNPRIOR_REGION;
  }

  const latitudes = markerCoordinates.map((coordinate) => coordinate.latitude);
  const longitudes = markerCoordinates.map((coordinate) => coordinate.longitude);
  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  const minLongitude = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes);

  return {
    latitude: (minLatitude + maxLatitude) / 2,
    latitudeDelta: Math.max((maxLatitude - minLatitude) * 1.5, 0.045),
    longitude: (minLongitude + maxLongitude) / 2,
    longitudeDelta: Math.max((maxLongitude - minLongitude) * 1.5, 0.045),
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
  const company = getActiveCompany();
  const isLiveTrip = variant === 'liveTrip';
  const mapRegion = getMapRegion(userLocation, destinationLocation, driverLocation);
  const routeCoordinates = route?.waypoints.length ? route.waypoints : undefined;

  return (
    <View style={[styles.container, style]}>
      <MapView
        loadingEnabled
        pitchEnabled={false}
        region={mapRegion}
        rotateEnabled={false}
        showsCompass={false}
        showsMyLocationButton={false}
        style={styles.map}>
        <Marker coordinate={COMPANY_HQ_COORDINATES} title={`${company.name} HQ`} />

        {userLocation ? (
          <Marker
            coordinate={userLocation.coordinates}
            pinColor={colors.black}
            title={userLocation.addressLabel ?? 'Current Location'}
          />
        ) : null}

        {driverLocation ? (
          <Marker coordinate={driverLocation.coordinates} pinColor={colors.brand} title="Driver" />
        ) : null}

        {destinationLocation ? (
          <Marker
            coordinate={destinationLocation.coordinates}
            pinColor={colors.black}
            title={destinationLocation.addressLabel ?? 'Destination'}
          />
        ) : null}

        {routeCoordinates ? (
          <Polyline coordinates={routeCoordinates} strokeColor={colors.brand} strokeWidth={5} />
        ) : null}
      </MapView>

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
  container: {
    backgroundColor: colors.black,
    borderRadius: radius.r34,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
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
  homeLabelTitle: {
    color: colors.surface,
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0,
  },
  homeLabelSubtitle: {
    color: colors.routeCaption,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
    marginTop: spacing.xs,
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
  etaValue: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  etaText: {
    color: colors.black,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0,
  },
});
