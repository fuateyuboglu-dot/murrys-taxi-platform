import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, CustomerBottomTabs, ScreenContainer } from '@/shared/components';
import {
  getDemoCustomerProfile,
  getDemoFavouritePlaces,
  getSelectedDemoPaymentMethod,
} from '@/shared/demo/demoData';
import { colors, radius, spacing } from '@/shared/theme';

export default function ProfileScreen() {
  const customerProfile = getDemoCustomerProfile();
  const favouritePlaces = getDemoFavouritePlaces();
  const homePlace = favouritePlaces.find((place) => place.id === 'home');
  const selectedPaymentMethod = getSelectedDemoPaymentMethod();
  const workPlace = favouritePlaces.find((place) => place.id === 'work');

  return (
    <ScreenContainer contentStyle={styles.content}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>M</Text>
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>Profile</Text>
            <Text style={styles.title}>{customerProfile.name}</Text>
            <Text style={styles.phone}>{customerProfile.phone}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Card style={styles.card}>
            <ProfileRow label="Name" onPress={() => router.push('/edit-profile')} value={customerProfile.name} />
            <View style={styles.divider} />
            <ProfileRow label="Phone" onPress={() => router.push('/edit-profile')} value={customerProfile.phone} />
            <View style={styles.divider} />
            <ProfileRow label="Email" onPress={() => router.push('/edit-profile')} value={customerProfile.email} />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favourite places</Text>
          <Card style={styles.card}>
            <ProfileRow label="Home" value={homePlace?.address ?? 'Add home address'} />
            <View style={styles.divider} />
            <ProfileRow label="Work" value={workPlace?.address ?? 'Add work address'} />
            <View style={styles.divider} />
            <ProfileRow label="Manage" onPress={() => router.push('/favourite-places')} value="Edit favourites" />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Card style={styles.card}>
            <ProfileRow
              label="Payment"
              onPress={() => router.push('/payment-methods')}
              value={selectedPaymentMethod.label}
            />
            <View style={styles.divider} />
            <ProfileRow label="Notifications" value="On" />
            <View style={styles.divider} />
            <ProfileRow label="Language" value="English" />
            <View style={styles.divider} />
            <ProfileRow label="Settings" onPress={() => router.push('/settings')} value="Open" />
          </Card>
        </View>
      </ScrollView>

      <CustomerBottomTabs activeTab="Profile" />
    </ScreenContainer>
  );
}

type ProfileRowProps = {
  label: string;
  onPress?: () => void;
  value: string;
};

function ProfileRow({ label, onPress, value }: ProfileRowProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && onPress ? styles.rowPressed : null]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.r30,
    height: 68,
    justifyContent: 'center',
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.24,
    shadowRadius: 22,
    width: 68,
  },
  avatarText: {
    color: colors.black,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.r30,
    padding: spacing.s18,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
  },
  content: {
    alignSelf: 'center',
    flex: 1,
    gap: spacing.s15,
    maxWidth: 430,
    paddingBottom: spacing.xxl,
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
    backgroundColor: colors.black,
    borderRadius: radius.r34,
    flexDirection: 'row',
    gap: spacing.s16,
    padding: spacing.s22,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.14,
    shadowRadius: 30,
  },
  headerCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  phone: {
    color: colors.textOnDarkMuted,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 52,
  },
  rowPressed: {
    opacity: 0.72,
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
  section: {
    gap: spacing.s12,
  },
  sectionTitle: {
    color: colors.black,
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 0,
  },
  title: {
    color: colors.surface,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
  },
});
