
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Clock, CalendarIcon, Store } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { useStores } from '@/contexts/StoresContext';
import { useResort } from '@/contexts/DestinationContext';

interface DashboardStore {
  id: string;
  name: string;
  count: number;
}

interface DashboardHeaderProps {
  selectedStore: string;
  setSelectedStore: (storeId: string) => void;
  selectedDateRange: DateRange | undefined;
  setSelectedDateRange: (dateRange: DateRange | undefined) => void;
}

export const DashboardHeader = ({ 
  selectedStore, 
  setSelectedStore, 
  selectedDateRange, 
  setSelectedDateRange
 }: DashboardHeaderProps) => {
  const { stores: allStores, getStoresByResort } = useStores();
  const { currentResort } = useResort();
  
  console.log('DashboardHeader - All stores:', allStores);
  console.log('DashboardHeader - Current resort:', currentResort);
  
  // Get all stores regardless of resort assignment and remove duplicates
  // This ensures all stores are available in dropdowns without duplicates
  const availableStores = allStores.filter((store, index, self) => 
    index === self.findIndex(s => s.id === store.id)
  );
  
  console.log('DashboardHeader - Available stores:', availableStores);
  
  // Transform stores to match dashboard format
  const stores: DashboardStore[] = [
    { 
      id: 'all', 
      name: 'All Stores', 
      count: availableStores.reduce((sum, store) => sum + (store.activeOrders || 0), 0) 
    },
    ...availableStores.map(store => ({
      id: store.id.toString(),
      name: store.name,
      count: store.activeOrders || 0
    }))
  ];
  const formatDateRange = (dateRange: DateRange | undefined) => {
    if (!dateRange) return "Pick date range";
    
    if (dateRange.from) {
      // Check if it's today
      const today = new Date();
      const isToday = dateRange.from && dateRange.to &&
        dateRange.from.toDateString() === today.toDateString() &&
        dateRange.to.toDateString() === today.toDateString();
      
      if (isToday) {
        return "Today";
      }
      
      if (dateRange.to) {
        return `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd, yyyy")}`;
      } else {
        return format(dateRange.from, "MMM dd, yyyy");
      }
    }
    
    return "Pick date range";
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-0.5">Welcome back! Here's what's happening with your stores.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Clock className="w-3 h-3" />
          Last updated: 2 min ago
        </div>
      </div>

      {/* Store and Date Range Picker Row */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        {/* Store Picker */}
        <div className="flex-1 sm:flex-none sm:min-w-[200px]">
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="w-full h-9 bg-white border-gray-300 hover:border-gray-400 focus:border-gray-500 shadow-sm">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-gray-600" />
                <SelectValue placeholder="Select store" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-300 shadow-lg z-50">
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id} className="hover:bg-gray-50 focus:bg-gray-50">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm text-gray-900">{store.name}</span>
                    {store.id !== 'all' && (
                      <span className="ml-2 text-xs text-gray-500">
                        {store.count} orders
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Picker */}
        <div className="flex-1 sm:flex-none sm:min-w-[280px]">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-9 justify-start text-left font-normal bg-white border-gray-300 hover:border-gray-400 focus:border-gray-500 shadow-sm hover:bg-gray-50"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-900">{formatDateRange(selectedDateRange)}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border-gray-300 shadow-xl z-50" align="start">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-900 text-sm">Select Date Range</h3>
                {selectedDateRange?.from && selectedDateRange?.to && (
                  <p className="text-xs text-gray-600 mt-1">
                    {format(selectedDateRange.from, "MMM dd, yyyy")} - {format(selectedDateRange.to, "MMM dd, yyyy")}
                  </p>
                )}
              </div>
              <Calendar
                mode="range"
                selected={selectedDateRange}
                onSelect={setSelectedDateRange}
                initialFocus
                className="p-4 pointer-events-auto"
                numberOfMonths={2}
              />
              {selectedDateRange?.from && selectedDateRange?.to && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Selected Range:</span>
                    <span className="text-sm font-semibold text-blue-700">
                      {Math.ceil((selectedDateRange.to.getTime() - selectedDateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                    </span>
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};
