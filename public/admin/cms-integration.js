// This script integrates with Decap CMS to process infographic images
// by calling a Netlify Function.

if (window.CMS) {
  CMS.registerEventListener({
    name: 'preSave',
    handler: async ({ entry, collection }) => {
      if (collection.get('name') === 'infographics') {
        const data = entry.get('data'); // Immutable.Map
        let imagePath = data.get('image');
        
        if (!imagePath) {
          console.log('CMS: No image found in entry, skipping AI processing.');
          return data;
        }
        
        let base64Image = null;
        let newImageFile = null;
        const mediaFiles = entry.get('mediaFiles');
        
        if (mediaFiles && mediaFiles.length > 0) {
          const imageFileEntry = mediaFiles.find(mf => 
            typeof imagePath === 'string' && (imagePath.endsWith(mf.name) || imagePath === mf.path || imagePath === mf.public_path)
          );
          if (imageFileEntry && imageFileEntry.file instanceof File) {
            newImageFile = imageFileEntry.file;
          }
        }

        if (newImageFile) {
          console.log('CMS: New image file found, preparing for AI processing:', newImageFile.name);
          try {
            base64Image = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result.split(',')[1]); // Get base64 part
              reader.onerror = error => reject(error);
              reader.readAsDataURL(newImageFile);
            });
          } catch (error) {
            console.error('CMS: Error converting image to base64:', error);
            CMS.addNotification({ type: 'error', message: `เกิดข้อผิดพลาดในการอ่านไฟล์ภาพ: ${error.message}` });
            return data.set('summary', 'เกิดข้อผิดพลาดในการอ่านไฟล์ภาพ.').set('full_text_from_ocr', '');
          }
        } else {
          console.log('CMS: No new image file detected for AI processing. Skipping.');
          return data; // Only process new images
        }

        if (base64Image) {
          CMS.showLoading('กำลังประมวลผลภาพและสรุปเนื้อหาด้วย AI...');
          let updatedData = data;

          try {
            const response = await fetch('/.netlify/functions/process-infographic', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ base64Image: base64Image }),
            });

            if (!response.ok) {
              const errorResult = await response.json().catch(() => ({ error: "Unknown error from Netlify Function" }));
              throw new Error(`Netlify Function Error (${response.status}): ${errorResult.error || response.statusText}`);
            }

            const result = await response.json();
            
            if (result.ocrText) {
              updatedData = updatedData.set('full_text_from_ocr', result.ocrText);
            }
            if (result.summary) {
              updatedData = updatedData.set('summary', result.summary);
            }
            CMS.addNotification({ type: 'success', message: 'ประมวลผลภาพและสรุปเนื้อหาด้วย AI สำเร็จ!' });
            console.log('CMS: AI Processing successful.', result);

          } catch (error) {
            console.error('CMS: Error calling Netlify Function for AI processing:', error);
            CMS.addNotification({ type: 'error', message: `การประมวลผล AI ล้มเหลว: ${error.message}` });
            // Set error messages in fields or leave them as they were
            updatedData = updatedData.set('summary', `การประมวลผล AI ล้มเหลว: ${error.message}`);
            if (!updatedData.get('full_text_from_ocr')) { // Only set OCR error if not already populated
                 updatedData = updatedData.set('full_text_from_ocr', `OCR Error: ${error.message}`);
            }
          } finally {
            CMS.hideLoading();
          }
          return updatedData;
        }
        return data; // Should not reach here if base64Image was expected but not obtained
      }
      return undefined; // No changes for other collections
    },
  });
} else {
  console.warn('Decap CMS global object (CMS) not found. AI integration script will not run.');
}
