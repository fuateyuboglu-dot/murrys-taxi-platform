import { emit } from '@/core/events';
import { canReceiveTrips, getDriverState, type DriverState } from '@/domains/drivers';
import type { Trip, TripDriver } from '@/domains/trips';

export type DispatchStatus =
  | 'no_drivers_available'
  | 'driver_recommended'
  | 'assigned';

export type DispatchDriverCandidate = TripDriver & {
  state?: DriverState;
};

export type DispatchInput = {
  availableDrivers: DispatchDriverCandidate[];
  trip: Trip;
};

export type DispatchResult = {
  recommendedDriver?: DispatchDriverCandidate;
  status: DispatchStatus;
};

function getCandidateState(candidate: DispatchDriverCandidate) {
  return candidate.state ?? getDriverState();
}

function scoreDriver(candidate: DispatchDriverCandidate, trip: Trip) {
  const candidateState = getCandidateState(candidate);
  let score = 0;

  if (candidateState === 'waiting') {
    score += 30;
  }

  if (candidateState === 'online') {
    score += 20;
  }

  if (candidate.id === trip.driver?.id) {
    score += 15;
  }

  if (candidate.id === 'ali') {
    score += 10;
  }

  return score;
}

export function dispatchTrip({ availableDrivers, trip }: DispatchInput): DispatchResult {
  const eligibleDrivers = availableDrivers.filter((driver) => canReceiveTrips(getCandidateState(driver)));

  if (eligibleDrivers.length === 0) {
    return {
      status: 'no_drivers_available',
    };
  }

  const [recommendedDriver] = [...eligibleDrivers].sort(
    (leftDriver, rightDriver) => scoreDriver(rightDriver, trip) - scoreDriver(leftDriver, trip),
  );

  const result: DispatchResult = {
    recommendedDriver,
    status: recommendedDriver.id === trip.driver?.id ? 'assigned' : 'driver_recommended',
  };

  if (result.status === 'assigned') {
    emit('trip_assigned', {
      driver: recommendedDriver,
      result,
      trip,
    });
  }

  return result;
}
