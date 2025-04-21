interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator = ({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps) => {
  return (
    <div className='w-full bg-gray-200 h-2 rounded-full mt-4'>
      <div
        className='bg-green-600 h-2 rounded-full'
        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
      ></div>
    </div>
  );
};

export default ProgressIndicator;
