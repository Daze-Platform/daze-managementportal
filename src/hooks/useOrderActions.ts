import { useOrderData } from "@/hooks/useOrderData";

export const useOrderActions = (
  activeTab: string,
  selectedOrder: string | null,
  setSelectedOrder: (id: string | null) => void,
  setShowOrderDetails: (show: boolean) => void,
  setActiveTab: (tab: string) => void,
) => {
  const { orderData, moveOrder, removeOrder, scheduleOrder } = useOrderData();

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrder(orderId);
    setShowOrderDetails(true);
  };

  const handleOrderUpdate = (
    orderId: string,
    action:
      | "accept"
      | "decline"
      | "ready"
      | "complete"
      | "fulfill"
      | "schedule"
      | "activate",
    data?: any,
  ) => {
    console.log("Order update action:", action, "for order:", orderId);

    // Find the order to check its type
    const currentOrder = orderData[activeTab as keyof typeof orderData]?.find(
      (order) => order.id === orderId,
    );

    switch (action) {
      case "accept":
        console.log("Moving order from new to progress:", orderId);
        moveOrder(orderId, "new", "progress");
        setActiveTab("progress");
        break;
      case "decline":
        console.log("Declining order from new:", orderId);
        removeOrder(orderId, "new");
        if (selectedOrder === orderId) {
          setSelectedOrder(null);
          setShowOrderDetails(false);
        }
        break;
      case "ready":
        console.log("Moving order from progress to ready:", orderId);
        moveOrder(orderId, "progress", "ready");
        setActiveTab("ready");
        break;
      case "complete":
        console.log("Moving order from ready to fulfillment:", orderId);
        moveOrder(orderId, "ready", "fulfillment");
        setActiveTab("fulfillment");
        break;
      case "fulfill":
        console.log(
          "Moving order from fulfillment/ready to fulfilled:",
          orderId,
        );
        // Handle both pickup orders (skip fulfillment) and delivery orders
        const fromTab = activeTab === "ready" ? "ready" : "fulfillment";
        moveOrder(orderId, fromTab as keyof typeof orderData, "fulfilled");
        setActiveTab("fulfilled");
        break;
      case "schedule":
        console.log("Moving order to scheduled:", orderId);
        const scheduledTime = data?.scheduledTime || "Tomorrow, 2:00PM";
        scheduleOrder(
          orderId,
          activeTab as keyof typeof orderData,
          scheduledTime,
        );
        setActiveTab("scheduled");
        break;
      case "activate":
        console.log("Moving scheduled order to new:", orderId);
        moveOrder(orderId, "scheduled", "new");
        setActiveTab("new");
        break;
    }
  };

  return {
    handleOrderSelect,
    handleOrderUpdate,
    // Pass through order data actions
    moveOrder,
    removeOrder,
    scheduleOrder,
  };
};
