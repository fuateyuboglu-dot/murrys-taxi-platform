import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { placesService, type AddressSearchResult } from '@/domains/places';
import { colors, radius, spacing } from '@/shared/theme';
import { Card, ListRow, ScreenContainer, SectionTitle } from '@/shared/components';
import { getDemoFavouritePlaces } from '@/shared/demo/demoData';


const recentDestinations = ['Arnprior Shopping Centre', 'Nick Smith Centre', 'Robert Simpson Park'];
const suggestedLocations = ['Downtown Arnprior', 'Arnprior Regional Health', 'Daniel Street South'];
const searchResults = ['Murrys Taxi Office', 'Ottawa Street', 'Madawaska Boulevard'];

export default function DestinationSearchScreen() {
  const favouritePlaces = getDemoFavouritePlaces();
  const [addressResults, setAddressResults] = useState<AddressSearchResult[]>(() => placesService.searchDemoAddresses(''));
  const [query, setQuery] = useState('');
  const trimmedQuery = query.trim();

  useEffect(() => {
    const abortController = new AbortController();
    const debounceTimer = setTimeout(() => {
      if (trimmedQuery.length < 2) {
        setAddressResults(placesService.searchDemoAddresses(trimmedQuery));
        return;
      }

      void placesService
        .searchAddressSuggestions(trimmedQuery, {
          signal: abortController.signal,
        })
        .then(setAddressResults)
        .catch((error: unknown) => {
          if (error instanceof Error && error.name === 'AbortError') {
            return;
          }

          setAddressResults(placesService.searchDemoAddresses(trimmedQuery));
        });
    }, 300);

    return () => {
      abortController.abort();
      clearTimeout(debounceTimer);
    };
  }, [trimmedQuery]);

  function continueToRideSelection() {
    router.push('/ride-selection');
  }

  return (
    <ScreenContainer contentStyle={styles.content}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed ? styles.buttonPressed : null]}>
            <Text style={styles.backButtonText}>‹</Text>
          </Pressable>

          <View style={styles.searchInputContainer}>
            <TextInput
              accessibilityLabel="Destination address"
              autoFocus
              editable
              onChangeText={setQuery}
              onSubmitEditing={continueToRideSelection}
              placeholder="Where to?"
              placeholderTextColor={colors.mutedAlt}
              returnKeyType="search"
              selectionColor={colors.brand}
              style={styles.searchInput}
              value={query}
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.heroCard}>
            <Text style={styles.heroEyebrow}>Destination</Text>
            <Text style={styles.heroTitle}>Search your drop-off location</Text>
            {trimmedQuery ? <Text style={styles.queryText}>Searching for {`"${trimmedQuery}"`}</Text> : null}
          </View>

          {trimmedQuery ? (
            <View style={styles.section}>
              <SectionTitle style={styles.sectionTitle}>Filtered demo results</SectionTitle>
              <Card style={styles.listCard}>
                {addressResults.length ? (
                  addressResults.map((item, index) => (
                    <LocationRow
                      key={item.id}
                      marker="D"
                      onPress={continueToRideSelection}
                      showDivider={index < addressResults.length - 1}
                      subtitle={item.subtitle}
                      title={item.label}
                    />
                  ))
                ) : (
                  <LocationRow
                    marker="D"
                    onPress={continueToRideSelection}
                    showDivider={false}
                    title={`Use typed address: ${trimmedQuery}`}
                  />
                )}
              </Card>
              {!addressResults.length ? (
                <Text style={styles.noResultText}>No demo result found. Use typed address for this demo ride.</Text>
              ) : null}
            </View>
          ) : null}

          {!trimmedQuery ? <View style={styles.section}>
            <SectionTitle style={styles.sectionTitle}>Recent destinations</SectionTitle>
            <Card style={styles.listCard}>
              {recentDestinations.map((item, index) => (
                <LocationRow
                  key={item}
                  marker="R"
                  onPress={continueToRideSelection}
                  showDivider={index < recentDestinations.length - 1}
                  title={item}
                />
              ))}
            </Card>
          </View> : null}

          {!trimmedQuery ? <View style={styles.section}>
            <SectionTitle style={styles.sectionTitle}>Favourite places</SectionTitle>
            <View style={styles.favouritesRow}>
              {favouritePlaces.map((item) => (
                <Pressable
                  accessibilityRole="button"
                  key={item.id}
                  onPress={continueToRideSelection}
                  style={({ pressed }) => [
                    styles.favouriteCard,
                    pressed ? styles.buttonPressed : null,
                  ]}>
                  <View style={styles.favouriteIcon}>
                    <Text style={styles.favouriteIconText}>{item.label.charAt(0)}</Text>
                  </View>
                  <Text style={styles.favouriteText}>{item.label}</Text>
                  <Text style={styles.favouriteAddress}>{item.address}</Text>
                </Pressable>
              ))}
            </View>
          </View> : null}

          {!trimmedQuery ? <View style={styles.section}>
            <SectionTitle style={styles.sectionTitle}>Suggested locations</SectionTitle>
            <Card style={styles.listCard}>
              {suggestedLocations.map((item, index) => (
                <LocationRow
                  key={item}
                  marker="S"
                  onPress={continueToRideSelection}
                  showDivider={index < suggestedLocations.length - 1}
                  title={item}
                />
              ))}
            </Card>
          </View> : null}

          {!trimmedQuery ? <View style={styles.section}>
            <SectionTitle style={styles.sectionTitle}>Search results</SectionTitle>
            <Card style={styles.listCard}>
              {searchResults.map((item, index) => (
                <LocationRow
                  key={item}
                  marker="D"
                  onPress={continueToRideSelection}
                  showDivider={index < searchResults.length - 1}
                  title={item}
                />
              ))}
            </Card>
          </View> : null}
        </ScrollView>
    </ScreenContainer>
  );
}

