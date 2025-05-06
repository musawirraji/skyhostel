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

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  userEmail: string;
  userPhone: string;
  matricNumber: string;
  rrrNumber: string;
  isGenerating: boolean;
  onUserNameChange: (value: string) => void;
  onUserEmailChange: (value: string) => void;
  onUserPhoneChange: (value: string) => void;
  onMatricNumberChange: (value: string) => void;
  onGenerateRRR: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onOpenChange,
  userName,
  userEmail,
  userPhone,
  matricNumber,
  rrrNumber,
  isGenerating,
  onUserNameChange,
  onUserEmailChange,
  onUserPhoneChange,
  onMatricNumberChange,
  onGenerateRRR,
}) => {
  // Validation states
  const [errors, setErrors] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    matricNumber: '',
  });

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate form fields
  const validateForm = () => {
    const newErrors = {
      userName: '',
      userEmail: '',
      userPhone: '',
      matricNumber: '',
    };

    let isValid = true;

    if (!userName.trim()) {
      newErrors.userName = 'Full name is required';
      isValid = false;
    }

    if (!userEmail.trim()) {
      newErrors.userEmail = 'Email address is required';
      isValid = false;
    } else if (!emailRegex.test(userEmail)) {
      newErrors.userEmail = 'Please enter a valid email address';
      isValid = false;
    }

    if (!userPhone.trim()) {
      newErrors.userPhone = 'Phone number is required';
      isValid = false;
    } else if (userPhone.length < 10) {
      newErrors.userPhone = 'Phone number must be at least 10 digits';
      isValid = false;
    }

    if (!matricNumber.trim()) {
      newErrors.matricNumber = 'Matric number is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      onGenerateRRR();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md bg-white'>
        <DialogHeader>
          <DialogTitle className='text-center text-[--sky-dark-blue] text-xl'>
            Generate Payment Reference
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4 py-4'>
          <FormInput
            name='userName'
            id='name'
            label='Full Name'
            placeholder='Enter your full name'
            value={userName}
            onChange={(e) => {
              onUserNameChange(e.target.value);
              if (errors.userName) {
                setErrors({ ...errors, userName: '' });
              }
            }}
            error={errors.userName}
            required={true}
          />

          <FormInput
            name='userEmail'
            id='email'
            label='Email Address'
            type='email'
            placeholder='Enter your email'
            value={userEmail}
            onChange={(e) => {
              onUserEmailChange(e.target.value);
              if (errors.userEmail) {
                setErrors({ ...errors, userEmail: '' });
              }
            }}
            error={errors.userEmail}
            required={true}
          />

          <FormInput
            name='userPhone'
            id='phone'
            label='Phone Number'
            placeholder='Enter your phone number'
            value={userPhone}
            onChange={(e) => {
              onUserPhoneChange(e.target.value);
              if (errors.userPhone) {
                setErrors({ ...errors, userPhone: '' });
              }
            }}
            error={errors.userPhone}
            required={true}
          />

          <FormInput
            name='matricNumber'
            id='matric'
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

          {rrrNumber && (
            <div className='p-4 bg-green-50 border border-green-200 rounded-md text-center'>
              <p className='text-green-800 font-semibold'>
                Your Reference Number:
              </p>
              <p className='text-xl font-bold text-[--sky-dark-blue]'>
                {rrrNumber}
              </p>
              <p className='text-sm text-gray-600 mt-2'>
                Use this number to pay on Remita platform or verify your
                payment.
              </p>
            </div>
          )}

          <div className='text-center'>
            <p className='text-sm text-[--sky-dark-blue] mb-2'>
              Payment Amount:{' '}
              <span className='font-bold'>{FORMATTED_PAYMENT_AMOUNT}</span>
            </p>
          </div>
        </div>
        <DialogFooter className='sm:justify-center space-x-0 sm:space-x-4'>
          <Button
            onClick={handleSubmit}
            className='bg-blue text-white hover:bg-dark-blue w-full sm:w-auto'
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Generating...
              </>
            ) : (
              'Generate Reference Number'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
