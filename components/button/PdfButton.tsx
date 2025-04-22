'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

interface PdfButtonProps {
  receiptRef: React.RefObject<HTMLDivElement | null>;
  RRR: string;
}

const PdfButton: React.FC<PdfButtonProps> = ({ receiptRef, RRR }) => {
  const waitForRender = (): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, 100));

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) {
      console.error('Receipt reference is null');
      alert('Could not generate PDF—element not found.');
      return;
    }

    let tempStyleElement: HTMLStyleElement | null = null;

    try {
      console.log('Starting PDF generation...');

      tempStyleElement = document.createElement('style');
      tempStyleElement.textContent = `
        .receipt-container * {
          color: #000000 !important;
          background-color: #ffffff !important;
          border-color: #cccccc !important;
        }
        .receipt-container .text-green-600 {
          color: #16a34a !important;
        }
        .receipt-container .bg-gray-50 {
          background-color: #f9fafb !important;
        }
        .receipt-container .bg-gray-200 {
          background-color: #e5e7eb !important;
        }
        .receipt-container .text-gray-500, 
        .receipt-container .text-gray-600, 
        .receipt-container .text-gray-700 {
          color: #6b7280 !important;
        }
      `;
      document.head.appendChild(tempStyleElement);

      await waitForRender();
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      receiptRef.current.offsetHeight;

      await html2pdf()
        .set({
          margin: 10,
          filename: `payment-receipt-${RRR}.pdf`,
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: true,
            timeout: 5000,
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(receiptRef.current)
        .save();

      console.log('PDF generated successfully');
    } catch (err) {
      console.error('PDF download failed:', err);
      alert('Could not generate PDF—please try printing instead.');
    } finally {
      if (tempStyleElement) {
        try {
          document.head.removeChild(tempStyleElement);
        } catch (cleanupErr) {
          console.error('Error removing temporary style element', cleanupErr);
        }
      }
    }
  };

  return (
    <Button onClick={handleDownloadPDF} className='flex items-center gap-2'>
      <Download className='h-4 w-4' />
      Save PDF
    </Button>
  );
};

export default PdfButton;
