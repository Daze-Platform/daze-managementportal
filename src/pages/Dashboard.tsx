
import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardStats } from '@/components/dashboard/DashboardStats';

import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { EmployeeDeliveries } from '@/components/dashboard/EmployeeDeliveries';
import { PerformanceAlerts } from '@/components/dashboard/PerformanceAlerts';
import { CustomerSatisfaction } from '@/components/dashboard/CustomerSatisfaction';
import { OperationalMetrics } from '@/components/dashboard/OperationalMetrics';
import { resortDashboardData, stores, employeeDeliveries } from '@/data/dashboardData';
import { useToast } from '@/hooks/use-toast';
import { useFilters } from '@/contexts/FilterContext';
import { useResort } from '@/contexts/DestinationContext';

export const Dashboard = () => {
  const { 
    selectedStore, 
    setSelectedStore,
    selectedDateRange, 
    setSelectedDateRange 
  } = useFilters();

  const { toast } = useToast();
  const { currentResort } = useResort();

  // Get resort-specific data or fallback to Pensacola Beach Resort
  const resortData = currentResort?.id && resortDashboardData[currentResort.id as keyof typeof resortDashboardData] 
    ? resortDashboardData[currentResort.id as keyof typeof resortDashboardData]
    : resortDashboardData['pensacola-beach-resort'];

  let currentStoreData = resortData[selectedStore as keyof typeof resortData];

  // If no specific store data found, fall back to 'all' data
  if (!currentStoreData && selectedStore !== 'all') {
    console.warn(`Dashboard: No data found for store '${selectedStore}' in resort '${currentResort?.id}', falling back to 'all' stores data`);
    currentStoreData = resortData['all'];
  }

  // Final fallback if still no data
  if (!currentStoreData) {
    console.error('Dashboard: No data available for resort:', currentResort?.id);
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-gray-600">Unable to load dashboard data for the selected resort and store combination.</p>
        </div>
      </div>
    );
  }

  // Log filter changes for debugging
  useEffect(() => {
    console.log('Dashboard filters changed:', { selectedStore, selectedDateRange });
  }, [selectedStore, selectedDateRange]);

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        
        {/* Header with Store Picker and Date Range Picker */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <DashboardHeader
            selectedStore={selectedStore}
            setSelectedStore={setSelectedStore}
            selectedDateRange={selectedDateRange}
            setSelectedDateRange={setSelectedDateRange}
          />
        </div>

        {/* Stats Cards */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <DashboardStats stats={currentStoreData.stats} />
        </div>

        {/* Charts and Most Ordered Items Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <DashboardCharts
            storeName={currentStoreData.name}
            revenueData={currentStoreData.revenueData}
            orderData={currentStoreData.orderData}
            topItems={currentStoreData.topItems}
          />
        </div>

        {/* Enhanced Restaurant Data Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Performance Alerts */}
          <div className="bg-white rounded-lg shadow-sm">
            <PerformanceAlerts alerts={currentStoreData.performanceAlerts || []} />
          </div>
          
          {/* Customer Satisfaction */}
          <div className="bg-white rounded-lg shadow-sm">
            <CustomerSatisfaction data={currentStoreData.customerSatisfaction || {
              overall: 4.0,
              foodQuality: 4.0,
              serviceSpeed: 4.0,
              cleanliness: 4.0,
              value: 4.0,
              totalReviews: 0
            }} />
          </div>
        </div>

        {/* Operational Metrics and Employee Deliveries */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 pb-4 sm:pb-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
            <OperationalMetrics data={currentStoreData.operationalMetrics || {
              avgOrderPrepTime: 0,
              kitchenEfficiency: 0,
              wastagePercentage: 0,
              staffUtilization: 0,
              peakHourCapacity: 0
            }} />
          </div>
          <div className="bg-white rounded-lg shadow-sm">
            <EmployeeDeliveries employees={employeeDeliveries} />
          </div>
        </div>
      </div>
    </div>
  );
};
