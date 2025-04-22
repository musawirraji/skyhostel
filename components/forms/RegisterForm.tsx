'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { registerStudent } from '@/utils/supabase-utils';
import { formSchema } from '@/lib/validation';
import { RemitaPaymentResponse } from '@/types/remita';

import PaymentProcessing from './PaymentProcessing';
import PersonalInfoForm from './PersonalInfoForm';
import PaymentInfoForm from './PaymentInfoForm';
import StepNavigation from './StepNavigation';
import ProgressIndicator from './ProgressIndicator';

type RegistrationStep = 1 | 2 | 3;

const RegisterForm = () => {
  const [step, setStep] = useState<RegistrationStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentData, setPaymentData] = useState<RemitaPaymentResponse | null>(
    null
  );

  const totalSteps = 3;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      matricNumber: '',
      level: '',
      phoneNumber: '',
      faculty: '',
      department: '',
      programme: '',
      stateOfOrigin: '',
      maritalStatus: '',
      paymentType: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Form submitted with values:', values);
    setIsSubmitting(true);

    try {
      console.log('Sending request to registerStudent');
      const result = await registerStudent(values);
      console.log('Received result from registerStudent:', result);

      if (result.success && result.studentId) {
        toast.success('Registration successful', {
          description: 'Proceeding to payment...',
        });

        setStep(3);
      } else {
        console.error('Registration failed:', result.error);
        toast.error('Registration failed', {
          description: result.error || 'An error occurred during registration.',
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed', {
        description:
          error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    type FormField = keyof z.infer<typeof formSchema>;

    const fieldsToValidate: FormField[] =
      step === 1
        ? [
            'firstName',
            'lastName',
            'email',
            'matricNumber',
            'level',
            'phoneNumber',
            'faculty',
            'department',
            'programme',
            'dateOfBirth',
            'stateOfOrigin',
            'maritalStatus',
          ]
        : ['paymentType'];

    form.trigger(fieldsToValidate).then((isValid) => {
      if (isValid) setStep((prevStep) => (prevStep + 1) as RegistrationStep);
    });
  };

  const prevStep = () => {
    setStep((prevStep) => (prevStep - 1) as RegistrationStep);
  };

  const renderStepContent = () => {
    if (step === 3) {
      return (
        <PaymentProcessing
          formValues={form.getValues()}
          setPaymentCompleted={setPaymentCompleted}
          setPaymentData={setPaymentData}
        />
      );
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {step === 1 && <PersonalInfoForm control={form.control} />}
          {step === 2 && <PaymentInfoForm control={form.control} />}

          <StepNavigation
            currentStep={step}
            isSubmitting={isSubmitting}
            onPrevStep={prevStep}
            onNextStep={nextStep}
          />
        </form>
      </Form>
    );
  };

  return (
    <div className='w-full max-w-3xl mx-auto p-4'>
      <Card className='w-full bg-white shadow-lg rounded-lg overflow-hidden'>
        <CardHeader className='space-y-1 text-center p-6 bg-white border-b'>
          <h2 className='text-2xl font-bold'>PAYMENT FORM</h2>
          <p className='text-sm text-gray-600'>
            All information supplied remains valid and could be used for or
            against you.
          </p>
          <ProgressIndicator currentStep={step} totalSteps={totalSteps} />
        </CardHeader>
        <CardContent className='p-6'>{renderStepContent()}</CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;
