'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import RoomSelector from './RoomSelector';

interface RoomType {
  type: string;
  value: string;
}

interface BlockType {
  name: string;
  value: string;
}

interface RoomSelectionProps {
  onRoomSelect?: (roomType: string, block: string, students: string) => void;
}

const RoomSelection = ({ onRoomSelect }: RoomSelectionProps) => {
  const [roomType, setRoomType] = useState<string>('Room of 4');
  const [block, setBlock] = useState<string>('Block A');
  const [students, setStudents] = useState<string>('2 students');
  const [showRoomSelector, setShowRoomSelector] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<{
    roomNumber: string;
    floorLevel: string;
    bunkPosition: string;
  } | null>(null);

  const roomTypes: RoomType[] = [
    { type: 'Room of 4', value: 'Room of 4' },
    { type: 'Room of 6', value: 'Room of 6' },
  ];

  const blocks: BlockType[] = [
    { name: 'Block A', value: 'Block A' },
    { name: 'Block B', value: 'Block B' },
    { name: 'Block C', value: 'Block C' },
  ];

  const handleShowRooms = () => {
    setShowRoomSelector(true);
  };

  const handleRoomSelected = (roomDetails: {
    roomNumber: string;
    floorLevel: string;
    bunkPosition: string;
  }) => {
    setSelectedRoom(roomDetails);

    if (onRoomSelect) {
      onRoomSelect(roomType, block, students);
    }
  };

  return (
    <div className='w-full max-w-5xl mx-auto'>
      <h2 className='text-center text-xl font-semibold mb-6 text-[--sky-dark-blue]'>
        Rooms
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <div className='space-y-2'>
          <Label htmlFor='roomType'>Room type</Label>
          <Select value={roomType} onValueChange={setRoomType}>
            <SelectTrigger>
              <SelectValue placeholder='Select room type' />
            </SelectTrigger>
            <SelectContent>
              {roomTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='block'>Blocks</Label>
          <Select value={block} onValueChange={setBlock}>
            <SelectTrigger>
              <SelectValue placeholder='Select block' />
            </SelectTrigger>
            <SelectContent>
              {blocks.map((blk) => (
                <SelectItem key={blk.value} value={blk.value}>
                  {blk.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='students'>Students</Label>
          <Select value={students} onValueChange={setStudents}>
            <SelectTrigger>
              <SelectValue placeholder='Select number of students' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='1 student'>1 student</SelectItem>
              <SelectItem value='2 students'>2 students</SelectItem>
              <SelectItem value='3 students'>3 students</SelectItem>
              <SelectItem value='4 students'>4 students</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='text-center'>
        <p className='text-red-500 text-sm font-medium mb-4 p-2 bg-red-100 rounded-md inline-block'>
          10 rooms available with at least 2 spaces left
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-10'>
        <div className='sky-room-card sky-room-green'>
          <h3 className='text-xl font-bold mb-2'>ROOM OF 4: NGN 219,000</h3>
          <ul className='space-y-1'>
            <li>Hostel Fee - 180,000</li>
            <li>Utility Fee - 28,000</li>
            <li>Caution Fee - 10,000</li>
            <li>Form Fee - 1,000</li>
          </ul>
        </div>

        <div className='sky-room-card sky-room-blue'>
          <h3 className='text-xl font-bold mb-2'>ROOM OF 6: NGN 219,000</h3>
          <ul className='space-y-1'>
            <li>Hostel Fee - 180,000</li>
            <li>Utility Fee - 28,000</li>
            <li>Caution Fee - 10,000</li>
            <li>Form Fee - 1,000</li>
          </ul>
        </div>
      </div>

      {!showRoomSelector ? (
        <div className='text-center'>
          <Button
            className='sky-btn-primary px-8 py-2'
            onClick={handleShowRooms}
          >
            Select Rooms
          </Button>
        </div>
      ) : selectedRoom ? (
        <div className='text-center mt-6'>
          <div className='bg-green-100 text-green-800 p-4 rounded-lg mb-4 inline-block'>
            You selected Room {selectedRoom.roomNumber},{' '}
            {selectedRoom.floorLevel}, {selectedRoom.bunkPosition}
          </div>
          <Button
            className='sky-btn-primary px-8 py-2'
            onClick={() =>
              onRoomSelect && onRoomSelect(roomType, block, students)
            }
          >
            Register
          </Button>
        </div>
      ) : (
        <>
          <div className='border-t border-gray-300 pt-6 mt-6 mb-4'>
            <h2 className='text-2xl font-bold mb-4 text-center text-[--sky-dark-blue]'>
              Select Your Room
            </h2>
            <p className='text-center text-gray-600 mb-6'>
              Red rooms are available. Click on a room to select it.
            </p>
          </div>

          <RoomSelector
            floor='Top Floor'
            roomType={roomType}
            onRoomSelected={handleRoomSelected}
          />

          <RoomSelector
            floor='Bottom Floor'
            roomType={roomType}
            onRoomSelected={handleRoomSelected}
          />
        </>
      )}
    </div>
  );
};

export default RoomSelection;
