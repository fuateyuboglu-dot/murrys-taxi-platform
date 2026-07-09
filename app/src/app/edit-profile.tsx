import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Card, PrimaryButton, ScreenContainer } from '@/shared/components';
import { getDemoCustomerProfile, updateDemoCustomerProfile } from '@/shared/demo/demoData';
import { colors, radius, spacing } from '@/shared/theme';

export default function EditProfileScreen() {
  const customerProfile = getDemoCustomerProfile();
  const [email, setEmail] = useState(customerProfile.email);
  const [name, setName] = useState(customerProfile.name);
  const [phone, setPhone] = useState(customerProfile.phone);

  function saveProfile() {
    updateDemoCustomerProfile({
      email,
      name,
      phone,
    });

    router.replace('/profile');
  }

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
            <Text style={styles.title}>Edit profile</Text>
          </View>
        </View>

        <Card style={styles.formCard}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor={colors.muted}
            selectionColor={colors.brand}
            style={styles.input}
            value={name}
          />

          <View style={styles.divider} />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            inputMode="tel"
            onChangeText={setPhone}
            placeholder="Phone"
            placeholderTextColor={colors.muted}
            selectionColor={colors.brand}
            style={styles.input}
            value={phone}
          />

          <View style={styles.divider} />

          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            inputMode="email"
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={colors.muted}
            selectionColor={colors.brand}
            style={styles.input}
            value={email}
          />
        </Card>
      </ScrollView>

      <PrimaryButton
        onPress={saveProfile}
        pressedStyle={styles.buttonPressed}
        style={styles.saveButton}
        textStyle={styles.saveButtonText}>
        Save Profile
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
    shadowOffset: { width: 0, height: 16 },
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
  input: {
    color: colors.black,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
    minHeight: 48,
  },
  label: {
    color: colors.label,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.r22,
    justifyContent: 'center',
    minHeight: 64,
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.26,
    shadowRadius: 26,
  },
  saveButtonText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
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
