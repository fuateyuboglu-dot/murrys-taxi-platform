import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, spacing } from '@/shared/theme';
import { PrimaryButton, ScreenContainer, SecondaryButton } from '@/shared/components';
import { getSelectedDemoPaymentMethod } from '@/shared/demo/demoData';
import { getSelectedDestinationFromParams, toDestinationRouteParams } from '@/domains/places';
import { calculateFare, getFareFromParams, toFareRouteParams } from '@/domains/pricing';


export default function BookingConfirmationScreen() {
  const routeParams = useLocalSearchParams();
  const selectedDestination = getSelectedDestinationFromParams(routeParams);
  const fareEstimate = routeParams.fareAmountCents
    ? getFareFromParams(routeParams)
    : calculateFare({ destination: selectedDestination });
  const destinationParams = toDestinationRouteParams(selectedDestination);
  const selectedPaymentMethod = getSelectedDemoPaymentMethod();

  return (
    <ScreenContainer contentStyle={styles.content}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed ? styles.buttonPressed : null]}>
            <Text style={styles.backButtonText}>‹</Text>
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>Booking</Text>
            <Text style={styles.title}>Confirm your ride</Text>
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
          <DetailRow label="Ride type" value="Standard" />
          <DetailRow label="Estimated fare" value={fareEstimate.displayAmountWithCurrency} />
          <DetailRow label="Payment" value={selectedPaymentMethod.label} />
        </View>

        <View style={styles.notesCard}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            multiline
            placeholder="Add note for driver"
            placeholderTextColor={colors.muted}
            selectionColor={colors.brand}
            style={styles.notesInput}
          />
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            onPress={() => {
              router.push({
                pathname: '/searching-driver',
                params: {
                  ...destinationParams,
                  ...toFareRouteParams(fareEstimate),
                },
              });
            }}
            pressedStyle={styles.buttonPressed}
            style={styles.primaryButton}
            textStyle={styles.primaryButtonText}>
            Confirm Booking
          </PrimaryButton>

          <SecondaryButton
            onPress={() => router.back()}
            pressedStyle={styles.buttonPressed}
            style={styles.secondaryButton}
            textStyle={styles.secondaryButtonText}>
            Back
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
    paddingTop: spacing.xxl,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.s14,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.r22,
    height: 48,
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    width: 48,
  },
  backButtonText: {
    color: colors.black,
    fontSize: 34,
    fontWeight: '500',
    lineHeight: 36,
  },
  headerCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  eyebrow: {
    color: colors.warmText,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.black,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 35,
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
    color: colors.label,
    fontSize: 13,
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
  notesCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.r30,
    gap: spacing.xxl,
    padding: spacing.s18,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.08,
    shadowRadius: 28,
  },
  notesInput: {
    backgroundColor: colors.field,
    borderRadius: radius.r22,
    color: colors.black,
    fontSize: 17,
    fontWeight: '700',
    minHeight: 92,
    padding: spacing.s16,
    textAlignVertical: 'top',
  },
  actions: {
    gap: spacing.s12,
    marginTop: 'auto',
  },
  primaryButton: {
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
  primaryButtonText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.r22,
    justifyContent: 'center',
    minHeight: 56,
  },
  secondaryButtonText: {
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
