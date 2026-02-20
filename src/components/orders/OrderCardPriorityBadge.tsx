import React from "react";
import { AlertTriangle } from "lucide-react";

interface OrderCardPriorityBadgeProps {
  priority?: "normal" | "high" | "urgent";
}

export const OrderCardPriorityBadge = ({
  priority,
}: OrderCardPriorityBadgeProps) => {
  // Priority badges removed - always return null
  return null;
};
