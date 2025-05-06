import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Copy, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { FORMATTED_PAYMENT_AMOUNT } from '@/constants';
import FormInput from './forms/FormInput';
import RRRGeneratedComponent from './RRRGenerated';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import RemitaPaymentButton from './RemitaPaymentButton';
import { toast } from 'sonner';

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
  // State for the UI
  const [step, setStep] = useState<
    'FORM' | 'RRR_GENERATED' | 'PAYMENT_OPTIONS'
  >('FORM');
  const [selectedPaymentType, setSelectedPaymentType] = useState<
    'FULL' | 'HALF' | 'CUSTOM'
  >('FULL');
  const [customAmount, setCustomAmount] = useState('');
  const [copied, setCopied] = useState(false);

  // Validation states
  const [errors, setErrors] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    matricNumber: '',
    customAmount: '',
  });

  // Payment amounts
  const FULL_AMOUNT = 219000;
  const HALF_AMOUNT = Math.floor(FULL_AMOUNT / 2);

  // Effect to move to next step when RRR number is generated
  useEffect(() => {
    if (rrrNumber && step === 'FORM' && !isGenerating) {
      setStep('RRR_GENERATED');
    }
  }, [rrrNumber, isGenerating, step]);

  // Calculate the current payment amount based on selection
  const getPaymentAmount = () => {
    switch (selectedPaymentType) {
      case 'FULL':
        return FULL_AMOUNT;
      case 'HALF':
        return HALF_AMOUNT;
      case 'CUSTOM':
        return customAmount ? parseInt(customAmount, 10) : 0;
      default:
        return FULL_AMOUNT;
    }
  };

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate form fields
  const validateForm = () => {
    const newErrors = {
      userName: '',
      userEmail: '',
      userPhone: '',
      matricNumber: '',
      customAmount: '',
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

    if (step === 'PAYMENT_OPTIONS' && selectedPaymentType === 'CUSTOM') {
      if (!customAmount) {
        newErrors.customAmount = 'Please enter a custom amount';
        isValid = false;
      } else if (parseInt(customAmount, 10) < 10000) {
        newErrors.customAmount = 'Amount must be at least ₦10,000';
        isValid = false;
      }
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

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(rrrNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle pay now click
  const handlePayNow = () => {
    setStep('PAYMENT_OPTIONS');
  };

  // Proceed to Remita payment
  const proceedToRemitaPayment = () => {
    if (selectedPaymentType === 'CUSTOM' && !validateForm()) {
      return;
    }

    // Get full name parts
    const nameParts = userName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    // Close the modal after successful payment
    onOpenChange(false);
  };

  // Initial form
  const renderInitialForm = () => (
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
    </div>
  );

  // RRR generated view
  const renderRRRGenerated = () => (
    <div className='space-y-6 py-4'>
      <div className='text-center'>
        <div className='mx-auto bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mb-4'>
          <Check className='text-green-500 w-10 h-10' />
        </div>
        <h3 className='text-xl font-semibold text-gray-800 mb-2'>
          Reference Number Generated!
        </h3>
        <p className='text-gray-600 mb-6'>
          Use this number to complete your payment
        </p>
      </div>

      <div className='p-4 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-between'>
        <div className='font-mono text-lg font-semibold'>{rrrNumber}</div>
        <Button
          variant='outline'
          size='sm'
          onClick={handleCopy}
          className='flex items-center gap-2'
        >
          {copied ? (
            <>
              <Check className='h-4 w-4' />
              Copied
            </>
          ) : (
            <>
              <Copy className='h-4 w-4' />
              Copy
            </>
          )}
        </Button>
      </div>

      <div className='text-center space-y-2'>
        <p className='text-sm text-gray-500'>
          Your payment reference is valid for 24 hours. You can use this to pay
          via Remita or to verify your payment later.
        </p>
      </div>

      <div className='pt-4 flex justify-center'>
        <Button
          onClick={handlePayNow}
          className='bg-blue text-white hover:bg-dark-blue w-full max-w-md'
        >
          Pay Now
        </Button>
      </div>
    </div>
  );

  // Payment options view
  const renderPaymentOptions = () => (
    <div className='space-y-6 py-4'>
      <div className='text-center mb-4'>
        <h3 className='text-xl font-semibold text-gray-800 mb-2'>
          Choose Payment Amount
        </h3>
        <p className='text-gray-600'>Select how much you want to pay</p>
      </div>

      <div className='space-y-4'>
        <RadioGroup
          value={selectedPaymentType}
          onValueChange={(value: 'FULL' | 'HALF' | 'CUSTOM') =>
            setSelectedPaymentType(value)
          }
          className='space-y-4'
        >
          <div className='border rounded-lg p-4 hover:bg-gray-50 transition-colors'>
            <div className='flex items-center space-x-3'>
              <RadioGroupItem value='FULL' id='full' />
              <div className='flex-1'>
                <Label
                  htmlFor='full'
                  className='text-base font-medium flex justify-between'
                >
                  <span>Full Payment</span>
                  <span className='font-semibold'>
                    ₦{FULL_AMOUNT.toLocaleString()}
                  </span>
                </Label>
                <p className='text-sm text-gray-500 mt-1'>
                  Pay the entire amount at once
                </p>
              </div>
            </div>
          </div>

          <div className='border rounded-lg p-4 hover:bg-gray-50 transition-colors'>
            <div className='flex items-center space-x-3'>
              <RadioGroupItem value='HALF' id='half' />
              <div className='flex-1'>
                <Label
                  htmlFor='half'
                  className='text-base font-medium flex justify-between'
                >
                  <span>Half Payment</span>
                  <span className='font-semibold'>
                    ₦{HALF_AMOUNT.toLocaleString()}
                  </span>
                </Label>
                <p className='text-sm text-gray-500 mt-1'>
                  Pay half now, half later
                </p>
              </div>
            </div>
          </div>

          <div className='border rounded-lg p-4 hover:bg-gray-50 transition-colors'>
            <div className='flex items-center space-x-3'>
              <RadioGroupItem value='CUSTOM' id='custom' />
              <div className='flex-1'>
                <Label htmlFor='custom' className='text-base font-medium'>
                  Custom Amount
                </Label>
                {selectedPaymentType === 'CUSTOM' && (
                  <div className='mt-3'>
                    <Input
                      id='customAmount'
                      type='number'
                      placeholder='Minimum ₦10,000'
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        if (errors.customAmount) {
                          setErrors({ ...errors, customAmount: '' });
                        }
                      }}
                      min='10000'
                    />
                    {errors.customAmount && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.customAmount}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </RadioGroup>

        <div className='pt-6 flex justify-center space-x-4'>
          <Button variant='outline' onClick={() => setStep('RRR_GENERATED')}>
            Back
          </Button>
          <RemitaPaymentButton
            amount={getPaymentAmount()}
            customerDetails={{
              firstName: userName.split(' ')[0],
              lastName:
                userName.split(' ').length > 1
                  ? userName.split(' ').slice(1).join(' ')
                  : '',
              email: userEmail,
              matricNumber: matricNumber,
              phoneNumber: userPhone,
            }}
            rrrNumber={rrrNumber}
            className='bg-blue text-white hover:bg-dark-blue'
            onSuccess={() => {
              toast.success('Payment successful!');
              onOpenChange(false);
            }}
            onError={() => {
              toast.error('Payment failed. Please try again.');
            }}
          >
            Proceed to Payment
          </RemitaPaymentButton>
        </div>
      </div>
    </div>
  );

  // Determine content based on step
  const renderContent = () => {
    switch (step) {
      case 'FORM':
        return (
          <>
            {renderInitialForm()}
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
          </>
        );
      case 'RRR_GENERATED':
        return renderRRRGenerated();
      case 'PAYMENT_OPTIONS':
        return renderPaymentOptions();
      default:
        return null;
    }
  };

  // Main return
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md bg-white'>
        <DialogHeader>
          <DialogTitle className='text-center text-[--sky-dark-blue] text-xl'>
            {step === 'FORM' && 'Generate Payment Reference'}
            {step === 'RRR_GENERATED' && 'Payment Reference Generated'}
            {step === 'PAYMENT_OPTIONS' && 'Payment Options'}
          </DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
