
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Timer, Store, Utensils } from 'lucide-react';

interface Order {
  type: string;
  priority?: 'normal' | 'high' | 'urgent';
  status?: string;
}

interface OrderCardBadgesProps {
  order: Order;
  showStatus: boolean;
  excludePriority?: boolean;
}

export const getTypeIcon = (type: string) => {
  return type === 'Delivery' ? (
    <div className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
      <Utensils className="w-3 h-3" />
      <span className="text-xs font-medium">Delivery</span>
    </div>
  ) : (
    <div className="flex items-center gap-1.5 text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
      <Store className="w-3 h-3" />
      <span className="text-xs font-medium">Pickup</span>
    </div>
  );
};

export const getPriorityBadge = (priority?: 'normal' | 'high' | 'urgent') => {
  // Priority badges removed - return null
  return null;
};

export const getStatusBadge = (status?: string, showStatus?: boolean) => {
  if (!showStatus || !status) return null;
  
  const statusConfig = {
    'Delivered': { className: 'bg-green-50 text-green-700 border-green-100' },
    'Picked Up': { className: 'bg-blue-50 text-blue-700 border-blue-100' }
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  
  return (
    <div className={`flex items-center px-2.5 py-1 rounded-full border ${config.className}`}>
      <span className="text-xs font-medium">{status}</span>
    </div>
  );
};

export const OrderCardBadges = ({ order, showStatus, excludePriority = true }: OrderCardBadgesProps) => {
  return (
    <>
      {getTypeIcon(order.type)}
      {/* Priority badges removed */}
      {getStatusBadge(order.status, showStatus)}
    </>
  );
};
