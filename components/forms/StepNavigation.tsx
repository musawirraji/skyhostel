import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StepNavigationProps {
  currentStep: number;
  isSubmitting: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
}

const StepNavigation = ({
  currentStep,
  isSubmitting,
  onPrevStep,
  onNextStep,
}: StepNavigationProps) => {
  return (
    <div className='flex justify-between pt-4'>
      {currentStep === 1 ? (
        <Button
          type='button'
          variant='outline'
          className='sky-btn-secondary px-8'
          disabled
        >
          Back
        </Button>
      ) : (
        <Button
          type='button'
          variant='outline'
          onClick={onPrevStep}
          className='sky-btn-secondary px-8'
        >
          Back
        </Button>
      )}

      {currentStep < 2 ? (
        <Button
          type='button'
          onClick={onNextStep}
          className='sky-btn-primary px-8'
        >
          Next
        </Button>
      ) : (
        <Button
          type='submit'
          disabled={isSubmitting}
          className='sky-btn-primary px-8'
        >
          {isSubmitting ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Processing...
            </>
          ) : (
            'Submit'
          )}
        </Button>
      )}
    </div>
  );
};

export default StepNavigation;
