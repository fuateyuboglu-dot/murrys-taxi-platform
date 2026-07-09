import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/shared/theme';
import { PrimaryButton, ScreenContainer, SecondaryButton } from '@/shared/components';
import { getSelectedDestinationFromParams, toDestinationRouteParams } from '@/domains/places';
import { calculateFare, getFareFromParams, toFareRouteParams } from '@/domains/pricing';


export default function SearchingDriverScreen() {
  const routeParams = useLocalSearchParams();
  const selectedDestination = getSelectedDestinationFromParams(routeParams);
  const fareEstimate = routeParams.fareAmountCents
    ? getFareFromParams(routeParams)
    : calculateFare({ destination: selectedDestination });
  const destinationParams = toDestinationRouteParams(selectedDestination);
  const pulse = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          duration: 1100,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          duration: 1100,
          toValue: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [pulse]);

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.32],
  });

  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.28, 0],
  });

  return (
    <ScreenContainer contentStyle={styles.content}>
        <View style={styles.searchCard}>
          <View style={styles.radar}>
            <Animated.View
              style={[
                styles.pulseRing,
                {
                  opacity: pulseOpacity,
                  transform: [{ scale: pulseScale }],
                },
              ]}
            />
            <View style={styles.radarCore}>
              <Text style={styles.radarText}>M</Text>
            </View>
          </View>

          <View style={styles.copy}>
            <Text style={styles.title}>Finding your driver</Text>
            <Text style={styles.subtitle}>
              We are sending your request to nearby Murrys Taxi drivers.
            </Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.routeRow}>
            <View style={styles.pickupMarker} />
            <View style={styles.routeText}>
              <Text style={styles.label}>Pickup</Text>
              <Text style={styles.value}>Current Location</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.routeRow}>
            <View style={styles.destinationMarker} />
            <View style={styles.routeText}>
              <Text style={styles.label}>Destination</Text>
              <Text style={styles.value}>{selectedDestination.displayName}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ride type</Text>
            <Text style={styles.detailValue}>Standard</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estimated fare</Text>
            <Text style={styles.detailValue}>{fareEstimate.displayAmountWithCurrency}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            onPress={() => {
              router.push({
                pathname: '/driver-assigned',
                params: {
                  ...destinationParams,
                  ...toFareRouteParams(fareEstimate),
                },
              });
            }}
            pressedStyle={styles.buttonPressed}
            style={styles.demoButton}
            textStyle={styles.demoButtonText}>
            Simulate Driver Found
          </PrimaryButton>

          <SecondaryButton
            onPress={() => router.back()}
            pressedStyle={styles.buttonPressed}
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}>
            Cancel
          </SecondaryButton>
        </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    alignSelf: 'center',
    flex: 1,
    gap: spacing.s16,
    maxWidth: 430,
    paddingBottom: spacing.s28,
    paddingHorizontal: spacing.s20,
    paddingTop: spacing.s18,
    width: '100%',
  },
  searchCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.r34,
    gap: spacing.s22,
    padding: spacing.s28,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.1,
    shadowRadius: 34,
  },
  radar: {
    alignItems: 'center',
    height: 132,
    justifyContent: 'center',
    width: 132,
  },
  pulseRing: {
    backgroundColor: colors.brand,
    borderRadius: radius.round,
    height: 132,
    position: 'absolute',
    width: 132,
  },
  radarCore: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderColor: colors.black,
    borderRadius: radius.r38,
    borderWidth: 5,
    height: 76,
    justifyContent: 'center',
    shadowColor: colors.brand,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    width: 76,
  },
  radarText: {
    color: colors.black,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 0,
  },
  copy: {
    gap: spacing.xxl,
  },
  title: {
    color: colors.black,
    fontSize: 33,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 38,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.mutedDark,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 25,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: colors.black,
    borderRadius: radius.r30,
    padding: spacing.s18,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.14,
    shadowRadius: 30,
  },
  routeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.s14,
    minHeight: 58,
  },
  pickupMarker: {
    backgroundColor: colors.brand,
    borderColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 3,
    height: 18,
    width: 18,
  },
  destinationMarker: {
    backgroundColor: colors.surface,
    borderRadius: radius.xs,
    height: 18,
    width: 18,
  },
  routeText: {
    flex: 1,
    gap: spacing.xs,
  },
  label: {
    color: colors.brand,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  value: {
    color: colors.surface,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  divider: {
    backgroundColor: colors.routeDark,
    height: 1,
    marginLeft: spacing.s32,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.r30,
    padding: spacing.s18,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.08,
    shadowRadius: 28,
  },
  detailRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  detailLabel: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
  },
  detailValue: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
  },
  actions: {
    gap: spacing.s12,
    marginTop: 'auto',
  },
  demoButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.r22,
    justifyContent: 'center',
    minHeight: 64,
    shadowColor: colors.brand,
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowOpacity: 0.26,
    shadowRadius: 26,
  },
  demoButtonText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  cancelButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.r22,
    justifyContent: 'center',
    minHeight: 56,
  },
  cancelButtonText: {
    color: colors.black,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  buttonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
});
