import React from 'react';
import { Control, useController } from 'react-hook-form';
import FormInput from './FormInput';
import { agreementSchema } from '@/lib/schemas';

interface SectionDProps {
  control: Control<any>;
}

const SectionD: React.FC<SectionDProps> = ({ control }) => {
  const { field: acceptTermsField, fieldState: acceptTermsFieldState } =
    useController({
      name: 'agreement.acceptedTerms',
      control,
      rules: { required: 'You must accept the terms and conditions' },
    });

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <h3 className='text-lg font-medium'>Section D</h3>
        <p className='text-sm text-gray-500'>Rules and Regulations</p>
      </div>

      <div className='space-y-4 border p-4 rounded-md bg-gray-50'>
        <ol className='list-decimal pl-5 space-y-2'>
          <li>Rooms are strictly for students of Sky Hostel.</li>
          <li>
            No cooking in the rooms, cooking must be done in designated places
            only.
          </li>
          <li>
            No unauthorized electrical appliances, heaters, stoves, or
            refrigerators are allowed in the rooms.
          </li>
          <li>No noise or nuisance making is allowed.</li>
          <li>Visitors must be received in the common room only.</li>
          <li>Students must keep the hostel clean at all times.</li>
          <li>
            Damaging hostel property is strictly prohibited and will attract
            full payment of damaged items.
          </li>
          <li>
            Students are solely responsible for the safety of their personal
            belongings.
          </li>
          <li>
            No fighting, bullying, or intimidation of any kind is allowed.
          </li>
          <li>Student must treat all hostel staff with respect.</li>
          <li>Alcohol is not allowed in the hostel premises.</li>
          <li>
            Smoking of cigarette and any form of tobacco or hard drugs inside
            and outside the hostel is prohibited.
          </li>
          <li>Not to keep any pet within the hostel premises.</li>
          <li>
            Not to associate with any social misconduct, cultism, or any illegal
            activities.
          </li>
          <li>
            No marketing of any product/services within the hostel premises.
          </li>
          <li>
            I must report any suspected broken items before it breaks down,
            otherwise I would be responsible for the repair.
          </li>
          <li>
            I am aware that visitors are only allowed in the common room between
            hours of 4pm-8pm.
          </li>
          <li>
            If the hostel management finds out that I am not a student of
            UniUniws, I will be forced to move out and handed over to the
            security agent and no refund would be paid.
          </li>
        </ol>

        <div className='mt-4'>
          <p className='font-medium'>
            I have read and fully understood the conditions stipulated above. I
            understand that failure to adhere strictly to the agreement will
            attract the following penalties:
          </p>
          <ul className='list-disc pl-5 mt-2'>
            <li>
              Outright ejection from the hostel without refund of the money.
            </li>
            <li>
              If this agreement is violated, law enforcement agent will be
              involved.
            </li>
            <li>
              That my caution fee will be deducted or fully utilized for any
              damage on hostel property caused by me.
            </li>
          </ul>
        </div>

        <div className='mt-4 flex items-center'>
          <input
            type='checkbox'
            id='agreement.acceptedTerms'
            checked={acceptTermsField.value}
            onChange={(e) => acceptTermsField.onChange(e.target.checked)}
            className='h-4 w-4 text-[var(--color-blue)] focus:ring-[var(--color-blue)] border-gray-300 rounded'
          />
          <label
            htmlFor='agreement.acceptedTerms'
            className='ml-2 block text-sm text-gray-700'
          >
            I hereby sign and accept the rules above and I would be held
            responsible for any breach of these rules hereof.
          </label>
        </div>
        {acceptTermsFieldState.error && (
          <p className='mt-1 text-sm text-[var(--color-red)]'>
            {acceptTermsFieldState.error.message}
          </p>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
          <FormInput
            control={control}
            name='agreement.firstName'
            label='First Name'
            placeholder='Enter first name'
            required
          />
          <FormInput
            control={control}
            name='agreement.lastName'
            label='Last Name'
            placeholder='Enter last name'
            required
          />
        </div>
      </div>
    </div>
  );
};

export default SectionD;
