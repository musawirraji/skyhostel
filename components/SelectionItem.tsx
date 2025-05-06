import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SelectionItemProps {
  label: string;
  value: string;
  icon: LucideIcon;
}

const SelectionItem: React.FC<SelectionItemProps> = ({
  label,
  value,
  icon: Icon,
}) => {
  return (
    <div className='flex items-center mb-4 md:mb-0 space-x-2'>
      <div className='flex flex-col'>
        <span className='text-xs text-gray-500'>{label}</span>
        <div className='flex items-center'>
          <Icon className='h-5 w-5 text-[var(--color-blue)] mr-2' />
          <span className='font-semibold'>{value}</span>
        </div>
      </div>
    </div>
  );
};

export default SelectionItem;
