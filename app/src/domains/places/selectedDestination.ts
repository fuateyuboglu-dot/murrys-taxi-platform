import type { AddressSearchResult, PlaceSuggestion } from './types';
import type { Coordinates } from '@/domains/locations';
import { getActiveCompany } from '@/domains/company';

const DESTINATION_PARAM_KEYS = {
  displayName: 'destinationDisplayName',
  placeId: 'destinationPlaceId',
  primaryText: 'destinationPrimaryText',
  secondaryText: 'destinationSecondaryText',
  source: 'destinationSource',
} as const;

export type SelectedDestinationSource = PlaceSuggestion['source'] | 'typed';

export type SelectedDestination = {
  displayName: string;
  placeId?: string;
  primaryText: string;
  secondaryText?: string;
  coordinates?: Coordinates;
  source: SelectedDestinationSource;
};

export type DestinationRouteParams = {
  destinationDisplayName?: string;
  destinationLatitude?: string;
  destinationLongitude?: string;
  destinationPlaceId?: string;
  destinationPrimaryText?: string;
  destinationSecondaryText?: string;
  destinationSource?: string;
};

export const fallbackSelectedDestination: SelectedDestination = {
  displayName: 'Arnprior Shopping Centre',
  primaryText: 'Arnprior Shopping Centre',
  secondaryText: getActiveCompany().serviceArea,
  source: 'demo',
};

function getStringParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function normalizeDestinationSource(source: string | undefined): SelectedDestinationSource {
  if (source === 'google' || source === 'typed') {
    return source;
  }

  return 'demo';
}

function getCoordinatesFromParams(
  latitude: string | undefined,
  longitude: string | undefined,
): Coordinates | undefined {
  if (!latitude || !longitude) {
    return undefined;
  }

  const parsedLatitude = Number(latitude);
  const parsedLongitude = Number(longitude);

  if (Number.isNaN(parsedLatitude) || Number.isNaN(parsedLongitude)) {
    return undefined;
  }

  return {
    latitude: parsedLatitude,
    longitude: parsedLongitude,
  };
}

export function createSelectedDestinationFromSearchResult(result: AddressSearchResult): SelectedDestination {
  const suggestion = result.suggestion;
  const source = suggestion?.source ?? 'demo';

  return {
    displayName: suggestion?.description ?? result.address,
    placeId: source === 'google' ? result.id : undefined,
    primaryText: suggestion?.mainText ?? result.label,
    secondaryText: suggestion?.secondaryText ?? result.subtitle,
    source,
  };
}

export function createSelectedDestinationFromText(
  destination: string,
  secondaryText = getActiveCompany().serviceArea,
  source: SelectedDestinationSource = 'demo',
): SelectedDestination {
  const trimmedDestination = destination.trim();
  const displayName = trimmedDestination || fallbackSelectedDestination.displayName;

  return {
    displayName,
    primaryText: displayName,
    secondaryText,
    source,
  };
}

export function getSelectedDestinationFromParams(
  params: Record<string, string | string[] | undefined>,
): SelectedDestination {
  const primaryText = getStringParam(params[DESTINATION_PARAM_KEYS.primaryText]);
  const displayName = getStringParam(params[DESTINATION_PARAM_KEYS.displayName]) ?? primaryText;

  if (!displayName) {
    return fallbackSelectedDestination;
  }

  return {
    displayName,
    coordinates: getCoordinatesFromParams(
      getStringParam(params.destinationLatitude),
      getStringParam(params.destinationLongitude),
    ),
    placeId: getStringParam(params[DESTINATION_PARAM_KEYS.placeId]),
    primaryText: primaryText ?? displayName,
    secondaryText: getStringParam(params[DESTINATION_PARAM_KEYS.secondaryText]),
    source: normalizeDestinationSource(getStringParam(params[DESTINATION_PARAM_KEYS.source])),
  };
}

export function toDestinationRouteParams(destination: SelectedDestination): DestinationRouteParams {
  const params: DestinationRouteParams = {
    destinationDisplayName: destination.displayName,
    destinationPrimaryText: destination.primaryText,
    destinationSource: destination.source,
  };

  if (destination.placeId) {
    params.destinationPlaceId = destination.placeId;
  }

  if (destination.coordinates) {
    params.destinationLatitude = String(destination.coordinates.latitude);
    params.destinationLongitude = String(destination.coordinates.longitude);
  }

  if (destination.secondaryText) {
    params.destinationSecondaryText = destination.secondaryText;
  }

  return params;
}
