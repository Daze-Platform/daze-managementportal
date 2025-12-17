
import React from 'react';

interface StatusDisplayProps {
  storeStatus: 'open' | 'closed';
  orderStatus: 'active' | 'paused';
  selectedStoreName: string;
}

export const StatusDisplay = ({ storeStatus, orderStatus, selectedStoreName }: StatusDisplayProps) => {
  const getStatusText = () => {
    if (storeStatus === 'closed') {
      return selectedStoreName === 'All Stores' ? 'All stores are closed' : 'Closed';
    } else if (orderStatus === 'paused') {
      return selectedStoreName === 'All Stores' ? 'Orders paused' : 'Paused';
    } else {
      return selectedStoreName === 'All Stores' ? 'All stores active' : 'Active';
    }
  };

  const getStatusColor = () => {
    if (storeStatus === 'closed') return 'text-red-600';
    if (orderStatus === 'paused') return 'text-orange-600';
    return 'text-green-600';
  };

  const getStatusDotColor = () => {
    if (storeStatus === 'closed') return 'bg-red-500';
    if (orderStatus === 'paused') return 'bg-orange-500';
    return 'bg-green-500';
  };

  const isActive = storeStatus === 'open' && orderStatus === 'active';

  return {
    statusText: getStatusText(),
    statusColor: getStatusColor(),
    statusDotColor: getStatusDotColor(),
    isActive
  };
};
