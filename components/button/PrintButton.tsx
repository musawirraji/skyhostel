'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

interface PrintButtonProps {
  receiptRef: React.RefObject<HTMLDivElement | null>;
  RRR: string;
}

const PrintButton: React.FC<PrintButtonProps> = ({ receiptRef, RRR }) => {
  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `receipt-${RRR}`,
    onBeforePrint: async () => {
      console.log('Preparing to print...');

      return Promise.resolve();
    },
    onAfterPrint: () => console.log('Print completed'),
    onPrintError: (error) => console.error('Print failed:', error),
  });

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handlePrint();
  };

  return (
    <Button onClick={handleButtonClick} className='flex items-center gap-2'>
      <Printer className='h-4 w-4' />
      Print
    </Button>
  );
};

export default PrintButton;
