import React from "react";

interface OrderCardActionButtonProps {
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
  orderId: string;
}

export const OrderCardActionButton = ({
  activeTab,
  onOrderUpdate,
  orderId,
}: OrderCardActionButtonProps) => {
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
    if (onOrderUpdate) {
      onOrderUpdate(orderId, action);
    }
  };

  return (
    <div className="mt-auto">
      {activeTab === "new" && (
        <button
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          onClick={(e) => handleButtonClick(e, "accept")}
        >
          Confirm order
        </button>
      )}
      {activeTab === "progress" && (
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          onClick={(e) => handleButtonClick(e, "ready")}
        >
          Mark as ready
        </button>
      )}
      {activeTab === "ready" && (
        <button
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          onClick={(e) => handleButtonClick(e, "complete")}
        >
          Ready for pickup
        </button>
      )}
      {activeTab === "fulfillment" && (
        <button
          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          onClick={(e) => handleButtonClick(e, "fulfill")}
        >
          Mark as fulfilled
        </button>
      )}
      {activeTab === "fulfilled" && (
        <div className="w-full bg-green-100 text-green-700 font-medium py-2.5 px-4 rounded-lg text-center">
          Order completed
        </div>
      )}
      {activeTab === "scheduled" && (
        <button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          onClick={(e) => handleButtonClick(e, "activate")}
        >
          Activate order
        </button>
      )}
    </div>
  );
};
