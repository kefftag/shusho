import { Receipt } from '../types/receipt';

const API_KEY_STORAGE_KEY = '@shusho_api_key';
const RECEIPTS_STORAGE_KEY = '@shusho_receipts';
const LANGUAGE_STORAGE_KEY = '@shusho_language';

// Lazy-load AsyncStorage to avoid early native module access
let AsyncStorage: any = null;
const getAsyncStorage = async () => {
  if (!AsyncStorage) {
    const module = await import('@react-native-async-storage/async-storage');
    AsyncStorage = module.default;
  }
  return AsyncStorage;
};

export const StorageService = {
  // API Key management
  async saveApiKey(apiKey: string): Promise<void> {
    const storage = await getAsyncStorage();
    await storage.setItem(API_KEY_STORAGE_KEY, apiKey);
  },

  async getApiKey(): Promise<string | null> {
    const storage = await getAsyncStorage();
    return await storage.getItem(API_KEY_STORAGE_KEY);
  },

  async removeApiKey(): Promise<void> {
    const storage = await getAsyncStorage();
    await storage.removeItem(API_KEY_STORAGE_KEY);
  },

  // Receipt management
  async saveReceipt(receipt: Receipt): Promise<void> {
    const storage = await getAsyncStorage();
    const receipts = await this.getReceipts();
    receipts.push(receipt);
    await storage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify(receipts));
  },

  async getReceipts(): Promise<Receipt[]> {
    const storage = await getAsyncStorage();
    const data = await storage.getItem(RECEIPTS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  async deleteReceipt(id: string): Promise<void> {
    const storage = await getAsyncStorage();
    const receipts = await this.getReceipts();
    const filtered = receipts.filter(r => r.id !== id);
    await storage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify(filtered));
  },

  async updateReceipt(receipt: Receipt): Promise<void> {
    const storage = await getAsyncStorage();
    const receipts = await this.getReceipts();
    const index = receipts.findIndex(r => r.id === receipt.id);
    if (index !== -1) {
      receipts[index] = receipt;
      await storage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify(receipts));
    }
  },

  // Language management
  async saveLanguage(language: string): Promise<void> {
    const storage = await getAsyncStorage();
    await storage.setItem(LANGUAGE_STORAGE_KEY, language);
  },

  async getLanguage(): Promise<string | null> {
    const storage = await getAsyncStorage();
    return await storage.getItem(LANGUAGE_STORAGE_KEY);
  }
};
