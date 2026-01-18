import AsyncStorage from '@react-native-async-storage/async-storage';
import { Receipt } from '../types/receipt';

const API_KEY_STORAGE_KEY = '@shusho_api_key';
const RECEIPTS_STORAGE_KEY = '@shusho_receipts';
const LANGUAGE_STORAGE_KEY = '@shusho_language';

export const StorageService = {
  // API Key management
  async saveApiKey(apiKey: string): Promise<void> {
    await AsyncStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
  },

  async getApiKey(): Promise<string | null> {
    return await AsyncStorage.getItem(API_KEY_STORAGE_KEY);
  },

  async removeApiKey(): Promise<void> {
    await AsyncStorage.removeItem(API_KEY_STORAGE_KEY);
  },

  // Receipt management
  async saveReceipt(receipt: Receipt): Promise<void> {
    const receipts = await this.getReceipts();
    receipts.push(receipt);
    await AsyncStorage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify(receipts));
  },

  async getReceipts(): Promise<Receipt[]> {
    const data = await AsyncStorage.getItem(RECEIPTS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  async deleteReceipt(id: string): Promise<void> {
    const receipts = await this.getReceipts();
    const filtered = receipts.filter(r => r.id !== id);
    await AsyncStorage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify(filtered));
  },

  async updateReceipt(receipt: Receipt): Promise<void> {
    const receipts = await this.getReceipts();
    const index = receipts.findIndex(r => r.id === receipt.id);
    if (index !== -1) {
      receipts[index] = receipt;
      await AsyncStorage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify(receipts));
    }
  },

  // Language management
  async saveLanguage(language: string): Promise<void> {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  },

  async getLanguage(): Promise<string | null> {
    return await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  }
};
