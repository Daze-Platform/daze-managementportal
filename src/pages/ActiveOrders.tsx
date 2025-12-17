
import React, { useState } from 'react';
import { ActiveOrdersHeader } from '@/components/orders/ActiveOrdersHeader';
import { PauseOrdersModal } from '@/components/orders/PauseOrdersModal';
import { StoreClosedState } from '@/components/orders/StoreClosedState';
import { MobileOrderDetailsView } from '@/components/orders/MobileOrderDetailsView';
import { OrdersListLayout } from '@/components/orders/OrdersListLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { useOrderManagement } from '@/hooks/useOrderManagement';
import { calculateTotalRevenue } from '@/utils/orderCalculations';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFilters } from '@/contexts/FilterContext';

export const ActiveOrders = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [viewingOrderDetails, setViewingOrderDetails] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const { selectedDateRange, setSelectedDateRange } = useFilters();

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
    setOrderType,
    setStoreStatus,
    setOrderStatus,
    setSelectedStore,
    setShowOrderDetails,
    setAdvancedFilters,
    handleOrderSelect,
    handleOrderUpdate,
    getFilteredOrders,
    getOrderTypeCount
  } = useOrderManagement();

  // Available stores
  const stores = [
    { id: 'all', name: 'All Stores' },
    { id: '12', name: 'Piazza' },
    { id: '13', name: 'Red Fish Blue Fish' },
    { id: '8', name: 'Sal De Mar' },
  ];

  const filteredOrders = getFilteredOrders();

  const tabs = [
    { id: 'new', label: 'New Orders', count: getOrderTypeCount('new') || 0 },
    { id: 'progress', label: 'In Progress', count: getOrderTypeCount('progress') || 0 },
    { id: 'ready', label: 'Ready', count: getOrderTypeCount('ready') || 0 },
    { id: 'fulfillment', label: 'Out for Delivery', count: getOrderTypeCount('fulfillment') || 0 },
    { id: 'fulfilled', label: 'Completed', count: getOrderTypeCount('fulfilled') || 0 },
    { id: 'scheduled', label: 'Scheduled', count: getOrderTypeCount('scheduled') || 0 }
  ];

  const toggleStoreOrOrderStatus = () => {
    if (storeStatus === 'closed') {
      // If store is closed, open it and activate orders
      console.log('Opening store and activating orders');
      setStoreStatus('open');
      setOrderStatus('active');
    } else if (orderStatus === 'active') {
      // If orders are active, show pause modal
      setShowPauseModal(true);
    } else {
      // If orders are paused, resume them
      console.log('Resuming orders for store:', selectedStore);
      setOrderStatus('active');
    }
  };

  const handleConfirmPause = () => {
    console.log('Pausing orders for store:', selectedStore);
    setOrderStatus('paused');
    setShowPauseModal(false);
  };

  const handleOpenStore = () => {
    console.log('Opening store and activating orders for:', selectedStore);
    setStoreStatus('open');
    setOrderStatus('active');
  };
  
  // Function specifically for the Resume Taking Orders button in StoreClosedState
  const handleResumeOrders = () => {
    console.log('Resume Taking Orders button clicked in ActiveOrders.tsx');
    setOrderStatus('active');
  };

  // Handle store selection changes - simple filtering only
  const handleStoreChange = (storeId: string) => {
    console.log('Store selection changed to:', storeId);
    setSelectedStore(storeId);
    // Orders will be automatically filtered by the getFilteredOrders function
  };

  const selectedStoreName = stores.find(store => store.id === selectedStore)?.name || 'All Stores';
  const totalRevenue = calculateTotalRevenue(filteredOrders);

  const handleMobileOrderSelect = (orderId: string) => {
    handleOrderSelect(orderId);
    if (isMobile) {
      setShowOrderDetails(true);
    }
  };

  const handleViewOrderDetails = (orderId: string) => {
    console.log('handleViewOrderDetails called for:', orderId);
    setViewingOrderDetails(orderId);
    if (isMobile) {
      setShowOrderDetails(true);
    }
  };

  const handleMobileBackToList = () => {
    setShowOrderDetails(false);
    setViewingOrderDetails(null);
  };

  // Mobile view - show order details full screen
  if ((showOrderDetails && selectedOrder && isMobile) || (viewingOrderDetails && isMobile)) {
    const orderIdToShow = viewingOrderDetails || selectedOrder;
    return (
      <MobileOrderDetailsView
        selectedOrder={orderIdToShow!}
        activeTab={activeTab}
        onOrderUpdate={handleOrderUpdate}
        onBackToList={handleMobileBackToList}
      />
    );
  }

  // Determine if we should show the closed/paused state
  // Only show if store is closed OR if orders are paused AND there are no filtered orders available
  const shouldShowClosedState = storeStatus === 'closed' || 
    (orderStatus === 'paused' && filteredOrders.length === 0);

  return (
    <div className="min-h-screen w-full bg-black">
      {/* Mobile Sidebar */}
      {isMobile && (
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      <div className="min-h-screen flex flex-col">
        {/* Fixed Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 z-10">
          <ActiveOrdersHeader
            storeStatus={storeStatus}
            orderStatus={orderStatus}
            onToggleStoreStatus={toggleStoreOrOrderStatus}
            totalRevenue={totalRevenue}
            selectedStore={selectedStore}
            onStoreChange={handleStoreChange}
            selectedStoreName={selectedStoreName}
            selectedDateRange={selectedDateRange}
            onDateRangeChange={setSelectedDateRange}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {shouldShowClosedState ? (
            <div className="min-h-screen">
                <StoreClosedState 
                  storeName={selectedStoreName}
                  storeStatus={storeStatus}
                  orderStatus={orderStatus}
                  onResumeOrders={handleResumeOrders}
                  onOpenStore={handleOpenStore}
                />
            </div>
          ) : (
            <OrdersListLayout
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              orderType={orderType}
              onOrderTypeChange={setOrderType}
              pickupCount={getOrderTypeCount('pickup')}
              deliveryCount={getOrderTypeCount('delivery')}
              totalCount={filteredOrders.length}
              advancedFilters={advancedFilters}
              onAdvancedFiltersChange={setAdvancedFilters}
              filteredOrders={filteredOrders}
              selectedOrder={selectedOrder}
              onOrderSelect={handleMobileOrderSelect}
              onOrderUpdate={handleOrderUpdate}
              onViewDetails={handleViewOrderDetails}
              viewingOrderDetails={viewingOrderDetails}
              isMobile={isMobile}
              isWaitingForOrders={isWaitingForOrders}
              selectedStore={selectedStore}
              orderStatus={orderStatus}
              onResumeOrders={handleResumeOrders}
            />
          )}
        </div>
      </div>

      {/* Pause Orders Modal */}
      <PauseOrdersModal
        isOpen={showPauseModal}
        onClose={() => setShowPauseModal(false)}
        onConfirm={handleConfirmPause}
        storeName={selectedStoreName}
      />
    </div>
  );
};
