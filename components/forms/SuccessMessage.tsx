import React from 'react';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface SuccessMessageProps {
  studentName: string;
  roomType: string;
  block: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  studentName,
  roomType,
  block,
}) => {
  return (
    <div className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-md'>
      <div className='text-center'>
        <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100'>
          <CheckCircle className='h-8 w-8 text-[var(--color-green)]' />
        </div>

        <h3 className='mt-4 text-lg font-medium text-gray-900'>
          Registration Successful!
        </h3>

        <div className='mt-2 space-y-1'>
          <p className='text-sm text-gray-500'>
            Thank you for registering with Sky Hostel!
          </p>
          <p className='text-sm text-gray-500'>
            Your application has been successfully processed.
          </p>
        </div>

        <div className='mt-6 px-4 py-5 border border-gray-200 rounded-md bg-gray-50'>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span className='text-sm font-medium text-gray-500'>Name:</span>
              <span className='text-sm text-gray-900'>{studentName}</span>
            </div>

            <div className='flex justify-between'>
              <span className='text-sm font-medium text-gray-500'>
                Room Type:
              </span>
              <span className='text-sm text-gray-900'>{roomType}</span>
            </div>

            <div className='flex justify-between'>
              <span className='text-sm font-medium text-gray-500'>Block:</span>
              <span className='text-sm text-gray-900'>{block}</span>
            </div>

            <div className='flex justify-between'>
              <span className='text-sm font-medium text-gray-500'>Status:</span>
              <span className='text-sm font-medium text-[var(--color-green)]'>
                Payment Verified ✓
              </span>
            </div>
          </div>
        </div>

        <div className='mt-6 space-y-4'>
          <p className='text-sm text-gray-500'>
            Your payment has been verified and your hostel reservation is
            confirmed. You will receive a confirmation email with your room
            details shortly.
          </p>

          <Link
            href='/'
            className='inline-block w-full rounded-md bg-[var(--color-blue)] px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-dark-blue)]'
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
