export type TaxRate = '10' | '8';

export type BusinessPurpose = 'networking' | 'client' | 'gifts';

export interface Receipt {
  id: string;
  date: string;
  time: string;
  address: string;
  name: string;
  pax: string;
  totalPaid: string;
  taxRate: TaxRate;
  businessPurpose: BusinessPurpose;
  photoUri: string;
  notes: string;
  createdAt: number;
}

export interface ExtractedReceiptData {
  date?: string;
  time?: string;
  address?: string;
  name?: string;
  pax?: string;
  totalPaid?: string;
  taxRate?: TaxRate;
  businessPurpose?: BusinessPurpose;
}
