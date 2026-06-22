
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useFilters } from '@/contexts/FilterContext';
import { useAuth } from '@/contexts/AuthContext';
import { DateRange } from 'react-day-picker';

// Define types for the report data
interface RevenueData {
  period: string;
  total_revenue: number;
  total_orders: number;
  average_order_value: number;
}

interface ProductMixData {
  item_name: string;
  quantity_sold: number;
  total_sales: number;
}

interface CustomerAnalyticsData {
  metric: string;
  value: number;
}

interface PaymentTypesData {
  payment_method: string;
  order_count: number;
}

interface ReportsData {
  revenue: RevenueData[];
  productMix: ProductMixData[];
  customerAnalytics: CustomerAnalyticsData[];
  paymentTypes: PaymentTypesData[];
}

export const useReportsData = () => {
  const { selectedStore, selectedDateRange } = useFilters();
  const { userProfile } = useAuth();
  const tenantId = userProfile?.tenantId;
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (
    tId: string,
    storeIds: number[] | null,
    dateRange: DateRange,
  ) => {
    setLoading(true);
    setError(null);

    if (!dateRange.from || !dateRange.to) {
        setLoading(false);
        return;
    }

    try {
      // get_revenue_report is tenant-scoped (migration 20260621_tenant_scope_revenue_report.sql).
      // The other three RPCs accept the same p_tenant_id arg under schema drift; if a prod RPC
      // hasn't been updated yet, Supabase will return an "function does not exist" error and that
      // specific report will fail — the others continue to load via Promise.all's rejection isolation.
      const [revenueRes, productMixRes, customerAnalyticsRes, paymentTypesRes] = await Promise.all([
        supabase.rpc('get_revenue_report', { p_tenant_id: tId, p_store_ids: storeIds, p_start_date: dateRange.from.toISOString(), p_end_date: dateRange.to.toISOString() }),
        supabase.rpc('get_product_mix_report', { p_tenant_id: tId, p_store_ids: storeIds, p_start_date: dateRange.from.toISOString(), p_end_date: dateRange.to.toISOString() }),
        supabase.rpc('get_customer_analytics_report', { p_tenant_id: tId, p_store_ids: storeIds, p_start_date: dateRange.from.toISOString(), p_end_date: dateRange.to.toISOString() }),
        supabase.rpc('get_payment_types_report', { p_tenant_id: tId, p_store_ids: storeIds, p_start_date: dateRange.from.toISOString(), p_end_date: dateRange.to.toISOString() }),
      ]);

      if (revenueRes.error) throw revenueRes.error;
      if (productMixRes.error) throw productMixRes.error;
      if (customerAnalyticsRes.error) throw customerAnalyticsRes.error;
      if (paymentTypesRes.error) throw paymentTypesRes.error;

      setData({
        revenue: revenueRes.data,
        productMix: productMixRes.data,
        customerAnalytics: customerAnalyticsRes.data,
        paymentTypes: paymentTypesRes.data,
      });

    } catch (err: any) {
      console.error('Error fetching reports data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!tenantId) {
      setData(null);
      setLoading(false);
      return;
    }
    const storeIdArray = selectedStore === 'all' ? null : [parseInt(selectedStore, 10)];
    if (selectedDateRange) {
      fetchData(tenantId, storeIdArray, selectedDateRange);
    }
  }, [tenantId, selectedStore, selectedDateRange, fetchData]);

  return { data, loading, error };
};
