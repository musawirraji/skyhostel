import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { FORMATTED_PAYMENT_AMOUNT } from '@/constants';
import FormInput from './forms/FormInput';

interface VerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  verificationInput: string;
  matricNumber: string;
  isVerifying: boolean;
  onVerificationInputChange: (value: string) => void;
  onMatricNumberChange: (value: string) => void;
  onVerifyPayment: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  open,
  onOpenChange,
  verificationInput,
  matricNumber,
  isVerifying,
  onVerificationInputChange,
  onMatricNumberChange,
  onVerifyPayment,
}) => {
  // Validation states
  const [errors, setErrors] = useState({
    verificationInput: '',
    matricNumber: '',
  });

  // Validate form fields
  const validateForm = () => {
    const newErrors = {
      verificationInput: '',
      matricNumber: '',
    };

    let isValid = true;

    if (!verificationInput.trim()) {
      newErrors.verificationInput = 'Reference number is required';
      isValid = false;
    }

    if (!matricNumber.trim()) {
      newErrors.matricNumber = 'Matric number is required for verification';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      onVerifyPayment();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md bg-white'>
        <DialogHeader>
          <DialogTitle className='text-center text-[--sky-dark-blue] text-xl'>
            Verify Your Payment
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4 py-4'>
          <FormInput
            name='verificationInput'
            id='reference'
            label='Reference Number (RRR)'
            placeholder='Enter your payment reference number'
            value={verificationInput}
            onChange={(e) => {
              onVerificationInputChange(e.target.value);
              if (errors.verificationInput) {
                setErrors({ ...errors, verificationInput: '' });
              }
            }}
            error={errors.verificationInput}
            required={true}
          />

          <FormInput
            name='matricNumber'
            id='matric-verify'
            label='Matric Number'
            placeholder='Enter your matric number'
            value={matricNumber}
            onChange={(e) => {
              onMatricNumberChange(e.target.value);
              if (errors.matricNumber) {
                setErrors({ ...errors, matricNumber: '' });
              }
            }}
            error={errors.matricNumber}
            required={true}
          />

          <div className='text-center'>
            <p className='text-sm text-gray-600'>
              We will verify your payment of{' '}
              <span className='font-bold'>{FORMATTED_PAYMENT_AMOUNT}</span> with
              Remita.
            </p>
          </div>
        </div>
        <DialogFooter className='sm:justify-center space-x-0 sm:space-x-4'>
          <Button
            onClick={handleSubmit}
            className='bg-blue text-white hover:bg-dark-blue w-full sm:w-auto'
            disabled={isVerifying}
          >
            {isVerifying ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Verifying...
              </>
            ) : (
              'Verify Payment'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationModal;