type LocationRowProps = {
  marker: string;
  onPress: () => void;
  showDivider: boolean;
  subtitle?: string;
  title: string;
};

function LocationRow({ marker, onPress, showDivider, subtitle = 'Arnprior and Area', title }: LocationRowProps) {
  return (
    <ListRow
      divider={showDivider ? <View style={styles.divider} /> : null}
      onPress={onPress}
      pressedStyle={styles.rowPressed}
      rowStyle={styles.locationRow}>
        <View style={styles.locationMarker}>
          <Text style={styles.locationMarkerText}>{marker}</Text>
        </View>
        <View style={styles.locationText}>
          <Text style={styles.locationTitle}>{title}</Text>
          <Text style={styles.locationSubtitle}>{subtitle}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
    </ListRow>
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
    maxWidth: 430,
    paddingHorizontal: spacing.s20,
    paddingTop: spacing.xxl,
    width: '100%',
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.s12,
  },
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
  searchInputContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.r24,
    flex: 1,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  searchInput: {
    color: colors.black,
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: 0,
    minHeight: 56,
    paddingHorizontal: spacing.s16,
    paddingVertical: spacing.none,
    width: '100%',
  },
  scrollContent: {
    gap: spacing.s22,
    paddingBottom: spacing.s28,
    paddingTop: spacing.s22,
  },
  heroCard: {
    backgroundColor: colors.black,
    borderRadius: radius.r30,
    gap: spacing.lg,
    padding: spacing.s22,
  },
  heroEyebrow: {
    color: colors.brand,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: colors.surface,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 33,
  },
  queryText: {
    color: colors.textOnDarkMuted,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 22,
  },
  section: {
    gap: spacing.xxl,
  },
  sectionTitle: {
    color: colors.black,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
    paddingHorizontal: spacing.xxs,
  },
  noResultText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 20,
    paddingHorizontal: spacing.xxs,
  },
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.r28,
    paddingHorizontal: spacing.s16,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowOpacity: 0.07,
    shadowRadius: 24,
  },
  locationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.s14,
    minHeight: 72,
  },
  rowPressed: {
    opacity: 0.64,
  },
  locationMarker: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.xxl,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  locationMarkerText: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0,
  },
  locationText: {
    flex: 1,
    gap: spacing.xs,
  },
  locationTitle: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
  },
  locationSubtitle: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
  },
  chevron: {
    color: colors.black,
    fontSize: 26,
    fontWeight: '600',
    lineHeight: 28,
  },
  divider: {
    backgroundColor: colors.divider,
    height: 1,
    marginLeft: spacing.s56,
  },
  favouritesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s12,
  },
  favouriteAddress: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 17,
  },
  favouriteCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.r26,
    gap: spacing.s12,
    maxWidth: '48%',
    minHeight: 116,
    minWidth: '48%',
    padding: spacing.s16,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowOpacity: 0.07,
    shadowRadius: 24,
  },
  favouriteIcon: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.xl,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  favouriteIconText: {
    color: colors.black,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
  },
  favouriteText: {
    color: colors.black,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  buttonPressed: {
    opacity: 0.76,
    transform: [{ scale: 0.99 }],
  },
});
