import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { formSchema } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { RemitaPaymentResponse, RemitaPaymentError } from '@/types/remita';
import PaymentReceipt from '../PaymentReceipt';
import PaymentSelectionModal from '../PaymentSelectionModal';
import RRRGeneratedComponent from '../RRRGenerated';
import PayNow from '../PayNow';

interface PaymentProcessingProps {
  formValues: z.infer<typeof formSchema>;
  setPaymentCompleted: (completed: boolean) => void;
  setPaymentData: (data: RemitaPaymentResponse | null) => void;
  onNavigateToDashboard?: () => void;
}

const PaymentProcessing: React.FC<PaymentProcessingProps> = ({
  formValues,
  setPaymentCompleted,
  setPaymentData,
  onNavigateToDashboard,
}) => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [successDetails, setSuccessDetails] =
    useState<RemitaPaymentResponse | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(true);
  const [payNowSelected, setPayNowSelected] = useState(false);
  const [rrrGenerated, setRrrGenerated] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate payment amount based on payment type
  const getPaymentAmount = () => {
    switch (formValues.paymentType) {
      case 'FULL':
        return 100000;
      case 'HALF':
        return 50000;
      case 'CUSTOM':
        return formValues.customAmount || 0;
      default:
        return 0;
    }
  };

  const paymentAmount = getPaymentAmount();

  const handlePaymentSuccess = (response: RemitaPaymentResponse) => {
    setPaymentSuccess(true);
    setSuccessDetails(response);
    setPaymentData(response);
    setPaymentCompleted(true);

    updatePaymentStatus(response);
  };

  const updatePaymentStatus = async (response: RemitaPaymentResponse) => {
    try {
      const updateResponse = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matricNumber: formValues.matricNumber,
          rrr: response.RRR,
          transactionId: response.transactionId,
          amount: paymentAmount,
          status: 'completed',
        }),
      });

      const data = await updateResponse.json();

      if (!data.success) {
        console.error('Failed to update payment status:', data.error);
        toast.error('Failed to update payment record');
      }
    } catch (error) {
      console.error('Payment status update error:', error);
    }
  };

  // Navigate to dashboard handler
  const handleDashboardClick = () => {
    if (onNavigateToDashboard) {
      onNavigateToDashboard();
    }
  };

  // Generate RRR without initiating payment
  const generateRRR = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/rrr-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matricNumber: formValues.matricNumber,
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          phoneNumber: formValues.phoneNumber,
          amount: paymentAmount,
        }),
      });

      // First try to parse as JSON
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Invalid response from payment service');
      }

      if (data.success && data.rrr) {
        setRrrGenerated(data.rrr);
        setSuccessDetails({
          RRR: data.rrr,
          transactionId: data.transactionId || String(Date.now()),
          message: 'RRR generated successfully',
          status: 'pending',
        });

        toast.success('Payment reference generated successfully');
      } else {
        // Handle different error scenarios with user-friendly messages
        let errorMessage = data.error || 'Failed to generate payment reference';
        const errorCodeValue = data.errorCode || 'UNKNOWN_ERROR';

        if (data.errorCode === 'AUTH_ERROR') {
          errorMessage =
            'The payment service is temporarily unavailable. Please try again later.';
        } else if (data.errorCode === 'TIMEOUT') {
          errorMessage =
            'The payment service is taking too long to respond. Please try again later.';
        } else if (data.errorCode === 'NETWORK_ERROR') {
          errorMessage =
            'Network connection issues detected. Please check your connection and try again.';
        }

        setPaymentError(errorMessage);
        setErrorCode(errorCodeValue);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('RRR generation error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'We encountered an unexpected issue. Please try again later.';

      setPaymentError(errorMessage);
      setErrorCode('CLIENT_ERROR');
      toast.error('Payment system unavailable. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (rrrGenerated || (successDetails && successDetails.RRR)) {
      const rrr = rrrGenerated || (successDetails ? successDetails.RRR : '');

      // Initial check
      checkPaymentStatus(rrr);

      // Set up interval for recurring checks (every 2 minutes for demo purposes)
      // In production, this would be a longer interval or handled server-side
      intervalId = setInterval(() => {
        checkPaymentStatus(rrr);
      }, 2 * 60 * 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [rrrGenerated, successDetails]);

  // Function to check payment status
  const checkPaymentStatus = async (rrr: string) => {
    try {
      const response = await fetch(`/api/check-payment-status?rrr=${rrr}`);
      const data = await response.json();

      if (data.success) {
        if (data.status === 'completed') {
          setPaymentSuccess(true);
          setSuccessDetails((prev) =>
            prev ? { ...prev, status: 'completed' } : null
          );
          setPaymentCompleted(true);
          toast.success('Payment completed!');
        } else if (data.status === 'failed') {
          setPaymentError('Payment processing failed');
          setErrorCode('PAYMENT_FAILED');
          toast.error('Payment processing failed');
        }
      }
    } catch (error) {
      console.error('Payment status check error:', error);
    }
  };

  // Handle payment error
  const handlePaymentError = (error: RemitaPaymentError | Error) => {
    let errorMessage = 'Payment could not be completed';
    let errorCodeValue = 'PAYMENT_ERROR';

    if (error instanceof Error) {
      errorMessage = error.message;

      if (/network|connection/i.test(error.message)) {
        errorCodeValue = 'NETWORK_ERROR';
      } else if (/timeout/i.test(error.message)) {
        errorCodeValue = 'TIMEOUT_ERROR';
      }
    } else {
      // it's your RemitaPaymentError
      const { message, responseMessage, error: errField, code } = error;
      errorMessage = message || responseMessage || errField || errorMessage;

      // assign code safely
      if (typeof code === 'string' && code) {
        errorCodeValue = code;
      } else if (code != null) {
        errorCodeValue = `${code}`;
      }
    }

    setPaymentError(errorMessage);
    setErrorCode(errorCodeValue);
    toast.error(errorMessage);
  };

  // Handle payment close
  const handlePaymentClose = () => {
    if (!paymentSuccess) {
      console.log('Payment window closed without completion');
    }
  };

  // Modal handlers
  const handlePayNow = () => {
    setPayNowSelected(true);
    setShowPaymentModal(false);
  };

  const handlePayLater = async () => {
    await generateRRR();
    setShowPaymentModal(false);
  };

  // Render RRR generated screen
  if (rrrGenerated) {
    return (
      <RRRGeneratedComponent
        rrrNumber={rrrGenerated}
        paymentAmount={paymentAmount}
        formValues={formValues}
        onPayNowClick={() => {
          setRrrGenerated(null);
          setPayNowSelected(true);
        }}
        onDashboardClick={handleDashboardClick}
      />
    );
  }

  // Render success screen with receipt if payment is completed
  if (paymentSuccess && successDetails) {
    return (
      <PaymentReceipt
        paymentDetails={{
          RRR: successDetails.RRR,
          transactionId: successDetails.transactionId,
          amount: paymentAmount,
          paymentDate: new Date().toISOString(),
          studentName: `${formValues.firstName} ${formValues.lastName}`,
          matricNumber: formValues.matricNumber,
        }}
        onDashboardClick={handleDashboardClick}
      />
    );
  }

  if (paymentError) {
    return (
      <div className='space-y-6'>
        <div className='text-center'>
          <svg
            className='mx-auto h-12 w-12 text-red-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
            />
          </svg>
          <h3 className='text-xl font-bold text-gray-900 mt-4'>
            Payment Not Processed
          </h3>
          <p className='text-gray-600 mt-2'>{paymentError}</p>
        </div>

        <div className='bg-red-50 border border-red-100 rounded-lg p-4'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg
                className='h-5 w-5 text-red-400'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-red-800'>
                What can you do?
              </h3>
              <div className='mt-2 text-sm text-red-700'>
                <ul className='list-disc pl-5 space-y-1'>
                  {errorCode === 'NETWORK_ERROR' && (
                    <>
                      <li>Check your internet connection</li>
                      <li>
                        Make sure you&apos;re connected to a stable network
                      </li>
                    </>
                  )}
                  {errorCode === 'TIMEOUT_ERROR' && (
                    <>
                      <li>The payment server is experiencing high traffic</li>
                      <li>Wait a few minutes before trying again</li>
                    </>
                  )}
                  {errorCode === 'AUTH_ERROR' && (
                    <>
                      <li>The payment system is temporarily unavailable</li>
                      <li>Try again later or contact support</li>
                    </>
                  )}
                  <li>Try again in a few minutes</li>
                  {!['NETWORK_ERROR', 'TIMEOUT_ERROR', 'AUTH_ERROR'].includes(
                    errorCode || ''
                  ) && <li>Contact support if the problem persists</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className='flex justify-center'>
          <Button
            onClick={() => {
              setPaymentError(null);
              setErrorCode(null);
              setShowPaymentModal(true);
            }}
            className='bg-blue-600 hover:bg-blue-700'
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (showPaymentModal) {
    return (
      <PaymentSelectionModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPayNow={handlePayNow}
        onPayLater={handlePayLater}
        amount={paymentAmount}
      />
    );
  }

  if (payNowSelected) {
    return (
      <PayNow
        formValues={formValues}
        paymentAmount={paymentAmount}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
        onClose={handlePaymentClose}
        onBackToOptions={() => setShowPaymentModal(true)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center p-8 space-y-4'>
        <Loader2 className='h-12 w-12 animate-spin text-blue-600' />
        <p className='text-lg text-gray-700'>Processing your request...</p>
      </div>
    );
  }

  return (
    <div className='flex justify-center items-center p-8'>
      <Button
        onClick={() => setShowPaymentModal(true)}
        className='bg-blue-600 hover:bg-blue-700'
      >
        Select Payment Option
      </Button>
    </div>
  );
};

export default PaymentProcessing;
