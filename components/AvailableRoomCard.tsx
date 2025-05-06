import React from 'react';

const AvailableRoomCard = () => {
  return (
    <div className='flex flex-col max-w-5xl px-4 md:px-0 mx-auto gap-4 mt-4'>
      <div className='bg-gray py-2 text-center text-sm font-medium text-gray-700 max-w-[480px] rounded-xl'>
        <span className='inline-flex items-center'>
          10 rooms available with at least 2 spaces left
          <span className='inline-block w-3 h-3 bg-red-500 rounded-full ml-2'></span>
        </span>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl '>
        <div className='rounded-lg overflow-hidden bg-green text-white'>
          <div className='p-5'>
            <h3 className='font-bold text-xl mb-3'>ROOM OF 4: NGN 219,000</h3>
            <div className='space-y-1 text-[15px]'>
              <div className='flex justify-between'>
                <span>Hostel Fee</span>
                <span>- 180,000</span>
              </div>
              <div className='flex justify-between'>
                <span>Utility Fee</span>
                <span>- 28,000</span>
              </div>
              <div className='flex justify-between'>
                <span>Caution Fee</span>
                <span>- 10,000</span>
              </div>
              <div className='flex justify-between'>
                <span>Form Fee</span>
                <span>- 1,000</span>
              </div>
            </div>
          </div>
        </div>

        <div className='rounded-lg overflow-hidden bg-blue text-white'>
          <div className='p-5'>
            <h3 className='font-bold text-xl mb-3'>ROOM OF 6: NGN 219,000</h3>
            <div className='space-y-1 text-[15px]'>
              <div className='flex justify-between'>
                <span>Hostel Fee</span>
                <span>- 180,000</span>
              </div>
              <div className='flex justify-between'>
                <span>Utility Fee</span>
                <span>- 28,000</span>
              </div>
              <div className='flex justify-between'>
                <span>Caution Fee</span>
                <span>- 10,000</span>
              </div>
              <div className='flex justify-between'>
                <span>Form Fee</span>
                <span>- 1,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableRoomCard;
