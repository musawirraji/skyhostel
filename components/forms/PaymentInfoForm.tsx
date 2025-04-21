import { Control, useWatch } from 'react-hook-form';
import * as z from 'zod';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { formSchema } from '@/lib/validation';
import { useEffect, useState } from 'react';

interface PaymentInfoFormProps {
  control: Control<z.infer<typeof formSchema>>;
}

const PaymentInfoForm = ({ control }: PaymentInfoFormProps) => {
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Use useWatch instead of the internal _formState.subscribe
  const paymentType = useWatch({
    control,
    name: 'paymentType',
  });

  // Update the UI based on the selected payment type
  useEffect(() => {
    setShowCustomInput(paymentType === 'CUSTOM');
  }, [paymentType]);

  return (
    <>
      <div className='space-y-2'>
        <h3 className='text-lg font-medium'>Section B</h3>
        <p className='text-sm text-gray-500'>Payment Information</p>
      </div>
      <div className='space-y-4'>
        <FormField
          control={control}
          name='paymentType'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select payment type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='FULL'>Full Payment (₦100,000)</SelectItem>
                  <SelectItem value='HALF'>Half Payment (₦50,000)</SelectItem>
                  <SelectItem value='CUSTOM'>Custom Amount</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {showCustomInput && (
          <FormField
            control={control}
            name='customAmount'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Amount (₦)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Enter payment amount'
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className='bg-blue-50 p-4 rounded-md'>
          <h4 className='font-medium text-blue-800'>Payment Information</h4>
          <p className='text-sm text-green-700 mt-1'>
            After submitting this form, you will be redirected to Remita to
            complete your payment. An RRR (Remita Retrieval Reference) will be
            generated for you.
          </p>
          <p className='text-sm text-blue-700 mt-2'>
            If you choose to pay later, you can go to Remita&apos;s website and
            pay using the RRR that will be generated for you.
          </p>
        </div>
      </div>
    </>
  );
};

export default PaymentInfoForm;
