
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface OrderCardStatusInfoProps {
  activeTab: string;
  time: string;
}

export const OrderCardStatusInfo = ({ activeTab, time }: OrderCardStatusInfoProps) => {
  const getStatusInfo = () => {
    switch (activeTab) {
      case 'new':
        return { label: 'New Order', color: 'bg-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', borderColor: 'border-emerald-200' };
      case 'progress':
        return { label: 'In Progress', color: 'bg-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200' };
      case 'ready':
        return { label: 'Ready', color: 'bg-amber-500', bgColor: 'bg-amber-50', textColor: 'text-amber-700', borderColor: 'border-amber-200' };
      case 'fulfillment':
        return { label: 'Out for Delivery', color: 'bg-purple-500', bgColor: 'bg-purple-50', textColor: 'text-purple-700', borderColor: 'border-purple-200' };
      case 'fulfilled':
        return { label: 'Completed', color: 'bg-green-600', bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200' };
      case 'scheduled':
        return { label: 'Scheduled', color: 'bg-indigo-500', bgColor: 'bg-indigo-50', textColor: 'text-indigo-700', borderColor: 'border-indigo-200' };
      default:
        return { label: '', color: 'bg-gray-500', bgColor: 'bg-gray-50', textColor: 'text-gray-700', borderColor: 'border-gray-200' };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="space-y-2">
      <Badge 
        variant="outline" 
        className={`${statusInfo.bgColor} ${statusInfo.textColor} ${statusInfo.borderColor} font-medium px-3 py-1 text-xs w-fit`}
      >
        {statusInfo.label}
      </Badge>
      <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-full w-fit">
        <Clock className="w-3.5 h-3.5 text-gray-500" />
        <span className="text-xs font-medium text-gray-700">{time}</span>
      </div>
    </div>
  );
};
