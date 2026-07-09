import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Card, PrimaryButton, ScreenContainer } from '@/shared/components';
import { assignedDemoDriver } from '@/shared/demo/demoData';
import { getRouteMetricsFromParams } from '@/domains/locations';
import { getSelectedDestinationFromParams, toDestinationRouteParams } from '@/domains/places';
import { calculateFare, getFareFromParams, toFareRouteParams } from '@/domains/pricing';
import { demoPassenger, formatDemoRouteDistance, formatDemoRouteDuration } from '@/shared/demo/driverTripDemo';
import { colors, radius, spacing } from '@/shared/theme';

export default function DriverDrivingScreen() {
  const routeParams = useLocalSearchParams();
  const selectedDestination = getSelectedDestinationFromParams(routeParams);
  const routeMetrics = getRouteMetricsFromParams(routeParams);
  const fareEstimate = routeParams.fareAmountCents
    ? getFareFromParams(routeParams)
    : calculateFare({
        destination: selectedDestination,
        distanceMeters: routeMetrics.distanceMeters,
      });
  const etaLabel = formatDemoRouteDuration(routeMetrics.durationSeconds, assignedDemoDriver.eta);
  const distanceLabel = formatDemoRouteDistance(routeMetrics.distanceMeters);

  return (
    <ScreenContainer contentStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Driving</Text>
        <Text style={styles.title}>Trip in progress</Text>
      </View>

      <Card style={styles.liveTripCard}>
        <Text style={styles.liveLabel}>Live trip</Text>
        <Text style={styles.passenger}>{demoPassenger.name}</Text>
        <View style={styles.divider} />
        <Text style={styles.destinationLabel}>Destination</Text>
        <Text style={styles.destinationValue}>{selectedDestination.displayName}</Text>
      </Card>

      <Card style={styles.detailsCard}>
        <DetailRow label="ETA" value={etaLabel} />
        <DetailRow label="Distance remaining" value={distanceLabel} />
      </Card>

      <PrimaryButton
        onPress={() => {
          router.push({
            pathname: '/driver-trip-complete',
            params: {
              ...toDestinationRouteParams(selectedDestination),
              ...toFareRouteParams(fareEstimate),
              routeDistanceMeters: routeMetrics.distanceMeters ? String(routeMetrics.distanceMeters) : undefined,
              routeDurationSeconds: routeMetrics.durationSeconds ? String(routeMetrics.durationSeconds) : undefined,
            },
          });
        }}
        pressedStyle={styles.buttonPressed}
        style={styles.primaryButton}
        textStyle={styles.primaryButtonText}>
        Complete Trip
      </PrimaryButton>
    </ScreenContainer>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
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
  destinationLabel: {
    color: colors.brand,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  destinationValue: {
    color: colors.surface,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 30,
  },
  detailLabel: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
  },
  detailRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  detailValue: {
    color: colors.black,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.r30,
    padding: spacing.s18,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
  },
  divider: {
    backgroundColor: colors.routeDark,
    height: 1,
    marginVertical: spacing.s16,
  },
  eyebrow: {
    color: colors.warmText,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  header: {
    gap: spacing.md,
  },
  liveLabel: {
    color: colors.brand,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  liveTripCard: {
    backgroundColor: colors.black,
    borderRadius: radius.r34,
    padding: spacing.s22,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 32,
  },
  passenger: {
    color: colors.surface,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: spacing.s12,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.r28,
    justifyContent: 'center',
    minHeight: 62,
  },
  primaryButtonText: {
    color: colors.black,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  title: {
    color: colors.black,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 41,
  },
});
