
import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

interface SearchResult {
  type: 'store' | 'revenue' | 'menu-item' | 'inventory' | 'order';
  title: string;
  description: string;
  id: string;
  data: any;
}

// Sample order history data for Lily Hall venues
const orderHistoryData = [
  {
    id: '#67899886',
    store: 'Brother Fox',
    customer: 'Lucie Morgan',
    type: 'Pickup',
    total: '$76.45',
    date: 'May 7, 2021 11:50AM',
    status: 'Completed',
  },
  {
    id: '#67899887',
    store: 'Sister Hen',
    customer: 'Adam Smith',
    type: 'Delivery',
    total: '$42.95',
    date: 'May 7, 2021 11:50AM',
    status: 'Canceled',
  },
  {
    id: '#67899888',
    store: 'Cousin Wolf',
    customer: 'John Cordoba',
    type: 'Delivery',
    total: '$28.47',
    date: 'May 7, 2021 11:50AM',
    status: 'Completed',
  },
  {
    id: '#67899889',
    store: 'Brother Fox',
    customer: 'Sarah Williams',
    type: 'Delivery',
    total: '$91.23',
    date: 'May 7, 2021 11:50AM',
    status: 'Completed',
  },
];

export const useDashboardSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  // Sample data for dashboard search - Lily Hall venues
  const sampleData = {
    stores: [
      { id: 'brother-fox', name: 'Brother Fox', orders: 45 },
      { id: 'sister-hen', name: 'Sister Hen', orders: 32 },
      { id: 'cousin-wolf', name: 'Cousin Wolf', orders: 28 },
    ],
    revenue: [
      { id: 'daily', name: 'Daily Revenue', value: 2450 },
      { id: 'weekly', name: 'Weekly Revenue', value: 15680 },
      { id: 'monthly', name: 'Monthly Revenue', value: 68900 },
    ],
    menuItems: [
      { id: 'oysters', name: 'Wood-Fired Oysters', orders: 120 },
      { id: 'paella', name: 'Seafood Paella', orders: 85 },
      { id: 'old-fashioned', name: 'Old Fashioned', orders: 67 },
    ],
    inventory: [
      { id: 'oysters-stock', name: 'Fresh Oysters', urgency: 'high' },
      { id: 'bourbon', name: 'Bourbon Selection', urgency: 'medium' },
      { id: 'eggs', name: 'Farm Fresh Eggs', urgency: 'low' },
    ],
  };

  // Create search results based on current page
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];
    const isDashboard = location.pathname === '/dashboard';
    const isOrderHistory = location.pathname === '/orders/history';

    console.log('Searching with query:', query, 'on page:', location.pathname);

    // Dashboard-specific search results
    if (isDashboard) {
      // Store search
      sampleData.stores
        .filter(store => store.name.toLowerCase().includes(query))
        .forEach(store => {
          results.push({
            type: 'store',
            title: store.name,
            description: `${store.orders} active orders`,
            id: store.id,
            data: store,
          });
        });

      // Revenue search
      sampleData.revenue
        .filter(revenue => revenue.name.toLowerCase().includes(query))
        .forEach(revenue => {
          results.push({
            type: 'revenue',
            title: revenue.name,
            description: `$${revenue.value.toLocaleString()}`,
            id: revenue.id,
            data: revenue,
          });
        });

      // Menu items search
      sampleData.menuItems
        .filter(item => item.name.toLowerCase().includes(query))
        .forEach(item => {
          results.push({
            type: 'menu-item',
            title: item.name,
            description: `${item.orders} orders this month`,
            id: item.id,
            data: item,
          });
        });

      // Inventory search
      sampleData.inventory
        .filter(item => item.name.toLowerCase().includes(query))
        .forEach(item => {
          results.push({
            type: 'inventory',
            title: item.name,
            description: `${item.urgency} priority restock`,
            id: item.id,
            data: item,
          });
        });
    }

    // Order history search
    if (isOrderHistory || isDashboard) {
      orderHistoryData
        .filter(order => 
          order.id.toLowerCase().includes(query) ||
          order.customer.toLowerCase().includes(query) ||
          order.store.toLowerCase().includes(query)
        )
        .forEach(order => {
          results.push({
            type: 'order',
            title: `Order ${order.id}`,
            description: `${order.customer} • ${order.store} • ${order.total}`,
            id: order.id,
            data: order,
          });
        });
    }

    console.log('Search results:', results);
    return results.slice(0, 8); // Limit to 8 results
  }, [searchQuery, location.pathname]);

  const hasResults = searchResults.length > 0;

  console.log('useDashboardSearch hook state:', { searchQuery, hasResults, resultsCount: searchResults.length });

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    hasResults,
  };
};
