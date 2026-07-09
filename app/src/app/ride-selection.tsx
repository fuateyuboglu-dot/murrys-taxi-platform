import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/shared/theme';
import { PrimaryButton, ScreenContainer } from '@/shared/components';
import { getSelectedDestinationFromParams, toDestinationRouteParams } from '@/domains/places';
import { calculateFare, toFareRouteParams } from '@/domains/pricing';


export default function RideSelectionScreen() {
  const routeParams = useLocalSearchParams();
  const selectedDestination = getSelectedDestinationFromParams(routeParams);
  const fareEstimate = calculateFare({ destination: selectedDestination });
  const destinationParams = toDestinationRouteParams(selectedDestination);
  const rideOptions = [
    {
      id: 'standard',
      name: 'Standard Taxi',
      arrival: '4 min',
      duration: '12 min',
      price: fareEstimate.displayAmountWithCurrency,
    },
  ];

  return (
    <ScreenContainer contentStyle={styles.content}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed ? styles.buttonPressed : null]}>
            <Text style={styles.backButtonText}>‹</Text>
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>Choose ride</Text>
            <Text style={styles.title}>Select your taxi</Text>
          </View>
        </View>

        <View style={styles.routeCard}>
          <View style={styles.routeRow}>
            <View style={styles.pickupMarker} />
            <View style={styles.routeCopy}>
              <Text style={styles.routeLabel}>Pickup</Text>
              <Text style={styles.routeValue}>Current Location</Text>
            </View>
          </View>

          <View style={styles.routeDivider} />

          <View style={styles.routeRow}>
            <View style={styles.destinationMarker} />
            <View style={styles.routeCopy}>
              <Text style={styles.routeLabel}>Destination</Text>
              <Text style={styles.routeValue}>{selectedDestination.displayName}</Text>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.rideList}
          showsVerticalScrollIndicator={false}>
          {rideOptions.map((ride) => {
            return (
              <Pressable
                accessibilityRole="button"
                key={ride.id}
                style={({ pressed }) => [
                  styles.rideCard,
                  styles.rideCardSelected,
                  pressed ? styles.cardPressed : null,
                ]}>
                <View style={[styles.vehicleIcon, styles.vehicleIconSelected]}>
                  <Text
                    style={[
                      styles.vehicleIconText,
                      styles.vehicleIconTextSelected,
                    ]}>
                    {ride.name.charAt(0)}
                  </Text>
                </View>

                <View style={styles.rideDetails}>
                  <View style={styles.rideHeader}>
                    <Text style={styles.rideName}>{ride.name}</Text>
                    <Text style={styles.ridePrice}>{ride.price}</Text>
                  </View>
                  <Text style={styles.rideMeta}>
                    Fare: {ride.price} • {ride.arrival} away • {ride.duration} trip
                  </Text>
                </View>

                <View style={styles.selectedDot} />
              </Pressable>
            );
          })}
        </ScrollView>

        <PrimaryButton
          onPress={() => {
            router.push({
              pathname: '/booking-confirmation',
              params: {
                ...destinationParams,
                ...toFareRouteParams(fareEstimate),
              },
            });
          }}
          pressedStyle={styles.buttonPressed}
          style={styles.continueButton}
          textStyle={styles.continueButtonText}>
          Continue
        </PrimaryButton>
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
    paddingTop: spacing.xxl,
    width: '100%',
  },
  topBar: {
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
  routeCard: {
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
    minHeight: 56,
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
  routeValue: {
    color: colors.surface,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  routeDivider: {
    backgroundColor: colors.routeDark,
    height: 1,
    marginLeft: spacing.s32,
  },
  rideList: {
    gap: spacing.s12,
    paddingBottom: spacing.xxs,
  },
  rideCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.surface,
    borderRadius: radius.r28,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.s14,
    minHeight: 92,
    padding: spacing.s14,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.07,
    shadowRadius: 22,
  },
  rideCardSelected: {
    borderColor: colors.brand,
    transform: [{ scale: 1.01 }],
  },
  cardPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
  vehicleIcon: {
    alignItems: 'center',
    backgroundColor: colors.black,
    borderRadius: radius.r22,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  vehicleIconSelected: {
    backgroundColor: colors.brand,
  },
  vehicleIconText: {
    color: colors.surface,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0,
  },
  vehicleIconTextSelected: {
    color: colors.black,
  },
  rideDetails: {
    flex: 1,
    gap: spacing.md,
  },
  rideHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rideName: {
    color: colors.black,
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 0,
  },
  ridePrice: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  rideMeta: {
    color: colors.mutedAlt,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0,
  },
  selectedDot: {
    backgroundColor: colors.brand,
    borderColor: colors.black,
    borderRadius: radius.sm,
    borderWidth: 3,
    height: 18,
    width: 18,
  },
  unselectedDot: {
    backgroundColor: colors.surface,
    borderColor: colors.selectedBorder,
    borderRadius: radius.sm,
    borderWidth: 2,
    height: 18,
    width: 18,
  },
  continueButton: {
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
  buttonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
  continueButtonText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
});
