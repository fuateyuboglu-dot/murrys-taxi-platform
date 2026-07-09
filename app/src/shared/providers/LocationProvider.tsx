import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';

import { createDemoUserLocation, locationService } from '@/domains/locations';
import type { Coordinates, UserLocation } from '@/domains/locations';

type LocationContextValue = {
  coordinates: Coordinates;
  isLoading: boolean;
  refreshLocation: () => Promise<void>;
  userLocation: UserLocation;
};

export const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: PropsWithChildren) {
  const [userLocation, setUserLocation] = useState<UserLocation>(() => createDemoUserLocation());
  const [isLoading, setIsLoading] = useState(true);

  const refreshLocation = useCallback(async () => {
    setIsLoading(true);

    try {
      const nextLocation = await locationService.getCurrentUserLocation();
      setUserLocation(nextLocation ?? createDemoUserLocation());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(refreshLocation);
  }, [refreshLocation]);

  const value = useMemo(
    () => ({
      coordinates: userLocation.coordinates,
      isLoading,
      refreshLocation,
      userLocation,
    }),
    [isLoading, refreshLocation, userLocation],
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}
