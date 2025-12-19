
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Filter, X, Calendar, DollarSign, Users, Clock, MapPin } from 'lucide-react';

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  activeFilters: FilterState;
}

export interface FilterState {
  dateRange: string;
  orderValue: string;
  customerType: string;
  priority: string[];
  timeRange: string;
  orderLocationType: string;
}

export const AdvancedFilters = ({ onFiltersChange, activeFilters }: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...activeFilters,
      [key]: value
    });
  };

  const handleCheckboxChange = (category: 'priority', value: string, checked: boolean) => {
    const currentValues = activeFilters[category] || [];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    
    updateFilter(category, newValues);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      dateRange: '',
      orderValue: '',
      customerType: '',
      priority: [],
      timeRange: '',
      orderLocationType: ''
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.dateRange) count++;
    if (activeFilters.orderValue) count++;
    if (activeFilters.customerType) count++;
    if (activeFilters.priority?.length) count++;
    if (activeFilters.timeRange) count++;
    if (activeFilters.orderLocationType) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative border-gray-300 hover:border-gray-400 hover:bg-gray-50">
          <Filter className="w-4 h-4 mr-2 text-gray-600" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs bg-gray-900 text-white">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-white border-gray-300 shadow-xl z-50" align="end">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Advanced Filters</h3>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              >
                <X className="w-4 h-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-96 scroll-smooth">
          <div className="p-4 space-y-4">
            {/* Date Range Filter */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <label className="text-sm font-medium text-gray-900">Date Range</label>
              </div>
              <Select value={activeFilters.dateRange} onValueChange={(value) => updateFilter('dateRange', value)}>
                <SelectTrigger className="w-full border-gray-300 hover:border-gray-400 focus:border-gray-500">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 shadow-lg">
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7days">Last 7 days</SelectItem>
                  <SelectItem value="last30days">Last 30 days</SelectItem>
                  <SelectItem value="thisweek">This week</SelectItem>
                  <SelectItem value="thismonth">This month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Order Value Filter */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-600" />
                <label className="text-sm font-medium text-gray-900">Order Value</label>
              </div>
              <Select value={activeFilters.orderValue} onValueChange={(value) => updateFilter('orderValue', value)}>
                <SelectTrigger className="w-full border-gray-300 hover:border-gray-400 focus:border-gray-500">
                  <SelectValue placeholder="Select order value" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 shadow-lg">
                  <SelectItem value="under25">Under $25</SelectItem>
                  <SelectItem value="25to50">$25 - $50</SelectItem>
                  <SelectItem value="50to100">$50 - $100</SelectItem>
                  <SelectItem value="over100">Over $100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Range Filter */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <label className="text-sm font-medium text-gray-900">Time Range</label>
              </div>
              <Select value={activeFilters.timeRange} onValueChange={(value) => updateFilter('timeRange', value)}>
                <SelectTrigger className="w-full border-gray-300 hover:border-gray-400 focus:border-gray-500">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 shadow-lg">
                  <SelectItem value="morning">Morning (6 AM - 12 PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12 PM - 6 PM)</SelectItem>
                  <SelectItem value="evening">Evening (6 PM - 12 AM)</SelectItem>
                  <SelectItem value="latenight">Late Night (12 AM - 6 AM)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Order Location Type Filter */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                <label className="text-sm font-medium text-gray-900">Order Type</label>
              </div>
              <div className="bg-gray-50 border border-gray-300 rounded-xl p-3">
                <RadioGroup 
                  value={activeFilters.orderLocationType} 
                  onValueChange={(value) => updateFilter('orderLocationType', value)}
                  className="space-y-2"
                >
                  {['Room', 'Beach', 'Pool', 'Table'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={`location-${type}`} />
                      <Label htmlFor={`location-${type}`} className="text-sm text-gray-700 cursor-pointer">
                        {type}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            {/* Customer Type Filter with Radio Buttons */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-600" />
                <label className="text-sm font-medium text-gray-900">Customer Type</label>
              </div>
              <div className="bg-gray-50 border border-gray-300 rounded-xl p-3">
                <RadioGroup 
                  value={activeFilters.customerType} 
                  onValueChange={(value) => updateFilter('customerType', value)}
                  className="space-y-2"
                >
                  {['New Customer', 'Returning Customer', 'VIP Customer', 'Corporate'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={type} />
                      <Label htmlFor={type} className="text-sm text-gray-700 cursor-pointer">
                        {type}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            {/* Priority Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Priority Level</label>
              <div className="space-y-2">
                {['Normal', 'High Priority', 'Urgent'].map((priority) => (
                  <div key={priority} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={priority}
                      checked={activeFilters.priority?.includes(priority) || false}
                      onChange={(e) => handleCheckboxChange('priority', priority, e.target.checked)}
                      className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                    />
                    <label htmlFor={priority} className="text-sm text-gray-700">
                      {priority}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={() => setIsOpen(false)}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white"
            size="sm"
          >
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
