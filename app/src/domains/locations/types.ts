export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type UserLocation = {
  accuracyMeters?: number;
  addressLabel?: string;
  coordinates: Coordinates;
  source?: 'demo' | 'device';
  timestamp: string;
};

export type DriverLocation = {
  driverId: string;
  headingDegrees?: number;
  coordinates: Coordinates;
  timestamp: string;
};

export type RoutePoint = Coordinates;

export type Route = {
  distanceMeters: number;
  durationSeconds: number;
  destination: Coordinates;
  id: string;
  origin: Coordinates;
  polyline?: string;
  waypoints: RoutePoint[];
};
