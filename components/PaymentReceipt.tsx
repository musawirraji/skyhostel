'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import dynamic from 'next/dynamic';

// Create separate client-only components with no SSR
const PrintButton = dynamic(() => import('./button/PrintButton'), {
  ssr: false,
});
const PdfButton = dynamic(() => import('./button/PdfButton'), { ssr: false });
const ImageButton = dynamic(() => import('./button/ImageButton'), {
  ssr: false,
});

interface ReceiptProps {
  paymentDetails: {
    RRR: string;
    transactionId: string;
    amount: number;
    paymentDate?: string;
    studentName: string;
    matricNumber: string;
  };
  onDashboardClick: () => void;
}

const PaymentReceipt: React.FC<ReceiptProps> = ({
  paymentDetails,
  onDashboardClick,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const { RRR } = paymentDetails;
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Formatting helper
  const formatDate = (d?: string) =>
    new Date(d ?? Date.now()).toLocaleString('en-NG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className='space-y-6'>
      {isClient && (
        <div className='no-print flex justify-end space-x-2'>
          {/* <ImageButton receiptRef={receiptRef} RRR={RRR} />
          <PdfButton receiptRef={receiptRef} RRR={RRR} /> */}
          <PrintButton receiptRef={receiptRef} RRR={RRR} />
        </div>
      )}

      <div
        ref={receiptRef}
        className='receipt-container bg-white border rounded-lg shadow-sm p-8 max-w-2xl mx-auto'
      >
        <div className='text-center border-b pb-4 mb-6'>
          <h2 className='font-bold text-2xl'>PAYMENT RECEIPT</h2>
          <p className='text-sm text-gray-500'>OFFICIAL PAYMENT CONFIRMATION</p>
        </div>

        <div className='flex justify-between items-center mb-8'>
          <div>
            <h3 className='text-xl font-bold'>Sky Hostel</h3>
            <p className='text-sm text-gray-600'>123 University Avenue</p>
            <p className='text-sm text-gray-600'>sky@hostel.edu</p>
          </div>
          <div className='bg-gray-200 w-20 h-20 flex items-center justify-center rounded'>
            <span className='text-sm text-gray-600'>LOGO</span>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
          <div>
            <p className='text-sm text-gray-500'>Receipt No:</p>
            <p className='font-medium'>{paymentDetails.transactionId}</p>
          </div>
          <div>
            <p className='text-sm text-gray-500'>Date:</p>
            <p className='font-medium'>
              {formatDate(paymentDetails.paymentDate)}
            </p>
          </div>
          <div>
            <p className='text-sm text-gray-500'>RRR:</p>
            <p className='font-medium'>{RRR}</p>
          </div>
          <div>
            <p className='text-sm text-gray-500'>Status:</p>
            <p className='font-medium text-green-600'>PAID</p>
          </div>
        </div>

        <div className='bg-gray-50 p-4 rounded mb-6'>
          <h4 className='font-medium text-gray-700 mb-2'>
            Student Information
          </h4>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-gray-500'>Name:</p>
              <p className='font-medium'>{paymentDetails.studentName}</p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Matric No:</p>
              <p className='font-medium'>{paymentDetails.matricNumber}</p>
            </div>
          </div>
        </div>

        <div className='border-t border-b py-4 mb-6'>
          <h4 className='font-medium text-gray-700 mb-2'>Payment Details</h4>
          <div className='flex justify-between border-b pb-2 mb-2'>
            <span>Description</span>
            <span>Amount</span>
          </div>
          <div className='flex justify-between py-2'>
            <span>School Fees Payment</span>
            <span>₦{paymentDetails.amount.toLocaleString()}</span>
          </div>
          <div className='flex justify-between pt-2 border-t'>
            <span className='font-semibold'>Total</span>
            <span className='font-bold'>
              ₦{paymentDetails.amount.toLocaleString()}
            </span>
          </div>
        </div>

        <footer className='text-center text-sm text-gray-500'>
          <p>This receipt serves as proof of payment. Keep for your records.</p>
          <p>Generated on {new Date().toLocaleString()}</p>
        </footer>
      </div>

      <div className='no-print text-center'>
        <Button
          onClick={onDashboardClick}
          className='bg-green-600 text-white hover:bg-green-700'
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default PaymentReceipt;
