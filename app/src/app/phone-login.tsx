import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '@/shared/theme';
import { PrimaryButton } from '@/shared/components';
import { getActiveCompany } from '@/domains/company';


export default function PhoneLoginScreen() {
  const company = getActiveCompany();

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>{company.name}</Text>
            <Text style={styles.title}>Enter your phone number</Text>
            <Text style={styles.subtitle}>We will use this number to send a verification code.</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Country</Text>
              <Pressable
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.countrySelector,
                  pressed ? styles.surfacePressed : null,
                ]}>
                <View style={styles.countryBadge}>
                  <Text style={styles.countryBadgeText}>CA</Text>
                </View>
                <View style={styles.countryText}>
                  <Text style={styles.countryName}>Canada</Text>
                  <Text style={styles.countryCode}>+1</Text>
                </View>
                <Text style={styles.selectorChevron}>›</Text>
              </Pressable>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Phone number</Text>
              <View style={styles.phoneInputRow}>
                <Text style={styles.prefix}>+1</Text>
                <View style={styles.inputDivider} />
                <TextInput
                  autoComplete="tel"
                  keyboardType="phone-pad"
                  placeholder="613 555 0123"
                  placeholderTextColor={colors.placeholderAlt}
                  selectionColor={colors.brand}
                  style={styles.phoneInput}
                  textContentType="telephoneNumber"
                />
              </View>
            </View>
          </View>

          <PrimaryButton
            onPress={() => router.push('/otp-verification')}
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
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
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
  header: {
    gap: spacing.s12,
  },
  eyebrow: {
    color: colors.warmText,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.black,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 43,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 25,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.r32,
    gap: spacing.s22,
    padding: spacing.s18,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.1,
    shadowRadius: 34,
  },
  fieldGroup: {
    gap: spacing.xl,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
  countrySelector: {
    alignItems: 'center',
    backgroundColor: colors.brandSurface,
    borderRadius: radius.r22,
    flexDirection: 'row',
    gap: spacing.s14,
    minHeight: 66,
    paddingHorizontal: spacing.s14,
  },
  surfacePressed: {
    opacity: 0.76,
  },
  countryBadge: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.xxl,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  countryBadgeText: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0,
  },
  countryText: {
    flex: 1,
    gap: spacing.xxs,
  },
  countryName: {
    color: colors.black,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  countryCode: {
    color: colors.mutedDeep,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0,
  },
  selectorChevron: {
    color: colors.black,
    fontSize: 28,
    fontWeight: '500',
    lineHeight: 30,
  },
  phoneInputRow: {
    alignItems: 'center',
    backgroundColor: colors.field,
    borderRadius: radius.r22,
    flexDirection: 'row',
    minHeight: 66,
    paddingHorizontal: spacing.s16,
  },
  prefix: {
    color: colors.black,
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 0,
  },
  inputDivider: {
    backgroundColor: colors.fieldDivider,
    height: 26,
    marginHorizontal: spacing.s12,
    width: 1,
  },
  phoneInput: {
    color: colors.black,
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0,
    paddingVertical: spacing.none,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.black,
    borderRadius: radius.r20,
    justifyContent: 'center',
    minHeight: 62,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowOpacity: 0.16,
    shadowRadius: 24,
  },
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
});
