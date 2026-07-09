import type { DispatchResult } from '@/domains/dispatch';
import type { DriverState } from '@/domains/drivers';
import type { Trip } from '@/domains/trips';
import type { DriverProfile } from '@/state';

export type TaxiOsEventMap = {
  driver_offline: {
    state: DriverState;
  };
  driver_online: {
    state: DriverState;
  };
  trip_assigned: {
    driver?: DriverProfile;
    result?: DispatchResult;
    trip: Trip;
  };
  trip_completed: {
    trip: Trip;
  };
  trip_requested: {
    trip: Trip;
  };
  trip_started: {
    trip: Trip;
  };
};

export type TaxiOsEventName = keyof TaxiOsEventMap;
export type TaxiOsEventHandler<EventName extends TaxiOsEventName> = (
  payload: TaxiOsEventMap[EventName],
) => void;
export type TaxiOsEventLogEntry<EventName extends TaxiOsEventName = TaxiOsEventName> = {
  id: string;
  payload: TaxiOsEventMap[EventName];
  timestamp: string;
  type: EventName;
};

const MAX_EVENT_LOG_ENTRIES = 25;
export const taxiOsEventNames: TaxiOsEventName[] = [
  'driver_offline',
  'driver_online',
  'trip_assigned',
  'trip_completed',
  'trip_requested',
  'trip_started',
];
const eventLog: TaxiOsEventLogEntry[] = [];
const listeners = new Map<TaxiOsEventName, Set<TaxiOsEventHandler<TaxiOsEventName>>>();

function getListeners<EventName extends TaxiOsEventName>(eventName: EventName) {
  const eventListeners = listeners.get(eventName) ?? new Set<TaxiOsEventHandler<TaxiOsEventName>>();

  listeners.set(eventName, eventListeners);

  return eventListeners as Set<TaxiOsEventHandler<EventName>>;
}

export function emit<EventName extends TaxiOsEventName>(
  eventName: EventName,
  payload: TaxiOsEventMap[EventName],
) {
  eventLog.unshift({
    id: `${eventName}-${Date.now()}-${eventLog.length}`,
    payload,
    timestamp: new Date().toISOString(),
    type: eventName,
  } as TaxiOsEventLogEntry);

  if (eventLog.length > MAX_EVENT_LOG_ENTRIES) {
    eventLog.length = MAX_EVENT_LOG_ENTRIES;
  }

  getListeners(eventName).forEach((handler) => {
    handler(payload);
  });
}

export function subscribe<EventName extends TaxiOsEventName>(
  eventName: EventName,
  handler: TaxiOsEventHandler<EventName>,
) {
  getListeners(eventName).add(handler);

  return () => unsubscribe(eventName, handler);
}

export function unsubscribe<EventName extends TaxiOsEventName>(
  eventName: EventName,
  handler: TaxiOsEventHandler<EventName>,
) {
  getListeners(eventName).delete(handler);
}

export function getRecentEvents() {
  return [...eventLog];
}
