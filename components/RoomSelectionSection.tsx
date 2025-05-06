'use client';

import React, { useState } from 'react';
import RoomSelectionBar from './RoomSelectionBar';
import RoomPricingCard from './RoomPricingCard';

const RoomSelectionSection: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);

  // Sample pricing data
  const roomPricing = {
    'Room of 4': {
      total: 219000,
      fees: [
        { label: 'Hostel Fee', amount: 180000 },
        { label: 'Utility Fee', amount: 28000 },
        { label: 'Caution Fee', amount: 10000 },
        { label: 'Form Fee', amount: 1000 },
      ],
      color: 'green' as const,
    },
    'Room of 6': {
      total: 219000,
      fees: [
        { label: 'Hostel Fee', amount: 180000 },
        { label: 'Utility Fee', amount: 28000 },
        { label: 'Caution Fee', amount: 10000 },
        { label: 'Form Fee', amount: 1000 },
      ],
      color: 'blue' as const,
    },
    'Room of 8': {
      total: 219000,
      fees: [
        { label: 'Hostel Fee', amount: 180000 },
        { label: 'Utility Fee', amount: 28000 },
        { label: 'Caution Fee', amount: 10000 },
        { label: 'Form Fee', amount: 1000 },
      ],
      color: 'green' as const,
    },
  };

  const handleReserveClick = () => {
    setShowRegister(true);
    // Handle registration logic
    console.log('Register clicked');
  };

  return (
    <div className='w-full'>
      <RoomSelectionBar onReserveClick={handleReserveClick} />

      <div className='w-full max-w-6xl mx-auto p-6'>
        <h2 className='text-2xl font-bold mb-6'>Room Pricing</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Object.entries(roomPricing).map(([roomType, data], index) => (
            <RoomPricingCard
              key={index}
              roomType={roomType}
              totalAmount={data.total}
              fees={data.fees}
              color={data.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomSelectionSection;
