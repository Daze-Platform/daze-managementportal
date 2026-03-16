import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  Users,
  Eye,
  UserPlus,
  Target,
  ShoppingBag,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TopItem {
  name: string;
  orderCount: number;
}

interface MarketingData {
  newCustomers: number;
  activeUsers: number;
  menuViews: number;
  topItems: TopItem[];
}

const SkeletonBox = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export const MarketingSection = () => {
  const [data, setData] = useState<MarketingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const since = new Date();
        since.setDate(since.getDate() - 30);
        const sinceIso = since.toISOString();

        // New Customers: distinct guest_email values in last 30 days
        const { data: ordersRaw, error: ordersError } = await (supabase as any)
          .from("orders")
          .select("id, guest_email, created_at")
          .gte("created_at", sinceIso);

        if (ordersError) throw ordersError;

        const orders: { id: string; guest_email: string | null; created_at: string }[] =
          ordersRaw ?? [];

        const distinctEmails = new Set(
          orders
            .map((o) => o.guest_email)
            .filter((e): e is string => !!e && e.trim() !== "")
        );
        const newCustomers = distinctEmails.size;
        const activeUsers = orders.length;
        const menuViews = activeUsers * 8;

        // Top Items: join order_items → pos_menu_items, count by item
        const { data: itemsRaw, error: itemsError } = await (supabase as any)
          .from("order_items")
          .select("item_id, quantity, pos_menu_items(name)")
          .not("item_id", "is", null);

        if (itemsError) throw itemsError;

        const countMap: Record<string, { name: string; count: number }> = {};
        for (const row of itemsRaw ?? []) {
          const id = row.item_id as string;
          const name =
            (row.pos_menu_items as { name?: string } | null)?.name ?? "Unknown Item";
          const qty = typeof row.quantity === "number" ? row.quantity : 1;
          if (!countMap[id]) countMap[id] = { name, count: 0 };
          countMap[id].count += qty;
        }

        const topItems: TopItem[] = Object.values(countMap)
          .sort((a, b) => b.count - a.count)
          .slice(0, 3)
          .map((item) => ({ name: item.name, orderCount: item.count }));

        setData({ newCustomers, activeUsers, menuViews, topItems });
      } catch (err) {
        console.error("MarketingSection fetch error:", err);
        // Fall back to zeroed state so UI doesn't stay blank
        setData({ newCustomers: 0, activeUsers: 0, menuViews: 0, topItems: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const metricConfigs = [
    {
      name: "New Customers",
      getValue: () => (data?.newCustomers ?? 0).toLocaleString(),
      icon: UserPlus,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      name: "Active Users",
      getValue: () => (data?.activeUsers ?? 0).toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "Menu Views",
      getValue: () => (data?.menuViews ?? 0).toLocaleString(),
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 15 }}
                className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"
              >
                <Target className="w-4 h-4 text-green-600" />
              </motion.div>
              <CardTitle className="text-lg">Marketing Performance</CardTitle>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              Last 30 days
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Customer engagement and top items this period
          </p>
        </CardHeader>

        <CardContent className="space-y-6 relative z-10">
          {/* Key Metrics */}
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700">Key Metrics</div>
            {metricConfigs.map((metric, index) => (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.2 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm rounded-lg border hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    className={`w-8 h-8 ${metric.bgColor} rounded-lg flex items-center justify-center`}
                  >
                    <metric.icon className={`w-4 h-4 ${metric.color}`} />
                  </motion.div>
                  <span className="text-sm font-medium text-gray-900">
                    {metric.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {loading ? (
                    <SkeletonBox className="h-6 w-16" />
                  ) : (
                    <span className="text-lg font-bold text-gray-900">
                      {metric.getValue()}
                    </span>
                  )}
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    Live
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Top Items This Period */}
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700">
              Top Items This Period
            </div>
            {loading ? (
              [0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="p-3 bg-white/80 backdrop-blur-sm rounded-lg border"
                >
                  <SkeletonBox className="h-4 w-3/4 mb-2" />
                  <SkeletonBox className="h-3 w-1/3" />
                </div>
              ))
            ) : data && data.topItems.length > 0 ? (
              data.topItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-3 bg-white/80 backdrop-blur-sm rounded-lg border hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-700">
                        {index + 1}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span className="font-medium">
                        {item.orderCount.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400">ordered</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-3 bg-white/80 backdrop-blur-sm rounded-lg border text-sm text-gray-500 text-center">
                No item data available yet.
              </div>
            )}
          </div>

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
            className="bg-green-50 p-3 rounded-lg border border-green-200"
          >
            <div className="text-xs font-medium text-green-800 mb-1">
              Data source
            </div>
            <div className="text-xs text-green-700">
              Metrics pulled live from order data. Menu Views estimated at 8x order
              volume — no view-tracking in DB yet.
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
