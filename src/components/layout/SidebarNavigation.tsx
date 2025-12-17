
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Settings,
  Bell,
  Utensils,
  Store,
  FileText,
  DollarSign,
  Users,
  Star,
  Gift
} from 'lucide-react';
import { useOrderManagement } from '@/hooks/useOrderManagement';
import { SidebarMenuItem } from './SidebarMenuItem';

const menuItems = [
  { 
    name: 'Dashboard', 
    path: '/dashboard', 
    icon: LayoutDashboard,
    iconClass: 'w-4 h-4 sm:w-5 sm:h-5'
  },
  { 
    name: 'Stores', 
    path: '/stores', 
    icon: Store,
    iconClass: 'w-4 h-4 sm:w-5 sm:h-5'
  },
  { 
    name: 'Orders', 
    path: '/orders', 
    icon: Bell,
    iconClass: 'w-4 h-4 sm:w-5 sm:h-5',
    hasSubmenu: true,
    submenu: [
      { name: 'Active orders', path: '/orders/active' },
      { name: 'Order history', path: '/orders/history' }
    ]
  },
  { 
    name: 'Menus', 
    path: '/menus', 
    icon: Utensils,
    iconClass: 'w-4 h-4 sm:w-5 sm:h-5'
  },
  { 
    name: 'Reports', 
    path: '/reports', 
    icon: FileText,
    iconClass: 'w-4 h-4 sm:w-5 sm:h-5'
  },
  { 
    name: 'Payouts', 
    path: '/financials', 
    icon: DollarSign,
    iconClass: 'w-4 h-4 sm:w-5 sm:h-5'
  },
  { 
    name: 'Employees', 
    path: '/employees', 
    icon: Users,
    iconClass: 'w-4 h-4 sm:w-5 sm:h-5'
  },
  { 
    name: 'Ratings', 
    path: '/ratings', 
    icon: Star,
    iconClass: 'w-4 h-4 sm:w-5 sm:h-5'
  },
  { 
    name: 'Promotions', 
    path: '/promotions', 
    icon: Gift,
    iconClass: 'w-4 h-4 sm:w-5 sm:h-5'
  },
  { 
    name: 'Settings', 
    path: '/settings', 
    icon: Settings,
    iconClass: 'w-4 h-4 sm:w-5 sm:h-5'
  }
];

interface SidebarNavigationProps {
  expandedItems: string[];
  onToggleSubmenu: (itemName: string) => void;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const SidebarNavigation = ({ expandedItems, onToggleSubmenu, onClose, isCollapsed = false, onToggleCollapse }: SidebarNavigationProps) => {
  const location = useLocation();
  const { getOrderTypeCount, storeStatus, orderStatus } = useOrderManagement();

  // Calculate total active orders (new + progress + ready + fulfillment)
  const totalActiveOrders = getOrderTypeCount('new') + getOrderTypeCount('progress') + getOrderTypeCount('ready') + getOrderTypeCount('fulfillment');
  
  // Badges should only show when:
  // 1. Store is open (storeStatus === 'open')
  // 2. Orders are active (orderStatus === 'active') 
  // 3. There are actually orders to show (totalActiveOrders > 0)
  const shouldShowBadges = storeStatus === 'open' && orderStatus === 'active' && totalActiveOrders > 0;

  console.log('SidebarNavigation badge logic:', {
    totalActiveOrders,
    storeStatus,
    orderStatus,
    shouldShowBadges,
    newOrders: getOrderTypeCount('new'),
    progressOrders: getOrderTypeCount('progress'),
    readyOrders: getOrderTypeCount('ready'),
    fulfillmentOrders: getOrderTypeCount('fulfillment')
  });

  return (
    <nav className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-5 py-4 sm:py-5 md:py-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
      <ul className="space-y-1 sm:space-y-1.5">
        {menuItems.map((item) => (
          <SidebarMenuItem
            key={item.name}
            item={item}
            isExpanded={expandedItems.includes(item.name)}
            onToggleSubmenu={onToggleSubmenu}
            onClose={onClose}
            totalActiveOrders={totalActiveOrders}
            shouldShowBadges={shouldShowBadges}
            currentPath={location.pathname}
            isCollapsed={isCollapsed}
            onToggleCollapse={onToggleCollapse}
          />
        ))}
      </ul>
    </nav>
  );
};
