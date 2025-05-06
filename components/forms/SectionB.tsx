import React from 'react';
import { Control } from 'react-hook-form';
import FormInput from './FormInput';
import { nextOfKinSchema } from '@/lib/schemas';

interface SectionBProps {
  control: Control<any>;
}

const SectionB: React.FC<SectionBProps> = ({ control }) => {
  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <h3 className='text-lg font-medium'>Section B</h3>
        <p className='text-sm text-gray-500'>Next of Kin information</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <FormInput
          control={control}
          name='nextOfKin.firstName'
          label='First Name'
          placeholder='Enter first name'
          required
        />
        <FormInput
          control={control}
          name='nextOfKin.lastName'
          label='Last Name'
          placeholder='Enter last name'
          required
        />
      </div>

      <FormInput
        control={control}
        name='nextOfKin.contactNumber'
        label='Contact Number'
        placeholder='Please enter a valid phone number'
        required
      />

      <FormInput
        control={control}
        name='nextOfKin.email'
        label='Email Address'
        placeholder='example@example.com'
        type='email'
        required
      />

      <FormInput
        control={control}
        name='nextOfKin.relationship'
        label='Relationship to student'
        placeholder='e.g., Parent, Guardian, Sibling, etc.'
        required
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <FormInput
          control={control}
          name='nextOfKin.homeAddress'
          label='Home Address'
          placeholder='Enter street address'
          required
        />
        <FormInput
          control={control}
          name='nextOfKin.city'
          label='City, State'
          placeholder='Enter city and state'
          required
        />
      </div>
    </div>
  );
};

export default SectionB;
