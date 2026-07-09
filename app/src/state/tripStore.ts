import { create } from 'zustand';

import { emit } from '@/core/events';
import type { Trip } from '@/domains/trips/trip';
import { initialDemoCompany } from './companyStore';

export type DemoCustomerProfile = {
  email: string;
  name: string;
  phone: string;
};

export type DemoPaymentMethod = {
  id: string;
  isAvailable: boolean;
  isSelected: boolean;
  label: string;
};

export type DemoScheduledBooking = {
  date: string;
  destination: string;
  fare: string;
  id: string;
  pickup: string;
  rideType: string;
  time: string;
};

export type DemoFavouritePlace = {
  address: string;
  id: string;
  label: string;
};

export type DemoDriverRating = {
  comment?: string;
  driverId: string;
  rating: number;
  submittedAt: string;
};

type TripStore = {
  currentTrip?: Trip;
  customerProfile: DemoCustomerProfile;
  favouritePlaces: DemoFavouritePlace[];
  latestDriverRating: DemoDriverRating | null;
  paymentMethods: DemoPaymentMethod[];
  scheduledBooking: DemoScheduledBooking | null;
  addFavouritePlace: (address: string) => DemoFavouritePlace;
  assignTripDriver: (driver: Trip['driver']) => Trip | undefined;
  completeCurrentTrip: () => Trip | undefined;
  getSelectedPaymentMethod: () => DemoPaymentMethod;
  scheduleBooking: (booking: Omit<DemoScheduledBooking, 'id'>) => DemoScheduledBooking;
  startCurrentTrip: () => Trip | undefined;
  setCurrentTrip: (trip: Trip) => void;
  submitDriverRating: (rating: Omit<DemoDriverRating, 'submittedAt'>) => DemoDriverRating;
  updateCustomerProfile: (profile: DemoCustomerProfile) => DemoCustomerProfile;
  updateFavouritePlace: (placeId: string, address: string) => DemoFavouritePlace[];
};

export const useTripStore = create<TripStore>((set, get) => ({
  currentTrip: undefined,
  customerProfile: {
    email: 'rider@murrystaxi.demo',
    name: `${initialDemoCompany.shortName} Rider`,
    phone: '+1 613 555 0101',
  },
  favouritePlaces: [
    {
      address: initialDemoCompany.serviceArea,
      id: 'home',
      label: 'Home',
    },
    {
      address: 'Add work address',
      id: 'work',
      label: 'Work',
    },
  ],
  latestDriverRating: null,
  paymentMethods: [
    {
      id: 'pay-in-car',
      isAvailable: true,
      isSelected: true,
      label: 'Pay in car',
    },
    {
      id: 'card',
      isAvailable: false,
      isSelected: false,
      label: 'Credit/Debit Card',
    },
    {
      id: 'apple-pay',
      isAvailable: false,
      isSelected: false,
      label: 'Apple Pay',
    },
    {
      id: 'google-pay',
      isAvailable: false,
      isSelected: false,
      label: 'Google Pay',
    },
  ],
  scheduledBooking: null,
  addFavouritePlace: (address) => {
    const nextPlace: DemoFavouritePlace = {
      address,
      id: `favourite-${Date.now()}`,
      label: 'Favourite',
    };

    set((state) => ({
      favouritePlaces: [...state.favouritePlaces, nextPlace],
    }));

    return nextPlace;
  },
  assignTripDriver: (driver) => {
    const currentTrip = get().currentTrip;

    if (!currentTrip) {
      return undefined;
    }

    const assignedTrip: Trip = {
      ...currentTrip,
      driver,
      status: 'accepted',
      timestamps: {
        ...currentTrip.timestamps,
        acceptedAt: new Date().toISOString(),
      },
    };

    set({ currentTrip: assignedTrip });
    emit('trip_assigned', { driver, trip: assignedTrip });

    return assignedTrip;
  },
  completeCurrentTrip: () => {
    const currentTrip = get().currentTrip;

    if (!currentTrip) {
      return undefined;
    }

    const completedTrip: Trip = {
      ...currentTrip,
      status: 'completed',
      timestamps: {
        ...currentTrip.timestamps,
        completedAt: new Date().toISOString(),
      },
    };

    set({ currentTrip: completedTrip });
    emit('trip_completed', { trip: completedTrip });

    return completedTrip;
  },
  getSelectedPaymentMethod: () =>
    get().paymentMethods.find((method) => method.isSelected) ?? get().paymentMethods[0],
  scheduleBooking: (booking) => {
    const scheduledBooking = {
      ...booking,
      id: `scheduled-${Date.now()}`,
    };

    set({ scheduledBooking });

    return scheduledBooking;
  },
  setCurrentTrip: (trip) => {
    set({ currentTrip: trip });

    if (trip.status === 'requested') {
      emit('trip_requested', { trip });
    }
  },
  startCurrentTrip: () => {
    const currentTrip = get().currentTrip;

    if (!currentTrip) {
      return undefined;
    }

    const startedTrip: Trip = {
      ...currentTrip,
      status: 'in_progress',
      timestamps: {
        ...currentTrip.timestamps,
        startedAt: new Date().toISOString(),
      },
    };

    set({ currentTrip: startedTrip });
    emit('trip_started', { trip: startedTrip });

    return startedTrip;
  },
  submitDriverRating: (rating) => {
    const latestDriverRating = {
      ...rating,
      submittedAt: new Date().toISOString(),
    };

    set({ latestDriverRating });

    return latestDriverRating;
  },
  updateCustomerProfile: (profile) => {
    set({ customerProfile: profile });

    return profile;
  },
  updateFavouritePlace: (placeId, address) => {
    const favouritePlaces = get().favouritePlaces.map((place) =>
      place.id === placeId
        ? {
            ...place,
            address,
          }
        : place,
    );

    set({ favouritePlaces });

    return favouritePlaces;
  },
}));
