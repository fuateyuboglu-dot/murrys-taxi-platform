import type { AddressSearchResult, PlaceDetails, PlaceSuggestion } from './types';
import { getActiveCompany } from '@/domains/company';

const GOOGLE_PLACES_AUTOCOMPLETE_URL = 'https://places.googleapis.com/v1/places:autocomplete';
const GOOGLE_PLACES_DETAILS_URL = 'https://places.googleapis.com/v1/places';
const GOOGLE_PLACES_FIELD_MASK =
  'suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat.mainText.text,suggestions.placePrediction.structuredFormat.secondaryText.text';
const GOOGLE_PLACE_DETAILS_FIELD_MASK = 'id,formattedAddress,location';

const demoAddressLabels = [
  'Arnprior Shopping Centre',
  'Nick Smith Centre',
  'Robert Simpson Park',
  'Downtown Arnprior',
  'Arnprior Regional Health',
  'Daniel Street South',
  `${getActiveCompany().name} Office`,
  'Ottawa Street',
  'Madawaska Boulevard',
  'Arnprior Public Library',
  'Arnprior District Museum',
  'John Street North',
  'Elgin Street West',
  'McNab Street',
];

function toDemoSearchResult(label: string): AddressSearchResult {
  const company = getActiveCompany();
  const suggestion: PlaceSuggestion = {
    description: `${label}, ${company.serviceArea}`,
    id: `demo-${label.toLowerCase().replaceAll(' ', '-')}`,
    mainText: label,
    secondaryText: company.serviceArea,
    source: 'demo',
  };

  return {
    address: label,
    id: suggestion.id,
    label,
    subtitle: company.serviceArea,
    suggestion,
  };
}

type SearchAddressSuggestionsOptions = {
  signal?: AbortSignal;
};

type GoogleAutocompleteResponse = {
  suggestions?: {
    placePrediction?: {
      placeId?: string;
      structuredFormat?: {
        mainText?: {
          text?: string;
        };
        secondaryText?: {
          text?: string;
        };
      };
      text?: {
        text?: string;
      };
    };
  }[];
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
};

type GooglePlaceDetailsResponse = {
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
  formattedAddress?: string;
  id?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
};

type PlacesDebugStatus = {
  apiKeyStatus: 'exists' | 'missing';
  errorCode?: string;
  errorMessage?: string;
  requestStatus: 'idle' | 'started' | 'success' | 'fallback' | 'error' | 'aborted';
  responseStatus?: number;
  source: 'demo' | 'google';
};

function getGoogleMapsApiKey() {
  return process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown Places API error';
}

function logPlacesDebugStatus(message: string, status: PlacesDebugStatus) {
  const logPayload = {
    apiKeyStatus: status.apiKeyStatus,
    errorCode: status.errorCode,
    errorMessage: status.errorMessage,
    requestStatus: status.requestStatus,
    responseStatus: status.responseStatus,
    source: status.source,
  };

  if (status.requestStatus === 'error') {
    console.warn(message, logPayload);
    return;
  }

  console.info(message, logPayload);
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === 'AbortError';
}

function toGoogleSearchResult(placePrediction: NonNullable<GoogleAutocompleteResponse['suggestions']>[number]['placePrediction']): AddressSearchResult | null {
  if (!placePrediction?.placeId || !placePrediction.text?.text) {
    return null;
  }

  const mainText = placePrediction.structuredFormat?.mainText?.text ?? placePrediction.text.text;
  const secondaryText = placePrediction.structuredFormat?.secondaryText?.text ?? 'Google Places';
  const suggestion: PlaceSuggestion = {
    description: placePrediction.text.text,
    id: placePrediction.placeId,
    mainText,
    secondaryText,
    source: 'google',
  };

  return {
    address: placePrediction.text.text,
    id: placePrediction.placeId,
    label: mainText,
    subtitle: secondaryText,
    suggestion,
  };
}

export type PlacesService = {
  getDemoAddressResults: () => AddressSearchResult[];
  getPlaceDetails: (placeId: string) => Promise<PlaceDetails | null>;
  searchAddressSuggestions: (query: string, options?: SearchAddressSuggestionsOptions) => Promise<AddressSearchResult[]>;
  searchDemoAddresses: (query: string) => AddressSearchResult[];
};

