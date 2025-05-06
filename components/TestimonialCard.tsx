import React from 'react';
import Image from 'next/image';

interface TestimonialCardProps {
  name: string;
  text: string;
  image: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  text,
  image,
}) => {
  return (
    <div className='bg-white p-6 rounded-lg shadow-sm w-full'>
      <div className='flex items-center mb-4'>
        <div className='w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-4 relative'>
          <Image
            src={image}
            alt={name}
            fill
            className='object-cover'
            onError={(e) => {
              // Fallback image if the provided one fails to load
              const target = e.target as HTMLImageElement;
              target.src = 'https://randomuser.me/api/portraits/men/1.jpg';
            }}
          />
        </div>
        <div>
          <h4 className='font-semibold'>{name}</h4>
        </div>
      </div>
      <p className='text-gray-700'>&quot;{text}&quot;</p>
    </div>
  );
};

export default TestimonialCard;
