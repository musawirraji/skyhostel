'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface RemitaPaymentButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  amount: number;
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    matricNumber: string;
    phoneNumber?: string;
  };
  rrrNumber?: string;
  onSuccess?: (response: any) => void;
  onError?: (response: any) => void;
  onClose?: () => void;
  className?: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
}

const RemitaPaymentButton: React.FC<RemitaPaymentButtonProps> = ({
  amount,
  customerDetails,
  rrrNumber,
  onSuccess,
  onError,
  onClose,
  children,
  className,
  variant = 'default',
  ...buttonProps
}) => {
  // Generate a unique transaction ID if not provided
  const generateTransactionId = () => {
    return `TX${Date.now()}${Math.floor(Math.random() * 1000)}`;
  };

  const handlePayment = () => {
    // Make sure the RmPaymentEngine is available (from the global script)
    if (typeof window !== 'undefined' && window.RmPaymentEngine) {
      const paymentEngine = window.RmPaymentEngine.init({
        key: 'QzAwMDAyNzEyNTl8MTEwNjE4NjF8OWZjOWYwNmMyZDk3MDRhYWM3YThiOThlNTNjZTE3ZjYxOTY5NDdmZWE1YzU3NDc0ZjE2ZDZjNTg1YWYxNWY3NWM4ZjMzNzZhNjNhZWZlOWQwNmJhNTFkMjIxYTRiMjYzZDkzNGQ3NTUxNDIxYWNlOGY4ZWEyODY3ZjlhNGUwYTY=',
        transactionId: generateTransactionId(),
        customerId: customerDetails.matricNumber, // Use matric number as customer ID
        firstName: customerDetails.firstName,
        lastName: customerDetails.lastName,
        email: customerDetails.email,
        amount: amount,
        narration: 'SkyHostel Payment',
        ...(customerDetails.phoneNumber && {
          phoneNumber: customerDetails.phoneNumber,
        }),
        ...(rrrNumber && { rrr: rrrNumber }), // Include RRR if provided
        onSuccess: (response: any) => {
          console.log('Payment successful:', response);
          if (onSuccess) onSuccess(response);
        },
        onError: (response: any) => {
          console.error('Payment error:', response);
          if (onError) onError(response);
        },
        onClose: () => {
          console.log('Payment widget closed');
          if (onClose) onClose();
        },
      });

      // Show the payment widget
      paymentEngine.showPaymentWidget();
    } else {
      console.error(
        'Remita Payment Engine not available. Make sure the script is loaded.'
      );
    }
  };

  return (
    <Button
      className={className}
      variant={variant}
      onClick={handlePayment}
      {...buttonProps}
    >
      {children || 'Pay Now'}
    </Button>
  );
};

export default RemitaPaymentButton;
