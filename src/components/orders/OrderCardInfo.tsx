import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Store, Truck, User, Calendar } from "lucide-react";

interface Order {
  id: string;
  items: string;
  type: string;
  deliverTime: string;
  customer?: string;
  storeName?: string;
  courier?: string;
  platformFee?: string;
  priority?: "normal" | "high" | "urgent";
}

interface OrderCardInfoProps {
  order: Order;
  activeTab: string;
}

export const OrderCardInfo = ({ order, activeTab }: OrderCardInfoProps) => {
  const parseOrderItems = () => {
    const itemsText = order.items;
    const itemCount = itemsText.split(" ")[0];
    const price = itemsText.split("$")[1];
    return { itemCount, price };
  };

  const { itemCount, price } = parseOrderItems();

  return (
    <>
      {/* Customer Name */}
      <h3 className="text-lg font-bold text-gray-900 mb-3 truncate min-h-[28px]">
        {order.customer || `Order #${order.id}`}
      </h3>

      {/* Order Type */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-1">
          {order.type === "Delivery" ? (
            <Truck className="w-4 h-4 text-gray-600" />
          ) : (
            <Store className="w-4 h-4 text-gray-600" />
          )}
          <span className="text-sm font-medium text-gray-700">
            {order.type}
          </span>
        </div>
      </div>

      {/* Pickup/Delivery Time */}
      <div className="flex items-center space-x-2 mb-3 text-sm text-gray-600">
        {activeTab === "scheduled" ? (
          <Calendar className="w-4 h-4" />
        ) : (
          <Clock className="w-4 h-4" />
        )}
        <span className="truncate">{order.deliverTime}</span>
      </div>

      {/* Items Count */}
      <div className="flex items-center space-x-2 mb-3 text-sm text-gray-600">
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <span>{itemCount} items</span>
      </div>

      {/* Store Info */}
      {order.storeName && (
        <div className="mb-3">
          <Badge
            variant="outline"
            className="text-xs bg-blue-50 text-blue-700 border-blue-200"
          >
            {order.storeName}
          </Badge>
        </div>
      )}

      {/* Courier Info */}
      {(activeTab === "ready" || activeTab === "fulfillment") &&
        order.courier &&
        order.type === "Delivery" && (
          <div className="mb-3">
            <Badge
              variant="outline"
              className="text-xs bg-purple-50 text-purple-700 border-purple-200 flex items-center space-x-1 w-fit"
            >
              <User className="w-3 h-3" />
              <span>{order.courier}</span>
            </Badge>
          </div>
        )}

      {/* Price */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-bold text-gray-900">${price}</div>
        {order.platformFee && (
          <Badge
            variant="outline"
            className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Fee: {order.platformFee}
          </Badge>
        )}
      </div>
    </>
  );
};
