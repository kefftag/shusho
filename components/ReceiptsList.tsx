import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Receipt } from '../types/receipt';

interface ReceiptsListProps {
  receipts: Receipt[];
  onDelete: (id: string) => void;
  onSelect?: (receipt: Receipt) => void;
}

export default function ReceiptsList({ receipts, onDelete, onSelect }: ReceiptsListProps) {
  const { t } = useTranslation();

  const handleDelete = (id: string) => {
    Alert.alert(
      t('receipts.delete'),
      t('receipts.deleteConfirm'),
      [
        { text: t('form.cancel'), style: 'cancel' },
        { text: t('receipts.delete'), style: 'destructive', onPress: () => onDelete(id) },
      ]
    );
  };

  const renderItem = ({ item }: { item: Receipt }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onSelect?.(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.photoUri }} style={styles.thumbnail} />
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.info}>{item.date} {item.time}</Text>
        <Text style={styles.amount}>¥{item.totalPaid}</Text>
        <Text style={styles.purpose}>{t(`businessPurpose.${item.businessPurpose}`)}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.deleteText}>×</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (receipts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('receipts.empty')}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={receipts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  info: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 4,
  },
  purpose: {
    fontSize: 11,
    color: '#999',
  },
  deleteButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 30,
    color: '#f44336',
    fontWeight: '300',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
