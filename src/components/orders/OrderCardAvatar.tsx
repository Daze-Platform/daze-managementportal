
import React from 'react';

interface OrderCardAvatarProps {
  customer?: string;
}

export const OrderCardAvatar = ({ customer }: OrderCardAvatarProps) => {
  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'GU';
  };

  return (
    <div className="relative flex-shrink-0">
      <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-md ring-2 ring-white">
        <span className="text-white font-bold text-sm">
          {getInitials(customer || '')}
        </span>
      </div>
      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
    </div>
  );
};
