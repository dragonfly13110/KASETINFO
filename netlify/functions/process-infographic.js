// netlify/functions/process-infographic.js
// This function needs @google/genai to be in the main package.json dependencies.
const { GoogleGenAI } = require("@google/genai");

// --- Environment Variables (set these in Netlify Build & Deploy > Environment) ---
const GEMINI_API_KEY = process.env.API_KEY; // Your Gemini API Key
const TYPHOON_OCR_API_KEY = process.env.TYPHOON_API_KEY; // Your Typhoon OCR API Key (if you have one)
const GEMINI_MODEL_TEXT = process.env.GEMINI_MODEL_NAME || 'gemini-2.5-flash-preview-04-17';

// --- Mock Typhoon OCR Function ---
// Replace with actual API call to Typhoon OCR if available.
// You might need to install 'node-fetch' or 'axios' for this.
async function callTyphoonOcr(base64ImageData) {
  if (!TYPHOON_OCR_API_KEY) {
    console.warn("Netlify Function: TYPHOON_OCR_API_KEY not set. Using mock OCR data.");
    // Fallback to mock data if API key is not set
    return `(Mock OCR from Netlify Function) เนื้อหาจำลองจากภาพ: ข้าวโพดหวานสองสี ลูกผสม F1 ให้ผลผลิตสูง ทนทานโรค ปลูกง่ายในทุกสภาพอากาศ. เหมาะสำหรับตลาดสดและโรงงานแปรรูป. ${new Date().toISOString()}`;
  }

  // TODO: Implement actual Typhoon OCR API call here
  // Example (conceptual, requires Typhoon OCR API details and client like node-fetch):
  // const fetch = require('node-fetch');
  // const ocrResponse = await fetch('YOUR_TYPHOON_OCR_ENDPOINT', {
  //   method: 'POST',
  //   headers: { 'X-API-Key': TYPHOON_OCR_API_KEY, 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ image_base64: base64ImageData })
  // });
  // if (!ocrResponse.ok) throw new Error(`Typhoon OCR API error: ${ocrResponse.statusText}`);
  // const ocrData = await ocrResponse.json();
  // return ocrData.text;

  // For now, return mock data when key is present but no implementation
  console.log("Netlify Function: Simulating Typhoon OCR call as actual implementation is pending.");
  return `(Simulated OCR with API Key from Netlify Function) Text from image about agriculture techniques. ${new Date().toISOString()}`;
}

// --- Gemini Summarization Function ---
async function summarizeTextWithGeminiInFunction(textToSummarize) {
  if (!GEMINI_API_KEY) {
    console.error("Netlify Function: Gemini API Key (API_KEY) is not configured.");
    throw new Error("Gemini API Key is not configured for the Netlify Function.");
  }
  if (!textToSummarize || String(textToSummarize).trim() === "") {
    console.warn("Netlify Function: No text provided to summarize for Gemini.");
    return "ไม่มีเนื้อหาที่จะสรุป (ข้อมูล OCR ว่างเปล่า)";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const prompt = \`กรุณาสรุปข้อความต่อไปนี้ให้กระชับและเข้าใจง่าย เหมาะสำหรับเป็นคำอธิบายสั้นๆ ของอินโฟกราฟิกทางการเกษตร ความยาวไม่เกิน 3-4 ประโยค อย่าใส่ markdown formatting เช่น backticks:\n\n"\${textToSummarize}"\n\nสรุปเป็นภาษาไทย:\`;
    
    console.log(\`Netlify Function: Sending text to Gemini model '\${GEMINI_MODEL_TEXT}' for summarization.\`);
    
    const response = await ai.models.generateContent({
        model: GEMINI_MODEL_TEXT,
        contents: prompt,
    });

    const summary = response.text;
    console.log("Netlify Function: Summary received from Gemini.");
    return summary.trim();

  } catch (error) {
    console.error("Netlify Function: Error calling Gemini API", error);
    let errorMessage = "เกิดข้อผิดพลาดในการสรุปเนื้อหาด้วย Gemini.";
    if (error.message && error.message.includes("API key not valid")) {
        errorMessage = "API Key ของ Gemini ไม่ถูกต้อง หรือไม่ได้ตั้งค่าใน Netlify Function.";
    } else if (error.message) {
        errorMessage = \`Gemini API error: \${error.message}\`;
    }
    throw new Error(errorMessage);
  }
}


exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { base64Image } = JSON.parse(event.body);
    if (!base64Image) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No image data provided in request body' }) };
    }

    console.log("Netlify Function: Received image for processing.");

    const ocrText = await callTyphoonOcr(base64Image);
    console.log("Netlify Function: OCR Text obtained:", ocrText ? ocrText.substring(0, 100) + "..." : "No OCR text");
    
    const summary = await summarizeTextWithGeminiInFunction(ocrText);
    console.log("Netlify Function: Summary obtained:", summary);

    return {
      statusCode: 200,
      body: JSON.stringify({ ocrText, summary }),
    };

  } catch (error) {
    console.error("Netlify Function Error in handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'An internal server error occurred in Netlify Function' }),
    };
  }
};
