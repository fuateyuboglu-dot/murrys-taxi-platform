import { useContext } from 'react';

import { LocationContext } from '@/shared/providers/LocationProvider';

export function useUserLocation() {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error('useUserLocation must be used within LocationProvider');
  }

  return context;
}
