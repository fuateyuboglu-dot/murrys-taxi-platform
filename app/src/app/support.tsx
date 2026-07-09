import { router } from 'expo-router';
import { Alert, Linking, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, CustomerBottomTabs, ListRow, ScreenContainer } from '@/shared/components';
import { demoCompany } from '@/shared/demo/demoData';
import { colors, radius, spacing } from '@/shared/theme';

function showSupportAlert(message: string) {
  if (Platform.OS === 'web' && typeof globalThis.alert === 'function') {
    globalThis.alert(message);
    return;
  }

  Alert.alert('Murrys Taxi Support', message);
}

async function callMurrysTaxi() {
  if (Platform.OS === 'web') {
    showSupportAlert(`Call Murrys Taxi: ${demoCompany.webSupportPhoneNumber}`);
    return;
  }

  await Linking.openURL(`tel:${demoCompany.phoneNumber}`);
}

async function messageSupport() {
  if (Platform.OS === 'web') {
    showSupportAlert(`Message Murrys Taxi: ${demoCompany.webSupportPhoneNumber}`);
    return;
  }

  await Linking.openURL(`sms:${demoCompany.phoneNumber}`);
}

export default function SupportScreen() {
  return (
    <ScreenContainer contentStyle={styles.content}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Support</Text>
          <Text style={styles.title}>How can we help?</Text>
        </View>

        <Card style={styles.heroCard}>
          <Text style={styles.heroTitle}>{demoCompany.name}</Text>
          <Text style={styles.heroText}>Fast local support for Arnprior and Area.</Text>
        </Card>

        <Card style={styles.listCard}>
          <SupportRow description={demoCompany.phoneNumber} glyph="C" label="Call Murrys Taxi" onPress={callMurrysTaxi} />
          <View style={styles.divider} />
          <SupportRow description="Send an SMS to support" glyph="M" label="Message support" onPress={messageSupport} />
          <View style={styles.divider} />
          <SupportRow
            description="Tell us what you left behind"
            glyph="L"
            label="Lost item"
            onPress={() => router.push('/lost-item')}
          />
        </Card>
      </ScrollView>

      <CustomerBottomTabs activeTab="Support" />
    </ScreenContainer>
  );
}

type SupportRowProps = {
  description: string;
  glyph: string;
  label: string;
  onPress: () => void;
};

function SupportRow({ description, glyph, label, onPress }: SupportRowProps) {
  return (
    <ListRow onPress={onPress} pressedStyle={styles.rowPressed} rowStyle={styles.row}>
      <View style={styles.rowIcon}>
        <Text style={styles.rowIconText}>{glyph}</Text>
      </View>
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{label}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </ListRow>
  );
}

const styles = StyleSheet.create({
  chevron: {
    color: colors.black,
    fontSize: 27,
    fontWeight: '600',
    lineHeight: 30,
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
    marginLeft: 62,
  },
  eyebrow: {
    color: colors.warmText,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  header: {
    gap: spacing.md,
  },
  heroCard: {
    backgroundColor: colors.black,
    borderRadius: radius.r34,
    gap: spacing.s12,
    padding: spacing.s22,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.14,
    shadowRadius: 30,
  },
  heroText: {
    color: colors.textOnDarkMuted,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 23,
  },
  heroTitle: {
    color: colors.surface,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
  },
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.r30,
    padding: spacing.s16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.s14,
    minHeight: 68,
  },
  rowCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  rowDescription: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
  rowIcon: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.r20,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  rowIconText: {
    color: colors.black,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  rowPressed: {
    opacity: 0.72,
  },
  rowTitle: {
    color: colors.black,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  scrollContent: {
    flexGrow: 1,
    gap: spacing.s16,
  },
  title: {
    color: colors.black,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 41,
  },
});
