// This service is now a placeholder.
// The actual OCR processing for new infographics uploaded via CMS
// will be handled by a Netlify Function, invoked from public/admin/cms-integration.js.
// This client-side service would only be used if there was a feature for end-users
// to perform OCR, which would also require a secure backend call (e.g., to another Netlify function).

// interface OcrResponse {
//   text: string;
// }

/**
 * Placeholder for client-side OCR call.
 * For the admin panel's OCR functionality, see `netlify/functions/process-infographic.js`
 * and its invocation in `public/admin/cms-integration.js`.
 * @param base64Image The image data encoded in base64.
 * @returns A promise that resolves to the extracted text (mocked).
 */
export const getTextFromImage = async (base64Image: string): Promise<string> => {
  console.warn('ocrService.getTextFromImage (client-side) is a mock. Actual CMS OCR is via Netlify Function.');
  if (!base64Image) {
    return Promise.reject('No image data provided for mock OCR.');
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const mockText = `(Client-Side Mock OCR) Text from image for dev purposes.`;
      resolve(mockText);
    }, 500);
  });
};
