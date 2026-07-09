import * as Location from 'expo-location';

import type { Coordinates, DriverLocation, Route, UserLocation } from './types';

export type LocationService = {
  getCurrentUserLocation: () => Promise<UserLocation | null>;
  getDriverLocation: (driverId: string) => Promise<DriverLocation | null>;
  getRoute: (origin: Coordinates, destination: Coordinates) => Promise<Route | null>;
};

export const ARNPRIOR_DEMO_COORDINATES: Coordinates = {
  latitude: 45.4334,
  longitude: -76.3518,
};

export function createDemoUserLocation(): UserLocation {
  return {
    addressLabel: 'Arnprior demo location',
    coordinates: ARNPRIOR_DEMO_COORDINATES,
    source: 'demo',
    timestamp: new Date().toISOString(),
  };
}

export const locationService: LocationService = {
  async getCurrentUserLocation() {
    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== Location.PermissionStatus.GRANTED) {
        return createDemoUserLocation();
      }

      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        accuracyMeters: currentPosition.coords.accuracy ?? undefined,
        addressLabel: 'Current Location',
        coordinates: {
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude,
        },
        source: 'device',
        timestamp: new Date(currentPosition.timestamp).toISOString(),
      };
    } catch {
      return createDemoUserLocation();
    }
  },
  async getDriverLocation() {
    return null;
  },
  async getRoute() {
    return null;
  },
};
