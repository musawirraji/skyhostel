'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RemitaPaymentResponse, RemitaPaymentError } from '@/types/remita';
import { z } from 'zod';
import { formSchema } from '@/lib/validation';
import { RemitaDemoButton } from './RemitaDemoButton';

interface PayNowProps {
  formValues: z.infer<typeof formSchema>;
  paymentAmount: number;
  onSuccess: (response: RemitaPaymentResponse) => void;
  onError: (error: RemitaPaymentError | Error) => void;
  onClose: () => void;
  onBackToOptions: () => void;
}

const PayNow: React.FC<PayNowProps> = ({
  formValues,
  paymentAmount,
  onSuccess,
  onError,
  onClose,
  onBackToOptions,
}) => {
  return (
    <div className='space-y-6'>
      <Card className='w-full bg-white shadow-lg rounded-lg overflow-hidden'>
        <CardHeader className='space-y-1 text-center p-6 bg-white border-b'>
          <h2 className='text-2xl font-bold'>Complete Your Payment</h2>
          <p className='text-sm text-gray-600'>
            Please complete your payment to finalize your registration
          </p>
        </CardHeader>
        <CardContent className='p-6 space-y-6'>
          <div className='bg-blue-50 p-4 rounded-md'>
            <h4 className='font-medium text-blue-800'>Payment Details</h4>
            <div className='mt-2 space-y-2'>
              <div className='flex justify-between'>
                <span className='text-blue-700'>Amount:</span>
                <span className='font-medium'>
                  ₦{paymentAmount.toLocaleString()}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-blue-700'>Registration Number:</span>
                <span className='font-medium'>{formValues.matricNumber}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-blue-700'>Payment Type:</span>
                <span className='font-medium'>
                  {formValues.paymentType === 'FULL'
                    ? 'Full Payment'
                    : formValues.paymentType === 'HALF'
                    ? 'Half Payment'
                    : 'Custom Payment'}
                </span>
              </div>
            </div>
            <p className='text-sm text-blue-700 mt-4'>
              You will be redirected to Remita to complete your payment
              securely. An RRR (Remita Retrieval Reference) will be generated
              for you.
            </p>
          </div>

          <div className='flex justify-center pt-4'>
            <RemitaDemoButton
              amount={paymentAmount}
              firstName={formValues.firstName}
              lastName={formValues.lastName}
              email={formValues.email}
              matricNumber={formValues.matricNumber}
              onSuccess={onSuccess}
              onError={onError}
              onClose={onClose}
            />
          </div>

          <div className='text-center mt-4'>
            <Button variant='outline' onClick={onBackToOptions}>
              Back to Payment Options
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayNow;
