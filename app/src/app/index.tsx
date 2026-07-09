import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/shared/theme';
import { Card, PrimaryButton, ScreenContainer } from '@/shared/components';
import { getActiveCompany } from '@/domains/company';


export default function WelcomeScreen() {
  const company = getActiveCompany();

  return (
    <ScreenContainer contentStyle={styles.content}>
        <View style={styles.hero}>
          <Card style={styles.brandCard}>
            <View style={styles.brandMark}>
              <Text style={styles.brandInitial}>M</Text>
            </View>
            <Text style={styles.serviceArea}>Serving {company.serviceArea}</Text>
          </Card>

          <View style={styles.heroCopy}>
            <Text style={styles.appName}>{company.name}</Text>
            <Text style={styles.tagline}>Fast • Safe • Local</Text>
          </View>
        </View>

        <PrimaryButton
          onPress={() => router.push('/phone-login')}
          pressedStyle={styles.buttonPressed}
          style={styles.primaryButton}
          textStyle={styles.primaryButtonText}>
          Continue with Phone
        </PrimaryButton>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'space-between',
    maxWidth: 430,
    paddingBottom: spacing.s28,
    paddingHorizontal: spacing.s24,
    paddingTop: spacing.s64,
    width: '100%',
  },
  hero: {
    gap: spacing.s44,
  },
  brandCard: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.r34,
    gap: spacing.s16,
    padding: spacing.s18,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.1,
    shadowRadius: 34,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.r30,
    height: 104,
    justifyContent: 'center',
    width: 104,
  },
  brandInitial: {
    color: colors.black,
    fontSize: 46,
    fontWeight: '900',
    letterSpacing: 0,
  },
  serviceArea: {
    color: colors.textTertiary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
  },
  heroCopy: {
    gap: spacing.s12,
  },
  appName: {
    color: colors.black,
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 52,
    textAlign: 'center',
  },
  tagline: {
    color: colors.routeDark,
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 0,
    textAlign: 'center',
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
    fontWeight: '800',
    letterSpacing: 0,
  },
});
