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
