import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Card, PrimaryButton, ScreenContainer } from '@/shared/components';
import { demoArnpriorLocalFare, scheduleDemoBooking } from '@/shared/demo/demoData';
import { colors, radius, spacing } from '@/shared/theme';

const DEMO_PICKUP = 'Current Location';
const DEMO_DESTINATION = 'Arnprior Shopping Centre';

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getTomorrowDateInput() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return formatDateInput(tomorrow);
}

function getDateTimeFromInputs(date: string, time: string) {
  const parsedDateTime = new Date(`${date}T${time}:00`);

  if (Number.isNaN(parsedDateTime.getTime())) {
    return null;
  }

  return parsedDateTime;
}

export default function ScheduleRideScreen() {
  const [date, setDate] = useState(() => getTomorrowDateInput());
  const [scheduleError, setScheduleError] = useState('');
  const [time, setTime] = useState('18:00');

  function scheduleRide() {
    const scheduledDateTime = getDateTimeFromInputs(date, time);

    if (!scheduledDateTime) {
      setScheduleError('Enter a valid future date and time.');
      return;
    }

    if (scheduledDateTime <= new Date()) {
      setScheduleError('Choose a future date and time.');
      return;
    }

    setScheduleError('');

    scheduleDemoBooking({
      date,
      destination: DEMO_DESTINATION,
      fare: demoArnpriorLocalFare.displayAmountWithCurrency,
      pickup: DEMO_PICKUP,
      rideType: 'Standard Taxi',
      time,
    });

    router.push('/booking-scheduled');
  }

  return (
    <ScreenContainer contentStyle={styles.content}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed ? styles.buttonPressed : null]}>
            <Text style={styles.backButtonText}>‹</Text>
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>Book later</Text>
            <Text style={styles.title}>Schedule your ride</Text>
          </View>
        </View>

        <Card style={styles.formCard}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            inputMode="numeric"
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.muted}
            selectionColor={colors.brand}
            style={styles.input}
            value={date}
          />
          <Text style={styles.helperText}>Use YYYY-MM-DD. Past dates are not allowed.</Text>

          <View style={styles.divider} />

          <Text style={styles.label}>Time</Text>
          <TextInput
            inputMode="numeric"
            onChangeText={setTime}
            placeholder="HH:MM"
            placeholderTextColor={colors.muted}
            selectionColor={colors.brand}
            style={styles.input}
            value={time}
          />
          <Text style={styles.helperText}>Use 24-hour time, for example 18:00.</Text>
          {scheduleError ? <Text style={styles.errorText}>{scheduleError}</Text> : null}
        </Card>

        <Card style={styles.summaryCard}>
          <View style={styles.routeRow}>
            <View style={styles.pickupMarker} />
            <View style={styles.routeCopy}>
              <Text style={styles.routeLabel}>Pickup</Text>
              <Text style={styles.routeValue}>{DEMO_PICKUP}</Text>
            </View>
          </View>

          <View style={styles.routeDivider} />

          <View style={styles.routeRow}>
            <View style={styles.destinationMarker} />
            <View style={styles.routeCopy}>
              <Text style={styles.routeLabel}>Destination</Text>
              <Text style={styles.routeValue}>{DEMO_DESTINATION}</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.fareCard}>
          <Text style={styles.fareLabel}>Estimated fare</Text>
          <Text style={styles.fareValue}>{demoArnpriorLocalFare.displayAmountWithCurrency}</Text>
        </Card>
      </ScrollView>

      <PrimaryButton
        onPress={scheduleRide}
        pressedStyle={styles.buttonPressed}
        style={styles.scheduleButton}
        textStyle={styles.scheduleButtonText}>
        Schedule Ride
      </PrimaryButton>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.r22,
    height: 48,
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 10 },
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
  destinationMarker: {
    backgroundColor: colors.surface,
    borderRadius: radius.xs,
    height: 18,
    width: 18,
  },
  divider: {
    backgroundColor: colors.divider,
    height: 1,
    marginVertical: spacing.s14,
  },
  eyebrow: {
    color: colors.warmText,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  fareCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.r30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.s18,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
  },
  fareLabel: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
  },
  fareValue: {
    color: colors.black,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.r30,
    padding: spacing.s18,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.s14,
  },
  headerCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  input: {
    color: colors.black,
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 0,
    minHeight: 48,
    paddingVertical: spacing.lg,
  },
  helperText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: spacing.xs,
  },
  errorText: {
    color: colors.black,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: spacing.s12,
  },
  label: {
    color: colors.label,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  pickupMarker: {
    backgroundColor: colors.brand,
    borderColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 3,
    height: 18,
    width: 18,
  },
  routeCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  routeDivider: {
    backgroundColor: colors.routeDark,
    height: 1,
    marginLeft: spacing.s32,
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
    minHeight: 56,
  },
  routeValue: {
    color: colors.surface,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  scheduleButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.r22,
    justifyContent: 'center',
    minHeight: 64,
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.26,
    shadowRadius: 26,
  },
  scheduleButtonText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  scrollContent: {
    flexGrow: 1,
    gap: spacing.s16,
  },
  summaryCard: {
    backgroundColor: colors.black,
    borderRadius: radius.r30,
    padding: spacing.s18,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.14,
    shadowRadius: 30,
  },
  title: {
    color: colors.black,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 39,
  },
});
