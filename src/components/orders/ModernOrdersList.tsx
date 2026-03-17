import React, { useState, useEffect, useRef } from "react";
import { ModernOrderCard } from "./ModernOrderCard";
import { EmptyOrdersState } from "./EmptyOrdersState";
import { WaitingForOrdersState } from "./WaitingForOrdersState";
import { OrderDetailsOverlay } from "./OrderDetailsOverlay";
import { ChevronDown } from "lucide-react";

interface Order {
  id: string;
  items: string;
  type: string;
  time: string;
  deliverTime: string;
  icon: string;
  iconBg: string;
  status?: string;
  customer?: string;
  estimatedTime?: string;
  priority?: "normal" | "high" | "urgent";
  platformFee?: string;
  storeId?: string;
  storeName?: string;
  courier?: string;
  scheduledFor?: string;
  isVisible?: boolean;
  createdAt?: string;
}

interface ModernOrdersListProps {
  orders: Order[];
  selectedOrder: string | null;
  onOrderSelect: (orderId: string) => void;
  activeTab: string;
  isWaitingForOrders?: boolean;
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
  selectedStore?: string;
  orderStatus?: "active" | "paused";
  onResumeOrders?: () => void;
}

export const ModernOrdersList = ({
  orders,
  selectedOrder,
  onOrderSelect,
  activeTab,
  isWaitingForOrders = false,
  onOrderUpdate,
  onViewDetails,
  selectedStore = "all",
  orderStatus = "active",
  onResumeOrders,
}: ModernOrdersListProps) => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [overlayOrder, setOverlayOrder] = useState<string | null>(null);
  const [cardPosition, setCardPosition] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  console.log("ModernOrdersList: Rendering with props:", {
    ordersCount: orders.length,
    isWaitingForOrders,
    activeTab,
    visibleOrdersCount: orders.filter((order) => order.isVisible !== false)
      .length,
    selectedStore,
  });

  // Filter orders to only show visible ones
  const visibleOrders = orders.filter((order) => order.isVisible !== false);

  // Determine if we should show store badges
  const showStoreBadges = selectedStore === "all";

  const calculateTotal = (orders: Order[]): number => {
    return orders.reduce((sum: number, order: Order) => {
      const amount = parseFloat(order.items.split("$")[1] || "0");
      return sum + amount;
    }, 0);
  };

  const handleViewDetails = (
    orderId: string,
    cardRef: React.RefObject<HTMLDivElement>,
  ) => {
    console.log("ModernOrdersList: View details called for order:", orderId);

    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setCardPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
      setOverlayOrder(orderId);
    }

    // Don't call onViewDetails to avoid showing desktop panel
    // The overlay popup is sufficient for viewing details
  };

  const handleCloseOverlay = () => {
    setOverlayOrder(null);
    setCardPosition(null);
  };

  const checkScrollIndicator = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      const hasMoreContent = scrollHeight > clientHeight;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;
      setShowScrollIndicator(hasMoreContent && !isNearBottom);
    }
  };

  useEffect(() => {
    checkScrollIndicator();
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScrollIndicator);
      return () =>
        scrollContainer.removeEventListener("scroll", checkScrollIndicator);
    }
  }, [visibleOrders]);

  // Ensure scroll container is properly set up when orders load
  useEffect(() => {
    if (scrollContainerRef.current && visibleOrders.length > 0) {
      // Force a layout recalculation
      const container = scrollContainerRef.current;
      container.style.overflowY = "auto";
      container.style.height = "100%";

      // Check scroll after a brief delay to ensure DOM is updated
      setTimeout(() => {
        checkScrollIndicator();
      }, 100);
    }
  }, [visibleOrders.length]);

  const scrollToMore = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: 300,
        behavior: "smooth",
      });
    }
  };

  // Show waiting state ONLY when explicitly waiting AND no orders exist globally
  // AND we're on the new tab AND store is 'all' (not filtering by specific store)
  if (
    isWaitingForOrders &&
    activeTab === "new" &&
    orders.length === 0 &&
    selectedStore === "all"
  ) {
    console.log(
      "ModernOrdersList: Showing waiting state - no orders exist yet",
    );
    return <WaitingForOrdersState />;
  }

  // Show empty state ONLY when store is paused (not when filtering by specific store)
  if (orderStatus === "paused") {
    console.log("ModernOrdersList: Showing empty state - orders paused");
    return (
      <EmptyOrdersState
        onResumeOrders={() => {
          console.log("Resume orders clicked in EmptyOrdersState");
          if (onResumeOrders) {
            onResumeOrders();
          }
        }}
      />
    );
  }

  // When filtering by specific store and no orders match, just show empty list (no special state)
  if (visibleOrders.length === 0 && selectedStore !== "all") {
    console.log(
      "ModernOrdersList: No orders for selected store - showing empty list",
    );
    return (
      <div className="h-full flex flex-col bg-black">
        <div className="flex-shrink-0 px-4 py-3 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                0 Orders
              </h2>
              <p className="text-gray-600 text-xs mt-1">
                No orders for selected store
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-black flex items-center justify-center text-white">
          <p>No orders found for this store</p>
        </div>
      </div>
    );
  }

  // When no orders for any tab (except the ones already handled above), show empty state with black background
  if (visibleOrders.length === 0) {
    console.log(
      "ModernOrdersList: No orders for current tab - showing empty list",
    );
    return (
      <div className="h-full flex flex-col bg-black">
        <div className="flex-shrink-0 px-4 py-3 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                0 Orders
              </h2>
              <p className="text-gray-600 text-xs mt-1">
                No orders in this section
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-black flex items-center justify-center text-white">
          <div className="text-center">
            <p className="text-lg mb-2">📋</p>
            <p>No orders in this section</p>
          </div>
        </div>
      </div>
    );
  }

  console.log(
    "ModernOrdersList: Showing orders list with",
    visibleOrders.length,
    "visible orders",
  );

  return (
    <div className="h-full flex flex-col bg-black relative">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900">
              {visibleOrders.length}{" "}
              {visibleOrders.length === 1 ? "Order" : "Orders"}
              {isWaitingForOrders && (
                <span className="text-blue-600 ml-2">(Loading more...)</span>
              )}
            </h2>
            <p className="text-gray-600 text-xs mt-1">
              Total:{" "}
              <span className="font-semibold text-green-600">
                ${calculateTotal(visibleOrders).toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Orders Grid */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden bg-black"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
          overscrollBehavior: "contain",
        }}
      >
        <div className="p-4 bg-black min-h-full">
          <div
            className="grid gap-4 bg-black"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              minHeight: "100%",
            }}
          >
            {visibleOrders.map((order, index) => (
              <div
                key={order.id}
                className="animate-scale-in opacity-0"
                style={{
                  animationDelay: `${index * 2000}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <ModernOrderCard
                  order={order}
                  isSelected={selectedOrder === order.id}
                  onClick={() => onOrderSelect(order.id)}
                  activeTab={activeTab}
                  onOrderUpdate={onOrderUpdate}
                  onViewDetails={handleViewDetails}
                  showStoreBadge={showStoreBadges}
                />
              </div>
            ))}
          </div>
          {/* Ensure full height coverage with black background */}
          <div className="h-20 bg-black w-full"></div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={scrollToMore}
            className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white"
            aria-label="Scroll to see more orders"
          >
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}

      {/* Order Details Overlay */}
      {overlayOrder && (
        <OrderDetailsOverlay
          selectedOrder={overlayOrder}
          activeTab={activeTab}
          onOrderUpdate={onOrderUpdate}
          onClose={handleCloseOverlay}
          cardPosition={cardPosition}
        />
      )}
    </div>
  );
};
