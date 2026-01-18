import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../i18n/config';
import { useTranslation } from 'react-i18next';
import { StorageService } from '../utils/storage';

export default function RootLayout() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Load saved language preference
    StorageService.getLanguage().then((lang) => {
      if (lang) {
        i18n.changeLanguage(lang);
      }
    });
  }, []);

  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
