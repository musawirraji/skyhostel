'use client';

import { useState } from 'react';
import { Dialog } from './ui/dialog';
import RoomConfirmationModal from './RoomConfirmationModal';

interface RoomSelectorProps {
  floor: 'Top Floor' | 'Bottom Floor';
  roomType: string;
  onRoomSelected: (roomDetails: {
    roomNumber: string;
    floorLevel: string;
    bunkPosition: string;
  }) => void;
}

const RoomSelector = ({
  floor,
  roomType,
  onRoomSelected,
}: RoomSelectorProps) => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [roomDetails, setRoomDetails] = useState({
    roomNumber: '',
    floorLevel: floor,
    bunkPosition: 'Bunk A2',
  });

  // This would come from an API in a real application
  const rooms = Array.from({ length: 20 }, (_, i) => ({
    number: `${101 + i}`,
    available: Math.random() > 0.4, // Simulate some rooms being unavailable
  }));

  const handleRoomClick = (roomNumber: string) => {
    setSelectedRoom(roomNumber);
    setRoomDetails({
      roomNumber,
      floorLevel: floor,
      bunkPosition: 'Bunk A2',
    });
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    onRoomSelected(roomDetails);
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setSelectedRoom(null);
  };

  return (
    <div className='mt-8'>
      <h3 className='text-xl font-semibold mb-4 text-[--sky-dark-blue]'>
        {floor}
      </h3>

      <div className='grid grid-cols-5 gap-4'>
        {rooms.map((room) => (
          <button
            key={room.number}
            className={`
              p-4 rounded-lg text-white font-semibold text-xl
              transition-all duration-300
              ${
                room.available
                  ? 'bg-red-500 hover:bg-red-600 cursor-pointer'
                  : 'bg-gray-400 cursor-not-allowed opacity-60'
              }
            `}
            disabled={!room.available}
            onClick={() => room.available && handleRoomClick(room.number)}
          >
            {room.number}
          </button>
        ))}
      </div>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <RoomConfirmationModal
          roomType={roomType}
          blockName='Block A'
          roomNumber={roomDetails.roomNumber}
          floorLevel={roomDetails.floorLevel}
          bunkPosition={roomDetails.bunkPosition}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </Dialog>
    </div>
  );
};

export default RoomSelector;
