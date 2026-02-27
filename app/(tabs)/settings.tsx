import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import Dropdown from '../../components/Dropdown';
import { StorageService } from '../../utils/storage';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const languageOptions = [
    { label: t('settings.english'), value: 'en' },
    { label: t('settings.japanese'), value: 'ja' },
  ];

  const handleLanguageChange = async (lang: string) => {
    setLanguage(lang);
    await i18n.changeLanguage(lang);
    await StorageService.saveLanguage(lang);
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter an API key');
      return;
    }
    await StorageService.saveApiKey(apiKey);
    setShowApiKeyInput(false);
    setApiKey('');
    Alert.alert('Success', 'API Key updated');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
        <Dropdown
          options={languageOptions}
          selectedValue={language}
          onValueChange={handleLanguageChange}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.apiKey')}</Text>
        {!showApiKeyInput ? (
          <TouchableOpacity style={styles.button} onPress={() => setShowApiKeyInput(true)}>
            <Text style={styles.buttonText}>{t('settings.changeApiKey')}</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TextInput
              style={styles.input}
              value={apiKey}
              onChangeText={setApiKey}
              placeholder={t('home.apiKeyPlaceholder')}
              secureTextEntry
              autoCapitalize="none"
            />
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => { setShowApiKeyInput(false); setApiKey(''); }}
              >
                <Text style={styles.buttonText}>{t('form.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSaveApiKey}>
                <Text style={styles.buttonText}>{t('home.saveApiKey')}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.appName}>{t('appName')}</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.subtitle}>Receipt Scanner for Japan</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 14 },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  row: { flexDirection: 'row', gap: 10 },
  cancelButton: { flex: 1, backgroundColor: '#757575' },
  saveButton: { flex: 1, backgroundColor: '#2196F3' },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  infoSection: { alignItems: 'center', padding: 24 },
  appName: { fontSize: 24, fontWeight: 'bold', color: '#2196F3', marginBottom: 6 },
  version: { fontSize: 13, color: '#999', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#999' },
});
