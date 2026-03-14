import React from "react";
import { Clock } from "lucide-react";
import { OrderCardBadges } from "./OrderCardBadges";

interface Order {
  id: string;
  type: string;
  time: string;
  priority?: "normal" | "high" | "urgent";
  status?: string;
}

interface OrderCardHeaderProps {
  order: Order;
  showStatus: boolean;
}

export const OrderCardHeader = ({
  order,
  showStatus,
}: OrderCardHeaderProps) => {
  return (
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="font-bold text-xl text-gray-900 tracking-tight">
          #{order.id}
        </span>
        <div className="flex gap-2">
          <OrderCardBadges order={order} showStatus={showStatus} />
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-gray-500 bg-gray-50/80 px-2.5 py-1 rounded-full flex-shrink-0">
        <Clock className="w-3 h-3" />
        <span className="text-xs font-medium">{order.time}</span>
      </div>
    </div>
  );
};
