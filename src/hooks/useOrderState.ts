
import { useState } from 'react';
import { FilterState } from '@/components/orders/AdvancedFilters';

export const useOrderState = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<'all' | 'pickup' | 'delivery'>('all');
  const [storeStatus, setStoreStatus] = useState<'open' | 'closed'>('closed');
  const [orderStatus, setOrderStatus] = useState<'active' | 'paused'>('paused');
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [isWaitingForOrders, setIsWaitingForOrders] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>({
    dateRange: '',
    orderValue: '',
    customerType: '',
    priority: [],
    timeRange: ''
  });

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
    
    // Setters
    setActiveTab,
    setSelectedOrder,
    setOrderType,
    setStoreStatus,
    setOrderStatus,
    setSelectedStore,
    setShowOrderDetails,
    setIsWaitingForOrders,
    setAdvancedFilters,
  };
};
