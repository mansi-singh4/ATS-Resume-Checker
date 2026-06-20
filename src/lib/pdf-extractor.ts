/**
 * Extract plain text from a PDF file on the client side using pdfjs-dist
 */

// Polyfill Promise.withResolvers since pdfjs-dist (v5+) uses it and older browser/js runtimes crash without it.
if (typeof (Promise as any).withResolvers === 'undefined') {
  (Promise as any).withResolvers = function () {
    let resolve: any;
    let reject: any;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

export async function extractTextFromPdf(file: File): Promise<string> {
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Dynamically import pdfjs-dist to avoid SSR compilation failures
    const pdfjs = await import('pdfjs-dist');
    
    // Configure worker from jsDelivr npm registry CDN (exact version 5.6.205)
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs`;

    const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    
    let text = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => {
          return 'str' in item ? item.str : '';
        })
        .join(' ');
      
      text += pageText + '\n';
    }
    
    return text.trim();
  } catch (error: any) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(`Failed to parse PDF: ${error?.message || error || 'Check text layers'}`);
  }
}
