'use client';

import React from 'react';
import RoomSelectionBar from './RoomSelectionBar';
import RoomPricingCard from './RoomPricingCard';

const RoomSelectionExample: React.FC = () => {
  // Example 1: Basic usage in header
  const Example1 = () => (
    <div className='mb-10 border rounded-lg overflow-hidden shadow-sm'>
      <h2 className='p-4 border-b bg-gray-50 font-medium'>
        Example 1: Room Selection Bar in Header
      </h2>
      <RoomSelectionBar />
    </div>
  );

  // Example 2: Room pricing cards
  const Example2 = () => {
    const room4Fees = [
      { label: 'Hostel Fee', amount: 180000 },
      { label: 'Utility Fee', amount: 28000 },
      { label: 'Caution Fee', amount: 10000 },
      { label: 'Form Fee', amount: 1000 },
    ];

    const room6Fees = [
      { label: 'Hostel Fee', amount: 180000 },
      { label: 'Utility Fee', amount: 28000 },
      { label: 'Caution Fee', amount: 10000 },
      { label: 'Form Fee', amount: 1000 },
    ];

    return (
      <div className='mb-10 border rounded-lg overflow-hidden shadow-sm'>
        <h2 className='p-4 border-b bg-gray-50 font-medium'>
          Example 2: Room Pricing Cards
        </h2>
        <div className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <RoomPricingCard
              roomType='ROOM OF 4'
              totalAmount={219000}
              fees={room4Fees}
              color='green'
            />
            <RoomPricingCard
              roomType='ROOM OF 6'
              totalAmount={219000}
              fees={room6Fees}
              color='blue'
            />
          </div>
        </div>
      </div>
    );
  };

  // Example 3: Combined with custom styling
  const Example3 = () => {
    const handleReserve = () => {
      alert('Registration initiated!');
    };

    const room4Fees = [
      { label: 'Hostel Fee', amount: 180000 },
      { label: 'Utility Fee', amount: 28000 },
      { label: 'Caution Fee', amount: 10000 },
      { label: 'Form Fee', amount: 1000 },
    ];

    return (
      <div className='mb-10 border rounded-lg overflow-hidden shadow-sm'>
        <h2 className='p-4 border-b bg-gray-50 font-medium'>
          Example 3: Custom Styling
        </h2>
        <div className='bg-gray-100'>
          <RoomSelectionBar
            title='Select Your Room'
            className='border-0 shadow-sm'
            onReserveClick={handleReserve}
          />

          <div className='p-6 max-w-md mx-auto'>
            <RoomPricingCard
              roomType='ROOM OF 4'
              totalAmount={219000}
              fees={room4Fees}
              color='green'
              className='shadow-lg'
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='container mx-auto py-10 px-4'>
      <h1 className='text-3xl font-bold mb-8'>Room Selection Components</h1>
      <Example1 />
      <Example2 />
      <Example3 />
    </div>
  );
};

export default RoomSelectionExample;
