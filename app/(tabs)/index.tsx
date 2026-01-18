import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import CameraView from '../../components/CameraView';
import ReceiptForm from '../../components/ReceiptForm';
import { StorageService } from '../../utils/storage';
import { ClaudeApiService } from '../../services/claudeApi';
import { Receipt, ExtractedReceiptData } from '../../types/receipt';

export default function HomeScreen() {
  const { t } = useTranslation();
  const [apiKey, setApiKey] = useState('');
  const [savedApiKey, setSavedApiKey] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedReceiptData | undefined>();
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    const key = await StorageService.getApiKey();
    if (key) {
      setSavedApiKey(key);
      setApiKey(key);
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter an API key');
      return;
    }

    await StorageService.saveApiKey(apiKey);
    setSavedApiKey(apiKey);
    Alert.alert('Success', t('home.apiKeySaved'));
  };

  const handleTakePhoto = () => {
    if (!savedApiKey) {
      Alert.alert('Error', 'Please save your API key first');
      return;
    }
    setShowCamera(true);
  };

  const handleSelectFromGallery = async () => {
    if (!savedApiKey) {
      Alert.alert('Error', 'Please save your API key first');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      handlePhotoTaken(result.assets[0].uri);
    }
  };

  const handlePhotoTaken = async (uri: string) => {
    setShowCamera(false);
    setCurrentPhoto(uri);
    setShowForm(true);
    setIsExtracting(true);
    setExtractedData(undefined);

    try {
      const claudeService = new ClaudeApiService(savedApiKey!);
      const data = await claudeService.extractReceiptData(uri);
      setExtractedData(data);
    } catch (error) {
      console.error('Error extracting data:', error);
      Alert.alert('Error', t('form.extractionError'));
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSaveReceipt = async (receipt: Omit<Receipt, 'id' | 'createdAt'>) => {
    const newReceipt: Receipt = {
      ...receipt,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };

    await StorageService.saveReceipt(newReceipt);
    setShowForm(false);
    setCurrentPhoto(null);
    setExtractedData(undefined);
    Alert.alert('Success', 'Receipt saved successfully');
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentPhoto(null);
    setExtractedData(undefined);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.content}>
        <Text style={styles.title}>{t('appName')}</Text>

        <View style={styles.apiKeyContainer}>
          <Text style={styles.label}>{t('home.apiKeyLabel')}</Text>
          <TextInput
            style={styles.input}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder={t('home.apiKeyPlaceholder')}
            secureTextEntry
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveApiKey}>
            <Text style={styles.buttonText}>{t('home.saveApiKey')}</Text>
          </TouchableOpacity>
          {savedApiKey && (
            <Text style={styles.savedText}>✓ API Key saved</Text>
          )}
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionButton, !savedApiKey && styles.disabledButton]}
            onPress={handleTakePhoto}
            disabled={!savedApiKey}
          >
            <Text style={styles.actionButtonText}>{t('home.takePhoto')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, !savedApiKey && styles.disabledButton]}
            onPress={handleSelectFromGallery}
            disabled={!savedApiKey}
          >
            <Text style={styles.actionButtonText}>{t('home.selectFromGallery')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={showCamera} animationType="slide">
        <CameraView
          onPhotoTaken={handlePhotoTaken}
          onCancel={() => setShowCamera(false)}
        />
      </Modal>

      <Modal visible={showForm} animationType="slide">
        {currentPhoto && (
          <ReceiptForm
            imageUri={currentPhoto}
            extractedData={extractedData}
            isExtracting={isExtracting}
            onSave={handleSaveReceipt}
            onCancel={handleCancelForm}
          />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  apiKeyContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  savedText: {
    marginTop: 10,
    color: '#4CAF50',
    fontSize: 14,
    textAlign: 'center',
  },
  actionContainer: {
    gap: 15,
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
