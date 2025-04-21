import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { formSchema } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { RemitaPaymentResponse, RemitaPaymentError } from '@/types/remita';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RemitaDemoButton } from '../RemitaDemoButton';
import PaymentReceipt from '../PaymentReceipt';
import PaymentSelectionModal from '../PaymentSelectionModal';

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

      const data = await response.json();

      if (data.success && data.rrr) {
        setRrrGenerated(data.rrr);
        setSuccessDetails({
          RRR: data.rrr,
          transactionId: data.transactionId || String(Date.now()),
          message: 'RRR generated successfully',
          status: 'pending',
        });

        toast.success('RRR generated successfully');
      } else {
        setPaymentError(data.error || 'Failed to generate RRR');
        toast.error(data.error || 'Failed to generate RRR');
      }
    } catch (error) {
      console.error('RRR generation error:', error);
      setPaymentError(
        error instanceof Error ? error.message : 'Failed to generate RRR'
      );
      toast.error('Failed to generate RRR');
    } finally {
      setIsLoading(false);
    }
  };

  // Set up recurring payment status check
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
          toast.error('Payment processing failed');
        }
      }
    } catch (error) {
      console.error('Payment status check error:', error);
    }
  };

  // Handle payment error
  const handlePaymentError = (error: RemitaPaymentError | Error) => {
    let errorMessage: string;

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null) {
      errorMessage =
        error.message ||
        error.responseMessage ||
        error.error ||
        'Payment could not be completed';
    } else {
      errorMessage = 'Payment could not be completed';
    }

    setPaymentError(errorMessage);
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
      <div className='space-y-6'>
        <div className='text-center'>
          <h3 className='text-xl font-bold text-blue-600'>
            RRR Generated Successfully
          </h3>
          <p className='text-gray-600 mt-2'>
            Use this RRR to complete your payment on Remita&apos;s website.
          </p>
        </div>

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
              <span className='text-blue-700'>RRR:</span>
              <span className='font-medium font-mono text-lg'>
                {rrrGenerated}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-blue-700'>Status:</span>
              <span className='font-medium text-yellow-600'>Pending</span>
            </div>
          </div>
        </div>

        <div className='bg-gray-50 p-4 rounded-md'>
          <h4 className='font-medium text-gray-800'>How to Pay with RRR</h4>
          <ol className='mt-2 space-y-2 text-sm pl-5 list-decimal'>
            <li>
              Visit the Remita website at{' '}
              <a
                href='https://www.remita.net'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:underline'
              >
                www.remita.net
              </a>
            </li>
            <li>
              Click on &quot;Pay RRR&quot; or &quot;Pay a Federal Government
              Agency&quot;
            </li>
            <li>Enter the RRR number above</li>
            <li>Complete the payment process</li>
          </ol>
        </div>

        <div className='flex justify-center space-x-4'>
          <Button
            variant='outline'
            onClick={() => {
              setRrrGenerated(null);
              setPayNowSelected(true);
            }}
          >
            Pay Now Instead
          </Button>
          <Button
            className='bg-green-600 hover:bg-green-700'
            onClick={handleDashboardClick}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
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
          <h3 className='text-xl font-bold text-red-600'>Payment Failed</h3>
          <p className='text-gray-600 mt-2'>{paymentError}</p>
        </div>

        <div className='flex justify-center'>
          <Button
            onClick={() => {
              setPaymentError(null);
              setShowPaymentModal(true);
            }}
            className='bg-blue-600 hover:bg-blue-700'
          >
            Retry Payment
          </Button>
        </div>
      </div>
    );
  }

  // Show payment modal if needed
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

  // Render payment component if pay now selected
  if (payNowSelected) {
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
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onClose={handlePaymentClose}
              />
            </div>

            <div className='text-center mt-4'>
              <Button
                variant='outline'
                onClick={() => setShowPaymentModal(true)}
              >
                Back to Payment Options
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center p-8 space-y-4'>
        <Loader2 className='h-12 w-12 animate-spin text-blue-600' />
        <p className='text-lg text-gray-700'>Processing your request...</p>
      </div>
    );
  }

  // Default fallback view
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
