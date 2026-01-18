import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import ReceiptsList from '../../components/ReceiptsList';
import { StorageService } from '../../utils/storage';
import { Receipt } from '../../types/receipt';

export default function ReceiptsScreen() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  const loadReceipts = async () => {
    const data = await StorageService.getReceipts();
    // Sort by createdAt descending (newest first)
    const sorted = data.sort((a, b) => b.createdAt - a.createdAt);
    setReceipts(sorted);
  };

  useFocusEffect(
    useCallback(() => {
      loadReceipts();
    }, [])
  );

  const handleDelete = async (id: string) => {
    await StorageService.deleteReceipt(id);
    loadReceipts();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ReceiptsList receipts={receipts} onDelete={handleDelete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
