import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Card, PrimaryButton, ScreenContainer, SecondaryButton } from '@/shared/components';
import { setDriverState } from '@/domains/drivers';
import { toFareRouteParams } from '@/domains/pricing';
import { getSelectedDestinationFromParams, toDestinationRouteParams } from '@/domains/places';
import { getDemoTrip } from '@/domains/trips';
import { colors, radius, spacing } from '@/shared/theme';

export default function DriverTripRequestScreen() {
  const trip = getDemoTrip();
  const selectedDestination = getSelectedDestinationFromParams({});
  const driver = trip.driver;

  return (
    <ScreenContainer contentStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Trip request</Text>
        <Text style={styles.title}>New ride available</Text>
      </View>

      <Card style={styles.requestCard}>
        <View style={styles.driverPill}>
          <Text style={styles.driverPillText}>{driver?.eta} away</Text>
        </View>

        <View style={styles.routeRow}>
          <View style={styles.pickupMarker} />
          <View style={styles.routeCopy}>
            <Text style={styles.routeLabel}>Passenger pickup</Text>
            <Text style={styles.routeValue}>{trip.pickup.address}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.routeRow}>
          <View style={styles.destinationMarker} />
          <View style={styles.routeCopy}>
            <Text style={styles.routeLabel}>Destination</Text>
            <Text style={styles.routeValue}>{trip.destination.address}</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.detailsCard}>
        <DetailRow label="Fare" value={trip.fare.displayAmountWithCurrency} />
        <DetailRow label="ETA" value={driver?.eta ?? '4 min'} />
      </Card>

      <View style={styles.actions}>
        <PrimaryButton
          onPress={() => {
            setDriverState('accepted');
            router.push({
              pathname: '/driver-active-trip',
              params: {
                ...toDestinationRouteParams(selectedDestination),
                ...toFareRouteParams(trip.fare),
              },
            });
          }}
          pressedStyle={styles.buttonPressed}
          style={styles.acceptButton}
          textStyle={styles.acceptButtonText}>
          Accept
        </PrimaryButton>

        <SecondaryButton
          onPress={() => {
            setDriverState('waiting');
            router.replace('/driver-home');
          }}
          pressedStyle={styles.buttonPressed}
          style={styles.declineButton}
          textStyle={styles.declineButtonText}>
          Decline
        </SecondaryButton>
      </View>
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
  acceptButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.r28,
    flex: 1,
    justifyContent: 'center',
    minHeight: 62,
  },
  acceptButtonText: {
    color: colors.black,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.s12,
  },
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
  declineButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.r28,
    flex: 1,
    justifyContent: 'center',
    minHeight: 62,
  },
  declineButtonText: {
    color: colors.black,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  destinationMarker: {
    backgroundColor: colors.surface,
    borderRadius: radius.xs,
    height: 18,
    width: 18,
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
    marginLeft: spacing.s32,
  },
  driverPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.brand,
    borderRadius: radius.r20,
    paddingHorizontal: spacing.s14,
    paddingVertical: spacing.lg,
  },
  driverPillText: {
    color: colors.black,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
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
  pickupMarker: {
    backgroundColor: colors.brand,
    borderColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 3,
    height: 18,
    width: 18,
  },
  requestCard: {
    backgroundColor: colors.black,
    borderRadius: radius.r34,
    gap: spacing.s14,
    padding: spacing.s20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 32,
  },
  routeCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  routeLabel: {
    color: colors.brand,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  routeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.s14,
    minHeight: 58,
  },
  routeValue: {
    color: colors.surface,
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
