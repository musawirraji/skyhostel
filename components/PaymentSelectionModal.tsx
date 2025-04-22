import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PaymentSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayNow: () => void;
  onPayLater: () => void;
  amount: number;
}

const PaymentSelectionModal: React.FC<PaymentSelectionModalProps> = ({
  isOpen,
  onClose,
  onPayNow,
  onPayLater,
  amount,
}) => {
  const [isPayNowLoading, setIsPayNowLoading] = useState(false);
  const [isPayLaterLoading, setIsPayLaterLoading] = useState(false);

  const handlePayNow = () => {
    setIsPayNowLoading(true);

    onPayNow();
  };

  const handlePayLater = () => {
    setIsPayLaterLoading(true);

    onPayLater();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Payment Options</DialogTitle>
          <DialogDescription>
            Choose how you would like to proceed with your payment of ₦
            {amount.toLocaleString()}.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='bg-blue-50 p-4 rounded-md'>
            <h4 className='font-medium text-blue-800'>Pay Now</h4>
            <p className='text-sm text-gray-600 mt-1'>
              Complete your payment now using Remita&apos;s secure payment
              gateway.
            </p>
          </div>

          <div className='bg-gray-50 p-4 rounded-md'>
            <h4 className='font-medium text-gray-800'>Pay Later</h4>
            <p className='text-sm text-gray-600 mt-1'>
              An RRR number will be generated for you. You can use this to pay
              later on Remita&apos;s website.
            </p>
          </div>
        </div>

        <DialogFooter className='flex-col sm:flex-row sm:justify-between gap-2'>
          <Button
            variant='outline'
            onClick={handlePayLater}
            disabled={isPayLaterLoading || isPayNowLoading}
          >
            {isPayLaterLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Generating RRR...
              </>
            ) : (
              'Generate RRR Only'
            )}
          </Button>
          <Button
            onClick={handlePayNow}
            className='bg-blue-600 hover:bg-blue-700'
            disabled={isPayNowLoading || isPayLaterLoading}
          >
            {isPayNowLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSelectionModal;
