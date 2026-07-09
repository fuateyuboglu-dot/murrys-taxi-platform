export { placesService } from './placesService';
export {
  createSelectedDestinationFromSearchResult,
  createSelectedDestinationFromText,
  fallbackSelectedDestination,
  getSelectedDestinationFromParams,
  toDestinationRouteParams,
} from './selectedDestination';
export type { PlacesService } from './placesService';
export type { DestinationRouteParams, SelectedDestination, SelectedDestinationSource } from './selectedDestination';
export type { AddressSearchResult, PlaceDetails, PlaceSuggestion } from './types';
