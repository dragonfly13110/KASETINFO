
import { TYPHOON_OCR_API_ENDPOINT, TYPHOON_OCR_API_KEY } from '../constants';

// This is a MOCK implementation for Typhoon OCR API.
// Replace with actual API call logic.

interface OcrResponse {
  text: string;
  // Potentially other fields like confidence, bounding boxes etc.
}

/**
 * Calls Typhoon OCR API to extract text from an image.
 * @param base64Image The image data encoded in base64.
 * @param apiKey The API key for Typhoon OCR.
 * @returns A promise that resolves to the extracted text.
 */
export const getTextFromImage = async (base64Image: string, apiKey: string = TYPHOON_OCR_API_KEY): Promise<string> => {
  console.log('ocrService: Called getTextFromImage. API Key used:', apiKey ? 'Provided' : 'Not Provided');
  if (!base64Image) {
    console.warn('ocrService: No base64 image data provided.');
    return Promise.reject('No image data provided for OCR.');
  }

  // MOCK API call simulation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (apiKey === 'INVALID_KEY_FOR_TESTING_ERROR') { // Example error condition
        console.error('ocrService: Mock API key is invalid.');
        reject('Mock OCR Error: Invalid API Key');
        return;
      }
      const mockText = `นี่คือข้อความที่จำลองจากการอ่านภาพด้วย Typhoon OCR API. วันที่ ${new Date().toLocaleDateString('th-TH')}. เนื้อหาเกี่ยวกับเทคนิคการปลูกข้าวโพดหวาน การเลือกใช้ปุ๋ยอินทรีย์ และการป้องกันแมลงศัตรูพืชโดยไม่ใช้สารเคมี เพื่อผลผลิตที่ปลอดภัยและมีคุณภาพสูง.`;
      console.log('ocrService: Mock OCR successful, returning text.');
      resolve(mockText);
    }, 1500); // Simulate network delay
  });

  /*
  // Example of a real fetch call (uncomment and adapt when you have the actual API)
  try {
    const response = await fetch(TYPHOON_OCR_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey, // Or however the API key is expected
      },
      body: JSON.stringify({ image_base64: base64Image }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown OCR API error' }));
      console.error('ocrService: OCR API request failed.', response.status, errorData);
      throw new Error(`Typhoon OCR API Error: ${response.status} ${errorData.message || ''}`);
    }

    const result: OcrResponse = await response.json();
    console.log('ocrService: OCR API call successful.');
    return result.text;
  } catch (error) {
    console.error('ocrService: Error calling Typhoon OCR API.', error);
    throw error; // Re-throw the error to be handled by the caller
  }
  */
};
    