
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Timer, MapPin, Clock } from 'lucide-react';

interface Order {
  items: string;
  deliverTime: string;
  icon: string;
  iconBg: string;
  estimatedTime?: string;
  type?: string;
}

interface OrderCardFooterProps {
  order: Order;
}

export const OrderCardFooter = ({ order }: OrderCardFooterProps) => {
  const orderValue = parseFloat(order.items.split('$')[1] || '0');

  const getEstimatedTimeStyle = () => {
    if (order.estimatedTime === 'Ready') return 'text-green-700 bg-green-50 border-green-200';
    if (order.estimatedTime === 'Completed') return 'text-gray-600 bg-gray-50 border-gray-200';
    
    const minutes = parseInt(order.estimatedTime?.split(' ')[0] || '0');
    if (minutes <= 5) return 'text-red-700 bg-red-50 border-red-200';
    if (minutes <= 10) return 'text-orange-700 bg-orange-50 border-orange-200';
    return 'text-blue-700 bg-blue-50 border-blue-200';
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 ${order.iconBg} rounded-lg flex items-center justify-center shadow-sm`}>
          <MapPin className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="w-3 h-3 text-gray-500" />
            <div className="text-xs text-gray-600 font-medium">{order.deliverTime}</div>
          </div>
          {orderValue > 50 && (
            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200 px-2 py-0.5">
              High Value
            </Badge>
          )}
        </div>
      </div>
      
      {order.estimatedTime && (
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border ${getEstimatedTimeStyle()}`}>
          <Timer className="w-3 h-3" />
          <span className="text-xs font-medium whitespace-nowrap">
            {order.estimatedTime}
          </span>
        </div>
      )}
    </div>
  );
};
