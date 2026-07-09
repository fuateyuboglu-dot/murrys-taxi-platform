import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, PrimaryButton, ScreenContainer } from '@/shared/components';
import { assignedDemoDriver } from '@/shared/demo/demoData';
import { colors, radius, spacing } from '@/shared/theme';

export default function DriverHomeScreen() {
  const [isOnline, setIsOnline] = useState(false);

  return (
    <ScreenContainer contentStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Driver App</Text>
        <Text style={styles.title}>Welcome, {assignedDemoDriver.name}</Text>
      </View>

      <Card style={styles.driverCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{assignedDemoDriver.name.charAt(0)}</Text>
        </View>
        <View style={styles.driverCopy}>
          <Text style={styles.driverName}>{assignedDemoDriver.name}</Text>
          <Text style={styles.vehicle}>
            {assignedDemoDriver.color} {assignedDemoDriver.vehicle}
          </Text>
          <Text style={styles.plate}>{assignedDemoDriver.plate}</Text>
        </View>
      </Card>

      <Card style={styles.statusCard}>
        <View style={styles.statusTopRow}>
          <View>
            <Text style={styles.statusLabel}>Driver status</Text>
            <Text style={styles.statusTitle}>{isOnline ? 'Online' : 'Offline'}</Text>
          </View>
          <Pressable
            accessibilityLabel="Toggle driver online status"
            accessibilityRole="switch"
            accessibilityState={{ checked: isOnline }}
            onPress={() => setIsOnline((currentValue) => !currentValue)}
            style={({ pressed }) => [
              styles.toggle,
              isOnline ? styles.toggleOnline : null,
              pressed ? styles.buttonPressed : null,
            ]}>
            <View style={[styles.toggleKnob, isOnline ? styles.toggleKnobOnline : null]} />
          </Pressable>
        </View>

        <View style={styles.waitingCard}>
          <Text style={styles.waitingTitle}>Waiting for trips</Text>
          <Text style={styles.waitingText}>
            Demo mode only. Trip requests are opened manually for now.
          </Text>
        </View>
      </Card>

      <PrimaryButton
        onPress={() => router.push('/driver-trip-request')}
        pressedStyle={styles.buttonPressed}
        style={styles.primaryButton}
        textStyle={styles.primaryButtonText}>
        View Demo Trip Request
      </PrimaryButton>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.r28,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  avatarText: {
    color: colors.black,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0,
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
  driverCard: {
    alignItems: 'center',
    backgroundColor: colors.black,
    borderRadius: radius.r34,
    flexDirection: 'row',
    gap: spacing.s14,
    padding: spacing.s20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 32,
  },
  driverCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  driverName: {
    color: colors.surface,
    fontSize: 25,
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
  plate: {
    color: colors.brand,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
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
  statusCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.r32,
    gap: spacing.s16,
    padding: spacing.s18,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
  },
  statusLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  statusTitle: {
    color: colors.black,
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: 0,
  },
  statusTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.black,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 41,
  },
  toggle: {
    backgroundColor: colors.dividerStrong,
    borderRadius: radius.r20,
    height: 38,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    width: 68,
  },
  toggleKnob: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    height: 30,
    width: 30,
  },
  toggleKnobOnline: {
    transform: [{ translateX: 30 }],
  },
  toggleOnline: {
    backgroundColor: colors.brand,
  },
  vehicle: {
    color: colors.textOnDarkMuted,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
  },
  waitingCard: {
    backgroundColor: colors.field,
    borderRadius: radius.r24,
    gap: spacing.xs,
    padding: spacing.s16,
  },
  waitingText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 21,
  },
  waitingTitle: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
});
