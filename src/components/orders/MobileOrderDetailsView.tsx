
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { OrderDetails } from './OrderDetails';

interface MobileOrderDetailsViewProps {
  selectedOrder: string;
  activeTab: string;
  onOrderUpdate: (orderId: string, action: 'accept' | 'decline' | 'ready' | 'complete' | 'fulfill' | 'schedule' | 'activate') => void;
  onBackToList: () => void;
}

export const MobileOrderDetailsView = ({
  selectedOrder,
  activeTab,
  onOrderUpdate,
  onBackToList
}: MobileOrderDetailsViewProps) => {
  return (
    <div className="page-container">
      {/* Mobile Order Details Header - Sticky */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200/50 p-4 flex items-center space-x-3 flex-shrink-0 mobile-optimized">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToList}
          className="p-2 min-h-[44px] min-w-[44px] hover-scale"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900">Order Details</h1>
      </div>
      
      {/* Order Details - Mobile optimized scrolling */}
      <div className="flex-1 order-details-mobile-scroll md:overflow-y-auto md:scroll-smooth md:overscroll-contain md:touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
        <OrderDetails 
          selectedOrder={selectedOrder} 
          activeTab={activeTab} 
          onOrderUpdate={onOrderUpdate}
        />
      </div>
    </div>
  );
};
