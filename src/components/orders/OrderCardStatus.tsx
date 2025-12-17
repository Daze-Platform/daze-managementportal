
import React from 'react';

interface OrderCardStatusProps {
  activeTab: string;
  time: string;
  estimatedTime?: string;
  scheduledFor?: string;
}

export const OrderCardStatus = ({ activeTab, time, estimatedTime, scheduledFor }: OrderCardStatusProps) => {
  const getStatusColor = () => {
    switch (activeTab) {
      case 'new': return 'bg-green-500';
      case 'progress': return 'bg-blue-500';
      case 'ready': return 'bg-purple-500';
      case 'fulfillment': return 'bg-gray-500';
      case 'fulfilled': return 'bg-green-600';
      case 'scheduled': return 'bg-purple-600';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (activeTab) {
      case 'new': return 'New';
      case 'progress': return 'In progress';
      case 'ready': return 'Ready in';
      case 'fulfillment': return 'Complete';
      case 'fulfilled': return 'Fulfilled';
      case 'scheduled': return 'Scheduled';
      default: return '';
    }
  };

  return (
    <div className={`${getStatusColor()} text-white px-4 py-2 rounded-t-lg flex items-center justify-between relative pr-32`}>
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-sm">{getStatusText()}</span>
        {activeTab === 'ready' && estimatedTime !== 'Ready' && (
          <span className="text-xs opacity-90">{estimatedTime}</span>
        )}
        {activeTab === 'scheduled' && scheduledFor && (
          <span className="text-xs opacity-90">{scheduledFor}</span>
        )}
      </div>
      <div className="text-xs opacity-90">{time}</div>
    </div>
  );
};
