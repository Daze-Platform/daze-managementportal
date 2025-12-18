
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { useResort } from '@/contexts/DestinationContext';
import { useFilters } from '@/contexts/FilterContext';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DateRange } from 'react-day-picker';
import { format, subDays } from 'date-fns';
import { reportsData } from '@/data/reportsData';
import { BarChart3, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const
    }
  }
};

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2
    }
  }
};

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Animated Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-3 sm:px-4 lg:px-6 py-4 lg:py-6 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Reports
                </h1>
                <p className="text-sm text-gray-600 mt-0.5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stores.find(s => s.id === selectedStore)?.name}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" />
                    {formatDateRangeForReports()}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters - Improved desktop layout */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger className="w-full sm:w-48 lg:w-52 bg-white/70 backdrop-blur-sm border-gray-200 hover:border-primary/50 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-md border-gray-200 shadow-xl z-50">
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
              <SelectTrigger className="w-full sm:w-48 lg:w-52 bg-white/70 backdrop-blur-sm border-gray-200 hover:border-primary/50 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-md border-gray-200 shadow-xl z-50">
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom range…</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs sm:text-sm text-gray-500 text-center sm:text-right lg:text-right flex-shrink-0 bg-gray-100/50 px-3 py-1.5 rounded-full"
          >
            Last updated on Dec 28, 2021
          </motion.div>
        </motion.div>

        <Dialog open={customOpen} onOpenChange={setCustomOpen}>
          <DialogContent className="sm:max-w-[560px] bg-white/95 backdrop-blur-md">
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
      </motion.div>

      {/* Scrollable Content - Animated */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-4 sm:p-6 lg:p-8 xl:p-10 space-y-8 lg:space-y-10"
        >
          {/* Customer Analytics Section - Full width on desktop */}
          <motion.div variants={itemVariants} className="w-full">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6 text-gray-900 flex items-center gap-2"
            >
              <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
              Customer Analytics
            </motion.h2>
            <div className="w-full">
              <CustomerAnalyticsSection data={currentStoreData.customerAnalytics} />
            </div>
          </motion.div>

          {/* Product Mix - Full width */}
          <motion.div variants={itemVariants} className="w-full">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6 text-gray-900 flex items-center gap-2"
            >
              <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
              Product Mix
            </motion.h2>
            <div className="w-full">
              <ProductMixSection selectedStore={selectedStore} selectedDateRange={selectedDateRange} />
            </div>
          </motion.div>

          {/* Reports Grid - Better responsive layout */}
          <motion.div variants={itemVariants} className="w-full">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6 text-gray-900 flex items-center gap-2"
            >
              <span className="w-1 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full" />
              Performance Reports
            </motion.h2>
            <motion.div 
              variants={gridVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 lg:gap-8 xl:gap-10"
            >
              <motion.div variants={itemVariants} className="w-full">
                <RevenueSection data={currentStoreData.revenue} />
              </motion.div>
              <motion.div variants={itemVariants} className="w-full">
                <PaymentTypesSection data={currentStoreData.paymentTypes} />
              </motion.div>
              <motion.div variants={itemVariants} className="w-full">
                <CancellationSection data={currentStoreData.cancellations} />
              </motion.div>
              <motion.div variants={itemVariants} className="w-full">
                <DowntimeSection />
              </motion.div>
              <motion.div variants={itemVariants} className="w-full">
                <MarketingSection />
              </motion.div>
              <motion.div variants={itemVariants} className="w-full">
                <TeamSection />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
