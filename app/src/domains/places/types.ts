import type { Coordinates } from '@/domains/locations';

export type PlaceSuggestion = {
  description: string;
  id: string;
  mainText: string;
  secondaryText?: string;
  source: 'demo' | 'google';
};

export type PlaceDetails = {
  address: string;
  coordinates?: Coordinates;
  id: string;
  name: string;
  source: 'demo' | 'google';
};

export type AddressSearchResult = {
  address: string;
  id: string;
  label: string;
  subtitle: string;
  suggestion?: PlaceSuggestion;
};
