import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  submitDemoDriverRating,
} from '@/shared/demo/demoData';
import { colors, radius, spacing } from '@/shared/theme';
import { PrimaryButton, ScreenContainer } from '@/shared/components';
import { getDemoTripFromParams } from '@/domains/trips';


export default function TripCompleteScreen() {
  const routeParams = useLocalSearchParams();
  const trip = getDemoTripFromParams(routeParams);
  const driver = trip.driver;
  const [comment, setComment] = useState('');
  const [hasSubmittedRating, setHasSubmittedRating] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);

  function submitRating() {
    if (!driver) {
      return;
    }

    submitDemoDriverRating({
      comment: comment.trim() || undefined,
      driverId: driver.id,
      rating: selectedRating,
    });
    setHasSubmittedRating(true);
  }

  return (
    <ScreenContainer contentStyle={styles.content}>
        <View style={styles.successCard}>
          <View style={styles.checkIcon}>
            <Text style={styles.checkText}>✓</Text>
          </View>
          <Text style={styles.title}>Trip complete</Text>
          <Text style={styles.fare}>{trip.fare.displayAmountWithCurrency}</Text>
          <Text style={styles.paymentMethod}>{trip.paymentMethod.label}</Text>
          <Text style={styles.destinationText}>To {trip.destination.address}</Text>
        </View>

        <View style={styles.driverCard}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverInitial}>{driver?.name.charAt(0)}</Text>
          </View>
          <View style={styles.driverCopy}>
            <Text style={styles.driverName}>{driver?.name}</Text>
            <Text style={styles.vehicle}>{driver?.vehicle}</Text>
            <Text style={styles.plate}>{driver?.plate}</Text>
          </View>
        </View>

        <View style={styles.ratingCard}>
          <Text style={styles.ratingTitle}>Rate your trip</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((ratingValue) => (
              <Pressable
                accessibilityLabel={`${ratingValue} star rating`}
                accessibilityRole="button"
                key={ratingValue}
                onPress={() => setSelectedRating(ratingValue)}
                style={({ pressed }) => (pressed ? styles.starPressed : null)}>
                <Text style={ratingValue <= selectedRating ? styles.starSelected : styles.starUnselected}>★</Text>
              </Pressable>
            ))}
          </View>

          <TextInput
            multiline
            onChangeText={setComment}
            placeholder="Add an optional comment"
            placeholderTextColor={colors.muted}
            selectionColor={colors.brand}
            style={styles.commentInput}
            value={comment}
          />

          {hasSubmittedRating ? (
            <Text style={styles.thankYouText}>Thanks for rating your driver.</Text>
          ) : (
            <PrimaryButton
              onPress={submitRating}
              pressedStyle={styles.buttonPressed}
              style={styles.ratingButton}
              textStyle={styles.ratingButtonText}>
              Submit Rating
            </PrimaryButton>
          )}
        </View>

        <PrimaryButton
          onPress={() => router.replace('/home')}
          pressedStyle={styles.buttonPressed}
          style={styles.primaryButton}
          textStyle={styles.primaryButtonText}>
          Back to Home
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
    justifyContent: 'center',
    maxWidth: 430,
    paddingBottom: spacing.s28,
    paddingHorizontal: spacing.s20,
    paddingTop: spacing.s18,
    width: '100%',
  },
  successCard: {
    alignItems: 'center',
    backgroundColor: colors.black,
    borderRadius: radius.r36,
    gap: spacing.s12,
    padding: spacing.s28,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.16,
    shadowRadius: 32,
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
  title: {
    color: colors.surface,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
  },
  fare: {
    color: colors.brand,
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 50,
  },
  paymentMethod: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0,
  },
  destinationText: {
    color: colors.textOnDarkMuted,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0,
    textAlign: 'center',
  },
  driverCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.r30,
    flexDirection: 'row',
    gap: spacing.s14,
    padding: spacing.s18,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.08,
    shadowRadius: 28,
  },
  driverAvatar: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.r25,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  driverInitial: {
    color: colors.black,
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: 0,
  },
  driverCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  driverName: {
    color: colors.black,
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0,
  },
  vehicle: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0,
  },
  plate: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
  },
  ratingCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.r30,
    gap: spacing.s12,
    padding: spacing.s20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.08,
    shadowRadius: 28,
  },
  commentInput: {
    alignSelf: 'stretch',
    backgroundColor: colors.background,
    borderRadius: radius.r20,
    color: colors.black,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
    minHeight: 86,
    padding: spacing.s14,
    textAlignVertical: 'top',
  },
  ratingTitle: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  stars: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  starPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.95 }],
  },
  starSelected: {
    color: colors.brand,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0,
  },
  starUnselected: {
    color: colors.dividerStrong,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0,
  },
  ratingButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.black,
    borderRadius: radius.r20,
    justifyContent: 'center',
    minHeight: 54,
  },
  ratingButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
  },
  thankYouText: {
    color: colors.black,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
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
  buttonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
});
