import React from 'react';
import { Control, useController } from 'react-hook-form';
import FormInput from './FormInput';
import { guarantorSchema } from '@/lib/schemas';

interface SectionEProps {
  control: Control<any>;
}

const SectionE: React.FC<SectionEProps> = ({ control }) => {
  const { field: signatureField, fieldState: signatureFieldState } =
    useController({
      name: 'guarantor.signatureDeclaration',
      control,
      rules: { required: 'You must declare that the information is accurate' },
    });

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <h3 className='text-lg font-medium'>Section E</h3>
        <p className='text-sm text-gray-500'>Guarantor information</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <FormInput
          control={control}
          name='guarantor.firstName'
          label='First Name'
          placeholder='Enter first name'
          required
        />
        <FormInput
          control={control}
          name='guarantor.lastName'
          label='Last Name'
          placeholder='Enter last name'
          required
        />
      </div>

      <FormInput
        control={control}
        name='guarantor.contactNumber'
        label='Contact Number'
        placeholder='Please enter a valid phone number'
        required
      />

      <FormInput
        control={control}
        name='guarantor.email'
        label='Email Address'
        placeholder='example@example.com'
        type='email'
        required
      />

      <FormInput
        control={control}
        name='guarantor.relationship'
        label='Relationship to student'
        placeholder='e.g., Parent, Guardian, Sibling, etc.'
        required
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <FormInput
          control={control}
          name='guarantor.homeAddress'
          label='Home Address'
          placeholder='Enter street address'
          required
        />
        <FormInput
          control={control}
          name='guarantor.city'
          label='City, State'
          placeholder='Enter city and state'
          required
        />
      </div>

      <div className='mt-4'>
        <div className='flex items-center'>
          <input
            type='checkbox'
            id='guarantor.signatureDeclaration'
            checked={signatureField.value}
            onChange={(e) => signatureField.onChange(e.target.checked)}
            className='h-4 w-4 text-[var(--color-blue)] focus:ring-[var(--color-blue)] border-gray-300 rounded'
          />
          <label
            htmlFor='guarantor.signatureDeclaration'
            className='ml-2 block text-sm text-gray-700'
          >
            I hereby sign and declare that the above information is accurate and
            I would be held responsible for any inaccuracies.
          </label>
        </div>
        {signatureFieldState.error && (
          <p className='mt-1 text-sm text-[var(--color-red)]'>
            {signatureFieldState.error.message}
          </p>
        )}
      </div>

      <FormInput
        control={control}
        name='guarantor.date'
        label='Date'
        placeholder='DD/MM/YYYY'
        type='date'
        required
      />
    </div>
  );
};

export default SectionE;
