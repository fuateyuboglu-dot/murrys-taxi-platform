import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/shared/components';
import { colors, radius, spacing } from '@/shared/theme';

export default function DriverLoginScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Murrys Taxi Driver</Text>
            <Text style={styles.title}>Sign in to drive</Text>
            <Text style={styles.subtitle}>Enter your driver phone number to continue.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Phone number</Text>
            <View style={styles.phoneInputRow}>
              <Text style={styles.prefix}>+1</Text>
              <View style={styles.inputDivider} />
              <TextInput
                autoComplete="tel"
                keyboardType="phone-pad"
                placeholder="613 555 0101"
                placeholderTextColor={colors.placeholderAlt}
                selectionColor={colors.brand}
                style={styles.phoneInput}
                textContentType="telephoneNumber"
              />
            </View>
          </View>

          <PrimaryButton
            onPress={() => router.push('/driver-home')}
            pressedStyle={styles.buttonPressed}
            style={styles.primaryButton}
            textStyle={styles.primaryButtonText}>
            Continue
          </PrimaryButton>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.r32,
    gap: spacing.s12,
    padding: spacing.s18,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.1,
    shadowRadius: 34,
  },
  content: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'space-between',
    maxWidth: 430,
    paddingBottom: spacing.s28,
    paddingHorizontal: spacing.s24,
    paddingTop: spacing.s34,
    width: '100%',
  },
  eyebrow: {
    color: colors.warmText,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  header: {
    gap: spacing.s12,
  },
  inputDivider: {
    backgroundColor: colors.fieldDivider,
    height: 28,
    width: 1,
  },
  keyboardView: {
    flex: 1,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
  phoneInput: {
    color: colors.black,
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0,
    minHeight: 62,
  },
  phoneInputRow: {
    alignItems: 'center',
    backgroundColor: colors.field,
    borderRadius: radius.r22,
    flexDirection: 'row',
    gap: spacing.s14,
    minHeight: 66,
    paddingHorizontal: spacing.s16,
  },
  prefix: {
    color: colors.black,
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 0,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.r28,
    justifyContent: 'center',
    minHeight: 64,
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 28,
  },
  primaryButtonText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 25,
  },
  title: {
    color: colors.black,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 43,
  },
});
