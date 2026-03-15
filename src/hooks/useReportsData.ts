
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useFilters } from '@/contexts/FilterContext';
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
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (storeIds: number[] | null, dateRange: DateRange) => {
    setLoading(true);
    setError(null);

    if (!dateRange.from || !dateRange.to) {
        setLoading(false);
        return;
    }

    try {
      const [revenueRes, productMixRes, customerAnalyticsRes, paymentTypesRes] = await Promise.all([
        supabase.rpc('get_revenue_report', { p_store_ids: storeIds, p_start_date: dateRange.from.toISOString(), p_end_date: dateRange.to.toISOString() }),
        supabase.rpc('get_product_mix_report', { p_store_ids: storeIds, p_start_date: dateRange.from.toISOString(), p_end_date: dateRange.to.toISOString() }),
        supabase.rpc('get_customer_analytics_report', { p_store_ids: storeIds, p_start_date: dateRange.from.toISOString(), p_end_date: dateRange.to.toISOString() }),
        supabase.rpc('get_payment_types_report', { p_store_ids: storeIds, p_start_date: dateRange.from.toISOString(), p_end_date: dateRange.to.toISOString() }),
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
    const storeIdArray = selectedStore === 'all' ? null : [parseInt(selectedStore, 10)];
    if (selectedDateRange) {
      fetchData(storeIdArray, selectedDateRange);
    }
  }, [selectedStore, selectedDateRange, fetchData]);

  return { data, loading, error };
};
