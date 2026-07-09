import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '@/shared/theme';
import { PrimaryButton } from '@/shared/components';


export default function OtpVerificationScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Verification</Text>
            <Text style={styles.title}>Enter the 6-digit code</Text>
            <Text style={styles.subtitle}>Use the code sent to your phone number.</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.codeBadge}>
              <Text style={styles.codeBadgeText}>•••</Text>
            </View>
            <Text style={styles.label}>Verification code</Text>
            <TextInput
              autoComplete="sms-otp"
            keyboardType="number-pad"
            maxLength={6}
            placeholder="000000"
            placeholderTextColor={colors.placeholderLight}
            selectionColor={colors.brand}
            style={styles.codeInput}
            textContentType="oneTimeCode"
          />
          </View>

          <PrimaryButton
            onPress={() => router.replace('/home')}
            pressedStyle={styles.buttonPressed}
            style={styles.primaryButton}
            textStyle={styles.primaryButtonText}>
            Verify
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
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.r32,
    gap: spacing.s14,
    padding: spacing.s20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.1,
    shadowRadius: 34,
  },
  codeBadge: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.r20,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  codeBadgeText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
  codeInput: {
    backgroundColor: colors.field,
    borderColor: colors.brand,
    borderRadius: radius.r24,
    borderWidth: 2,
    color: colors.black,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 9,
    minHeight: 76,
    paddingHorizontal: spacing.s18,
    textAlign: 'center',
    width: '100%',
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
