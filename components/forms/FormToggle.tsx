import React from 'react';
import { Control, useController } from 'react-hook-form';

interface FormToggleProps {
  name: string;
  control: Control<any>;
  label: string;
  required?: boolean;
}

const FormToggle: React.FC<FormToggleProps> = ({
  name,
  control,
  label,
  required = false,
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: required ? `${label} is required` : false },
  });

  return (
    <div className='flex items-center justify-between mb-4'>
      <label htmlFor={name} className='text-sm font-medium text-gray-700'>
        {label}
        {required && <span className='text-[var(--color-red)] ml-1'>*</span>}
      </label>
      <div className='relative inline-block w-10 align-middle select-none'>
        <input
          type='checkbox'
          id={name}
          {...field}
          checked={field.value}
          onChange={(e) => field.onChange(e.target.checked)}
          className='sr-only'
        />
        <div
          className={`block w-10 h-6 rounded-full ${
            field.value ? 'bg-[var(--color-blue)]' : 'bg-gray-300'
          } transition-colors duration-200`}
        />
        <div
          className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 transform ${
            field.value ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </div>
      {error && (
        <p className='mt-1 text-sm text-[var(--color-red)]'>{error.message}</p>
      )}
    </div>
  );
};

export default FormToggle;
