import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Card, PrimaryButton, ScreenContainer } from '@/shared/components';
import {
  addDemoFavouritePlace,
  getDemoFavouritePlaces,
  updateDemoFavouritePlace,
  type DemoFavouritePlace,
} from '@/shared/demo/demoData';
import { colors, radius, spacing } from '@/shared/theme';

export default function FavouritePlacesScreen() {
  const [favouritePlaces, setFavouritePlaces] = useState<DemoFavouritePlace[]>(() => getDemoFavouritePlaces());
  const [newFavouriteAddress, setNewFavouriteAddress] = useState('');

  function updateAddress(placeId: string, address: string) {
    setFavouritePlaces(updateDemoFavouritePlace(placeId, address));
  }

  function addFavourite() {
    const trimmedAddress = newFavouriteAddress.trim();

    if (!trimmedAddress) {
      return;
    }

    addDemoFavouritePlace(trimmedAddress);
    setFavouritePlaces(getDemoFavouritePlaces());
    setNewFavouriteAddress('');
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
            <Text style={styles.title}>Favourite places</Text>
          </View>
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>Saved places</Text>
          <Text style={styles.infoText}>Edit demo addresses for Home and Work, or add another local favourite.</Text>
        </Card>

        <Card style={styles.formCard}>
          {favouritePlaces.map((place, index) => (
            <View key={place.id}>
              <Text style={styles.label}>{place.label}</Text>
              <TextInput
                onChangeText={(address) => updateAddress(place.id, address)}
                placeholder={`Add ${place.label.toLowerCase()} address`}
                placeholderTextColor={colors.muted}
                selectionColor={colors.brand}
                style={styles.input}
                value={place.address}
              />
              {index < favouritePlaces.length - 1 ? <View style={styles.divider} /> : null}
            </View>
          ))}
        </Card>

        <Card style={styles.formCard}>
          <Text style={styles.label}>Add Favourite</Text>
          <TextInput
            onChangeText={setNewFavouriteAddress}
            placeholder="Add favourite address"
            placeholderTextColor={colors.muted}
            selectionColor={colors.brand}
            style={styles.input}
            value={newFavouriteAddress}
          />
        </Card>
      </ScrollView>

      <PrimaryButton
        onPress={addFavourite}
        pressedStyle={styles.buttonPressed}
        style={styles.saveButton}
        textStyle={styles.saveButtonText}>
        Add Favourite
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
