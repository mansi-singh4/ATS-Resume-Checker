/**
 * Security utilities for inputs, XSS prevention, and PDF validation
 */

// Max size: 5 MB (in bytes)
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates the uploaded file to ensure it's a PDF under the size limit
 */
export function validateUploadedFile(file: File): FileValidationResult {
  if (!file) {
    return { isValid: false, error: 'No file provided.' };
  }

  // Check type (either by mime-type or file extension)
  const isPdfMime = file.type === 'application/pdf';
  const isPdfExt = file.name.toLowerCase().endsWith('.pdf');
  
  if (!isPdfMime && !isPdfExt) {
    return { isValid: false, error: 'Invalid file format. Please upload a PDF resume.' };
  }

  // Check size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { isValid: false, error: 'File size exceeds the 5MB limit. Please upload a smaller PDF.' };
  }

  return { isValid: true };
}

/**
 * Sanitize untrusted text input to prevent basic script injections or malicious text HTML tags
 */
export function sanitizeInputText(text: string): string {
  if (!text) return '';
  
  // Strip common HTML tags completely
  let clean = text.replace(/<[^>]*>/g, '');
  
  // Escape potential security payload characters
  clean = clean
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
    
  return clean;
}

/**
 * Unescapes text for display inside textareas or standard DOM elements (where escaping is handled natively)
 */
export function decodeHtml(html: string): string {
  if (!html) return '';
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/'
  };
  return html.replace(/&(amp|lt|gt|quot|#x27|#x2F);/g, (m) => map[m] || m);
}
