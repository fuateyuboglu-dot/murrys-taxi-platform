import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, ScreenContainer } from '@/shared/components';
import { getActiveCompany } from '@/domains/company';
import { colors, radius, spacing } from '@/shared/theme';

export default function SettingsScreen() {
  const company = getActiveCompany();
  const settingsRows = [
    { label: 'Notifications', value: 'On' },
    { label: 'Language', value: 'English' },
    { label: `About ${company.name}`, value: 'Demo app' },
    { label: 'Privacy Policy', value: 'Demo only' },
    { label: 'Terms of Service', value: 'Demo only' },
    { isDisabled: true, label: 'Dark Mode', value: 'Coming Soon' },
  ];

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
            <Text style={styles.title}>Settings</Text>
          </View>
        </View>

        <Card style={styles.listCard}>
          {settingsRows.map((row, index) => (
            <View key={row.label}>
              <View style={[styles.row, row.isDisabled ? styles.rowDisabled : null]}>
                <Text style={styles.rowLabel}>{row.label}</Text>
                <Text style={styles.rowValue}>{row.value}</Text>
              </View>
              {index < settingsRows.length - 1 ? <View style={styles.divider} /> : null}
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
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.r30,
    padding: spacing.s18,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 56,
  },
  rowDisabled: {
    opacity: 0.45,
  },
  rowLabel: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
  },
  rowValue: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0,
    textAlign: 'right',
  },
  scrollContent: {
    flexGrow: 1,
    gap: spacing.s16,
  },
  title: {
    color: colors.black,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 39,
  },
});
