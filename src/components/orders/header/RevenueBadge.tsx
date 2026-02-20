import React from "react";
import { Badge } from "@/components/ui/badge";

interface RevenueBadgeProps {
  totalRevenue: number;
  isActive: boolean;
  variant?: "mobile" | "tablet" | "desktop";
}

export const RevenueBadge = ({
  totalRevenue,
  isActive,
  variant = "desktop",
}: RevenueBadgeProps) => {
  if (!isActive) return null;

  const getClassName = () => {
    switch (variant) {
      case "mobile":
        return "text-xs bg-green-50 text-green-700 px-1 py-0.5 h-6";
      case "tablet":
        return "text-xs bg-green-50 text-green-700 px-1.5 py-0.5";
      case "desktop":
        return "text-xs bg-green-50 text-green-700";
      default:
        return "text-xs bg-green-50 text-green-700";
    }
  };

  const getDisplayValue = () => {
    switch (variant) {
      case "mobile":
        return `$${totalRevenue.toFixed(0)}`;
      case "tablet":
        return `$${totalRevenue.toFixed(2)}`;
      case "desktop":
        return `Today: $${totalRevenue.toFixed(2)}`;
      default:
        return `$${totalRevenue.toFixed(2)}`;
    }
  };

  return (
    <Badge variant="outline" className={getClassName()}>
      {getDisplayValue()}
    </Badge>
  );
};
