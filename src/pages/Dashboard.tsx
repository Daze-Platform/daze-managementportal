import React, { useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { RightNowPanel } from "@/components/dashboard/RightNowPanel";
import { DashboardStats } from "@/components/dashboard/DashboardStats";

import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { EmployeeDeliveries } from "@/components/dashboard/EmployeeDeliveries";
import { PerformanceAlerts } from "@/components/dashboard/PerformanceAlerts";
import { CustomerSatisfaction } from "@/components/dashboard/CustomerSatisfaction";
import { OperationalMetrics } from "@/components/dashboard/OperationalMetrics";
import {
  resortDashboardData,
  employeeDeliveries,
} from "@/data/dashboardData";
import { useDashboardLiveData } from "@/hooks/useDashboardLiveData";
import { useFilters } from "@/contexts/FilterContext";
import { useResort } from "@/contexts/DestinationContext";
import { useAuth } from "@/contexts/AuthContext";

export const Dashboard = () => {
  const {
    selectedStore,
    setSelectedStore,
    selectedDateRange,
    setSelectedDateRange,
  } = useFilters();

  const { currentResort } = useResort();
  const { userProfile } = useAuth();

  // Live data from Supabase orders table (auto-refreshes every 60s)
  const liveData = useDashboardLiveData(userProfile?.tenantId);

  // Get resort-specific static data for sections we can't compute live yet
  const resortData =
    currentResort?.id &&
    resortDashboardData[currentResort.id as keyof typeof resortDashboardData]
      ? resortDashboardData[
          currentResort.id as keyof typeof resortDashboardData
        ]
      : resortDashboardData["pensacola-beach-resort"];

  let currentStoreData = resortData[selectedStore as keyof typeof resortData];

  if (!currentStoreData && selectedStore !== "all") {
    currentStoreData = resortData["all"];
  }

  if (!currentStoreData) {
    currentStoreData = resortData["all"];
  }

  // Log filter changes for debugging
  useEffect(() => {
    console.log("Dashboard filters changed:", {
      selectedStore,
      selectedDateRange,
    });
  }, [selectedStore, selectedDateRange]);

  return (
    <div className="min-h-full bg-gray-50 page-fade-in">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {/* Header with Store Picker and Date Range Picker */}
        <div className="bg-white rounded-xl border border-border/50 p-4 sm:p-6">
          <DashboardHeader
            selectedStore={selectedStore}
            setSelectedStore={setSelectedStore}
            selectedDateRange={selectedDateRange}
            setSelectedDateRange={setSelectedDateRange}
          />
        </div>

        {/* Right Now Panel */}
        <RightNowPanel tenantId={userProfile?.tenantId} />

        {/* Stats Cards — LIVE from Supabase */}
        <div className="bg-white rounded-xl border border-border/50 p-4 sm:p-6">
          <DashboardStats stats={liveData.stats} />
        </div>

        {/* Charts and Most Ordered Items — LIVE from Supabase */}
        <div className="bg-white rounded-xl border border-border/50 p-4 sm:p-6">
          <DashboardCharts
            storeName={liveData.storeName}
            revenueData={liveData.revenueData}
            orderData={liveData.orderData}
            topItems={liveData.topItems.length > 0 ? liveData.topItems : currentStoreData.topItems}
          />
        </div>

        {/* Enhanced Restaurant Data Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Performance Alerts */}
          <div className="bg-white rounded-xl border border-border/50">
            <PerformanceAlerts
              alerts={currentStoreData.performanceAlerts || []}
            />
          </div>

          {/* Customer Satisfaction */}
          <div className="bg-white rounded-xl border border-border/50">
            <CustomerSatisfaction
              data={
                currentStoreData.customerSatisfaction || {
                  overall: 4.0,
                  foodQuality: 4.0,
                  serviceSpeed: 4.0,
                  cleanliness: 4.0,
                  value: 4.0,
                  totalReviews: 0,
                }
              }
            />
          </div>
        </div>

        {/* Operational Metrics and Employee Deliveries */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 pb-4 sm:pb-8">
          <div className="lg:col-span-2 bg-white rounded-xl border border-border/50">
            <OperationalMetrics
              data={
                currentStoreData.operationalMetrics || {
                  avgOrderPrepTime: 0,
                  kitchenEfficiency: 0,
                  wastagePercentage: 0,
                  staffUtilization: 0,
                  peakHourCapacity: 0,
                }
              }
            />
          </div>
          <div className="bg-white rounded-xl border border-border/50">
            <EmployeeDeliveries employees={employeeDeliveries} />
          </div>
        </div>
      </div>
    </div>
  );
};
