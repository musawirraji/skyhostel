'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  return (
    <nav
      className={`w-full bg-white border-b border-gray-200 py-3 px-4 ${className}`}
    >
      <div className='container mx-auto flex justify-between items-center'>
        {/* Logo */}
        <Link href='/' className='flex items-center'>
          <span className='text-blue-700 text-xl font-bold'>
            <span className='text-blue-600'>sky</span>
            <span className='text-blue-800 uppercase'>HOSTEL</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className='flex items-center space-x-6'>
          <Link
            href='/support'
            className='text-sm text-gray-600 hover:text-blue-600'
          >
            Support
          </Link>
          <Link
            href='/login'
            className='text-sm text-gray-600 hover:text-blue-600'
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
