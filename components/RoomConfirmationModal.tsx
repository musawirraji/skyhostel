'use client';

import React from 'react';
import { Button } from './ui/button';
import { DialogContent, DialogHeader, DialogFooter } from './ui/dialog';

interface RoomConfirmationModalProps {
  roomType: string;
  blockName: string;
  roomNumber: string;
  floorLevel: string;
  bunkPosition: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const RoomConfirmationModal = ({
  roomType,
  blockName,
  roomNumber,
  floorLevel,
  bunkPosition,
  onConfirm,
  onCancel,
}: RoomConfirmationModalProps) => {
  return (
    <DialogContent className='sm:max-w-md p-6 bg-white rounded-lg'>
      <div className='flex justify-center mb-6'>
        <img
          src='/celebration.svg'
          alt='Celebration'
          className='w-40 h-40'
          onError={(e) => {
            // Fallback to a base64 or emoji if SVG doesn't exist
            e.currentTarget.src =
              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI4MCIgZmlsbD0iI2YwZjlmZiIgLz4KPHRleHQgeD0iMTAwIiB5PSIxMTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzQyOWJmZiI+8J+OgzwvdGV4dD4KPC9zdmc+';
          }}
        />
      </div>

      <DialogHeader>
        <h2 className='text-center text-2xl font-bold'>
          You have successfully chosen {blockName},<br />
          {roomNumber}, {floorLevel}, {bunkPosition}!
        </h2>
      </DialogHeader>

      <DialogFooter className='sm:justify-center mt-8 space-x-4'>
        <Button
          type='button'
          className='sky-btn-primary w-32'
          onClick={onConfirm}
        >
          Confirm
        </Button>
        <Button
          type='button'
          variant='outline'
          className='sky-btn-secondary w-32'
          onClick={onCancel}
        >
          Cancel
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default RoomConfirmationModal;
