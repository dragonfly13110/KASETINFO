export const APP_TITLE = "คลังความรู้เกษตรตำบล Infographic";
export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17'; // Used by Netlify Function
export const IMAGEN_MODEL_TEXT = 'imagen-3.0-generate-002'; // Used by Netlify Function (if image generation was added)


// API Endpoints and Keys are now managed by Netlify Functions and their environment variables.
// Do NOT store API keys in client-side code.

export const MOCK_CATEGORIES: { id: string; name: string }[] = [
  { id: 'rice', name: 'ข้าว' },
  { id: 'vegetables', name: 'พืชผัก' },
  { id: 'fruits', name: 'ผลไม้' },
  { id: 'livestock', name: 'ปศุสัตว์' },
  { id: 'technology', name: 'เทคโนโลยีการเกษตร' },
];

export const MOCK_TAGS: { id: string; name: string }[] = [
  { id: 'pest-control', name: 'การควบคุมศัตรูพืช' },
  { id: 'fertilizer', name: 'ปุ๋ย' },
  { id: 'irrigation', name: 'การชลประทาน' },
  { id: 'harvesting', name: 'การเก็บเกี่ยว' },
  { id: 'organic', name: 'เกษตรอินทรีย์' },
];

// Number of items per page for pagination
export const ITEMS_PER_PAGE = 9;
