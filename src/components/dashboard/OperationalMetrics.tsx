import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Timer,
  Target,
  AlertTriangle,
} from "lucide-react";

interface OperationalMetricsData {
  avgOrderPrepTime: number;
  kitchenEfficiency: number;
  wastagePercentage: number;
  staffUtilization: number;
  peakHourCapacity: number;
}

interface OperationalMetricsProps {
  data: OperationalMetricsData;
}

export const OperationalMetrics = ({ data }: OperationalMetricsProps) => {
  const metrics = [
    {
      label: "Order Accuracy",
      value: "96.2%",
      icon: Target,
      trend: "good",
      description: "Correct orders delivered",
    },
    {
      label: "Avg Prep Time",
      value: `${data.avgOrderPrepTime} min`,
      icon: Timer,
      trend: data.avgOrderPrepTime < 15 ? "good" : "attention",
      description: "Kitchen to service time",
    },
    {
      label: "Peak Hour Orders",
      value: "187/hr",
      icon: Activity,
      trend: "good",
      description: "Rush hour throughput",
    },
    {
      label: "Order Cancellations",
      value: "2.1%",
      icon: AlertTriangle,
      trend: "good",
      description: "Cancelled after confirmation",
    },
  ];

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Resort F&B Operations</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Key performance indicators
            </p>
          </div>
          <Activity className="w-5 h-5 text-gray-500" />
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div
                key={index}
                className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        {metric.label}
                      </span>
                      {metric.trend === "good" ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {metric.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-2 rounded-full ${
                        metric.trend === "good"
                          ? "bg-green-500"
                          : "bg-orange-500"
                      }`}
                      style={{
                        width: `${
                          metric.label === "Order Accuracy"
                            ? 96
                            : metric.label === "Avg Prep Time"
                              ? Math.max(100 - data.avgOrderPrepTime * 3, 25)
                              : metric.label === "Peak Hour Orders"
                                ? 87
                                : metric.label === "Order Cancellations"
                                  ? 93
                                  : 80
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-blue-800 mb-1">
                Today's Performance
              </div>
              <div className="text-sm text-blue-700">
                Peak dining: 12-2pm & 6-8pm. Beachside orders up 23% this week.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
