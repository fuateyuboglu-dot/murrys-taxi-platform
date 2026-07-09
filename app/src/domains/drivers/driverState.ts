import { useDriverStore } from '@/state/driverStore';

export type DriverState =
  | 'offline'
  | 'online'
  | 'waiting'
  | 'trip_requested'
  | 'accepted'
  | 'arriving'
  | 'waiting_for_passenger'
  | 'in_progress'
  | 'completed'
  | 'unavailable';

export function setDriverState(nextState: DriverState) {
  return useDriverStore.getState().setDriverState(nextState);
}

export function getDriverState() {
  return useDriverStore.getState().driverState;
}

export function canReceiveTrips(state: DriverState = getDriverState()) {
  return state === 'online' || state === 'waiting';
}

export function getDriverStateLabel(state: DriverState = getDriverState()) {
  const labels: Record<DriverState, string> = {
    accepted: 'Accepted',
    arriving: 'Arriving',
    completed: 'Completed',
    in_progress: 'In progress',
    offline: 'Offline',
    online: 'Online',
    trip_requested: 'Trip requested',
    unavailable: 'Unavailable',
    waiting: 'Waiting for trips',
    waiting_for_passenger: 'Waiting for passenger',
  };

  return labels[state];
}
