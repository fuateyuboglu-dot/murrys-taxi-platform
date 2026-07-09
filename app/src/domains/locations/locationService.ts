import * as Location from 'expo-location';

import type { Coordinates, DriverLocation, Route, UserLocation } from './types';

const GOOGLE_ROUTES_COMPUTE_URL = 'https://routes.googleapis.com/directions/v2:computeRoutes';
const GOOGLE_ROUTES_FIELD_MASK = 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline';

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

type GoogleRoutesResponse = {
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
  routes?: {
    distanceMeters?: number;
    duration?: string;
    polyline?: {
      encodedPolyline?: string;
    };
  }[];
};

function getGoogleMapsApiKey() {
  return process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
}

function parseDurationSeconds(duration: string | undefined) {
  if (!duration?.endsWith('s')) {
    return null;
  }

  const seconds = Number(duration.slice(0, -1));

  return Number.isFinite(seconds) ? seconds : null;
}

function decodeEncodedPolyline(encodedPolyline: string) {
  const coordinates: Coordinates[] = [];
  let index = 0;
  let latitude = 0;
  let longitude = 0;

  while (index < encodedPolyline.length) {
    let byte = 0;
    let shift = 0;
    let result = 0;

    do {
      byte = encodedPolyline.charCodeAt(index) - 63;
      index += 1;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    latitude += result & 1 ? ~(result >> 1) : result >> 1;
    shift = 0;
    result = 0;

    do {
      byte = encodedPolyline.charCodeAt(index) - 63;
      index += 1;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    longitude += result & 1 ? ~(result >> 1) : result >> 1;

    coordinates.push({
      latitude: latitude / 100000,
      longitude: longitude / 100000,
    });
  }

  return coordinates;
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
  async getRoute(origin, destination) {
    const googleMapsApiKey = getGoogleMapsApiKey();

    if (!googleMapsApiKey) {
      console.warn('Google Routes fallback', {
        apiKeyStatus: 'missing',
        errorCode: 'MISSING_API_KEY',
        errorMessage: 'EXPO_PUBLIC_GOOGLE_MAPS_API_KEY is missing.',
      });

      return null;
    }

    try {
      const response = await fetch(GOOGLE_ROUTES_COMPUTE_URL, {
        body: JSON.stringify({
          computeAlternativeRoutes: false,
          destination: {
            location: {
              latLng: {
                latitude: destination.latitude,
                longitude: destination.longitude,
              },
            },
          },
          languageCode: 'en-US',
          origin: {
            location: {
              latLng: {
                latitude: origin.latitude,
                longitude: origin.longitude,
              },
            },
          },
          routeModifiers: {
            avoidFerries: false,
            avoidHighways: false,
            avoidTolls: false,
          },
          routingPreference: 'TRAFFIC_AWARE',
          travelMode: 'DRIVE',
          units: 'METRIC',
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': googleMapsApiKey,
          'X-Goog-FieldMask': GOOGLE_ROUTES_FIELD_MASK,
        },
        method: 'POST',
      });
      const data = (await response.json()) as GoogleRoutesResponse;

      if (!response.ok) {
        console.warn('Google Routes request failed, using demo fallback', {
          errorCode: data.error?.status ?? `HTTP_${response.status}`,
          errorMessage: data.error?.message ?? 'Google Routes request failed.',
          responseStatus: response.status,
        });

        return null;
      }

      const googleRoute = data.routes?.[0];
      const durationSeconds = parseDurationSeconds(googleRoute?.duration);
      const encodedPolyline = googleRoute?.polyline?.encodedPolyline;

      if (!googleRoute?.distanceMeters || !durationSeconds || !encodedPolyline) {
        console.warn('Google Routes returned incomplete route data, using demo fallback', {
          errorCode: 'INCOMPLETE_ROUTE',
          responseStatus: response.status,
        });

        return null;
      }

      return {
        destination,
        distanceMeters: googleRoute.distanceMeters,
        durationSeconds,
        id: `google-route-${Date.now()}`,
        origin,
        polyline: encodedPolyline,
        waypoints: decodeEncodedPolyline(encodedPolyline),
      };
    } catch (error) {
      console.warn('Google Routes request errored, using demo fallback', {
        errorMessage: error instanceof Error ? error.message : 'Unknown Google Routes error',
      });

      return null;
    }
  },
};
