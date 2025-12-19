
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, Utensils } from 'lucide-react';
import { AdvancedFilters, FilterState } from './AdvancedFilters';

interface OrderFiltersProps {
  orderType: 'all' | 'pickup' | 'delivery';
  onOrderTypeChange: (type: 'all' | 'pickup' | 'delivery') => void;
  pickupCount: number;
  deliveryCount: number;
  totalCount: number;
  advancedFilters?: FilterState;
  onAdvancedFiltersChange?: (filters: FilterState) => void;
}

export const OrderFilters = ({
  orderType,
  onOrderTypeChange,
  pickupCount,
  deliveryCount,
  totalCount,
  advancedFilters = {
    dateRange: '',
    orderValue: '',
    customerType: '',
    priority: [],
    timeRange: '',
    orderLocationType: ''
  },
  onAdvancedFiltersChange = () => {}
}: OrderFiltersProps) => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50/50 border-b border-gray-100 px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm">
      <div className="flex flex-col space-y-2.5 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        {/* Order Type Tabs - More compact */}
        {/* Mobile compact order selector */}
        <div className="sm:hidden">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <button
              type="button"
              aria-pressed={orderType === 'all'}
              onClick={() => onOrderTypeChange('all')}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl border-2 transition-all shadow-sm whitespace-nowrap ${
                orderType === 'all'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-foreground border-border hover:bg-muted/60'
              }`}
            >
              <span className="text-sm font-semibold">All Orders</span>
              <Badge
                variant="secondary"
                className={`${orderType === 'all' ? 'bg-white/20 text-white border-white/30' : 'bg-secondary text-secondary-foreground'} h-5 px-2 text-xs font-bold`}
              >
                {totalCount}
              </Badge>
            </button>

            <button
              type="button"
              aria-pressed={orderType === 'pickup'}
              onClick={() => onOrderTypeChange('pickup')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border-2 min-h-[32px] transition-all whitespace-nowrap ${
                orderType === 'pickup'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted text-foreground border-border hover:bg-muted/60'
              }`}
            >
              <Store className={`w-4 h-4 ${orderType === 'pickup' ? 'text-primary-foreground' : 'text-foreground/80'}`} />
              <span className="text-xs font-medium">Pickup</span>
              <Badge
                variant="secondary"
                className={`${orderType === 'pickup' ? 'bg-white/20 text-white border-white/30' : 'bg-secondary text-secondary-foreground'} h-5 px-2 text-xs font-bold`}
              >
                {pickupCount}
              </Badge>
            </button>

            <button
              type="button"
              aria-pressed={orderType === 'delivery'}
              onClick={() => onOrderTypeChange('delivery')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border-2 min-h-[32px] transition-all whitespace-nowrap ${
                orderType === 'delivery'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted text-foreground border-border hover:bg-muted/60'
              }`}
            >
              <Utensils className={`${orderType === 'delivery' ? 'text-primary-foreground' : 'text-foreground/80'}`} size={16} />
              <span className="text-xs font-medium">Delivery</span>
              <Badge
                variant="secondary"
                className={`${orderType === 'delivery' ? 'bg-white/20 text-white border-white/30' : 'bg-secondary text-secondary-foreground'} h-5 px-2 text-xs font-bold`}
              >
                {deliveryCount}
              </Badge>
            </button>
          </div>
        </div>

        {/* Desktop/Tablet tabs */}
        <Tabs value={orderType} onValueChange={(value) => onOrderTypeChange(value as 'all' | 'pickup' | 'delivery')} className="hidden sm:flex sm:flex-1">
          <TabsList className="h-9 sm:h-10 p-0.5 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/50 w-full grid grid-cols-3">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-xs font-medium py-1.5 px-2 sm:px-3 rounded-lg transition-all duration-300"
            >
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-semibold">All Orders</span>
                <Badge 
                  variant="secondary" 
                  className={`h-4 px-1.5 text-xs font-bold transition-colors duration-300 ${
                    orderType === 'all' 
                      ? 'bg-white/20 text-white border-white/30' 
                      : 'bg-blue-100 text-blue-700 border-blue-200'
                  }`}
                >
                  {totalCount}
                </Badge>
              </div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="pickup" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-xs font-medium py-1.5 px-2 sm:px-3 rounded-lg transition-all duration-300"
            >
              <div className="flex items-center space-x-1.5">
                <Store className="w-3 h-3" />
                <span className="text-xs font-semibold hidden sm:inline">Pickup</span>
                <Badge 
                  variant="secondary" 
                  className={`h-4 px-1.5 text-xs font-bold transition-colors duration-300 ${
                    orderType === 'pickup' 
                      ? 'bg-white/20 text-white border-white/30' 
                      : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {pickupCount}
                </Badge>
              </div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="delivery" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-xs font-medium py-1.5 px-2 sm:px-3 rounded-lg transition-all duration-300"
            >
              <div className="flex items-center space-x-1.5">
                <Utensils className="w-3 h-3" />
                <span className="text-xs font-semibold hidden sm:inline">Delivery</span>
                <Badge 
                  variant="secondary" 
                  className={`h-4 px-1.5 text-xs font-bold transition-colors duration-300 ${
                    orderType === 'delivery' 
                      ? 'bg-white/20 text-white border-white/30' 
                      : 'bg-purple-100 text-purple-700 border-purple-200'
                  }`}
                >
                  {deliveryCount}
                </Badge>
              </div>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Advanced Filters - More compact */}
        <div className="flex items-center sm:ml-4">
          <div className="sm:hidden md:block">
            <AdvancedFilters
              activeFilters={advancedFilters}
              onFiltersChange={onAdvancedFiltersChange}
            />
          </div>
        </div>
      </div>
      
      {/* Filters button for tablets - More compact */}
      <div className="hidden sm:block md:hidden mt-2 flex justify-end">
        <AdvancedFilters
          activeFilters={advancedFilters}
          onFiltersChange={onAdvancedFiltersChange}
        />
      </div>
    </div>
  );
};
