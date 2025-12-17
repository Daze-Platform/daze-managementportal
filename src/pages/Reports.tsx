
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RevenueSection } from '@/components/reports/RevenueSection';
import { PaymentTypesSection } from '@/components/reports/PaymentTypesSection';
import { CancellationSection } from '@/components/reports/CancellationSection';
import { DowntimeSection } from '@/components/reports/DowntimeSection';
import { MarketingSection } from '@/components/reports/MarketingSection';
import { TeamSection } from '@/components/reports/TeamSection';
import { CustomerAnalyticsSection } from '@/components/reports/CustomerAnalyticsSection';
import { ProductMixSection } from '@/components/reports/ProductMixSection';
import { useStores } from '@/contexts/StoresContext';
import { useResort } from '@/contexts/ResortContext';
import { useFilters } from '@/contexts/FilterContext';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DateRange } from 'react-day-picker';
import { format, subDays } from 'date-fns';
import { reportsData } from '@/data/reportsData';

export const Reports = () => {
  const { stores: allStores, getStoresByResort } = useStores();
  const { currentResort } = useResort();
  const { selectedStore, setSelectedStore, selectedDateRange, setSelectedDateRange } = useFilters();
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [customOpen, setCustomOpen] = useState(false);
  const [tempRange, setTempRange] = useState<DateRange | undefined>(selectedDateRange);

  // Get store-specific data
  const currentStoreData = reportsData[selectedStore as keyof typeof reportsData] || reportsData['all'];

  // Get all stores regardless of resort assignment and remove duplicates
  // This ensures all stores are available in dropdowns without duplicates
  const availableStores = allStores.filter((store, index, self) => 
    index === self.findIndex(s => s.id === store.id)
  );

  // Transform stores to match dropdown format
  const stores = [
    { id: 'all', name: 'All stores' },
    ...availableStores.map(store => ({
      id: store.id.toString(),
      name: store.name
    }))
  ];

  // Log filter changes for debugging
  useEffect(() => {
    console.log('Reports filters changed:', { selectedStore, selectedDateRange });
  }, [selectedStore, selectedDateRange]);

  // Format date range for display
  const formatDateRangeForReports = () => {
    if (!selectedDateRange?.from) return 'No date selected';
    if (selectedDateRange.from && selectedDateRange.to) {
      return `${format(selectedDateRange.from, 'MMM dd, yyyy')} - ${format(selectedDateRange.to, 'MMM dd, yyyy')}`;
    }
    return format(selectedDateRange.from, 'MMM dd, yyyy');
  };

  function handlePeriodChange(value: string) {
    if (value === 'custom') {
      setSelectedPeriod('custom');
      setTempRange(selectedDateRange);
      setCustomOpen(true);
      return;
    }
    setSelectedPeriod(value);
    const today = new Date();
    const daysBack = value === '7days' ? 6 : value === '30days' ? 29 : 89;
    setSelectedDateRange({ from: subDays(today, daysBack), to: today });
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-4 lg:py-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">Reports</h1>
            <p className="text-sm text-gray-600 mt-1">
              Store: {stores.find(s => s.id === selectedStore)?.name} • {formatDateRangeForReports()}
            </p>
          </div>
        </div>

        {/* Filters - Improved desktop layout */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger className="w-full sm:w-48 lg:w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300 shadow-lg z-50">
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    <div className="flex items-center gap-2">
                      <span>{store.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-full sm:w-48 lg:w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300 shadow-lg z-50">
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom range…</SelectItem>
              </SelectContent>
            </Select>

            
          </div>

          <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-right lg:text-right flex-shrink-0">
            Last updated on Dec 28, 2021
          </div>
        </div>

        <Dialog open={customOpen} onOpenChange={setCustomOpen}>
          <DialogContent className="sm:max-w-[560px]">
            <DialogHeader>
              <DialogTitle>Select custom date range</DialogTitle>
            </DialogHeader>
            <div className="p-1">
              <Calendar
                mode="range"
                selected={tempRange}
                onSelect={setTempRange}
                initialFocus
                className="p-3 pointer-events-auto"
                numberOfMonths={2}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCustomOpen(false)}>Cancel</Button>
              <Button onClick={() => { if (tempRange?.from) { setSelectedDateRange(tempRange); } setCustomOpen(false); }}>Apply</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Scrollable Content - Improved spacing and layout */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8 xl:p-10 space-y-8 lg:space-y-10">
          {/* Customer Analytics Section - Full width on desktop */}
          <div className="w-full">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6 text-gray-900">Customer Analytics</h2>
            <div className="w-full">
              <CustomerAnalyticsSection data={currentStoreData.customerAnalytics} />
            </div>
          </div>

          {/* Product Mix - Full width */}
          <div className="w-full">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6 text-gray-900">Product Mix</h2>
            <div className="w-full">
              <ProductMixSection selectedStore={selectedStore} selectedDateRange={selectedDateRange} />
            </div>
          </div>

          {/* Reports Grid - Better responsive layout */}
          <div className="w-full">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6 text-gray-900">Performance Reports</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 lg:gap-8 xl:gap-10">
              <div className="w-full">
                <RevenueSection data={currentStoreData.revenue} />
              </div>
              <div className="w-full">
                <PaymentTypesSection data={currentStoreData.paymentTypes} />
              </div>
              <div className="w-full">
                <CancellationSection data={currentStoreData.cancellations} />
              </div>
              <div className="w-full">
                <DowntimeSection />
              </div>
              <div className="w-full">
                <MarketingSection />
              </div>
              <div className="w-full">
                <TeamSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
