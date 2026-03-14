import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface StoreStats {
  revenue: number;
  orders: number;
  customers: number;
  avgOrder: number;
  trends: {
    revenue: number;
    orders: number;
    customers: number;
    avgOrder: number;
  };
}

interface DashboardStatsProps {
  stats: StoreStats;
}

const statCards = [
  {
    key: "revenue",
    label: "Total Revenue",
    icon: DollarSign,
    format: (v: number) => `$${v.toLocaleString()}`,
    gradient: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    key: "orders",
    label: "Total Orders",
    icon: ShoppingCart,
    format: (v: number) => v.toLocaleString(),
    gradient: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    key: "customers",
    label: "Active Customers",
    icon: Users,
    format: (v: number) => v.toLocaleString(),
    gradient: "from-violet-500 to-purple-600",
    bgLight: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    key: "avgOrder",
    label: "Avg. Order Value",
    icon: TrendingUp,
    format: (v: number) => `$${v.toFixed(2)}`,
    gradient: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const formatTrend = (value: number) => {
    const isPositive = value >= 0;
    return {
      value: `${isPositive ? "+" : ""}${value}%`,
      color: isPositive ? "text-emerald-600" : "text-red-500",
      bgColor: isPositive ? "bg-emerald-50" : "bg-red-50",
      icon: isPositive ? ArrowUpRight : ArrowDownRight,
    };
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        const value = stats[card.key as keyof StoreStats] as number;
        const trendValue = stats.trends[card.key as keyof typeof stats.trends];
        const trend = formatTrend(trendValue);
        const TrendIcon = trend.icon;

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <Card className="group relative overflow-hidden border border-border/50 bg-card transition-shadow duration-200 hover:shadow-md">
              {/* Gradient accent line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} opacity-80`}
              />

              <CardContent className="p-4 lg:p-6">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1 space-y-3">
                    <p className="text-xs font-medium text-foreground/70 uppercase tracking-wide">
                      {card.label}
                    </p>
                    <motion.p
                      className="text-2xl lg:text-3xl font-bold text-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {card.format(value)}
                    </motion.p>
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-current/10 ${trend.bgColor}`}
                    >
                      <TrendIcon className={`w-3.5 h-3.5 ${trend.color}`} />
                      <span className={`text-xs font-bold ${trend.color}`}>
                        {trend.value}
                      </span>
                    </div>
                  </div>

                  <motion.div
                    className={`w-14 h-14 lg:w-16 lg:h-16 ${card.bgLight} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm ring-1 ring-black/5`}
                    whileHover={{ rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon
                      className={`w-7 h-7 lg:w-8 lg:h-8 ${card.iconColor}`}
                    />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
