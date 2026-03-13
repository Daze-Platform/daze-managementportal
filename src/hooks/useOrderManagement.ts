import { useEffect } from "react";
import { useOrderData } from "@/hooks/useOrderData";
import { useOrderState } from "@/hooks/useOrderState";
import { useOrderFilters } from "@/hooks/useOrderFilters";
import { useOrderActions } from "@/hooks/useOrderActions";

export const useOrderManagement = () => {
  const {
    activeTab,
    selectedOrder,
    orderType,
    storeStatus,
    orderStatus,
    selectedStore,
    showOrderDetails,
    isWaitingForOrders,
    advancedFilters,
    setActiveTab,
    setSelectedOrder,
    setOrderType,
    setStoreStatus,
    setOrderStatus,
    setSelectedStore,
    setShowOrderDetails,
    setIsWaitingForOrders,
    setAdvancedFilters,
  } = useOrderState();

  const { orderData, generateInitialOrders } = useOrderData();

  const { getFilteredOrders, getOrderTypeCount } = useOrderFilters();

  const {
    handleOrderSelect,
    handleOrderUpdate,
    moveOrder,
    removeOrder,
    scheduleOrder,
  } = useOrderActions(
    activeTab,
    selectedOrder,
    setSelectedOrder,
    setShowOrderDetails,
    setActiveTab,
  );

  // Generate initial batch of orders when user clicks "Start Taking Orders"
  useEffect(() => {
    console.log("useOrderManagement: Order status changed:", {
      orderStatus,
      storeStatus,
      activeTab,
      existingOrdersCount: orderData.new.length,
    });

    // Generate orders when user activates orders AND no orders exist yet
    if (
      orderStatus === "active" &&
      storeStatus === "open" &&
      orderData.new.length === 0
    ) {
      console.log(
        'useOrderManagement: User clicked "Start Taking Orders" - generating orders for ALL stores',
      );
      generateInitialOrders();
    }

    // Handle inactive states
    if (orderStatus !== "active" || storeStatus !== "open") {
      setIsWaitingForOrders(false);
    }
  }, [
    orderStatus,
    storeStatus,
    orderData.new.length,
    generateInitialOrders,
    setIsWaitingForOrders,
  ]);

  // Ensure no waiting state when orders exist (for filtering)
  // Also ensure no waiting state when switching stores - we're just filtering, not generating new orders
  useEffect(() => {
    if (orderData.new.length > 0) {
      console.log(
        "useOrderManagement: Orders exist, ensuring no waiting state for filtering",
      );
      setIsWaitingForOrders(false);
    }
  }, [orderData.new.length, selectedStore, setIsWaitingForOrders]);

  // Create wrapper functions that include the required parameters
  const getFilteredOrdersWithParams = () => {
    const filtered = getFilteredOrders(
      orderData,
      activeTab,
      selectedStore,
      orderType,
      advancedFilters,
    );

    // Only show visible orders (for new orders that are being animated in)
    const visibleOrders = filtered.filter((order) => {
      // If isVisible is undefined, show the order (backwards compatibility)
      // If isVisible is defined, only show if it's true
      return order.isVisible !== false;
    });

    console.log("getFilteredOrdersWithParams result:", {
      totalFiltered: filtered.length,
      visibleOrders: visibleOrders.length,
      activeTab,
      selectedStore,
      storeNames: filtered.map((o) => o.storeName),
      storeIds: filtered.map((o) => o.storeId),
      isWaitingForOrders,
    });

    return visibleOrders;
  };

  const getOrderTypeCountWithParams = (
    type:
      | "pickup"
      | "delivery"
      | "new"
      | "progress"
      | "ready"
      | "fulfillment"
      | "fulfilled"
      | "scheduled",
  ) => getOrderTypeCount(orderData, activeTab, selectedStore, type);

  return {
    // State
    activeTab,
    selectedOrder,
    orderType,
    storeStatus,
    orderStatus,
    selectedStore,
    showOrderDetails,
    isWaitingForOrders,
    advancedFilters,
    orderData,

    // Setters
    setActiveTab,
    setSelectedOrder,
    setOrderType,
    setStoreStatus,
    setOrderStatus,
    setSelectedStore,
    setShowOrderDetails,
    setAdvancedFilters,

    // Handlers
    handleOrderSelect,
    handleOrderUpdate,

    // Computed values
    getFilteredOrders: getFilteredOrdersWithParams,
    getOrderTypeCount: getOrderTypeCountWithParams,

    // Order actions
    moveOrder,
    removeOrder,
    scheduleOrder,
  };
};
