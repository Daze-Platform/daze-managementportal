import React from "react";
import { ModernTabNavigation } from "./ModernTabNavigation";
import { OrderFilters } from "./OrderFilters";
import { ModernOrdersList } from "./ModernOrdersList";
import { DesktopOrderDetailsPanel } from "./DesktopOrderDetailsPanel";
import { FilterState } from "./AdvancedFilters";

interface Tab {
  id: string;
  label: string;
  count: number;
}

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
}

interface OrdersListLayoutProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  orderType: "all" | "pickup" | "delivery";
  onOrderTypeChange: (type: "all" | "pickup" | "delivery") => void;
  pickupCount: number;
  deliveryCount: number;
  totalCount: number;
  advancedFilters: FilterState;
  onAdvancedFiltersChange: (filters: FilterState) => void;
  filteredOrders: Order[];
  selectedOrder: string | null;
  onOrderSelect: (orderId: string) => void;
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
  viewingOrderDetails?: string | null;
  isMobile: boolean;
  isWaitingForOrders?: boolean;
  selectedStore?: string;
  orderStatus?: "active" | "paused";
  onResumeOrders?: () => void;
}

export const OrdersListLayout = ({
  tabs,
  activeTab,
  onTabChange,
  orderType,
  onOrderTypeChange,
  pickupCount,
  deliveryCount,
  totalCount,
  advancedFilters,
  onAdvancedFiltersChange,
  filteredOrders,
  selectedOrder,
  onOrderSelect,
  onOrderUpdate,
  onViewDetails,
  viewingOrderDetails,
  isMobile,
  isWaitingForOrders = false,
  selectedStore = "all",
  orderStatus = "active",
  onResumeOrders,
}: OrdersListLayoutProps) => {
  const showOrderDetails = !isMobile && (selectedOrder || viewingOrderDetails);
  const orderDetailsId = viewingOrderDetails || selectedOrder;

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Tab Navigation */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200">
        <ModernTabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      </div>

      {/* Order Type Filters */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100">
        <OrderFilters
          orderType={orderType}
          onOrderTypeChange={onOrderTypeChange}
          pickupCount={pickupCount}
          deliveryCount={deliveryCount}
          totalCount={totalCount}
          advancedFilters={advancedFilters}
          onAdvancedFiltersChange={onAdvancedFiltersChange}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden bg-black">
        <div className="h-full flex bg-black">
          {/* Orders List */}
          <div
            className={`${showOrderDetails ? "w-1/2" : "w-full"} h-full bg-black`}
          >
            <ModernOrdersList
              orders={filteredOrders}
              selectedOrder={selectedOrder}
              onOrderSelect={onOrderSelect}
              activeTab={activeTab}
              isWaitingForOrders={isWaitingForOrders}
              onOrderUpdate={onOrderUpdate}
              onViewDetails={onViewDetails}
              selectedStore={selectedStore}
              orderStatus={orderStatus}
              onResumeOrders={onResumeOrders}
            />
          </div>

          {/* Desktop Order Details Panel */}
          {showOrderDetails && orderDetailsId && (
            <DesktopOrderDetailsPanel
              selectedOrder={orderDetailsId}
              activeTab={activeTab}
              onOrderUpdate={onOrderUpdate}
              onClose={() => {
                // Clear both selected order and viewing details
                onOrderSelect("");
                if (onViewDetails) {
                  onViewDetails("");
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
