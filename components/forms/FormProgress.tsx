import React from 'react';
import { CheckCircle } from 'lucide-react';

interface FormProgressProps {
  currentStep: number;
  steps: string[];
}

const FormProgress: React.FC<FormProgressProps> = ({ currentStep, steps }) => {
  return (
    <div className='w-full py-4'>
      <div className='flex items-center justify-between'>
        {steps.map((step, index) => {
          const isActive = currentStep === index;
          const isCompleted = currentStep > index;

          return (
            <React.Fragment key={step}>
              {/* Step indicator */}
              <div className='flex flex-col items-center'>
                <div
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    isActive
                      ? 'border-[var(--color-blue)] bg-white'
                      : isCompleted
                      ? 'border-[var(--color-blue)] bg-[var(--color-blue)]'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className='h-6 w-6 text-white' />
                  ) : (
                    <span
                      className={`text-sm font-medium ${
                        isActive ? 'text-[var(--color-blue)]' : 'text-gray-500'
                      }`}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>
                <span
                  className={`mt-2 text-xs ${
                    isActive || isCompleted
                      ? 'text-[var(--color-blue)]'
                      : 'text-gray-500'
                  }`}
                >
                  {step}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    currentStep > index
                      ? 'bg-[var(--color-blue)]'
                      : 'bg-gray-300'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default FormProgress;
