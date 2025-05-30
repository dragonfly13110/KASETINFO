
// This script integrates with Decap CMS to process infographic images.
// It attempts to use OCR and Gemini services.
// NOTE: For actual ocrService and geminiService, you'd need to either:
// 1. Re-implement their logic here (less ideal).
// 2. Bundle your TypeScript services into a JS file loadable here.
// 3. Call a serverless function that uses these services securely.
// This example uses mock/placeholder services for demonstration.

// --- Placeholder/Mock Services (Mimicking ocrService.ts and geminiService.ts) ---
const mockOcrService = {
  async getTextFromImage(base64Image, apiKey) {
    console.log('CMS Integration: Mock OCR called. API Key:', apiKey ? 'Provided' : 'Not Provided');
    if (!base64Image) return Promise.reject('No image data for mock OCR.');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
    return Promise.resolve(`นี่คือข้อความจำลองจากภาพ (CMS Integration): ${new Date().toLocaleTimeString()}`);
  }
};

const mockGeminiService = {
  async summarizeTextWithGemini(text, geminiApiKey) {
    console.log('CMS Integration: Mock Gemini called. API Key (should be securely handled):', geminiApiKey ? 'Provided' : 'Not Provided');
    if (!text) return Promise.resolve("ไม่สามารถสรุปได้เนื่องจากไม่มีข้อความ (CMS Integration)");
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
    return Promise.resolve(`สรุปย่อ (CMS Integration): ${text.substring(0, 60)}...`);
  }
};
// --- End Placeholder/Mock Services ---


if (window.CMS) {
  CMS.registerEventListener({
    name: 'preSave',
    handler: async ({ entry, collection }) => {
      if (collection.get('name') === 'infographics') {
        const data = entry.get('data'); // This is an Immutable.Map
        let imagePath = data.get('image'); // Path to the image or new image object

        if (!imagePath) {
          console.log('No image found in entry, skipping OCR/Summary.');
          return data; // Return original data if no image
        }
        
        let base64Image = null;
        let newImageFile = null;

        // Check if imagePath is a File object (for new uploads not yet saved)
        // Decap CMS might provide the file differently depending on version/widget.
        // `entry.get('mediaFiles')` is more reliable for new files.
        const mediaFiles = entry.get('mediaFiles'); // Array of {file, path, public_path} for new files
        
        if (mediaFiles && mediaFiles.length > 0) {
            // Find the image file. entry.get('data').get('image') might be the temporary path or final path.
            // We need to match it to one of the mediaFiles.
            // This logic might need adjustment based on how Decap CMS handles paths for new images.
            const imageFileEntry = mediaFiles.find(mf => {
                // mf.path is usually the final path. imagePath could be a temp blob URL or the final path.
                return typeof imagePath === 'string' && (imagePath.endsWith(mf.name) || imagePath === mf.path || imagePath === mf.public_path);
            });

            if (imageFileEntry && imageFileEntry.file instanceof File) {
                newImageFile = imageFileEntry.file;
            }
        }


        if (newImageFile) {
          console.log('New image file found, processing:', newImageFile.name);
          try {
            base64Image = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result.split(',')[1]); // Get base64 part
              reader.onerror = error => reject(error);
              reader.readAsDataURL(newImageFile);
            });
          } catch (error) {
            console.error('Error converting image to base64:', error);
            // Potentially update summary with error message
            const errorSummary = 'เกิดข้อผิดพลาดในการอ่านไฟล์ภาพ';
            return data.set('summary', errorSummary).set('full_text_from_ocr', errorSummary);
          }
        } else if (typeof imagePath === 'string' && imagePath.startsWith('data:image')) {
          // Image might already be base64 (e.g., from a custom widget or if it was already processed)
          base64Image = imagePath.split(',')[1];
          console.log('Image is already base64 data.');
        } else if (typeof imagePath === 'string') {
            // Image is a path to an existing, already uploaded image.
            // OCR/Summarization should ideally only run for NEW or CHANGED images.
            // For this example, if it's just a path and not a new file, we skip.
            // To re-process existing images, you'd need to fetch the image content by its path.
            console.log('Image is an existing path, skipping OCR/Summary for this example unless it is a new upload that was missed by file check.', imagePath);
            // If you want to process existing images on every save (not recommended),
            // you would need to fetch this imagePath, convert to base64. This is complex client-side.
            return data; 
        }


        if (base64Image) {
          let ocrText = '';
          let summary = '';
          let errorOccurred = false;

          // Show a loading indicator to the admin user
          CMS.showLoading('กำลังประมวลผลภาพและสรุปเนื้อหาด้วย AI...');

          try {
            // 1. Call OCR Service
            // Replace with actual TYPHOON_OCR_API_KEY or secure retrieval method
            const typhoonApiKey = 'YOUR_TYPHOON_OCR_API_KEY_PLACEHOLDER_CMS'; 
            ocrText = await mockOcrService.getTextFromImage(base64Image, typhoonApiKey);
            
            // 2. Call Gemini Service to summarize OCR text
            // API_KEY for Gemini: Assumed to be available via `window.process.env.API_KEY`
            // This is set in index.html for admin or via build process.
            const geminiApiKey = (window.process && window.process.env && window.process.env.API_KEY) 
                                 ? window.process.env.API_KEY 
                                 : 'FALLBACK_GEMINI_KEY_FOR_CMS_IF_NOT_SET';
            if (!geminiApiKey || geminiApiKey.startsWith('FALLBACK')) {
                console.warn("CMS Integration: Gemini API Key is not properly configured for summarization.");
            }
            summary = await mockGeminiService.summarizeTextWithGemini(ocrText, geminiApiKey);

          } catch (error) {
            console.error('Error during OCR/Gemini processing in CMS:', error);
            summary = `เกิดข้อผิดพลาดในการประมวลผลอัตโนมัติ: ${error.message || 'Unknown error'}`;
            if (!ocrText) ocrText = `OCR Error: ${error.message || 'Unknown error'}`;
            errorOccurred = true;
          } finally {
             CMS.hideLoading();
          }

          // Update the entry's data
          // entry.get('data') is immutable, so set returns a new map
          let updatedData = data;
          if (ocrText) {
            updatedData = updatedData.set('full_text_from_ocr', ocrText);
          }
          if (summary) {
            updatedData = updatedData.set('summary', summary);
          }
          
          if (errorOccurred) {
             // Optional: Notify user more explicitly through CMS UI if possible
             // CMS.addNotification({ message: 'การประมวลผล AI ล้มเหลว', type: 'error' });
          } else {
             // CMS.addNotification({ message: 'สรุปเนื้อหาด้วย AI สำเร็จ', type: 'success' });
          }

          return updatedData; // Return the modified entry data for Decap CMS to save

        } else {
          console.log('No new image data to process for OCR/summary.');
          return data; // No changes if no image data extracted
        }
      }
      return undefined; // No changes for other collections or if conditions not met
    },
  });
} else {
  console.warn('Decap CMS global object (CMS) not found. OCR/Gemini integration script will not run.');
}

    