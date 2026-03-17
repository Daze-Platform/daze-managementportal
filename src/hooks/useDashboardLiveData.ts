import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sb = supabase as any;

interface LiveStats {
  revenue: number;
  orders: number;
  customers: number;
  avgOrder: number;
  trends: { revenue: number; orders: number; customers: number; avgOrder: number };
}

interface ChartPoint {
  name: string;
  value?: number;
  orders?: number;
}

interface TopItem {
  name: string;
  orders: number;
  revenue: string;
  image: string;
  change: string;
}

export interface DashboardLiveData {
  stats: LiveStats;
  revenueData: ChartPoint[];
  orderData: ChartPoint[];
  topItems: TopItem[];
  isLoading: boolean;
  storeName: string;
}

function startOfDay(d: Date): Date {
  const s = new Date(d);
  s.setHours(0, 0, 0, 0);
  return s;
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

const HOUR_LABELS = ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"];
const HOUR_BUCKETS = [6, 9, 12, 15, 18, 21];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function useDashboardLiveData(tenantId?: string): DashboardLiveData {
  const [stats, setStats] = useState<LiveStats>({
    revenue: 0, orders: 0, customers: 0, avgOrder: 0,
    trends: { revenue: 0, orders: 0, customers: 0, avgOrder: 0 },
  });
  const [revenueData, setRevenueData] = useState<ChartPoint[]>([]);
  const [orderData, setOrderData] = useState<ChartPoint[]>([]);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const now = new Date();
      const todayStart = startOfDay(now).toISOString();

      // 1) Today's orders (excluding cancelled)
      let todayQuery = sb
        .from("orders")
        .select("id, total_cents, guest_id, created_at, status")
        .neq("status", "cancelled")
        .gte("created_at", todayStart);
      if (tenantId) todayQuery = todayQuery.eq("tenant_id", tenantId);

      const { data: todayOrders } = await todayQuery;
      const orders = todayOrders ?? [];

      const totalRevenue = orders.reduce((s: number, o: { total_cents: number }) => s + (o.total_cents || 0), 0);
      const totalOrders = orders.length;
      const uniqueGuests = new Set(orders.map((o: { guest_id: string | null }) => o.guest_id).filter(Boolean)).size;
      const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // 2) Yesterday's orders for trend comparison
      const yesterdayStart = startOfDay(new Date(now.getTime() - 86400000)).toISOString();
      const yesterdayEnd = todayStart;
      let yQuery = sb
        .from("orders")
        .select("id, total_cents, guest_id")
        .neq("status", "cancelled")
        .gte("created_at", yesterdayStart)
        .lt("created_at", yesterdayEnd);
      if (tenantId) yQuery = yQuery.eq("tenant_id", tenantId);

      const { data: yOrders } = await yQuery;
      const yArr = yOrders ?? [];
      const yRevenue = yArr.reduce((s: number, o: { total_cents: number }) => s + (o.total_cents || 0), 0);
      const yCount = yArr.length;
      const yGuests = new Set(yArr.map((o: { guest_id: string | null }) => o.guest_id).filter(Boolean)).size;
      const yAvg = yCount > 0 ? yRevenue / yCount : 0;

      const pct = (cur: number, prev: number) => prev > 0 ? +((cur - prev) / prev * 100).toFixed(1) : 0;

      setStats({
        revenue: Math.round(totalRevenue / 100),
        orders: totalOrders,
        customers: uniqueGuests || totalOrders,
        avgOrder: +(avgOrder / 100).toFixed(2),
        trends: {
          revenue: pct(totalRevenue, yRevenue),
          orders: pct(totalOrders, yCount),
          customers: pct(uniqueGuests || totalOrders, yGuests || yCount),
          avgOrder: pct(avgOrder, yAvg),
        },
      });

      // 3) 7-day revenue chart
      const weekAgo = new Date(now.getTime() - 7 * 86400000);
      let weekQuery = sb
        .from("orders")
        .select("total_cents, created_at")
        .neq("status", "cancelled")
        .gte("created_at", startOfDay(weekAgo).toISOString());
      if (tenantId) weekQuery = weekQuery.eq("tenant_id", tenantId);

      const { data: weekOrders } = await weekQuery;
      const dayMap: Record<string, number> = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 86400000);
        dayMap[DAY_NAMES[d.getDay()]] = 0;
      }
      for (const o of weekOrders ?? []) {
        const d = new Date(o.created_at);
        const key = DAY_NAMES[d.getDay()];
        if (key in dayMap) dayMap[key] += Math.round((o.total_cents || 0) / 100);
      }
      setRevenueData(Object.entries(dayMap).map(([name, value]) => ({ name, value })));

      // 4) Orders by hour (today)
      const hourCounts: Record<number, number> = {};
      for (const b of HOUR_BUCKETS) hourCounts[b] = 0;
      for (const o of orders) {
        const h = new Date(o.created_at).getHours();
        // bucket into nearest label
        let best = HOUR_BUCKETS[0];
        for (const b of HOUR_BUCKETS) {
          if (h >= b) best = b;
        }
        hourCounts[best] = (hourCounts[best] || 0) + 1;
      }
      setOrderData(HOUR_BUCKETS.map((b, i) => ({ name: HOUR_LABELS[i], orders: hourCounts[b] })));

      // 5) Top items
      let itemsQuery = sb
        .from("order_items")
        .select("name, quantity, unit_price_cents, order_id");
      // Can't filter by tenant on order_items directly — we'll use all items from today's order IDs
      const todayIds = orders.map((o: { id: string }) => o.id);
      if (todayIds.length > 0) {
        itemsQuery = itemsQuery.in("order_id", todayIds);
      }

      const { data: items } = await itemsQuery;
      const itemAgg: Record<string, { count: number; revenue: number }> = {};
      for (const item of items ?? []) {
        const key = item.name || "Unknown";
        if (!itemAgg[key]) itemAgg[key] = { count: 0, revenue: 0 };
        itemAgg[key].count += item.quantity || 1;
        itemAgg[key].revenue += (item.unit_price_cents || 0) * (item.quantity || 1);
      }
      const sorted = Object.entries(itemAgg)
        .sort(([, a], [, b]) => b.count - a.count)
        .slice(0, 5);

      setTopItems(
        sorted.map(([name, { count, revenue }]) => ({
          name,
          orders: count,
          revenue: formatCents(revenue),
          image: "",
          change: "+0%",
        })),
      );
    } catch (err) {
      console.error("Dashboard live data error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 60_000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  return {
    stats,
    revenueData,
    orderData,
    topItems,
    isLoading,
    storeName: "All Stores",
  };
}
