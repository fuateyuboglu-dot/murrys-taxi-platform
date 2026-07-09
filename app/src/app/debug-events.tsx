import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  getRecentEvents,
  subscribe,
  taxiOsEventNames,
  type TaxiOsEventLogEntry,
} from '@/core/events';
import { Card, ScreenContainer } from '@/shared/components';
import { colors, radius, spacing } from '@/shared/theme';

function formatEventTime(timestamp: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(timestamp));
}

function summarizePayload(entry: TaxiOsEventLogEntry) {
  const payload = entry.payload;

  if ('state' in payload) {
    return `Driver state: ${payload.state}`;
  }

  if ('driver' in payload && payload.driver) {
    return `${payload.driver.name} assigned to ${payload.trip.destination.address}`;
  }

  if ('trip' in payload) {
    return `${payload.trip.status} • ${payload.trip.pickup.address} to ${payload.trip.destination.address}`;
  }

  return 'Internal event';
}

export default function DebugEventsScreen() {
  const [events, setEvents] = useState<TaxiOsEventLogEntry[]>(() => getRecentEvents());

  useEffect(() => {
    const unsubscribeHandlers = taxiOsEventNames.map((eventName) =>
      subscribe(eventName, () => {
        setEvents(getRecentEvents());
      }),
    );

    return () => {
      unsubscribeHandlers.forEach((unsubscribeHandler) => unsubscribeHandler());
    };
  }, []);

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
            <Text style={styles.eyebrow}>Developer only</Text>
            <Text style={styles.title}>Event Log</Text>
          </View>
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>Taxi OS internal events</Text>
          <Text style={styles.infoText}>Showing the last 25 events emitted in this app session.</Text>
        </Card>

        {events.length > 0 ? (
          <Card style={styles.listCard}>
            {events.map((event, index) => (
              <View key={event.id}>
                <View style={styles.eventRow}>
                  <View style={styles.eventHeader}>
                    <Text style={styles.eventType}>{event.type}</Text>
                    <Text style={styles.eventTime}>{formatEventTime(event.timestamp)}</Text>
                  </View>
                  <Text style={styles.eventSummary}>{summarizePayload(event)}</Text>
                </View>
                {index < events.length - 1 ? <View style={styles.divider} /> : null}
              </View>
            ))}
          </Card>
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No events yet</Text>
            <Text style={styles.emptyText}>
              Trigger a driver status change or booking action, then return here to inspect the event stream.
            </Text>
          </Card>
        )}
      </ScrollView>
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
  divider: {
    backgroundColor: colors.divider,
    height: 1,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.r30,
    gap: spacing.xs,
    padding: spacing.s20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 22,
  },
  emptyTitle: {
    color: colors.black,
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0,
  },
  eventHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.s12,
    justifyContent: 'space-between',
  },
  eventRow: {
    gap: spacing.xs,
    paddingVertical: spacing.s12,
  },
  eventSummary: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 20,
  },
  eventTime: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
  },
  eventType: {
    color: colors.black,
    flex: 1,
    fontSize: 16,
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
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.s14,
  },
  headerCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  infoCard: {
    backgroundColor: colors.black,
    borderRadius: radius.r34,
    gap: spacing.s12,
    padding: spacing.s22,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.14,
    shadowRadius: 30,
  },
  infoText: {
    color: colors.textOnDarkMuted,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 23,
  },
  infoTitle: {
    color: colors.surface,
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: 0,
  },
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.r30,
    padding: spacing.s18,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
  },
  scrollContent: {
    flexGrow: 1,
    gap: spacing.s16,
  },
  title: {
    color: colors.black,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 41,
  },
});
