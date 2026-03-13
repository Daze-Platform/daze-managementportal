import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, TrendingDown, Target } from "lucide-react";

interface PerformanceAlert {
  metric: string;
  currentValue: number;
  targetValue: number;
  urgency: "low" | "medium" | "high" | "critical";
  impact: string;
}

interface PerformanceAlertsProps {
  alerts: PerformanceAlert[];
}

export const PerformanceAlerts = ({ alerts }: PerformanceAlertsProps) => {
  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs">
            🔴 Critical
          </Badge>
        );
      case "high":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 text-xs">
            🟠 High
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs">
            🟡 Medium
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
            🟢 Good
          </Badge>
        );
      default:
        return <Badge className="text-xs">{urgency}</Badge>;
    }
  };

  const getVarianceIcon = (current: number, target: number, metric: string) => {
    const isGoodDirection =
      metric.includes("Rating") ||
      metric.includes("Acceptance") ||
      metric.includes("Availability");
    const variance = current - target;

    if (isGoodDirection) {
      return variance >= 0 ? (
        <TrendingUp className="w-3 h-3 text-green-500" />
      ) : (
        <TrendingDown className="w-3 h-3 text-red-500" />
      );
    } else {
      return variance <= 0 ? (
        <TrendingUp className="w-3 h-3 text-green-500" />
      ) : (
        <TrendingDown className="w-3 h-3 text-red-500" />
      );
    }
  };

  const getVariancePercentage = (current: number, target: number) => {
    const variance = ((current - target) / target) * 100;
    return Math.abs(variance).toFixed(1);
  };

  const formatValue = (value: number, metric: string) => {
    if (metric.includes("Rate") || metric.includes("Availability")) {
      return `${value}%`;
    }
    if (metric.includes("Time") || metric.includes("Response")) {
      return `${value}min`;
    }
    if (metric.includes("Rating")) {
      return `${value}/5`;
    }
    return `${value}`;
  };

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2 px-3 sm:px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg lg:text-xl">
            Platform Performance
          </CardTitle>
          <div className="flex items-center gap-1 sm:gap-2">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs hidden sm:inline-flex">
              {
                alerts.filter(
                  (alert) =>
                    alert.urgency === "critical" || alert.urgency === "high",
                ).length
              }{" "}
              Needs Attention
            </Badge>
            <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs sm:hidden">
              {
                alerts.filter(
                  (alert) =>
                    alert.urgency === "critical" || alert.urgency === "high",
                ).length
              }
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3 px-3 sm:px-6">
        <div className="space-y-2 sm:space-y-3">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mb-2 sm:mb-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                      {alert.metric}
                    </p>
                    {getUrgencyBadge(alert.urgency)}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500">
                    <span>
                      Current: {formatValue(alert.currentValue, alert.metric)}
                    </span>
                    <span className="hidden sm:inline">
                      Target: {formatValue(alert.targetValue, alert.metric)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                    {getVarianceIcon(
                      alert.currentValue,
                      alert.targetValue,
                      alert.metric,
                    )}
                    <span>
                      {getVariancePercentage(
                        alert.currentValue,
                        alert.targetValue,
                      )}
                      % variance
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between sm:block sm:text-right flex-shrink-0">
                <div className="sm:hidden text-xs text-gray-500">
                  Target: {formatValue(alert.targetValue, alert.metric)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Impact</p>
                  <p className="text-xs text-gray-500">{alert.impact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
