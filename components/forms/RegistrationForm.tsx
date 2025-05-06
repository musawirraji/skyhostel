import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { completeFormSchema, defaultValues } from '@/lib/schemas';
import SectionA from './SectionA';
import SectionB from './SectionB';
import SectionC from './SectionC';
import SectionD from './SectionD';
import SectionE from './SectionE';
import FormProgress from './FormProgress';
import SuccessMessage from './SuccessMessage';
import { ArrowLeft, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const STEPS = [
  'Personal Info',
  'Next of Kin',
  'Security',
  'Rules',
  'Guarantor',
];

interface RegistrationFormProps {
  paymentVerified?: boolean;
  selectedRoom?: string;
  selectedBlock?: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  paymentVerified = false,
  selectedRoom = 'Room of 4',
  selectedBlock = 'Block A',
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create modified default values with the selected room and block
  const formDefaultValues = {
    ...defaultValues,
    roomSelection: {
      ...defaultValues.roomSelection,
      roomType: selectedRoom,
      block: selectedBlock,
      numberOfStudents: 2, // Default value for MVP
    },
  };

  const {
    control,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(completeFormSchema),
    defaultValues: formDefaultValues,
    mode: 'onChange',
  });

  // Debug form errors whenever they change
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('Form validation errors:', errors);
    }
  }, [errors]);

  // Update form values when props change
  useEffect(() => {
    setValue('roomSelection.roomType', selectedRoom);
    setValue('roomSelection.block', selectedBlock);
  }, [selectedRoom, selectedBlock, setValue]);

  const formData = watch();

  const validateStep = async () => {
    let fieldsToValidate: string[] = [];

    switch (currentStep) {
      case 0:
        fieldsToValidate = Object.keys(defaultValues.personalInfo).map(
          (key) => `personalInfo.${key}`
        );
        break;
      case 1:
        fieldsToValidate = Object.keys(defaultValues.nextOfKin).map(
          (key) => `nextOfKin.${key}`
        );
        break;
      case 2:
        fieldsToValidate = Object.keys(defaultValues.securityInfo).map(
          (key) => `securityInfo.${key}`
        );
        break;
      case 3:
        fieldsToValidate = Object.keys(defaultValues.agreement).map(
          (key) => `agreement.${key}`
        );
        break;
      case 4:
        fieldsToValidate = Object.keys(defaultValues.guarantor).map(
          (key) => `guarantor.${key}`
        );
        break;
      default:
        return false;
    }

    console.log(`Validating fields for step ${currentStep}:`, fieldsToValidate);
    const result = await trigger(fieldsToValidate as any);
    console.log(`Validation result for step ${currentStep}:`, result, errors);
    return result;
  };

  const nextStep = async () => {
    const isStepValid = await validateStep();
    if (isStepValid) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const uploadPassportPhoto = async (file: File) => {
    try {
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()
        .toString(36)
        .substring(2, 15)}.${fileExt}`;
      const filePath = `passport_photos/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (error) {
        throw new Error(`Error uploading file: ${error.message}`);
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('uploads').getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading passport photo:', error);
      return null;
    }
  };

  const onSubmit = async (data: any) => {
    console.log('Form submission started');
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Form data received in onSubmit:', data);

      // Handle passport photo URL - handle both formats
      let passportUrl = null;
      const passportPhoto = data.personalInfo.passportPhoto;

      if (passportPhoto) {
        console.log(
          'Passport photo type:',
          typeof passportPhoto,
          passportPhoto instanceof File ? 'File instance' : 'Not a File'
        );

        // If it's the ImageKit format (object with url property)
        if (typeof passportPhoto === 'object' && 'url' in passportPhoto) {
          passportUrl = passportPhoto.url;
          console.log('Using ImageKit URL:', passportUrl);
        }
        // If it's a File object, upload using the legacy method
        else if (passportPhoto instanceof File) {
          console.log('Uploading File object to Supabase');
          try {
            passportUrl = await uploadPassportPhoto(passportPhoto);
            console.log('Supabase upload result:', passportUrl);
          } catch (uploadError) {
            console.error('Error uploading to Supabase:', uploadError);
            toast.error('Error uploading passport photo');
            // Continue with submission even if upload fails
          }
        }
      } else {
        console.log('No passport photo provided');
      }

      // Create full name from first and last name
      const fullName = `${data.personalInfo.firstName} ${data.personalInfo.lastName}`;
      console.log('Using full name:', fullName);

      // Prepare data for API submission with room selection defaults
      const submissionData = {
        ...data,
        personalInfo: {
          ...data.personalInfo,
          fullName,
          // Remove the file object and replace with just the URL
          passportPhoto: undefined,
          passportUrl,
        },
        roomSelection: {
          roomType: selectedRoom,
          block: selectedBlock,
          numberOfStudents: 2,
        },
      };

      console.log(
        'Form data to be submitted:',
        JSON.stringify(submissionData, null, 2)
      );

      console.log('Sending form data to /api/register endpoint');
      // Send the data to our API
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      console.log('API response status:', response.status);
      const result = await response.json();
      console.log('API response data:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Error submitting form');
      }

      // Show success toast message
      toast.success('Form submitted successfully!');

      // Set completed status based on API response
      console.log('Setting isCompleted to true');
      setIsCompleted(true);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setError(error.message || 'Something went wrong. Please try again.');
      toast.error(error.message || 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
      console.log('Form submission process completed');
    }
  };

  if (isCompleted) {
    const fullName = `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`;
    return (
      <SuccessMessage
        studentName={fullName}
        roomType={formData.roomSelection?.roomType || selectedRoom}
        block={formData.roomSelection?.block || selectedBlock}
      />
    );
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='  overflow-hidden'>
        {/* Payment verification status */}
        {paymentVerified ? (
          <div className='mb-4 bg-green-50 border border-green-200 rounded-md p-3'>
            <p className='text-green-800 text-sm font-medium'>
              ✓ Payment Verified
            </p>
            <p className='text-green-700 text-xs'>
              Your payment of ₦219,000 has been confirmed.
            </p>
          </div>
        ) : (
          <div className='mb-4 bg-amber-50 border-l-4 border-amber-400 p-4 flex items-start'>
            <AlertCircle className='h-5 w-5 text-amber-400 mr-3 mt-0.5' />
            <div>
              <p className='text-sm text-amber-700 font-medium'>
                Payment Required
              </p>
              <p className='text-sm text-amber-600'>
                Your payment needs to be verified before you can register.
                Please return to the homepage and complete payment verification.
              </p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <FormProgress currentStep={currentStep} steps={STEPS} />

        {/* Form Content */}
        <form
          onSubmit={(e) => {
            console.log('Native form submission event triggered');
            handleSubmit(onSubmit)(e);
          }}
          className='mt-6'
        >
          <div className='space-y-8'>
            {currentStep === 0 && <SectionA control={control} />}
            {currentStep === 1 && <SectionB control={control} />}
            {currentStep === 2 && <SectionC control={control} />}
            {currentStep === 3 && <SectionD control={control} />}
            {currentStep === 4 && <SectionE control={control} />}
          </div>

          {/* Error Message */}
          {error && (
            <div className='mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
              {error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className='mt-8 flex justify-between'>
            <button
              type='button'
              onClick={prevStep}
              className={`flex items-center text-blue-600 ${
                currentStep === 0 ? 'invisible' : 'visible'
              }`}
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back
            </button>

            {currentStep < STEPS.length - 1 ? (
              <button
                type='button'
                onClick={nextStep}
                className='flex items-center bg-blue-600 text-white px-4 py-2 rounded'
              >
                Next
                <ArrowRight className='h-4 w-4 ml-2' />
              </button>
            ) : (
              <div className=''>
                <button
                  type='submit'
                  onClick={() => console.log('Submit button clicked')}
                  className='flex items-center bg-blue-600 text-white px-4 py-2 rounded'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
