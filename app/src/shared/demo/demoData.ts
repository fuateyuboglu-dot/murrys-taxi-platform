export type DemoDriver = {
  color: string;
  eta: string;
  id: string;
  name: string;
  plate: string;
  phoneNumber?: string;
  rating: number;
  vehicle: string;
};

export const demoArnpriorLocalFare = {
  amountCents: 1000,
  currency: 'CAD',
  displayAmount: '$10.00',
  displayAmountWithCurrency: '$10.00 CAD',
};

export const demoCompany = {
  name: 'Murrys Taxi',
  phoneNumber: '+16132959335',
  webSupportPhoneNumber: '+16135550100',
};

export type DemoCustomerProfile = {
  email: string;
  name: string;
  phone: string;
};

let demoCustomerProfile: DemoCustomerProfile = {
  email: 'rider@murrystaxi.demo',
  name: 'Murrys Rider',
  phone: '+1 613 555 0101',
};

export function getDemoCustomerProfile() {
  return demoCustomerProfile;
}

export function updateDemoCustomerProfile(profile: DemoCustomerProfile) {
  demoCustomerProfile = profile;

  return demoCustomerProfile;
}

export type DemoPaymentMethod = {
  id: string;
  isAvailable: boolean;
  isSelected: boolean;
  label: string;
};

export const demoPaymentMethods: DemoPaymentMethod[] = [
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
];

export function getSelectedDemoPaymentMethod() {
  return demoPaymentMethods.find((method) => method.isSelected) ?? demoPaymentMethods[0];
}

export type DemoScheduledBooking = {
  date: string;
  destination: string;
  fare: string;
  id: string;
  pickup: string;
  rideType: string;
  time: string;
};

let scheduledDemoBooking: DemoScheduledBooking | null = null;

export function scheduleDemoBooking(booking: Omit<DemoScheduledBooking, 'id'>) {
  scheduledDemoBooking = {
    ...booking,
    id: `scheduled-${Date.now()}`,
  };

  return scheduledDemoBooking;
}

export function getScheduledDemoBooking() {
  return scheduledDemoBooking;
}

export type DemoFavouritePlace = {
  address: string;
  id: string;
  label: string;
};

let demoFavouritePlaces: DemoFavouritePlace[] = [
  {
    address: 'Arnprior, Ontario',
    id: 'home',
    label: 'Home',
  },
  {
    address: 'Add work address',
    id: 'work',
    label: 'Work',
  },
];

export function getDemoFavouritePlaces() {
  return demoFavouritePlaces;
}

export function updateDemoFavouritePlace(placeId: string, address: string) {
  demoFavouritePlaces = demoFavouritePlaces.map((place) =>
    place.id === placeId
      ? {
          ...place,
          address,
        }
      : place,
  );

  return demoFavouritePlaces;
}

export function addDemoFavouritePlace(address: string) {
  const nextPlace: DemoFavouritePlace = {
    address,
    id: `favourite-${Date.now()}`,
    label: 'Favourite',
  };

  demoFavouritePlaces = [...demoFavouritePlaces, nextPlace];

  return nextPlace;
}

export type DemoDriverRating = {
  comment?: string;
  driverId: string;
  rating: number;
  submittedAt: string;
};

let latestDemoDriverRating: DemoDriverRating | null = null;

export function submitDemoDriverRating(rating: Omit<DemoDriverRating, 'submittedAt'>) {
  latestDemoDriverRating = {
    ...rating,
    submittedAt: new Date().toISOString(),
  };

  return latestDemoDriverRating;
}

export function getLatestDemoDriverRating() {
  return latestDemoDriverRating;
}

export const demoDrivers: DemoDriver[] = [
  {
    color: 'Black',
    eta: '4 min',
    id: 'ali',
    name: 'Ali',
    plate: 'GVPF-596',
    phoneNumber: '+16135550101',
    rating: 4.9,
    vehicle: 'Tesla Model Y Long Range',
  },
  {
    color: 'Black',
    eta: '6 min',
    id: 'fatih',
    name: 'Fatih',
    plate: 'MURRYS-02',
    rating: 4.9,
    vehicle: 'Tesla Model 3 Long Range',
  },
];

export const assignedDemoDriver = demoDrivers[0];
