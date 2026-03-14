import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, ArrowUpRight, BarChart3 } from "lucide-react";

interface RevenueData {
  total: number;
  growth: number;
  breakdown: Array<{
    label: string;
    amount: number;
    color: string;
    percentage: number;
  }>;
}

interface RevenueSectionProps {
  data?: RevenueData;
}

const AnimatedCounter = ({
  value,
  prefix = "",
}: {
  value: number;
  prefix?: string;
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <>
      {prefix}
      {displayValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
    </>
  );
};

export const RevenueSection = ({ data }: RevenueSectionProps) => {
  const defaultData = {
    total: 4220.5,
    growth: 4.07,
    breakdown: [
      {
        label: "Net Revenue",
        amount: 1928,
        color: "bg-emerald-500",
        percentage: 45.7,
      },
      { label: "Tax", amount: 1060, color: "bg-blue-500", percentage: 25.1 },
      {
        label: "Commission",
        amount: 844,
        color: "bg-orange-500",
        percentage: 20.0,
      },
      { label: "Tips", amount: 388, color: "bg-purple-500", percentage: 9.2 },
    ],
  };

  const revenueData = data || defaultData;
  const revenueBreakdown = revenueData.breakdown.map((item) => ({
    ...item,
    icon:
      item.label === "Net Revenue"
        ? DollarSign
        : item.label === "Tax"
          ? BarChart3
          : item.label === "Commission"
            ? ArrowUpRight
            : TrendingUp,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 border-emerald-200/50 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden relative group">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <DollarSign className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Gross Revenue
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Revenue breakdown for the selected period
                </p>
              </div>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-right"
            >
              <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                Performance
              </div>
              <div className="flex items-center gap-1 bg-emerald-100 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-600">
                  Excellent
                </span>
              </div>
            </motion.div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 relative z-10">
          {/* Total Revenue Highlight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-600">
                Total Revenue
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>vs. previous 7 days</span>
              </div>
            </div>
            <div className="flex items-end gap-4">
              <span className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                $<AnimatedCounter value={revenueData.total} />
              </span>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-1 bg-emerald-100 px-3 py-1.5 rounded-full mb-1"
              >
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-600">
                  +{revenueData.growth}%
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Revenue Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Revenue Breakdown
              </h3>
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                Last 7 days
              </div>
            </div>

            {/* Visual Progress Bar - Animated */}
            <div className="flex h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              {revenueBreakdown.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.percentage}%` }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  className={`${item.color} transition-all duration-500 hover:brightness-110`}
                  title={`${item.label}: $${item.amount} (${item.percentage}%)`}
                />
              ))}
            </div>

            {/* Breakdown Details - Staggered animation */}
            <div className="grid grid-cols-2 gap-4">
              {revenueBreakdown.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-white/30 hover:bg-white/80 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: 10 }}
                        className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center shadow-sm`}
                      >
                        <IconComponent className="w-4 h-4 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-700">
                          {item.label}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            ${item.amount.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Insights Panel - Animated */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-xl border border-emerald-200"
          >
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <span className="text-emerald-600 text-sm">💡</span>
              </motion.div>
              <div>
                <div className="text-sm font-semibold text-emerald-800 mb-1">
                  Revenue Analysis
                </div>
                <div className="text-sm text-emerald-700">
                  Strong performance with {revenueData.growth}% growth. Net
                  revenue represents {revenueData.breakdown[0].percentage}% of
                  total, indicating healthy profit margins.
                  <span className="font-medium">
                    {" "}
                    Tips increased by 12% this week.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
