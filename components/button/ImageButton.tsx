'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ImageButtonProps {
  receiptRef: React.RefObject<HTMLDivElement | null>;
  RRR: string;
}

const ImageButton: React.FC<ImageButtonProps> = ({ receiptRef, RRR }) => {
  const waitForRender = (): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, 100));

  const handleDownloadImage = async () => {
    if (!receiptRef.current) {
      console.error('Receipt reference is null');
      alert('Could not generate image—element not found.');
      return;
    }

    let tempStyleElement: HTMLStyleElement | null = null;

    try {
      console.log('Starting image generation...');

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

      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: true,
      });

      console.log('Canvas generated successfully');
      const link = document.createElement('a');
      link.download = `payment-receipt-${RRR}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Image download failed:', err);
      alert('Could not generate image—please try printing instead.');
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
    <Button onClick={handleDownloadImage} className='flex items-center gap-2'>
      <Download className='h-4 w-4' />
      Save Image
    </Button>
  );
};

export default ImageButton;
