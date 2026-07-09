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

let currentDriverState: DriverState = 'offline';

export function setDriverState(nextState: DriverState) {
  currentDriverState = nextState;

  return currentDriverState;
}

export function getDriverState() {
  return currentDriverState;
}

export function canReceiveTrips(state: DriverState = currentDriverState) {
  return state === 'online' || state === 'waiting';
}

export function getDriverStateLabel(state: DriverState = currentDriverState) {
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
