import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Card, PrimaryButton, ScreenContainer, SecondaryButton } from '@/shared/components';
import { getScheduledDemoBooking } from '@/shared/demo/demoData';
import { colors, radius, spacing } from '@/shared/theme';

export default function BookingScheduledScreen() {
  const scheduledBooking = getScheduledDemoBooking();

  return (
    <ScreenContainer contentStyle={styles.content}>
      <Card style={styles.successCard}>
        <View style={styles.checkIcon}>
          <Text style={styles.checkText}>✓</Text>
        </View>
        <Text style={styles.title}>Booking scheduled</Text>
        <Text style={styles.subtitle}>Your demo ride has been added to Bookings.</Text>
      </Card>

      <Card style={styles.summaryCard}>
        <Text style={styles.summaryEyebrow}>Upcoming ride</Text>
        <Text style={styles.summaryTitle}>{scheduledBooking?.destination ?? 'Arnprior Shopping Centre'}</Text>
        <Text style={styles.summaryText}>
          {scheduledBooking ? `${scheduledBooking.date} at ${scheduledBooking.time}` : 'Today at 6:00 PM'}
        </Text>
        <Text style={styles.summaryFare}>{scheduledBooking?.fare ?? '$10.00 CAD'}</Text>
      </Card>

      <View style={styles.actions}>
        <PrimaryButton
          onPress={() => router.replace('/bookings')}
          pressedStyle={styles.buttonPressed}
          style={styles.primaryButton}
          textStyle={styles.primaryButtonText}>
          View Bookings
        </PrimaryButton>
        <SecondaryButton
          onPress={() => router.replace('/home')}
          pressedStyle={styles.buttonPressed}
          style={styles.secondaryButton}
          textStyle={styles.secondaryButtonText}>
          Back to Home
        </SecondaryButton>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.s12,
  },
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
  primaryButton: {
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
  primaryButtonText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.black,
    borderRadius: radius.r22,
    justifyContent: 'center',
    minHeight: 58,
  },
  secondaryButtonText: {
    color: colors.surface,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  subtitle: {
    color: colors.textOnDarkMuted,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 23,
    textAlign: 'center',
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
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.r30,
    gap: spacing.xxl,
    padding: spacing.s20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
  },
  summaryEyebrow: {
    color: colors.warmText,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  summaryFare: {
    color: colors.black,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  summaryText: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
  },
  summaryTitle: {
    color: colors.black,
    fontSize: 22,
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
});
