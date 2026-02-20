import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  UserPlus,
  Target,
} from "lucide-react";

export const MarketingSection = () => {
  const marketingMetrics = [
    {
      name: "New Customers",
      value: "431",
      change: "+15.2%",
      trend: "up",
      icon: UserPlus,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      name: "Active Users",
      value: "1,923",
      change: "+8.7%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "Menu Views",
      value: "15,642",
      change: "-2.1%",
      trend: "down",
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const campaigns = [
    {
      name: "Windrose Restaurant Specials",
      orders: 127,
      revenue: "$2,340",
      performance: "excellent",
      color: "bg-green-100 text-green-800",
    },
    {
      name: "Speakeasy Happy Hour",
      orders: 89,
      revenue: "$1,567",
      performance: "good",
      color: "bg-blue-100 text-blue-800",
    },
    {
      name: "Weekend Brunch",
      orders: 203,
      revenue: "$4,821",
      performance: "outstanding",
      color: "bg-purple-100 text-purple-800",
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
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 15 }}
              className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"
            >
              <Target className="w-4 h-4 text-green-600" />
            </motion.div>
            <CardTitle className="text-lg">Marketing Performance</CardTitle>
          </div>
          <p className="text-sm text-gray-600">
            Customer engagement and campaign effectiveness
          </p>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10">
          {/* Key Metrics */}
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700">Key Metrics</div>
            {marketingMetrics.map((metric, index) => (
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
                  <span className="text-lg font-bold text-gray-900">
                    {metric.value}
                  </span>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      metric.trend === "up"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {metric.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {metric.change}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Campaign Performance */}
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700">
              Top Performing Campaigns
            </div>
            {campaigns.map((campaign, index) => (
              <motion.div
                key={campaign.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="p-3 bg-white/80 backdrop-blur-sm rounded-lg border hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold text-gray-900">
                      {campaign.name}
                    </div>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.7, type: "spring" }}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${campaign.color}`}
                    >
                      {campaign.performance}
                    </motion.span>
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    {campaign.revenue}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {campaign.orders} orders generated
                  </div>
                  <div className="text-xs text-gray-500">
                    $
                    {(
                      parseFloat(
                        campaign.revenue.replace("$", "").replace(",", ""),
                      ) / campaign.orders
                    ).toFixed(0)}{" "}
                    avg. order
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Marketing insights */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
            className="bg-green-50 p-3 rounded-lg border border-green-200"
          >
            <div className="text-xs font-medium text-green-800 mb-1">
              🎯 Marketing Insight
            </div>
            <div className="text-xs text-green-700">
              Weekend Brunch campaign shows highest ROI. Consider expanding
              similar promotions.
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
