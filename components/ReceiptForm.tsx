import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { Receipt, TaxRate, BusinessPurpose, ExtractedReceiptData } from '../types/receipt';

interface ReceiptFormProps {
  imageUri: string;
  extractedData?: ExtractedReceiptData;
  isExtracting?: boolean;
  onSave: (receipt: Omit<Receipt, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export default function ReceiptForm({
  imageUri,
  extractedData,
  isExtracting,
  onSave,
  onCancel,
}: ReceiptFormProps) {
  const { t } = useTranslation();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [pax, setPax] = useState('');
  const [totalPaid, setTotalPaid] = useState('');
  const [taxRate, setTaxRate] = useState<TaxRate>('10');
  const [businessPurpose, setBusinessPurpose] = useState<BusinessPurpose>('networking');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (extractedData) {
      if (extractedData.date) setDate(extractedData.date);
      if (extractedData.time) setTime(extractedData.time);
      if (extractedData.address) setAddress(extractedData.address);
      if (extractedData.name) setName(extractedData.name);
      if (extractedData.pax) setPax(extractedData.pax);
      if (extractedData.totalPaid) setTotalPaid(extractedData.totalPaid);
      if (extractedData.taxRate) setTaxRate(extractedData.taxRate);
      if (extractedData.businessPurpose) setBusinessPurpose(extractedData.businessPurpose);
    }
  }, [extractedData]);

  const handleSave = () => {
    if (!date || !name || !totalPaid) {
      Alert.alert('Error', 'Please fill in at least Date, Name, and Total Paid');
      return;
    }

    const receipt: Omit<Receipt, 'id' | 'createdAt'> = {
      date,
      time,
      address,
      name,
      pax,
      totalPaid,
      taxRate,
      businessPurpose,
      photoUri: imageUri,
      notes,
    };

    onSave(receipt);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
      </View>

      {isExtracting && (
        <View style={styles.extractingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.extractingText}>{t('form.extracting')}</Text>
        </View>
      )}

      <View style={styles.formContainer}>
        <Text style={styles.label}>{t('form.date')}</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
        />

        <Text style={styles.label}>{t('form.time')}</Text>
        <TextInput
          style={styles.input}
          value={time}
          onChangeText={setTime}
          placeholder="HHMM"
          keyboardType="number-pad"
          maxLength={4}
        />

        <Text style={styles.label}>{t('form.name')}</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder={t('form.name')}
        />

        <Text style={styles.label}>{t('form.address')}</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder={t('form.address')}
          multiline
        />

        <Text style={styles.label}>{t('form.pax')}</Text>
        <TextInput
          style={styles.input}
          value={pax}
          onChangeText={setPax}
          placeholder={t('form.pax')}
          keyboardType="number-pad"
        />

        <Text style={styles.label}>{t('form.totalPaid')}</Text>
        <TextInput
          style={styles.input}
          value={totalPaid}
          onChangeText={setTotalPaid}
          placeholder={t('form.totalPaid')}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>{t('form.taxRate')}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={taxRate}
            onValueChange={(itemValue) => setTaxRate(itemValue as TaxRate)}
            style={styles.picker}
          >
            <Picker.Item label={t('taxRate.10')} value="10" />
            <Picker.Item label={t('taxRate.8')} value="8" />
          </Picker>
        </View>

        <Text style={styles.label}>{t('form.businessPurpose')}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={businessPurpose}
            onValueChange={(itemValue) => setBusinessPurpose(itemValue as BusinessPurpose)}
            style={styles.picker}
          >
            <Picker.Item label={t('businessPurpose.networking')} value="networking" />
            <Picker.Item label={t('businessPurpose.client')} value="client" />
            <Picker.Item label={t('businessPurpose.gifts')} value="gifts" />
          </Picker>
        </View>

        <Text style={styles.label}>{t('form.notes')}</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={notes}
          onChangeText={setNotes}
          placeholder={t('form.notes')}
          multiline
          numberOfLines={4}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.buttonText}>{t('form.cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>{t('form.save')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    backgroundColor: '#000',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  extractingContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 8,
  },
  extractingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  formContainer: {
    padding: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 20,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#757575',
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
