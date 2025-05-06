'use client';

import React from 'react';

interface FeeItem {
  label: string;
  amount: number;
}

interface RoomPricingCardProps {
  roomType: string;
  totalAmount: number;
  fees: FeeItem[];
  className?: string;
  color?: 'green' | 'blue';
}

const RoomPricingCard: React.FC<RoomPricingCardProps> = ({
  roomType,
  totalAmount,
  fees,
  className = '',
  color = 'green',
}) => {
  const colorClasses = {
    green: 'bg-green-500 text-white',
    blue: 'bg-blue-600 text-white',
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace('NGN', 'NGN');
  };

  return (
    <div
      className={`rounded-lg overflow-hidden ${colorClasses[color]} ${className}`}
      style={{ maxWidth: '400px' }}
    >
      <div className='p-5'>
        <h3 className='font-bold text-xl mb-2'>
          {roomType}: {formatCurrency(totalAmount).replace('NGN', 'NGN ')}
        </h3>

        <div className='space-y-2'>
          {fees.map((fee, index) => (
            <div key={index} className='flex justify-between'>
              <span>{fee.label}</span>
              <span>- {formatCurrency(fee.amount).replace('NGN', '')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomPricingCard;
