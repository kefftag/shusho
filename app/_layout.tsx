import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../i18n/config';
import { useTranslation } from 'react-i18next';

export default function RootLayout() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Lazy-load StorageService to avoid early native module access
    import('../utils/storage').then(({ StorageService }) => {
      StorageService.getLanguage().then((lang) => {
        if (lang) {
          i18n.changeLanguage(lang);
        }
      });
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
