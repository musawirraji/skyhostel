'use client';

import React, { useState, useEffect } from 'react';
import { BedDouble, Building2, Users } from 'lucide-react';

interface RoomSelectionBarProps {
  onReserveClick?: () => void;
  title?: string;
  className?: string;
  defaultRoomType?: string;
  defaultBlock?: string;
  defaultStudents?: string;
  hasRoomHeader?: boolean;
  onRoomTypeChange?: (roomType: string) => void;
  onBlockChange?: (block: string) => void;
  onStudentsChange?: (students: string) => void;
}

const RoomSelectionBar: React.FC<RoomSelectionBarProps> = ({
  onReserveClick,
  title = 'Rooms',
  className = '',
  defaultRoomType = 'Room of 4',
  defaultBlock = 'Block A',
  defaultStudents = '2 students',
  onRoomTypeChange,
  onBlockChange,
  onStudentsChange,
  hasRoomHeader,
}) => {
  const [roomType, setRoomType] = useState(defaultRoomType);
  const [block, setBlock] = useState(defaultBlock);
  const [students, setStudents] = useState(defaultStudents);

  // Update local state when props change
  useEffect(() => {
    setRoomType(defaultRoomType);
  }, [defaultRoomType]);

  useEffect(() => {
    setBlock(defaultBlock);
  }, [defaultBlock]);

  useEffect(() => {
    setStudents(defaultStudents);
  }, [defaultStudents]);

  // Handle room type change
  const handleRoomTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRoomType = e.target.value;
    setRoomType(newRoomType);
    if (onRoomTypeChange) {
      onRoomTypeChange(newRoomType);
    }
  };

  // Handle block change
  const handleBlockChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBlock = e.target.value;
    setBlock(newBlock);
    if (onBlockChange) {
      onBlockChange(newBlock);
    }
  };

  // Handle students change
  const handleStudentsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStudents = e.target.value;
    setStudents(newStudents);
    if (onStudentsChange) {
      onStudentsChange(newStudents);
    }
  };

  return (
    <div className={`w-full bg-gray-50  rounded-2xl ${className}`}>
      {title && hasRoomHeader && (
        <div className='text-center py-3 border-b'>
          <h2 className='text-blue-600 font-medium'>{title}</h2>
        </div>
      )}

      <div className='w-full max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-stretch gap-3 justify-between'>
        <div className='w-full sm:w-1/3'>
          <div className='flex items-center gap-2 p-2 bg-white border rounded-md'>
            <div className='bg-gray-100 p-2 rounded'>
              <BedDouble size={18} className='text-gray-600' />
            </div>
            <div className='flex flex-col flex-1'>
              <label className='block text-xs text-gray-500'>Room type</label>
              <select
                value={roomType}
                onChange={handleRoomTypeChange}
                className='w-full border-none focus:outline-none text-sm font-medium'
              >
                <option>Room of 4</option>
                <option>Room of 6</option>
                <option>Room of 8</option>
              </select>
            </div>
          </div>
        </div>

        <div className='w-full sm:w-1/3'>
          <div className='flex items-center gap-2 p-2 bg-white border rounded-md h-full'>
            <div className='bg-gray-100 p-2 rounded'>
              <Building2 size={18} className='text-gray-600' />
            </div>
            <div className='flex flex-col flex-1'>
              <label className='block text-xs text-gray-500'>Blocks</label>
              <select
                value={block}
                onChange={handleBlockChange}
                className='w-full border-none focus:outline-none text-sm font-medium'
              >
                <option>Block A</option>
                <option>Block B</option>
                <option>Block C</option>
              </select>
            </div>
          </div>
        </div>

        <div className='w-full sm:w-1/3'>
          <div className='flex items-center gap-2 p-2 bg-white border rounded-md h-full'>
            <div className='bg-gray-100 p-2 rounded'>
              <Users size={18} className='text-gray-600' />
            </div>
            <div className='flex flex-col flex-1'>
              <label className='block text-xs text-gray-500'>Students</label>
              <select
                value={students}
                onChange={handleStudentsChange}
                className='w-full border-none focus:outline-none text-sm font-medium'
              >
                <option>2 students</option>
                <option>3 students</option>
                <option>4 students</option>
              </select>
            </div>
          </div>
        </div>

        <div className='w-full sm:w-auto flex items-center'>
          <button
            onClick={onReserveClick}
            className='w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition-colors'
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomSelectionBar;
