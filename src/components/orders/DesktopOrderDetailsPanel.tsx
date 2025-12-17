
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { OrderDetails } from './OrderDetails';

interface DesktopOrderDetailsPanelProps {
  selectedOrder: string;
  activeTab: string;
  onOrderUpdate: (orderId: string, action: 'accept' | 'decline' | 'ready' | 'complete' | 'fulfill' | 'schedule' | 'activate') => void;
  onClose: () => void;
}

export const DesktopOrderDetailsPanel = ({
  selectedOrder,
  activeTab,
  onOrderUpdate,
  onClose
}: DesktopOrderDetailsPanelProps) => {
  return (
    <div className="w-1/2 border-l border-gray-200/50 bg-white flex flex-col animate-slide-in-right">
      {/* Order Details Header */}
      <div className="p-4 border-b border-gray-200/50 bg-white flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-2 hover-scale"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      {/* Order Details Content */}
      <div className="flex-1 overflow-y-auto animate-fade-in">
        <OrderDetails 
          selectedOrder={selectedOrder} 
          activeTab={activeTab} 
          onOrderUpdate={onOrderUpdate}
        />
      </div>
    </div>
  );
};
