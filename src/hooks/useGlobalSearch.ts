import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

interface SearchResult {
  type: 'store' | 'revenue' | 'menu-item' | 'inventory' | 'order' | 'employee' | 'promotion' | 'setting' | 'report';
  title: string;
  description: string;
  id: string;
  data: any;
  page?: string; // Which page this result navigates to
}

// Global sample data that can be searched from any page
export const globalSearchData = {
  stores: [
    { id: 'piazza', name: 'Piazza', orders: 45, page: '/stores' },
    { id: 'red-fish', name: 'Red Fish Blue Fish', orders: 32, page: '/stores' },
    { id: 'sal-de-mar', name: 'Sal De Mar', orders: 28, page: '/stores' },
  ],
  orders: [
    {
      id: '#67899886',
      store: 'Piazza',
      customer: 'Lucie Morgan',
      type: 'Pickup',
      total: '$76.45',
      date: 'May 7, 2021 11:50AM',
      status: 'Completed',
      page: '/orders/history'
    },
    {
      id: '#67899887',
      store: 'Red Fish Blue Fish',
      customer: 'Adam Smith',
      type: 'Delivery',
      total: '$42.95',
      date: 'May 7, 2021 11:50AM',
      status: 'Canceled',
      page: '/orders/history'
    },
    {
      id: '#67899888',
      store: 'Sal De Mar',
      customer: 'John Cordoba',
      type: 'Delivery',
      total: '$28.47',
      date: 'May 7, 2021 11:50AM',
      status: 'Completed',
      page: '/orders/history'
    },
  ],
  menuItems: [
    { id: 'pizza', name: 'Pizza Margherita', orders: 120, category: 'Main Course', page: '/menu' },
    { id: 'tacos', name: 'Fish Tacos', orders: 85, category: 'Main Course', page: '/menu' },
    { id: 'paella', name: 'Seafood Paella', orders: 67, category: 'Main Course', page: '/menu' },
    { id: 'burger', name: 'Crispy Burger', orders: 95, category: 'Main Course', page: '/menu' },
  ],
  inventory: [
    { id: 'tomatoes', name: 'Fresh Tomatoes', urgency: 'high', stock: 12, page: '/dashboard' },
    { id: 'fish', name: 'Fresh Fish', urgency: 'medium', stock: 45, page: '/dashboard' },
    { id: 'rice', name: 'Arborio Rice', urgency: 'low', stock: 78, page: '/dashboard' },
  ],
  employees: [
    { id: 'john-doe', name: 'John Doe', role: 'Manager', store: 'Piazza', page: '/employees' },
    { id: 'jane-smith', name: 'Jane Smith', role: 'Chef', store: 'Red Fish Blue Fish', page: '/employees' },
    { id: 'mike-johnson', name: 'Mike Johnson', role: 'Server', store: 'Sal De Mar', page: '/employees' },
  ],
  promotions: [
    { id: 'summer-deal', name: 'Summer Special', discount: '20%', status: 'Active', page: '/promotions' },
    { id: 'happy-hour', name: 'Happy Hour', discount: '15%', status: 'Scheduled', page: '/promotions' },
  ],
  revenue: [
    { id: 'daily', name: 'Daily Revenue', value: 2450, page: '/reports' },
    { id: 'weekly', name: 'Weekly Revenue', value: 15680, page: '/reports' },
    { id: 'monthly', name: 'Monthly Revenue', value: 68900, page: '/reports' },
  ],
  settings: [
    { id: 'profile', name: 'Profile Settings', description: 'Manage your account profile', page: '/settings?tab=profile' },
    { id: 'security', name: 'Security Settings', description: 'Manage passwords and security', page: '/settings?tab=security' },
    { id: 'notifications', name: 'Notification Settings', description: 'Configure notifications', page: '/notifications' },
  ],
  reports: [
    { id: 'sales-report', name: 'Sales Report', description: 'Daily sales analytics', page: '/reports' },
    { id: 'inventory-report', name: 'Inventory Report', description: 'Stock levels and alerts', page: '/reports' },
    { id: 'performance-report', name: 'Performance Report', description: 'Store and staff performance', page: '/reports' },
  ]
};

export const useGlobalSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  // Create search results from global data
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    console.log('Global search with query:', query, 'on page:', location.pathname);

    // Search stores
    globalSearchData.stores
      .filter(store => store.name.toLowerCase().includes(query))
      .forEach(store => {
        results.push({
          type: 'store',
          title: store.name,
          description: `${store.orders} active orders`,
          id: store.id,
          data: store,
          page: store.page,
        });
      });

    // Search orders
    globalSearchData.orders
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
          page: order.page,
        });
      });

    // Search menu items
    globalSearchData.menuItems
      .filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      )
      .forEach(item => {
        results.push({
          type: 'menu-item',
          title: item.name,
          description: `${item.category} • ${item.orders} orders this month`,
          id: item.id,
          data: item,
          page: item.page,
        });
      });

    // Search inventory
    globalSearchData.inventory
      .filter(item => item.name.toLowerCase().includes(query))
      .forEach(item => {
        results.push({
          type: 'inventory',
          title: item.name,
          description: `${item.urgency} priority • ${item.stock} in stock`,
          id: item.id,
          data: item,
          page: item.page,
        });
      });

    // Search employees
    globalSearchData.employees
      .filter(employee => 
        employee.name.toLowerCase().includes(query) ||
        employee.role.toLowerCase().includes(query) ||
        employee.store.toLowerCase().includes(query)
      )
      .forEach(employee => {
        results.push({
          type: 'employee',
          title: employee.name,
          description: `${employee.role} at ${employee.store}`,
          id: employee.id,
          data: employee,
          page: employee.page,
        });
      });

    // Search promotions
    globalSearchData.promotions
      .filter(promo => 
        promo.name.toLowerCase().includes(query) ||
        promo.status.toLowerCase().includes(query)
      )
      .forEach(promo => {
        results.push({
          type: 'promotion',
          title: promo.name,
          description: `${promo.discount} discount • ${promo.status}`,
          id: promo.id,
          data: promo,
          page: promo.page,
        });
      });

    // Search revenue/reports
    globalSearchData.revenue
      .filter(revenue => revenue.name.toLowerCase().includes(query))
      .forEach(revenue => {
        results.push({
          type: 'revenue',
          title: revenue.name,
          description: `$${revenue.value.toLocaleString()}`,
          id: revenue.id,
          data: revenue,
          page: revenue.page,
        });
      });

    // Search settings
    globalSearchData.settings
      .filter(setting => 
        setting.name.toLowerCase().includes(query) ||
        setting.description.toLowerCase().includes(query)
      )
      .forEach(setting => {
        results.push({
          type: 'setting',
          title: setting.name,
          description: setting.description,
          id: setting.id,
          data: setting,
          page: setting.page,
        });
      });

    // Search reports
    globalSearchData.reports
      .filter(report => 
        report.name.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query)
      )
      .forEach(report => {
        results.push({
          type: 'report',
          title: report.name,
          description: report.description,
          id: report.id,
          data: report,
          page: report.page,
        });
      });

    console.log('Global search results:', results);
    return results.slice(0, 8); // Limit to 8 results
  }, [searchQuery, location.pathname]);

  const hasResults = searchResults.length > 0;

  console.log('useGlobalSearch hook state:', { searchQuery, hasResults, resultsCount: searchResults.length });

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    hasResults,
  };
};