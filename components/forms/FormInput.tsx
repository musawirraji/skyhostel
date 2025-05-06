import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface FormInputProps<T extends FieldValues = any> {
  label: string;
  name: Path<T>;
  control?: Control<T>;
  error?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  helperText?: string;
  required?: boolean;
  // Props for non-hook-form controlled inputs
  id?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const FormInput = <T extends FieldValues>({
  label,
  name,
  control,
  error,
  placeholder,
  type = 'text',
  className,
  labelClassName,
  inputClassName,
  helperText,
  required = false,
  // Props for non-hook-form controlled inputs
  id,
  value,
  onChange,
}: FormInputProps<T>) => {
  // If control is not provided, render a regular controlled input
  if (!control) {
    return (
      <div className={`space-y-1 ${className}`}>
        <Label
          htmlFor={id || name.toString()}
          className={`${labelClassName} ${
            required
              ? 'after:content-["*"] after:ml-0.5 after:text-red-500'
              : ''
          }`}
        >
          {label}
        </Label>
        <Input
          id={id || name.toString()}
          type={type}
          placeholder={placeholder}
          className={`${inputClassName} outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:shadow-none`}
          style={{ boxShadow: 'none' }}
          value={value}
          onChange={onChange}
        />
        {error && (
          <p className='text-red-500 text-sm mt-1' id={`${name}-error`}>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className='text-gray-500 text-sm mt-1' id={`${name}-helper`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }

  // If control is provided, use react-hook-form Controller
  return (
    <div className={`space-y-1 ${className}`}>
      <Label
        htmlFor={name.toString()}
        className={`${labelClassName} ${
          required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''
        }`}
      >
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <Input
              id={name.toString()}
              type={type}
              placeholder={placeholder}
              className={`${inputClassName} outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:shadow-none ${
                fieldState.error
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-gray-300'
              }`}
              style={{ boxShadow: 'none' }}
              aria-invalid={fieldState.error ? 'true' : 'false'}
              aria-describedby={
                fieldState.error
                  ? `${name}-error`
                  : helperText
                  ? `${name}-helper`
                  : undefined
              }
              {...field}
            />
            {fieldState.error && (
              <p className='text-red-500 text-sm mt-1' id={`${name}-error`}>
                {fieldState.error.message}
              </p>
            )}
          </>
        )}
      />
      {helperText && !error && (
        <p className='text-gray-500 text-sm mt-1' id={`${name}-helper`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default FormInput;
