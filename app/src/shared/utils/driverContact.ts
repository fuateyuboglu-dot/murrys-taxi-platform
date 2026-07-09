import { Alert, Linking, Platform } from 'react-native';

import type { DemoDriver } from '@/shared/demo/demoData';

function showWebContactAlert(action: 'Call' | 'Message', driver: DemoDriver) {
  const message = `${action} ${driver.name}: ${driver.phoneNumber ?? 'No phone number available'}`;
  const webGlobal = globalThis as typeof globalThis & {
    alert?: (message: string) => void;
  };

  if (typeof webGlobal.alert === 'function') {
    webGlobal.alert(message);
    return;
  }

  Alert.alert(message);
}

async function openDriverContactUrl(url: string, fallbackMessage: string) {
  const canOpen = await Linking.canOpenURL(url);

  if (canOpen) {
    await Linking.openURL(url);
    return;
  }

  Alert.alert('Contact unavailable', fallbackMessage);
}

export async function callDriver(driver: DemoDriver) {
  if (!driver.phoneNumber) {
    Alert.alert('Contact unavailable', 'No phone number is available for this demo driver.');
    return;
  }

  if (Platform.OS === 'web') {
    showWebContactAlert('Call', driver);
    return;
  }

  await openDriverContactUrl(`tel:${driver.phoneNumber}`, `Call ${driver.name} at ${driver.phoneNumber}`);
}

export async function messageDriver(driver: DemoDriver) {
  if (!driver.phoneNumber) {
    Alert.alert('Contact unavailable', 'No phone number is available for this demo driver.');
    return;
  }

  if (Platform.OS === 'web') {
    showWebContactAlert('Message', driver);
    return;
  }

  await openDriverContactUrl(`sms:${driver.phoneNumber}`, `Message ${driver.name} at ${driver.phoneNumber}`);
}
