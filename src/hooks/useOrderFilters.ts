import { Order } from "@/hooks/useOrderData";
import { FilterState } from "@/components/orders/AdvancedFilters";

export const useOrderFilters = () => {
  const applyAdvancedFilters = (
    orders: Order[],
    advancedFilters: FilterState,
  ): Order[] => {
    let filtered = orders;

    if (advancedFilters.orderValue) {
      filtered = filtered.filter((order) => {
        const amount = parseFloat(order.items.split("$")[1] || "0");
        switch (advancedFilters.orderValue) {
          case "under25":
            return amount < 25;
          case "25to50":
            return amount >= 25 && amount <= 50;
          case "50to100":
            return amount > 50 && amount <= 100;
          case "over100":
            return amount > 100;
          default:
            return true;
        }
      });
    }

    if (advancedFilters.customerType.length > 0) {
      filtered = filtered.filter((order) => {
        const customerTypes = [
          "New Customer",
          "Returning Customer",
          "VIP Customer",
          "Corporate",
        ];
        const orderCustomerType =
          customerTypes[parseInt(order.id) % customerTypes.length];
        return advancedFilters.customerType.includes(orderCustomerType);
      });
    }

    if (advancedFilters.priority.length > 0) {
      filtered = filtered.filter((order) => {
        const priorityMapping = {
          normal: "Normal",
          high: "High Priority",
          urgent: "Urgent",
        };
        const orderPriority = priorityMapping[order.priority || "normal"];
        return advancedFilters.priority.includes(orderPriority);
      });
    }

    // Filter by order location type (Room, Beach, Pool, Table)
    if (advancedFilters.orderLocationType) {
      filtered = filtered.filter((order) => {
        return order.locationType === advancedFilters.orderLocationType;
      });
    }

    return filtered;
  };

  const getFilteredOrders = (
    orderData: any,
    activeTab: string,
    selectedStore: string,
    orderType: "all" | "pickup" | "delivery",
    advancedFilters: FilterState,
  ): Order[] => {
    const orders = orderData[activeTab as keyof typeof orderData] || [];
    let filtered = orders;
    // Filter by store - only if a specific store is selected
    if (selectedStore !== "all") {
      const beforeFilter = filtered.length;
      filtered = filtered.filter((order) => {
        // Match both by storeId AND by storeName for more reliable matching
        const matchesById = order.storeId === selectedStore;
        const matchesByName =
          order.storeName &&
          order.storeName.toLowerCase() === selectedStore.toLowerCase();
        const matches = matchesById || matchesByName;
        return matches;
      });
    } else {
    }

    // Filter by order type
    if (orderType !== "all") {
      const beforeTypeFilter = filtered.length;
      filtered = filtered.filter((order) =>
        orderType === "pickup"
          ? order.type === "Pick Up"
          : order.type === "Delivery",
      );
    }

    // Apply advanced filters
    const beforeAdvancedFilter = filtered.length;
    filtered = applyAdvancedFilters(filtered, advancedFilters);
    return filtered;
  };

  const getOrderTypeCount = (
    orderData: any,
    activeTab: string,
    selectedStore: string,
    type:
      | "pickup"
      | "delivery"
      | "new"
      | "progress"
      | "ready"
      | "fulfillment"
      | "fulfilled"
      | "scheduled",
  ): number => {
    if (type === "pickup" || type === "delivery") {
      const orders = orderData[activeTab as keyof typeof orderData] || [];
      const filteredByStore =
        selectedStore === "all"
          ? orders
          : orders.filter((order) => {
              const matchesById = order.storeId === selectedStore;
              const matchesByName =
                order.storeName &&
                order.storeName.toLowerCase() === selectedStore.toLowerCase();
              return matchesById || matchesByName;
            });

      return filteredByStore.filter((order) =>
        type === "pickup"
          ? order.type === "Pick Up"
          : order.type === "Delivery",
      ).length;
    } else {
      // Return count for specific tab
      const orders = orderData[type as keyof typeof orderData] || [];
      if (selectedStore === "all") {
        return orders.length;
      }
      const filteredCount = orders.filter((order) => {
        const matchesById = order.storeId === selectedStore;
        const matchesByName =
          order.storeName &&
          order.storeName.toLowerCase() === selectedStore.toLowerCase();
        return matchesById || matchesByName;
      }).length;
      return filteredCount;
    }
  };

  return {
    applyAdvancedFilters,
    getFilteredOrders,
    getOrderTypeCount,
  };
};
