import {
  createDemoUserLocation,
  getRouteMetricsFromParams,
  type Coordinates,
  type RoutePoint,
} from '@/domains/locations';
import { getSelectedDestinationFromParams, type SelectedDestination } from '@/domains/places';
import { calculateFare, getFareFromParams, type FareEstimate } from '@/domains/pricing';
import {
  assignedDemoDriver,
  getSelectedDemoPaymentMethod,
  type DemoDriver,
  type DemoPaymentMethod,
} from '@/shared/demo/demoData';

export type TripStatus =
  | 'requested'
  | 'accepted'
  | 'arriving'
  | 'waiting'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type TripCustomer = {
  id: string;
  name: string;
  phoneNumber?: string;
};

export type TripDriver = DemoDriver;

export type TripLocation = {
  address: string;
  coordinates?: Coordinates;
  label: string;
  placeId?: string;
  source?: SelectedDestination['source'] | 'device';
};

export type TripRoute = {
  distanceMeters?: number;
  durationSeconds?: number;
  encodedPolyline?: string;
  waypoints?: RoutePoint[];
};

export type TripTimestamps = {
  acceptedAt?: string;
  arrivedAtPickupAt?: string;
  cancelledAt?: string;
  completedAt?: string;
  createdAt: string;
  startedAt?: string;
};

export type TripPaymentMethod = Pick<DemoPaymentMethod, 'id' | 'label'>;

export type Trip = {
  customer: TripCustomer;
  destination: TripLocation;
  driver?: TripDriver;
  fare: FareEstimate;
  id: string;
  notes?: string;
  paymentMethod: TripPaymentMethod;
  pickup: TripLocation;
  route: TripRoute;
  status: TripStatus;
  timestamps: TripTimestamps;
};

export const demoTripCustomer: TripCustomer = {
  id: 'demo-customer-sarah-johnson',
  name: 'Sarah Johnson',
  phoneNumber: '+16135550102',
};

const demoTripId = 'demo-trip-001';
const demoTimestamp = '2026-01-01T00:00:00.000Z';

function getPickupLocation(): TripLocation {
  const userLocation = createDemoUserLocation();

  return {
    address: userLocation.addressLabel ?? 'Current Location',
    coordinates: userLocation.coordinates,
    label: userLocation.addressLabel ?? 'Current Location',
    source: userLocation.source ?? 'demo',
  };
}

function getDestinationLocation(destination: SelectedDestination): TripLocation {
  return {
    address: destination.displayName,
    coordinates: destination.coordinates,
    label: destination.primaryText,
    placeId: destination.placeId,
    source: destination.source,
  };
}

function getTripStatusFromParams(params: Record<string, string | string[] | undefined>): TripStatus {
  const status = Array.isArray(params.tripStatus) ? params.tripStatus[0] : params.tripStatus;

  if (
    status === 'requested' ||
    status === 'accepted' ||
    status === 'arriving' ||
    status === 'waiting' ||
    status === 'in_progress' ||
    status === 'completed' ||
    status === 'cancelled'
  ) {
    return status;
  }

  return 'requested';
}

function getTripFare(
  params: Record<string, string | string[] | undefined>,
  destination: SelectedDestination,
  route: TripRoute,
) {
  if (params.fareAmountCents) {
    return getFareFromParams(params);
  }

  return calculateFare({
    destination,
    distanceMeters: route.distanceMeters,
  });
}

export function getDemoTripFromParams(params: Record<string, string | string[] | undefined> = {}): Trip {
  const selectedDestination = getSelectedDestinationFromParams(params);
  const routeMetrics = getRouteMetricsFromParams(params);
  const paymentMethod = getSelectedDemoPaymentMethod();
  const route: TripRoute = {
    distanceMeters: routeMetrics.distanceMeters,
    durationSeconds: routeMetrics.durationSeconds,
  };

  return {
    customer: demoTripCustomer,
    destination: getDestinationLocation(selectedDestination),
    driver: assignedDemoDriver,
    fare: getTripFare(params, selectedDestination, route),
    id: demoTripId,
    notes: Array.isArray(params.tripNotes) ? params.tripNotes[0] : params.tripNotes,
    paymentMethod: {
      id: paymentMethod.id,
      label: paymentMethod.label,
    },
    pickup: getPickupLocation(),
    route,
    status: getTripStatusFromParams(params),
    timestamps: {
      createdAt: demoTimestamp,
    },
  };
}

export function getDemoTrip() {
  return getDemoTripFromParams();
}
