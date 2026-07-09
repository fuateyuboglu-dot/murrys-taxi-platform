import { getActiveCompany } from '@/domains/company';
import {
  useDriverStore,
  useTripStore,
  type DemoCustomerProfile,
  type DemoDriverRating,
  type DemoFavouritePlace,
  type DemoPaymentMethod,
  type DemoScheduledBooking,
  type DriverProfile,
} from '@/state';

const activeCompany = getActiveCompany();

export type DemoDriver = DriverProfile;

export const demoArnpriorLocalFare = {
  amountCents: 1000,
  currency: activeCompany.currency,
  displayAmount: '$10.00',
  displayAmountWithCurrency: `$10.00 ${activeCompany.currency}`,
};

export const demoCompany = {
  email: activeCompany.supportEmail,
  name: activeCompany.name,
  phoneNumber: activeCompany.supportPhone,
  serviceArea: activeCompany.serviceArea,
  shortName: activeCompany.shortName,
  website: activeCompany.website,
  webSupportPhoneNumber: '+16135550100',
};

export function getDemoCustomerProfile() {
  return useTripStore.getState().customerProfile;
}

export function updateDemoCustomerProfile(profile: DemoCustomerProfile) {
  return useTripStore.getState().updateCustomerProfile(profile);
}

export type { DemoCustomerProfile, DemoDriverRating, DemoFavouritePlace, DemoPaymentMethod, DemoScheduledBooking };

export const demoPaymentMethods: DemoPaymentMethod[] = useTripStore.getState().paymentMethods;

export function getSelectedDemoPaymentMethod() {
  return useTripStore.getState().getSelectedPaymentMethod();
}

export function scheduleDemoBooking(booking: Omit<DemoScheduledBooking, 'id'>) {
  return useTripStore.getState().scheduleBooking(booking);
}

export function getScheduledDemoBooking() {
  return useTripStore.getState().scheduledBooking;
}

export function getDemoFavouritePlaces() {
  return useTripStore.getState().favouritePlaces;
}

export function updateDemoFavouritePlace(placeId: string, address: string) {
  return useTripStore.getState().updateFavouritePlace(placeId, address);
}

export function addDemoFavouritePlace(address: string) {
  return useTripStore.getState().addFavouritePlace(address);
}

export function submitDemoDriverRating(rating: Omit<DemoDriverRating, 'submittedAt'>) {
  return useTripStore.getState().submitDriverRating(rating);
}

export function getLatestDemoDriverRating() {
  return useTripStore.getState().latestDriverRating;
}

export const demoDrivers: DemoDriver[] = useDriverStore.getState().drivers;

export const assignedDemoDriver = useDriverStore.getState().getAssignedDriver();
