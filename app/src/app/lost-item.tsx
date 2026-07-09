import { router } from 'expo-router';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Card, PrimaryButton, ScreenContainer } from '@/shared/components';
import { colors, radius, spacing } from '@/shared/theme';

function showDemoConfirmation() {
  const message = 'Demo only: your lost item report has been recorded locally.';

  if (Platform.OS === 'web' && typeof globalThis.alert === 'function') {
    globalThis.alert(message);
    return;
  }

  Alert.alert('Lost item submitted', message);
}

export default function LostItemScreen() {
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
            <Text style={styles.eyebrow}>Support</Text>
            <Text style={styles.title}>Lost item</Text>
          </View>
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>We will help you track it down.</Text>
          <Text style={styles.infoText}>
            Select the related trip and describe what you lost. This is a demo request only.
          </Text>
        </Card>

        <Card style={styles.formCard}>
          <Text style={styles.label}>Trip</Text>
          <View style={styles.tripSelector}>
            <Text style={styles.tripSelectorText}>Recent Arnprior Shopping Centre trip</Text>
            <Text style={styles.chevron}>›</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.label}>Description</Text>
          <TextInput
            multiline
            placeholder="Describe the lost item"
            placeholderTextColor={colors.muted}
            selectionColor={colors.brand}
            style={styles.input}
          />
        </Card>
      </ScrollView>

      <PrimaryButton
        onPress={showDemoConfirmation}
        pressedStyle={styles.buttonPressed}
        style={styles.submitButton}
        textStyle={styles.submitButtonText}>
        Submit
      </PrimaryButton>
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
    shadowOffset: {
      width: 0,
      height: 10,
    },
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
  chevron: {
    color: colors.black,
    fontSize: 27,
    fontWeight: '600',
    lineHeight: 30,
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
    marginVertical: spacing.s16,
  },
  eyebrow: {
    color: colors.warmText,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.r30,
    padding: spacing.s18,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.08,
    shadowRadius: 28,
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
    shadowOffset: {
      width: 0,
      height: 18,
    },
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
  input: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
    minHeight: 130,
    textAlignVertical: 'top',
  },
  label: {
    color: colors.label,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  scrollContent: {
    flexGrow: 1,
    gap: spacing.s16,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.r22,
    justifyContent: 'center',
    minHeight: 64,
    shadowColor: colors.brand,
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowOpacity: 0.26,
    shadowRadius: 26,
  },
  submitButtonText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  title: {
    color: colors.black,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 39,
  },
  tripSelector: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 54,
  },
  tripSelectorText: {
    color: colors.black,
    flex: 1,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
});
