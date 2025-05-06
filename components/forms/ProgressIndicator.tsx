interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  activeColor?: string;
  completedColor?: string;
  backgroundColor?: string;
}

const ProgressIndicator = ({
  currentStep,
  totalSteps,
  activeColor = '#75b798',
  completedColor = '#75b798',
  backgroundColor = '#f3f4f6',
}: ProgressIndicatorProps) => {
  return (
    <div className='w-full h-2 rounded-full mt-4' style={{ backgroundColor }}>
      <div
        className='h-2 rounded-full transition-all duration-300 ease-in-out'
        style={{
          width: `${(currentStep / totalSteps) * 100}%`,
          backgroundColor:
            currentStep === totalSteps ? completedColor : activeColor,
        }}
      ></div>
    </div>
  );
};

export default ProgressIndicator;
