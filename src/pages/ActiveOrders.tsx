import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActiveOrdersHeader } from '@/components/orders/ActiveOrdersHeader';
import { PauseOrdersModal } from '@/components/orders/PauseOrdersModal';
import { StoreClosedState } from '@/components/orders/StoreClosedState';
import { MobileOrderDetailsView } from '@/components/orders/MobileOrderDetailsView';
import { OrdersListLayout } from '@/components/orders/OrdersListLayout';
import { useOrderManagement } from '@/hooks/useOrderManagement';
import { calculateTotalRevenue } from '@/utils/orderCalculations';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFilters } from '@/contexts/FilterContext';

export const ActiveOrders = () => {
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

  const stores = [
    { id: 'all', name: 'All Stores' },
    { id: '1', name: 'Brother Fox' },
    { id: '2', name: 'Sister Hen' },
    { id: '3', name: 'Cousin Wolf' },
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
      setStoreStatus('open');
      setOrderStatus('active');
    } else if (orderStatus === 'active') {
      setShowPauseModal(true);
    } else {
      setOrderStatus('active');
    }
  };

  const handleConfirmPause = () => {
    setOrderStatus('paused');
    setShowPauseModal(false);
  };

  const handleOpenStore = () => {
    setStoreStatus('open');
    setOrderStatus('active');
  };
  
  const handleResumeOrders = () => {
    setOrderStatus('active');
  };

  const handleStoreChange = (storeId: string) => {
    setSelectedStore(storeId);
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
    setViewingOrderDetails(orderId);
    if (isMobile) {
      setShowOrderDetails(true);
    }
  };

  const handleMobileBackToList = () => {
    setShowOrderDetails(false);
    setViewingOrderDetails(null);
  };

  // Mobile order details view
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

  const shouldShowClosedState = storeStatus === 'closed' || 
    (orderStatus === 'paused' && filteredOrders.length === 0);

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <motion.div 
          className="flex-shrink-0 bg-card border-b border-border z-10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
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
        </motion.div>

        {/* Main Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {shouldShowClosedState ? (
              <motion.div
                key="closed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-h-screen"
              >
                <StoreClosedState 
                  storeName={selectedStoreName}
                  storeStatus={storeStatus}
                  orderStatus={orderStatus}
                  onResumeOrders={handleResumeOrders}
                  onOpenStore={handleOpenStore}
                />
              </motion.div>
            ) : (
              <motion.div
                key="orders"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Pause Modal */}
      <PauseOrdersModal
        isOpen={showPauseModal}
        onClose={() => setShowPauseModal(false)}
        onConfirm={handleConfirmPause}
        storeName={selectedStoreName}
      />
    </div>
  );
};
