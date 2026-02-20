import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Eye, User, Truck } from "lucide-react";

interface Order {
  id: string;
  type: string;
  scheduledFor?: string;
}

interface OrderCardActionsProps {
  order: Order;
  activeTab: string;
  onOrderUpdate?: (
    orderId: string,
    action:
      | "accept"
      | "decline"
      | "ready"
      | "complete"
      | "fulfill"
      | "schedule"
      | "activate",
  ) => void;
  onViewDetails?: (orderId: string) => void;
}

export const OrderCardActions = ({
  order,
  activeTab,
  onOrderUpdate,
  onViewDetails,
}: OrderCardActionsProps) => {
  const handleButtonClick = (
    e: React.MouseEvent,
    action:
      | "accept"
      | "decline"
      | "ready"
      | "complete"
      | "fulfill"
      | "schedule"
      | "activate",
  ) => {
    e.stopPropagation();
    console.log("🔥 Button clicked:", action, "for order:", order.id);
    console.log("🔥 onOrderUpdate function:", onOrderUpdate);
    if (onOrderUpdate) {
      console.log("🔥 Calling onOrderUpdate with:", order.id, action);
      onOrderUpdate(order.id, action);
    } else {
      console.log("🔥 ERROR: onOrderUpdate is undefined!");
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("View Details clicked for order:", order.id);
    if (onViewDetails) {
      onViewDetails(order.id);
    }
  };

  const handlePickupComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Customer pickup - moving order to completed:", order.id);
    if (onOrderUpdate) {
      // For pickup orders, skip fulfillment and go directly to fulfilled/completed
      onOrderUpdate(order.id, "fulfill");
    }
  };

  const handleDeliveryHandoff = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Hand to courier - moving order to fulfillment:", order.id);
    if (onOrderUpdate) {
      onOrderUpdate(order.id, "complete");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Fixed position View Details Button - Always at the same height */}
      <div className="mb-4">
        <Button
          variant="outline"
          className="w-full h-11 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 font-medium flex items-center justify-center space-x-2 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group relative z-20"
          onClick={handleViewDetails}
          type="button"
        >
          <Eye className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
          <span className="font-semibold">View Details</span>
        </Button>
      </div>

      {/* Flexible spacer to push action buttons to bottom */}
      <div className="flex-1"></div>

      {/* Action Buttons - Always at the bottom */}
      <div className="space-y-2.5 relative z-10">
        {activeTab === "new" && (
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              variant="outline"
              className="h-10 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 font-semibold transition-all duration-200 hover:shadow-sm"
              onClick={(e) => handleButtonClick(e, "decline")}
            >
              Decline
            </Button>
            <Button
              className="h-10 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
              onClick={(e) => handleButtonClick(e, "accept")}
            >
              Accept Order
            </Button>
          </div>
        )}
        {activeTab === "progress" && (
          <Button
            className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
            onClick={(e) => handleButtonClick(e, "ready")}
          >
            Mark as Ready
          </Button>
        )}
        {activeTab === "ready" && (
          <Button
            className="w-full h-10 bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-sm flex items-center justify-center space-x-2 transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
            onClick={
              order.type === "Delivery"
                ? handleDeliveryHandoff
                : handlePickupComplete
            }
          >
            {order.type === "Delivery" ? (
              <>
                <Truck className="w-4 h-4" />
                <span>Hand to Courier</span>
              </>
            ) : (
              <>
                <User className="w-4 h-4" />
                <span>Customer Pickup</span>
              </>
            )}
          </Button>
        )}
        {activeTab === "fulfillment" && (
          <Button
            className="w-full h-10 bg-purple-500 hover:bg-purple-600 text-white font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
            onClick={(e) => handleButtonClick(e, "fulfill")}
          >
            Mark as Delivered
          </Button>
        )}
        {activeTab === "fulfilled" && (
          <div className="flex items-center justify-center space-x-2 h-10 text-green-600 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Order Completed</span>
          </div>
        )}
        {activeTab === "scheduled" && (
          <div className="space-y-2.5">
            <div className="text-center p-2.5 bg-indigo-50 rounded-lg border border-indigo-200">
              <span className="text-sm font-medium text-indigo-700">
                Scheduled for: {order.scheduledFor || "Tomorrow 2:00 PM"}
              </span>
            </div>
            <Button
              className="w-full h-10 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
              onClick={(e) => handleButtonClick(e, "activate")}
            >
              Activate Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
