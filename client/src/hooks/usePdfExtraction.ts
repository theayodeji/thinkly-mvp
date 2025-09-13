import { useState, useEffect, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import PdfWorker from 'pdfjs-dist/legacy/build/pdf.worker.mjs?url';

// Define the shape of the custom hook's return value
interface PdfExtractionState {
  text: string;
  loading: boolean;
  error: string | null;
  extractFromFile: (file: File) => Promise<string>;
  extractFromUrl: (url: string) => Promise<string>;
}

// Custom hook to handle all PDF text extraction logic
export const usePdfTextExtractor = (): PdfExtractionState => {
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = PdfWorker;
  }, []);

  const extractTextFromPdfData = useCallback(async (data: ArrayBuffer): Promise<string> => {
    try {
      const loadingTask = pdfjsLib.getDocument({ data });
      const pdfDocument = await loadingTask.promise;
      
      let extractedText = '';
      for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        extractedText += `--- Page ${pageNum} ---\n${pageText}\n\n`;
      }
      return extractedText;
    } catch (err) {
      console.error('Error during PDF extraction:', err);
      throw new Error('Failed to extract text from PDF. Please ensure it is a valid PDF file.');
    }
  }, []);

  const extractFromFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    setText('');
    
    if (!file) {
      setLoading(false);
      return '';
    }

    const reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const extractedText = await extractTextFromPdfData(arrayBuffer);
          setText(extractedText);
          resolve(extractedText);
        } catch (err) {
          setError((err as Error).message);
          reject(err);
        } finally {
          setLoading(false);
        }
      };
      reader.onerror = (err) => {
        setError("File read error.");
        reject(err);
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    });
  }, [extractTextFromPdfData]);

  const extractFromUrl = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    setText('');
    try {
      if (!url) {
        throw new Error('Please enter a valid URL.');
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const extractedText = await extractTextFromPdfData(arrayBuffer);
      setText(extractedText);
      return extractedText;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [extractTextFromPdfData]);

  return { text, loading, error, extractFromFile, extractFromUrl };
};