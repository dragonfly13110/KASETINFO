
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_TEXT } from '../constants';

// Ensure API_KEY is accessed as per instructions.
// The build system or environment must make process.env.API_KEY available.
// For client-side execution (like in Decap CMS custom script context), this is tricky.
// The `cms-integration.js` will attempt to use `window.process.env.API_KEY`.
const apiKey = (process.env.API_KEY as string) || (window as any).process?.env?.API_KEY;

if (!apiKey) {
  console.error("Gemini API Key is missing. Ensure process.env.API_KEY is set.");
  // Potentially throw an error or use a fallback if critical for app startup
  // For now, we'll let it fail at the point of API call if key is truly missing.
}

const ai = new GoogleGenAI({ apiKey: apiKey });

/**
 * Summarizes text using the Gemini API.
 * @param textToSummarize The text to be summarized.
 * @returns A promise that resolves to the summarized text.
 */
export const summarizeTextWithGemini = async (textToSummarize: string): Promise<string> => {
  if (!apiKey) {
     return Promise.reject("Gemini API Key is not configured.");
  }
  if (!textToSummarize || textToSummarize.trim().length === 0) {
    console.warn('geminiService: No text provided to summarize.');
    return 'ไม่มีเนื้อหาที่จะสรุป';
  }

  try {
    const model = GEMINI_MODEL_TEXT;
    const prompt = `กรุณาสรุปข้อความต่อไปนี้ให้กระชับและเข้าใจง่าย เหมาะสำหรับเป็นคำอธิบายสั้นๆ ของอินโฟกราฟิกทางการเกษตร ความยาวไม่เกิน 3-4 ประโยค:\n\n"${textToSummarize}"\n\nสรุปเป็นภาษาไทย:`;
    
    console.log(`geminiService: Sending text to Gemini for summarization. Model: ${model}`);
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: prompt,
    });

    const summary = response.text;
    console.log('geminiService: Summary received from Gemini.');
    return summary.trim();

  } catch (error) {
    console.error('geminiService: Error calling Gemini API:', error);
    // Provide a more user-friendly error or a fallback
    if (error instanceof Error && error.message.includes("API key not valid")) {
        return 'เกิดข้อผิดพลาด: ไม่สามารถเชื่อมต่อบริการสรุปเนื้อหาได้ (API Key ไม่ถูกต้อง).';
    }
    return `เกิดข้อผิดพลาดในการสรุปเนื้อหา: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};
    