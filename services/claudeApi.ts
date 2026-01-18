import * as FileSystem from 'expo-file-system';
import { ExtractedReceiptData } from '../types/receipt';

export class ClaudeApiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async extractReceiptData(imageUri: string): Promise<ExtractedReceiptData> {
    try {
      // Read the image file as base64
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Determine the media type based on the file extension
      const extension = imageUri.split('.').pop()?.toLowerCase();
      let mediaType = 'image/jpeg';
      if (extension === 'png') {
        mediaType = 'image/png';
      } else if (extension === 'gif') {
        mediaType = 'image/gif';
      } else if (extension === 'webp') {
        mediaType = 'image/webp';
      }

      const prompt = `You are analyzing a receipt or invoice from Japan. Extract the following information from this image:

1. Date (in YYYY-MM-DD format if possible)
2. Time (in HHMM 24-hour format)
3. Address
4. Name of Restaurant, Shop, or Transportation Method
5. Number of people (Pax)
6. Total amount paid (including tax and service charges, just the number)
7. Tax rate (either 10% or 8%)
8. Business purpose - analyze the content and guess which category it belongs to:
   - "networking" for Networking Meals & Entertainment (social gatherings, team meals)
   - "client" for Client Meals & Entertainment (business meetings with clients)
   - "gifts" for Small Gifts (retail purchases, souvenirs, small items)

Respond ONLY with a valid JSON object in this exact format (no markdown, no code blocks):
{
  "date": "YYYY-MM-DD or empty string",
  "time": "HHMM or empty string",
  "address": "address or empty string",
  "name": "business name or empty string",
  "pax": "number or empty string",
  "totalPaid": "amount or empty string",
  "taxRate": "10 or 8 or empty string",
  "businessPurpose": "networking or client or gifts or empty string"
}`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: mediaType,
                    data: base64Image,
                  },
                },
                {
                  type: 'text',
                  text: prompt,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const content = data.content[0].text;

      // Parse the JSON response
      const extracted = JSON.parse(content);

      // Convert to ExtractedReceiptData type
      const result: ExtractedReceiptData = {
        date: extracted.date || undefined,
        time: extracted.time || undefined,
        address: extracted.address || undefined,
        name: extracted.name || undefined,
        pax: extracted.pax || undefined,
        totalPaid: extracted.totalPaid || undefined,
        taxRate: (extracted.taxRate === '10' || extracted.taxRate === '8') ? extracted.taxRate : undefined,
        businessPurpose: ['networking', 'client', 'gifts'].includes(extracted.businessPurpose)
          ? extracted.businessPurpose
          : undefined,
      };

      return result;
    } catch (error) {
      console.error('Error extracting receipt data:', error);
      throw error;
    }
  }
}