export const placesService: PlacesService = {
  getDemoAddressResults() {
    return demoAddressLabels.map(toDemoSearchResult);
  },

  async getPlaceDetails(placeId) {
    const demoResult = this.getDemoAddressResults().find((result) => result.id === placeId);

    if (demoResult) {
      return {
        address: demoResult.address,
        id: demoResult.id,
        name: demoResult.label,
        source: 'demo',
      };
    }

    const googleMapsApiKey = getGoogleMapsApiKey();
    const apiKeyStatus = googleMapsApiKey ? 'exists' : 'missing';

    if (!googleMapsApiKey) {
      logPlacesDebugStatus('Google Place Details fallback', {
        apiKeyStatus: 'missing',
        errorCode: 'MISSING_API_KEY',
        errorMessage: 'EXPO_PUBLIC_GOOGLE_MAPS_API_KEY is missing.',
        requestStatus: 'fallback',
        source: 'demo',
      });

      return null;
    }

    try {
      logPlacesDebugStatus('Google Place Details request started', {
        apiKeyStatus,
        requestStatus: 'started',
        source: 'google',
      });

      const response = await fetch(`${GOOGLE_PLACES_DETAILS_URL}/${encodeURIComponent(placeId)}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': googleMapsApiKey,
          'X-Goog-FieldMask': GOOGLE_PLACE_DETAILS_FIELD_MASK,
        },
        method: 'GET',
      });
      const data = (await response.json()) as GooglePlaceDetailsResponse;

      if (!response.ok) {
        logPlacesDebugStatus('Google Place Details request failed, keeping destination without coordinates', {
          apiKeyStatus,
          errorCode: data.error?.status ?? `HTTP_${response.status}`,
          errorMessage: data.error?.message ?? 'Google Place Details request failed.',
          requestStatus: 'error',
          responseStatus: response.status,
          source: 'google',
        });

        return null;
      }

      const latitude = data.location?.latitude;
      const longitude = data.location?.longitude;

      if (typeof latitude !== 'number' || typeof longitude !== 'number' || !data.id) {
        logPlacesDebugStatus('Google Place Details returned no coordinates', {
          apiKeyStatus,
          errorCode: 'NO_COORDINATES',
          errorMessage: 'Google Place Details did not include latitude and longitude.',
          requestStatus: 'fallback',
          responseStatus: response.status,
          source: 'google',
        });

        return null;
      }

      logPlacesDebugStatus('Google Place Details request succeeded', {
        apiKeyStatus,
        requestStatus: 'success',
        responseStatus: response.status,
        source: 'google',
      });

      return {
        address: data.formattedAddress ?? placeId,
        coordinates: {
          latitude,
          longitude,
        },
        id: data.id,
        name: data.formattedAddress ?? placeId,
        source: 'google',
      };
    } catch (error) {
      logPlacesDebugStatus('Google Place Details request errored, keeping destination without coordinates', {
        apiKeyStatus,
        errorCode: 'REQUEST_ERROR',
        errorMessage: getErrorMessage(error),
        requestStatus: 'error',
        source: 'google',
      });

      return null;
    }
  },

  async searchAddressSuggestions(query, options) {
    const trimmedQuery = query.trim();
    const googleMapsApiKey = getGoogleMapsApiKey();
    const apiKeyStatus = googleMapsApiKey ? 'exists' : 'missing';

    if (trimmedQuery.length < 2) {
      return this.searchDemoAddresses(trimmedQuery);
    }

    if (!googleMapsApiKey) {
      const status: PlacesDebugStatus = {
        apiKeyStatus: 'missing',
        errorCode: 'MISSING_API_KEY',
        errorMessage: 'EXPO_PUBLIC_GOOGLE_MAPS_API_KEY is missing.',
        requestStatus: 'fallback',
        source: 'demo',
      };
      logPlacesDebugStatus('Google Places fallback', status);

      return this.searchDemoAddresses(trimmedQuery);
    }

    try {
      const startedStatus: PlacesDebugStatus = {
        apiKeyStatus,
        requestStatus: 'started',
        source: 'google',
      };
      logPlacesDebugStatus('Google Places request started', startedStatus);

      const response = await fetch(GOOGLE_PLACES_AUTOCOMPLETE_URL, {
        body: JSON.stringify({
          includedRegionCodes: ['ca'],
          input: trimmedQuery,
          languageCode: 'en',
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': googleMapsApiKey,
          'X-Goog-FieldMask': GOOGLE_PLACES_FIELD_MASK,
        },
        method: 'POST',
        signal: options?.signal,
      });

      const data = (await response.json()) as GoogleAutocompleteResponse;

      if (!response.ok) {
        const errorStatus: PlacesDebugStatus = {
          apiKeyStatus,
          errorCode: data.error?.status ?? `HTTP_${response.status}`,
          errorMessage: data.error?.message ?? 'Google Places API request failed.',
          requestStatus: 'error',
          responseStatus: response.status,
          source: 'demo',
        };
        logPlacesDebugStatus('Google Places request failed, using demo fallback', errorStatus);

        return this.searchDemoAddresses(trimmedQuery);
      }

      const googleResults =
        data.suggestions
          ?.map((suggestion) => toGoogleSearchResult(suggestion.placePrediction))
          .filter((result): result is AddressSearchResult => Boolean(result)) ?? [];

      if (googleResults.length) {
        const successStatus: PlacesDebugStatus = {
          apiKeyStatus,
          requestStatus: 'success',
          responseStatus: response.status,
          source: 'google',
        };
        logPlacesDebugStatus('Google Places request succeeded', successStatus);

        return googleResults;
      }

      const emptyStatus: PlacesDebugStatus = {
        apiKeyStatus,
        errorCode: 'NO_GOOGLE_RESULTS',
        errorMessage: 'Google Places returned no suggestions for this query.',
        requestStatus: 'fallback',
        responseStatus: response.status,
        source: 'demo',
      };
      logPlacesDebugStatus('Google Places returned no results, using demo fallback', emptyStatus);

      return this.searchDemoAddresses(trimmedQuery);
    } catch (error) {
      if (isAbortError(error)) {
        throw error;
      }

      const errorStatus: PlacesDebugStatus = {
        apiKeyStatus,
        errorCode: 'REQUEST_ERROR',
        errorMessage: getErrorMessage(error),
        requestStatus: 'error',
        source: 'demo',
      };
      logPlacesDebugStatus('Google Places request errored, using demo fallback', errorStatus);

      return this.searchDemoAddresses(trimmedQuery);
    }
  },

  searchDemoAddresses(query) {
    const trimmedQuery = query.trim();
    const demoResults = this.getDemoAddressResults();

    if (!trimmedQuery) {
      return demoResults;
    }

    const normalizedQuery = trimmedQuery.toLowerCase();

    return demoResults.filter((result) => result.label.toLowerCase().includes(normalizedQuery));
  },
};
