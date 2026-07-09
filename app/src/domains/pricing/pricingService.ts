import type { SelectedDestination } from '@/domains/places';
import { getActiveCompany } from '@/domains/company';

const LOCAL_FARE_CENTS = 1000;
const AIRPORT_FARE_CENTS = 12000;
const BASE_FARE_CENTS = 1000;
const PER_KM_CENTS = 250;
const ROUNDING_INCREMENT_CENTS = 50;

export type FareEstimate = {
  amountCents: number;
  currency: 'CAD';
  displayAmount: string;
  displayAmountWithCurrency: string;
  fareType: 'local' | 'airport' | 'distance' | 'fallback';
};

export type FareRouteParams = {
  fareAmountCents?: string;
  fareType?: string;
};

export type CalculateFareInput = {
  destination?: SelectedDestination;
  distanceMeters?: number;
};

function formatFare(amountCents: number, fareType: FareEstimate['fareType']): FareEstimate {
  const company = getActiveCompany();
  const displayAmount = `$${(amountCents / 100).toFixed(2)}`;

  return {
    amountCents,
    currency: company.currency,
    displayAmount,
    displayAmountWithCurrency: `${displayAmount} ${company.currency}`,
    fareType,
  };
}

function roundToNearestFareIncrement(amountCents: number) {
  return Math.round(amountCents / ROUNDING_INCREMENT_CENTS) * ROUNDING_INCREMENT_CENTS;
}

function normalizeText(value: string | undefined) {
  return value?.toLowerCase() ?? '';
}

function isAirportDestination(destination: SelectedDestination | undefined) {
  const displayName = normalizeText(destination?.displayName);
  const primaryText = normalizeText(destination?.primaryText);

  return (
    displayName.includes('ottawa international airport') ||
    displayName.includes('ottawa airport') ||
    primaryText.includes('ottawa international airport') ||
    primaryText.includes('ottawa airport') ||
    primaryText.includes('yow')
  );
}

function isArnpriorLocalDestination(destination: SelectedDestination | undefined) {
  if (!destination) {
    return true;
  }

  const searchableText = [
    destination.displayName,
    destination.primaryText,
    destination.secondaryText,
  ]
    .map(normalizeText)
    .join(' ');

  return searchableText.includes('arnprior') && !isAirportDestination(destination);
}

function getStringParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function calculateFare({ destination, distanceMeters }: CalculateFareInput) {
  if (isAirportDestination(destination)) {
    return formatFare(AIRPORT_FARE_CENTS, 'airport');
  }

  if (isArnpriorLocalDestination(destination)) {
    return formatFare(LOCAL_FARE_CENTS, 'local');
  }

  if (typeof distanceMeters === 'number' && Number.isFinite(distanceMeters) && distanceMeters > 0) {
    const distanceKilometers = distanceMeters / 1000;
    const distanceFareCents = roundToNearestFareIncrement(BASE_FARE_CENTS + distanceKilometers * PER_KM_CENTS);

    return formatFare(distanceFareCents, 'distance');
  }

  return formatFare(LOCAL_FARE_CENTS, 'fallback');
}

export function getFareFromParams(params: Record<string, string | string[] | undefined>) {
  const amountCents = Number(getStringParam(params.fareAmountCents));
  const fareType = getStringParam(params.fareType);

  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    return calculateFare({});
  }

  return formatFare(
    amountCents,
    fareType === 'airport' || fareType === 'distance' || fareType === 'local' ? fareType : 'fallback',
  );
}

export function toFareRouteParams(fare: FareEstimate): FareRouteParams {
  return {
    fareAmountCents: String(fare.amountCents),
    fareType: fare.fareType,
  };
}
