
import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

interface SearchResult {
  type: 'store' | 'revenue' | 'menu-item' | 'inventory' | 'order';
  title: string;
  description: string;
  id: string;
  data: any;
}

// Sample order history data for search
const orderHistoryData = [
  {
    id: '#67899886',
    store: 'Piazza',
    customer: 'Lucie Morgan',
    type: 'Pickup',
    total: '$76.45',
    date: 'May 7, 2021 11:50AM',
    status: 'Completed',
  },
  {
    id: '#67899887',
    store: 'Red Fish Blue Fish',
    customer: 'Adam Smith',
    type: 'Delivery',
    total: '$42.95',
    date: 'May 7, 2021 11:50AM',
    status: 'Canceled',
  },
  {
    id: '#67899888',
    store: 'Sal De Mar',
    customer: 'John Cordoba',
    type: 'Delivery',
    total: '$28.47',
    date: 'May 7, 2021 11:50AM',
    status: 'Completed',
  },
  {
    id: '#67899889',
    store: 'Sal De Mar',
    customer: 'John Cordoba',
    type: 'Delivery',
    total: '$91.23',
    date: 'May 7, 2021 11:50AM',
    status: 'Completed',
  },
];

export const useDashboardSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  // Sample data for dashboard search
  const sampleData = {
    stores: [
      { id: 'piazza', name: 'Piazza', orders: 45 },
      { id: 'red-fish', name: 'Red Fish Blue Fish', orders: 32 },
      { id: 'sal-de-mar', name: 'Sal De Mar', orders: 28 },
    ],
    revenue: [
      { id: 'daily', name: 'Daily Revenue', value: 2450 },
      { id: 'weekly', name: 'Weekly Revenue', value: 15680 },
      { id: 'monthly', name: 'Monthly Revenue', value: 68900 },
    ],
    menuItems: [
      { id: 'pizza', name: 'Pizza Margherita', orders: 120 },
      { id: 'tacos', name: 'Fish Tacos', orders: 85 },
      { id: 'paella', name: 'Seafood Paella', orders: 67 },
    ],
    inventory: [
      { id: 'tomatoes', name: 'Fresh Tomatoes', urgency: 'high' },
      { id: 'fish', name: 'Fresh Fish', urgency: 'medium' },
      { id: 'rice', name: 'Arborio Rice', urgency: 'low' },
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
