import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, ScreenContainer } from '@/shared/components';
import { demoPaymentMethods } from '@/shared/demo/demoData';
import { colors, radius, spacing } from '@/shared/theme';

export default function PaymentMethodsScreen() {
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
            <Text style={styles.eyebrow}>Profile</Text>
            <Text style={styles.title}>Payment Methods</Text>
          </View>
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>Current method</Text>
          <Text style={styles.infoText}>Murrys Taxi demo bookings use pay in car only.</Text>
        </Card>

        <Card style={styles.listCard}>
          {demoPaymentMethods.map((method, index) => (
            <View key={method.id}>
              <View style={[styles.methodRow, !method.isAvailable ? styles.methodRowDisabled : null]}>
                <View style={method.isSelected ? styles.selectedDot : styles.unselectedDot} />
                <View style={styles.methodCopy}>
                  <Text style={styles.methodLabel}>{method.label}</Text>
                  <Text style={styles.methodStatus}>{method.isAvailable ? 'Current method' : 'Coming soon'}</Text>
                </View>
              </View>
              {index < demoPaymentMethods.length - 1 ? <View style={styles.divider} /> : null}
            </View>
          ))}
        </Card>
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
    marginLeft: spacing.s32,
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
    fontSize: 27,
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
  methodCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  methodLabel: {
    color: colors.black,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  methodRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.s14,
    minHeight: 64,
  },
  methodRowDisabled: {
    opacity: 0.45,
  },
  methodStatus: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
  scrollContent: {
    flexGrow: 1,
    gap: spacing.s16,
  },
  selectedDot: {
    backgroundColor: colors.brand,
    borderColor: colors.black,
    borderRadius: radius.md,
    borderWidth: 3,
    height: 18,
    width: 18,
  },
  title: {
    color: colors.black,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 39,
  },
  unselectedDot: {
    backgroundColor: colors.dividerStrong,
    borderRadius: radius.md,
    height: 18,
    width: 18,
  },
});
