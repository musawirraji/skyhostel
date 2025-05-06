'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { z } from 'zod';
import { formSchema } from '@/lib/validation';

// Dynamically import the print button component
const PrintButton = dynamic(() => import('./button/PrintButton'), {
  ssr: false,
});
const PdfButton = dynamic(() => import('./button/PdfButton'), { ssr: false });
const ImageButton = dynamic(() => import('./button/ImageButton'), {
  ssr: false,
});

interface RRRGeneratedComponentProps {
  rrrNumber: string;
  paymentAmount: number;
  formValues: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    matricNumber: string;
    paymentType?: string;
  };
  onPayNowClick: () => void;
  onDashboardClick: () => void;
}

const RRRGeneratedComponent: React.FC<RRRGeneratedComponentProps> = ({
  rrrNumber,
  paymentAmount,
  formValues,
  onPayNowClick,
  onDashboardClick,
}) => {
  // Create a ref for the printable area
  const receiptRef = useRef<HTMLDivElement>(null);

  return (
    <div className='space-y-6'>
      {/* Print/Download Control Buttons */}
      <div className='no-print flex justify-end space-x-2'>
        <ImageButton receiptRef={receiptRef} RRR={rrrNumber} />
        <PdfButton receiptRef={receiptRef} RRR={rrrNumber} />
        <PrintButton receiptRef={receiptRef} RRR={rrrNumber} />
      </div>

      {/* Printable RRR Information */}
      <div
        ref={receiptRef}
        className='receipt-container bg-white border rounded-lg shadow-sm p-8 max-w-2xl mx-auto'
      >
        {/* Header */}
        <div className='text-center border-b pb-4 mb-6'>
          <h2 className='font-bold text-2xl'>PAYMENT INFORMATION</h2>
          <p className='text-sm text-gray-500'>RRR GENERATED SUCCESSFULLY</p>
        </div>

        {/* Institution */}
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h3 className='text-xl font-bold'>University Name</h3>
            <p className='text-sm text-gray-600'>123 University Avenue</p>
            <p className='text-sm text-gray-600'>support@university.edu</p>
          </div>
          <div className='bg-gray-200 w-20 h-20 flex items-center justify-center rounded'>
            <span className='text-sm text-gray-600'>LOGO</span>
          </div>
        </div>

        {/* Payment Details */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
          <div>
            <p className='text-sm text-gray-500'>RRR:</p>
            <p className='font-medium font-mono'>{rrrNumber}</p>
          </div>
          <div>
            <p className='text-sm text-gray-500'>Date Generated:</p>
            <p className='font-medium'>{new Date().toLocaleString('en-NG')}</p>
          </div>
          <div>
            <p className='text-sm text-gray-500'>Amount:</p>
            <p className='font-medium'>₦{paymentAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className='text-sm text-gray-500'>Status:</p>
            <p className='font-medium text-yellow-600'>PENDING</p>
          </div>
        </div>

        {/* Student Info */}
        <div className='bg-gray-50 p-4 rounded mb-6'>
          <h4 className='font-medium text-gray-700 mb-2'>
            Student Information
          </h4>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-gray-500'>Name:</p>
              <p className='font-medium'>{`${formValues.firstName} ${formValues.lastName}`}</p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Matric No:</p>
              <p className='font-medium'>{formValues.matricNumber}</p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Email:</p>
              <p className='font-medium'>{formValues.email}</p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Phone:</p>
              <p className='font-medium'>{formValues.phoneNumber}</p>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className='border-t border-b py-4 mb-6'>
          <h4 className='font-medium text-gray-700 mb-2'>
            Payment Instructions
          </h4>
          <ol className='ml-5 space-y-2 list-decimal'>
            <li>Visit the Remita website at www.remita.net</li>
            <li>
              Click on &quot;Pay RRR&quot; or &quot;Pay a Federal Government
              Agency&quot;
            </li>
            <li>Enter the RRR number shown above</li>
            <li>Complete the payment process</li>
          </ol>
        </div>

        {/* Footer */}
        <footer className='text-center text-sm text-gray-500'>
          <p>
            This RRR is valid for 24 hours. Keep this information for your
            records.
          </p>
          <p>Generated on {new Date().toLocaleString()}</p>
        </footer>
      </div>

      {/* Action Buttons (not part of printable content) */}
      <div className='no-print flex justify-center space-x-4'>
        <Button variant='outline' onClick={onPayNowClick}>
          Pay Now Instead
        </Button>
        <Button
          className='bg-green-600 hover:bg-green-700'
          onClick={onDashboardClick}
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default RRRGeneratedComponent;
