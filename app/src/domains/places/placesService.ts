import type { AddressSearchResult, PlaceDetails, PlaceSuggestion } from './types';

const GOOGLE_PLACES_AUTOCOMPLETE_URL = 'https://places.googleapis.com/v1/places:autocomplete';

const demoAddressLabels = [
  'Arnprior Shopping Centre',
  'Nick Smith Centre',
  'Robert Simpson Park',
  'Downtown Arnprior',
  'Arnprior Regional Health',
  'Daniel Street South',
  'Murrys Taxi Office',
  'Ottawa Street',
  'Madawaska Boulevard',
  'Arnprior Public Library',
  'Arnprior District Museum',
  'John Street North',
  'Elgin Street West',
  'McNab Street',
];

function toDemoSearchResult(label: string): AddressSearchResult {
  const suggestion: PlaceSuggestion = {
    description: `${label}, Arnprior and Area`,
    id: `demo-${label.toLowerCase().replaceAll(' ', '-')}`,
    mainText: label,
    secondaryText: 'Arnprior and Area',
    source: 'demo',
  };

  return {
    address: label,
    id: suggestion.id,
    label,
    subtitle: 'Arnprior and Area',
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
};

function getGoogleMapsApiKey() {
  return process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
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

    if (!demoResult) {
      return null;
    }

    return {
      address: demoResult.address,
      id: demoResult.id,
      name: demoResult.label,
      source: 'demo',
    };
  },

  async searchAddressSuggestions(query, options) {
    const trimmedQuery = query.trim();
    const googleMapsApiKey = getGoogleMapsApiKey();

    if (trimmedQuery.length < 2 || !googleMapsApiKey) {
      return this.searchDemoAddresses(trimmedQuery);
    }

    try {
      const response = await fetch(GOOGLE_PLACES_AUTOCOMPLETE_URL, {
        body: JSON.stringify({
          includedRegionCodes: ['ca'],
          input: trimmedQuery,
          languageCode: 'en',
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': googleMapsApiKey,
          'X-Goog-FieldMask':
            'suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat.mainText.text,suggestions.placePrediction.structuredFormat.secondaryText.text',
        },
        method: 'POST',
        signal: options?.signal,
      });

      if (!response.ok) {
        return this.searchDemoAddresses(trimmedQuery);
      }

      const data = (await response.json()) as GoogleAutocompleteResponse;
      const googleResults =
        data.suggestions
          ?.map((suggestion) => toGoogleSearchResult(suggestion.placePrediction))
          .filter((result): result is AddressSearchResult => Boolean(result)) ?? [];

      return googleResults.length ? googleResults : this.searchDemoAddresses(trimmedQuery);
    } catch (error) {
      if (isAbortError(error)) {
        throw error;
      }

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
