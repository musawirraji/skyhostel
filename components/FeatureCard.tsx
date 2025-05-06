import React from 'react';
import Image from 'next/image';

interface FeatureCardProps {
  title: string;
  icon: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, icon }) => {
  return (
    <div className='bg-blue text-white p-4 rounded-lg flex items-center justify-center gap-2 max-w-[220px]'>
      <Image src={icon} alt={title} width={30} height={30} />
      <h3 className='text-sm mb-3 text-left'>{title}</h3>
    </div>
  );
};

export default FeatureCard;
