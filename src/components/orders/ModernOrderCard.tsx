
import React, { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OrderCardAvatar } from './OrderCardAvatar';
import { OrderCardStatusInfo } from './OrderCardStatusInfo';
import { OrderCardContent } from './OrderCardContent';
import { OrderCardActions } from './OrderCardActions';
import { DeclineOrderDialog } from './DeclineOrderDialog';

interface Order {
  id: string;
  items: string;
  type: string;
  time: string;
  deliverTime: string;
  icon: string;
  iconBg: string;
  status?: string;
  customer?: string;
  estimatedTime?: string;
  priority?: 'normal' | 'high' | 'urgent';
  platformFee?: string;
  storeId?: string;
  storeName?: string;
  courier?: string;
  scheduledFor?: string;
}

interface ModernOrderCardProps {
  order: Order;
  isSelected: boolean;
  onClick: () => void;
  activeTab: string;
  onOrderUpdate?: (orderId: string, action: 'accept' | 'decline' | 'ready' | 'complete' | 'fulfill' | 'schedule' | 'activate') => void;
  onViewDetails?: (orderId: string, cardRef: React.RefObject<HTMLDivElement>) => void;
  showStoreBadge?: boolean;
}

export const ModernOrderCard = ({ order, isSelected, onClick, activeTab, onOrderUpdate, onViewDetails, showStoreBadge = false }: ModernOrderCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);

  const handleViewDetails = (orderId: string) => {
    if (onViewDetails) {
      onViewDetails(orderId, cardRef);
    }
  };

  const handleOrderUpdate = (orderId: string, action: 'accept' | 'decline' | 'ready' | 'complete' | 'fulfill' | 'schedule' | 'activate') => {
    if (action === 'decline') {
      setShowDeclineDialog(true);
    } else if (onOrderUpdate) {
      onOrderUpdate(orderId, action);
    }
  };

  const handleDeclineOrder = (reason: string) => {
    console.log('Declining order with reason:', reason);
    setShowDeclineDialog(false);
    if (onOrderUpdate) {
      onOrderUpdate(order.id, 'decline');
    }
  };

  const getStatusInfo = () => {
    switch (activeTab) {
      case 'new':
        return { color: 'bg-emerald-500' };
      case 'progress':
        return { color: 'bg-blue-500' };
      case 'ready':
        return { color: 'bg-amber-500' };
      case 'fulfillment':
        return { color: 'bg-purple-500' };
      case 'fulfilled':
        return { color: 'bg-green-600' };
      case 'scheduled':
        return { color: 'bg-indigo-500' };
      default:
        return { color: 'bg-gray-500' };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card 
      ref={cardRef}
      className={`transition-all duration-300 hover:shadow-lg border-2 relative overflow-hidden group ${
        isSelected 
          ? 'ring-2 ring-blue-400 shadow-xl transform scale-[1.02] border-blue-200' 
          : 'hover:transform hover:scale-[1.01] hover:border-gray-300 border-gray-200'
      }`}
      style={{ 
        // Auto height to fit content properly
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        // Smooth transforms without layout shifts
        transformOrigin: 'center',
        backfaceVisibility: 'hidden',
        willChange: 'transform'
      }}
    >
      {/* Enhanced Status Indicator */}
      <div className={`h-1.5 ${statusInfo.color} relative flex-shrink-0`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50"></div>
      </div>
      
      <CardContent className="p-4 flex flex-col flex-1">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-3 flex-shrink-0">
          <div className="flex items-center space-x-3 flex-1 min-w-0 pr-4">
            <OrderCardAvatar customer={order.customer} />
            
            {/* Order Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-gray-900 tracking-tight truncate">#{order.id}</h3>
                {showStoreBadge && order.storeName && (
                  <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 shrink-0">
                    {order.storeName}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 font-medium truncate mb-2">{order.customer || 'Guest Order'}</p>
              
              <OrderCardStatusInfo activeTab={activeTab} time={order.time} />
            </div>
          </div>
        </div>

        {/* Content Section - Allow natural height */}
        <div className="flex-1 mb-3">
          <OrderCardContent order={order} />
        </div>

        {/* Actions Section - Fixed at bottom */}
        <div className="flex-shrink-0 mt-auto pt-2 border-t border-gray-100">
          <OrderCardActions
            order={order}
            activeTab={activeTab}
            onOrderUpdate={handleOrderUpdate}
            onViewDetails={handleViewDetails}
          />
        </div>
      </CardContent>
      
      <DeclineOrderDialog 
        isOpen={showDeclineDialog} 
        onClose={() => setShowDeclineDialog(false)}
        onDecline={handleDeclineOrder}
        orderId={order.id}
      />
    </Card>
  );
};
