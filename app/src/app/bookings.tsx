import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, CustomerBottomTabs, ScreenContainer } from '@/shared/components';
import { getScheduledDemoBooking } from '@/shared/demo/demoData';
import { getDemoTrip } from '@/domains/trips';
import { colors, radius, spacing } from '@/shared/theme';

export default function BookingsScreen() {
  const scheduledBooking = getScheduledDemoBooking();
  const trip = getDemoTrip();

  return (
    <ScreenContainer contentStyle={styles.content}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Bookings</Text>
          <Text style={styles.title}>Your rides</Text>
        </View>

        {scheduledBooking ? (
          <Card style={styles.featuredCard}>
            <Text style={styles.cardEyebrow}>Upcoming booking</Text>
            <Text style={styles.cardTitle}>{scheduledBooking.destination}</Text>
            <Text style={styles.cardText}>
              {scheduledBooking.date} at {scheduledBooking.time} • {scheduledBooking.rideType} • {scheduledBooking.fare}
            </Text>
          </Card>
        ) : (
          <Card style={styles.featuredCard}>
            <Text style={styles.cardEyebrow}>Upcoming booking</Text>
            <Text style={styles.cardTitle}>No upcoming rides</Text>
            <Text style={styles.cardText}>Book a local Arnprior taxi when you are ready to go.</Text>
          </Card>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip history</Text>
          <Card style={styles.historyCard}>
            <View style={styles.historyRow}>
              <View style={styles.historyIcon}>
                <Text style={styles.historyIconText}>M</Text>
              </View>
              <View style={styles.historyCopy}>
                <Text style={styles.historyTitle}>{trip.destination.address}</Text>
                <Text style={styles.historyMeta}>Standard Taxi • {trip.paymentMethod.label}</Text>
              </View>
              <Text style={styles.historyFare}>{trip.fare.displayAmountWithCurrency}</Text>
            </View>
          </Card>
        </View>
      </ScrollView>

      <CustomerBottomTabs activeTab="Bookings" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  cardEyebrow: {
    color: colors.brand,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  cardText: {
    color: colors.textOnDarkMuted,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 23,
  },
  cardTitle: {
    color: colors.surface,
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: 0,
  },
  content: {
    alignSelf: 'center',
    flex: 1,
    gap: spacing.s15,
    maxWidth: 430,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.s20,
    paddingTop: spacing.s18,
    width: '100%',
  },
  eyebrow: {
    color: colors.warmText,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  featuredCard: {
    backgroundColor: colors.black,
    borderRadius: radius.r34,
    gap: spacing.s12,
    padding: spacing.s22,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.14,
    shadowRadius: 30,
  },
  header: {
    gap: spacing.md,
  },
  historyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.r30,
    padding: spacing.s18,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
  },
  historyCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  historyFare: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0,
  },
  historyIcon: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.r20,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  historyIconText: {
    color: colors.black,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  historyMeta: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
  historyRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.s14,
  },
  historyTitle: {
    color: colors.black,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  scrollContent: {
    flexGrow: 1,
    gap: spacing.s16,
  },
  section: {
    gap: spacing.s12,
  },
  sectionTitle: {
    color: colors.black,
    fontSize: 19,
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
