import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Card, PrimaryButton, ScreenContainer } from '@/shared/components';
import { assignedDemoDriver } from '@/shared/demo/demoData';
import { getRouteMetricsFromParams } from '@/domains/locations';
import { getSelectedDestinationFromParams } from '@/domains/places';
import { calculateFare, getFareFromParams } from '@/domains/pricing';
import { demoPassenger, formatDemoRouteDistance, formatDemoRouteDuration } from '@/shared/demo/driverTripDemo';
import { colors, radius, spacing } from '@/shared/theme';

export default function DriverTripCompleteScreen() {
  const routeParams = useLocalSearchParams();
  const selectedDestination = getSelectedDestinationFromParams(routeParams);
  const routeMetrics = getRouteMetricsFromParams(routeParams);
  const fareEstimate = routeParams.fareAmountCents
    ? getFareFromParams(routeParams)
    : calculateFare({
        destination: selectedDestination,
        distanceMeters: routeMetrics.distanceMeters,
      });

  return (
    <ScreenContainer contentStyle={styles.content}>
      <Card style={styles.successCard}>
        <View style={styles.checkIcon}>
          <Text style={styles.checkText}>✓</Text>
        </View>
        <Text style={styles.title}>Trip complete</Text>
        <Text style={styles.fare}>{fareEstimate.displayAmountWithCurrency}</Text>
      </Card>

      <Card style={styles.detailsCard}>
        <DetailRow label="Passenger" value={demoPassenger.name} />
        <DetailRow label="Distance" value={formatDemoRouteDistance(routeMetrics.distanceMeters)} />
        <DetailRow
          label="Duration"
          value={formatDemoRouteDuration(routeMetrics.durationSeconds, assignedDemoDriver.eta)}
        />
      </Card>

      <PrimaryButton
        onPress={() => router.replace('/driver-home')}
        pressedStyle={styles.buttonPressed}
        style={styles.primaryButton}
        textStyle={styles.primaryButtonText}>
        Back Online
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
  checkIcon: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.r36,
    height: 78,
    justifyContent: 'center',
    width: 78,
  },
  checkText: {
    color: colors.black,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 0,
  },
  content: {
    alignSelf: 'center',
    flex: 1,
    gap: spacing.s16,
    justifyContent: 'center',
    maxWidth: 430,
    paddingBottom: spacing.s28,
    paddingHorizontal: spacing.s20,
    paddingTop: spacing.s18,
    width: '100%',
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
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'right',
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
  fare: {
    color: colors.brand,
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 48,
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
  successCard: {
    alignItems: 'center',
    backgroundColor: colors.black,
    borderRadius: radius.r36,
    gap: spacing.s12,
    padding: spacing.s28,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 32,
  },
  title: {
    color: colors.surface,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
  },
});
