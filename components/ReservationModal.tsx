import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FORMATTED_PAYMENT_AMOUNT } from '@/constants';

interface ReservationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMakePaymentClick: () => void;
  onVerifyPaymentClick: () => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  open,
  onOpenChange,
  onMakePaymentClick,
  onVerifyPaymentClick,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md bg-white'>
        <DialogHeader>
          <DialogTitle className='text-center text-[--sky-dark-blue] text-xl'>
            Reserve a Room
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4 py-4'>
          <p className='text-center text-gray-700 mb-4'>
            To reserve a room, you need to make a payment of{' '}
            <span className='font-bold'>{FORMATTED_PAYMENT_AMOUNT}</span> and
            verify your payment.
          </p>

          <div className='flex flex-col space-y-4'>
            <Button
              className='bg-blue text-white hover:bg-dark-blue w-full'
              onClick={onMakePaymentClick}
            >
              Make Payment
            </Button>

            <Button
              variant='outline'
              className='border-blue text-blue hover:bg-blue/10 w-full'
              onClick={onVerifyPaymentClick}
            >
              Verify Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationModal;
