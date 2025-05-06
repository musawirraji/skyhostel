import React from 'react';
import { Control } from 'react-hook-form';
import FormInput from './FormInput';
import FileUpload from './FileUpload';
import { personalInfoSchema } from '@/lib/schemas';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Controller } from 'react-hook-form';

interface SectionAProps {
  control: Control<any>;
}

const SectionA: React.FC<SectionAProps> = ({ control }) => {
  // Nigerian states
  const nigerianStates = [
    'Abia',
    'Adamawa',
    'Akwa Ibom',
    'Anambra',
    'Bauchi',
    'Bayelsa',
    'Benue',
    'Borno',
    'Cross River',
    'Delta',
    'Ebonyi',
    'Edo',
    'Ekiti',
    'Enugu',
    'FCT',
    'Gombe',
    'Imo',
    'Jigawa',
    'Kaduna',
    'Kano',
    'Katsina',
    'Kebbi',
    'Kogi',
    'Kwara',
    'Lagos',
    'Nasarawa',
    'Niger',
    'Ogun',
    'Ondo',
    'Osun',
    'Oyo',
    'Plateau',
    'Rivers',
    'Sokoto',
    'Taraba',
    'Yobe',
    'Zamfara',
  ];

  // Marital status options
  const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <h3 className='text-lg font-medium'>Section A</h3>
        <p className='text-sm text-gray-500'>Personal Information</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <FormInput
          control={control}
          name='personalInfo.firstName'
          label='First Name'
          placeholder='Enter your first name'
          required
        />
        <FormInput
          control={control}
          name='personalInfo.lastName'
          label='Last Name'
          placeholder='Enter your last name'
          required
        />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <FormInput
          control={control}
          name='personalInfo.contactNumber'
          label='Contact Number'
          placeholder='Please enter a valid phone number'
          required
        />

        <FormInput
          control={control}
          name='personalInfo.email'
          label='Email Address'
          placeholder='example@example.com'
          type='email'
          required
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <FormInput
          control={control}
          name='personalInfo.matricNumber'
          label='Matric Number'
          placeholder='Enter your matric number'
          required
        />
        <FormInput
          control={control}
          name='personalInfo.level'
          label='Level'
          placeholder='e.g., 100, 200, 300, etc.'
          required
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <FormInput
          control={control}
          name='personalInfo.faculty'
          label='Faculty'
          placeholder='Enter your faculty'
          required
        />
        <FormInput
          control={control}
          name='personalInfo.department'
          label='Department'
          placeholder='Enter your department'
          required
        />
      </div>

      <FormInput
        control={control}
        name='personalInfo.programme'
        label='Programme'
        placeholder='Enter your programme'
        required
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <FormInput
          control={control}
          name='personalInfo.dateOfBirth'
          label='Date of Birth'
          placeholder='DD/MM/YYYY'
          type='date'
          required
        />

        <div className='space-y-1'>
          <Label
            htmlFor='personalInfo.stateOfOrigin'
            className='after:content-["*"] after:ml-0.5 after:text-red-500'
          >
            State of Origin
          </Label>
          <Controller
            control={control}
            name='personalInfo.stateOfOrigin'
            render={({ field, fieldState }) => (
              <>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select state of origin' />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
                    {nigerianStates.map((state) => (
                      <SelectItem
                        key={state}
                        value={state}
                        className='hover:bg-blue-100'
                      >
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className='text-red-500 text-sm mt-1'>
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-1'>
          <Label
            htmlFor='personalInfo.maritalStatus'
            className='after:content-["*"] after:ml-0.5 after:text-red-500'
          >
            Marital Status
          </Label>
          <Controller
            control={control}
            name='personalInfo.maritalStatus'
            render={({ field, fieldState }) => (
              <>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select marital status' />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
                    {maritalStatusOptions.map((status) => (
                      <SelectItem
                        key={status}
                        value={status.toLowerCase()}
                        className='hover:bg-blue-100'
                      >
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className='text-red-500 text-sm mt-1'>
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>
        <FormInput
          control={control}
          name='personalInfo.religion'
          label='Religion'
          placeholder='Enter your religion (optional)'
        />
      </div>

      <FormInput
        control={control}
        name='personalInfo.medicalRequirements'
        label='Any Peculiar Medical Requirements?'
        placeholder='Enter any medical requirements (optional)'
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <FormInput
          control={control}
          name='personalInfo.homeAddress'
          label='Home Address'
          placeholder='Enter your street address'
          required
        />
        <FormInput
          control={control}
          name='personalInfo.city'
          label='City, State'
          placeholder='Enter your city and state'
          required
        />
      </div>

      <FileUpload
        control={control}
        name='personalInfo.passportPhoto'
        label='Passport ID Upload'
        accept='.jpg,.jpeg,.png'
        maxSize={3}
        required
      />
    </div>
  );
};

export default SectionA;
