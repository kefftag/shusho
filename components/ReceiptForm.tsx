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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Dropdown from './Dropdown';
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

  const taxOptions = [
    { label: t('taxRate.10'), value: '10' },
    { label: t('taxRate.8'), value: '8' },
  ];

  const purposeOptions = [
    { label: t('businessPurpose.networking'), value: 'networking' },
    { label: t('businessPurpose.client'), value: 'client' },
    { label: t('businessPurpose.gifts'), value: 'gifts' },
  ];

  useEffect(() => {
    if (!extractedData) return;
    if (extractedData.date) setDate(extractedData.date);
    if (extractedData.time) setTime(extractedData.time);
    if (extractedData.address) setAddress(extractedData.address);
    if (extractedData.name) setName(extractedData.name);
    if (extractedData.pax) setPax(extractedData.pax);
    if (extractedData.totalPaid) setTotalPaid(extractedData.totalPaid);
    if (extractedData.taxRate) setTaxRate(extractedData.taxRate);
    if (extractedData.businessPurpose) setBusinessPurpose(extractedData.businessPurpose);
  }, [extractedData]);

  const handleSave = () => {
    if (!date || !name || !totalPaid) {
      Alert.alert('Missing fields', 'Please fill in at least Date, Name, and Total Paid.');
      return;
    }
    onSave({ date, time, address, name, pax, totalPaid, taxRate, businessPurpose, photoUri: imageUri, notes });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Image source={{ uri: imageUri }} style={styles.image} />

        {isExtracting && (
          <View style={styles.extractingBox}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.extractingText}>{t('form.extracting')}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Field label={t('form.date')}>
            <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
          </Field>

          <Field label={t('form.time')}>
            <TextInput
              style={styles.input}
              value={time}
              onChangeText={setTime}
              placeholder="HHMM"
              keyboardType="number-pad"
              maxLength={4}
            />
          </Field>

          <Field label={t('form.name')}>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder={t('form.name')} />
          </Field>

          <Field label={t('form.address')}>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={address}
              onChangeText={setAddress}
              placeholder={t('form.address')}
              multiline
            />
          </Field>

          <Field label={t('form.pax')}>
            <TextInput
              style={styles.input}
              value={pax}
              onChangeText={setPax}
              placeholder="1"
              keyboardType="number-pad"
            />
          </Field>

          <Field label={t('form.totalPaid')}>
            <TextInput
              style={styles.input}
              value={totalPaid}
              onChangeText={setTotalPaid}
              placeholder="0"
              keyboardType="decimal-pad"
            />
          </Field>

          <Field label={t('form.taxRate')}>
            <Dropdown
              options={taxOptions}
              selectedValue={taxRate}
              onValueChange={(v) => setTaxRate(v as TaxRate)}
            />
          </Field>

          <Field label={t('form.businessPurpose')}>
            <Dropdown
              options={purposeOptions}
              selectedValue={businessPurpose}
              onValueChange={(v) => setBusinessPurpose(v as BusinessPurpose)}
            />
          </Field>

          <Field label={t('form.notes')}>
            <TextInput
              style={[styles.input, styles.multiline, { height: 90 }]}
              value={notes}
              onChangeText={setNotes}
              placeholder={t('form.notes')}
              multiline
            />
          </Field>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.btnText}>{t('form.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.btnText}>{t('form.save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  image: { width: '100%', height: 200, resizeMode: 'cover', backgroundColor: '#000' },
  extractingBox: { margin: 16, padding: 20, backgroundColor: '#fff', borderRadius: 8, alignItems: 'center' },
  extractingText: { marginTop: 10, color: '#666' },
  form: { padding: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  multiline: { textAlignVertical: 'top', minHeight: 60 },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 24, marginBottom: 40 },
  cancelBtn: { flex: 1, backgroundColor: '#757575', padding: 16, borderRadius: 8, alignItems: 'center' },
  saveBtn: { flex: 1, backgroundColor: '#4CAF50', padding: 16, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
