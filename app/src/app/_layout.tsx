import { Stack } from 'expo-router';

import { LocationProvider } from '@/shared/providers/LocationProvider';
import { colors } from '@/shared/theme';

export default function RootLayout() {
  return (
    <LocationProvider>
      <Stack
        screenOptions={{
          animation: 'ios_from_right',
          contentStyle: {
            backgroundColor: colors.background,
          },
          headerShown: false,
        }}
      />
    </LocationProvider>
  );
}
