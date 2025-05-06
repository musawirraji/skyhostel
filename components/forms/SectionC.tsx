import React from 'react';
import { Control } from 'react-hook-form';
import FormToggle from './FormToggle';
import { securityInfoSchema } from '@/lib/schemas';

interface SectionCProps {
  control: Control<any>;
}

const SectionC: React.FC<SectionCProps> = ({ control }) => {
  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <h3 className='text-lg font-medium'>Section C</h3>
        <p className='text-sm text-gray-500'>Security information</p>
      </div>

      <div className='space-y-4'>
        <FormToggle
          control={control}
          name='securityInfo.hasMisconduct'
          label='Have you ever been found guilty of any misconduct in your former/present school?'
          required
        />

        <FormToggle
          control={control}
          name='securityInfo.hasBeenConvicted'
          label='Have you ever been convicted of any criminal offence in/outside school?'
          required
        />

        <FormToggle
          control={control}
          name='securityInfo.isWellBehaved'
          label='Do you consider yourself to be a well behaved student?'
          required
        />
      </div>
    </div>
  );
};

export default SectionC;
