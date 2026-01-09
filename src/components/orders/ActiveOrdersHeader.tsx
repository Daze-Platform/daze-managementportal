
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { StoreSelector } from './header/StoreSelector';
import { StatusDisplay } from './header/StatusDisplay';
import { ControlButton } from './header/ControlButton';
import { RevenueBadge } from './header/RevenueBadge';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';

interface ActiveOrdersHeaderProps {
  storeStatus: 'open' | 'closed';
  orderStatus: 'active' | 'paused';
  onToggleStoreStatus: () => void;
  totalRevenue: number;
  selectedStore: string;
  onStoreChange: (storeId: string) => void;
  selectedStoreName: string;
  selectedDateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
}

export const ActiveOrdersHeader = ({ 
  storeStatus, 
  orderStatus,
  onToggleStoreStatus, 
  totalRevenue,
  selectedStore,
  onStoreChange,
  selectedStoreName,
  selectedDateRange,
  onDateRangeChange
}: ActiveOrdersHeaderProps) => {
  const handleToggleClick = () => {
    onToggleStoreStatus();
  };

  const statusDisplay = StatusDisplay({ storeStatus, orderStatus, selectedStoreName });

  // Helper function to get proper status message for desktop view
  const getDesktopStatusMessage = () => {
    if (storeStatus === 'closed') {
      return selectedStoreName === 'All Venues' ? 'All venues are closed' : `${selectedStoreName} is closed`;
    } else if (orderStatus === 'paused') {
      return selectedStoreName === 'All Venues' ? 'Orders are paused for all venues' : `Orders are paused for ${selectedStoreName}`;
    } else {
      return selectedStoreName === 'All Venues' ? 'All venues are active' : `${selectedStoreName} is active`;
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-1 sm:py-1.5 shadow-sm">
      {/* Mobile Layout - Ultra compact */}
      <div className="block md:hidden">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <h1 className="text-sm font-bold text-gray-900 truncate">Orders</h1>
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDisplay.statusDotColor}`}></div>
            <span className={`text-xs font-medium truncate ${statusDisplay.statusColor}`}>
              {statusDisplay.statusText}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <StoreSelector
              selectedStore={selectedStore}
              onStoreChange={onStoreChange}
              className="w-18 h-6 text-xs px-2"
            />
            
            <ControlButton
              storeStatus={storeStatus}
              orderStatus={orderStatus}
              onClick={handleToggleClick}
              className="px-1.5 h-6 text-xs"
            />

            <RevenueBadge
              totalRevenue={totalRevenue}
              isActive={statusDisplay.isActive}
              variant="mobile"
            />
          </div>
        </div>
      </div>

      {/* Tablet Layout - More compact */}
      <div className="hidden md:block lg:hidden">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <h1 className="text-sm font-bold text-gray-900 truncate">Orders</h1>
            <div className="flex items-center space-x-1">
              <div className={`w-1.5 h-1.5 rounded-full ${statusDisplay.statusDotColor}`}></div>
              <span className={`text-xs font-medium ${statusDisplay.statusColor}`}>
                {selectedStoreName} - {statusDisplay.statusText}
              </span>
            </div>
            
            <RevenueBadge
              totalRevenue={totalRevenue}
              isActive={statusDisplay.isActive}
              variant="tablet"
            />
          </div>
          
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <StoreSelector
              selectedStore={selectedStore}
              onStoreChange={onStoreChange}
              className="w-28 h-6 text-xs"
            />
            
            <ControlButton
              storeStatus={storeStatus}
              orderStatus={orderStatus}
              onClick={handleToggleClick}
              className="px-2 h-6 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Desktop Layout - Compact */}
      <div className="hidden lg:flex lg:items-center lg:justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-gray-900">Order Management</h1>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${statusDisplay.statusDotColor} ${statusDisplay.isActive ? 'animate-pulse' : ''}`}></div>
            <span className={`text-sm font-medium ${statusDisplay.statusColor}`}>
              {getDesktopStatusMessage()}
            </span>
          </div>
          
          <RevenueBadge
            totalRevenue={totalRevenue}
            isActive={statusDisplay.isActive}
            variant="desktop"
          />
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0">
          <StoreSelector
            selectedStore={selectedStore}
            onStoreChange={onStoreChange}
            className="w-40 h-8"
          />

          <DateRangePicker value={selectedDateRange} onChange={onDateRangeChange} className="w-56" />
          
          <ControlButton
            storeStatus={storeStatus}
            orderStatus={orderStatus}
            onClick={handleToggleClick}
            className="px-3 h-8"
          />

          {statusDisplay.isActive && (
            <Button variant="outline" size="sm" className="px-3 h-8">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
