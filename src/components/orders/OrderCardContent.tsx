import React from "react";
import { Badge } from "@/components/ui/badge";
import { MapPin, Utensils, Store, Timer } from "lucide-react";

interface Order {
  id: string;
  items: string;
  type: string;
  deliverTime: string;
  estimatedTime?: string;
  priority?: "normal" | "high" | "urgent";
}

interface OrderCardContentProps {
  order: Order;
}

export const OrderCardContent = ({ order }: OrderCardContentProps) => {
  const parseOrderItems = () => {
    const itemsText = order.items;
    const itemCount = itemsText.split(" ")[0];
    const price = itemsText.split("$")[1];
    return { itemCount, price };
  };

  const { itemCount, price } = parseOrderItems();

  return (
    <div className="space-y-3">
      {/* Order Type & Value Section */}
      <div className="bg-gray-50/80 rounded-lg p-3 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {order.type === "Delivery" ? (
              <div className="flex items-center space-x-1.5 bg-blue-100 px-2 py-1 rounded-full">
                <Utensils className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-semibold text-blue-700">
                  Delivery
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 bg-green-100 px-2 py-1 rounded-full">
                <Store className="w-3 h-3 text-green-600" />
                <span className="text-xs font-semibold text-green-700">
                  Pickup
                </span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">${price}</div>
            <div className="text-xs text-gray-500 font-medium">
              {itemCount} items
            </div>
          </div>
        </div>

        {/* Delivery Time */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start space-x-2 text-gray-600 flex-1 min-w-0">
            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span className="text-xs font-medium leading-tight">
              {order.deliverTime}
            </span>
          </div>

          {order.estimatedTime && order.estimatedTime !== "Completed" && (
            <div className="flex items-center space-x-1 bg-orange-100 px-2 py-1 rounded-full flex-shrink-0">
              <Timer className="w-3 h-3 text-orange-600" />
              <span className="text-xs font-semibold text-orange-700 whitespace-nowrap">
                {order.estimatedTime}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
