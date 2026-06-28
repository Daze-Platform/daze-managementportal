import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useGlobalSearch, globalSearchData } from "@/hooks/useGlobalSearch";
import { SearchResults } from "@/components/dashboard/SearchResults";
import {
  ProfileDropdown,
  NotificationsPanel,
  SearchInput,
} from "./HeaderSubcomponents";

interface HeaderProps {
  onToggleSidebar?: () => void;
  isHidden?: boolean;
}

export const Header = ({ onToggleSidebar, isHidden = false }: HeaderProps) => {
  const { logout, userProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const isOrderHistory = location.pathname === "/orders/history";

  // Global search functionality that works across all pages
  const { searchQuery, setSearchQuery, searchResults, hasResults } =
    useGlobalSearch();
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Separate state for mobile search to avoid conflicts
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [mobileSearchResults, setMobileSearchResults] = useState<any[]>([]);

  const [notificationPopoverOpen, setNotificationPopoverOpen] = useState(false);
  const [notifications, setNotifications] = useState<Array<{
    id: number;
    title: string;
    message: string;
    time: string;
    unread: boolean;
    type: "success" | "warning" | "info" | "error";
    route: string;
  }>>([
    {
      id: 1,
      title: "Refund Processed",
      message:
        "Successfully refunded $10.00 for order #67899886 at Windrose Restaurant",
      time: "2 min ago",
      unread: true,
      type: "success",
      route: "/orders/history",
    },
    {
      id: 2,
      title: "Menu Update",
      message: 'Menu item "Grilled Salmon" updated at Tiki Bar',
      time: "1 hour ago",
      unread: false,
      type: "info",
      route: "/menus",
    },
    {
      id: 3,
      title: "Report Available",
      message: "Daily sales report for Pensacola Beach Resort is now available",
      time: "3 hours ago",
      unread: false,
      type: "info",
      route: "/reports",
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleSearchResultClick = (result: any) => {
    setShowSearchResults(false);
    setSearchQuery("");

    // Navigate to the appropriate page if specified
    if (result.page && result.page !== location.pathname) {
      navigate(result.page);
    }

    // Handle different result types with enhanced navigation and toasts
    switch (result.type) {
      case "order":
        toast({
          title: "Order Found",
          description: `Order ${result.data.id} - ${result.data.customer}`,
        });
        break;
      case "store":
        toast({
          title: "Store Found",
          description: `${result.data.name} - ${result.data.orders} active orders`,
        });
        break;
      case "revenue":
        toast({
          title: "Revenue Data",
          description: `${result.title}: $${result.data.value}`,
        });
        break;
      case "menu-item":
        toast({
          title: "Menu Item Found",
          description: `${result.title} - ${result.data.orders} orders`,
        });
        break;
      case "inventory":
        toast({
          title: "Inventory Item",
          description: `${result.title} - ${result.data.urgency} urgency`,
        });
        break;
      case "employee":
        toast({
          title: "Employee Found",
          description: `${result.data.name} - ${result.data.role}`,
        });
        break;
      case "promotion":
        toast({
          title: "Promotion Found",
          description: `${result.data.name} - ${result.data.discount} discount`,
        });
        break;
      case "setting":
        toast({
          title: "Setting Found",
          description: result.data.description,
        });
        break;
      case "report":
        toast({
          title: "Report Found",
          description: result.data.description,
        });
        break;
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowSearchResults(value.trim().length > 0);
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim().length > 0) {
      setShowSearchResults(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding to allow for clicks on results
    setTimeout(() => {
      setShowSearchResults(false);
    }, 200);
  };

  // Mobile search functionality - uses global search data
  const handleMobileSearch = (query: string) => {
    setMobileSearchQuery(query);

    if (!query.trim()) {
      setMobileSearchResults([]);
      return;
    }

    // Use the same global search logic for mobile
    const queryLower = query.toLowerCase();
    const results: any[] = [];

    // Search through all global search data categories
    // Stores
    globalSearchData.stores
      .filter((store) => store.name.toLowerCase().includes(queryLower))
      .forEach((store) => {
        results.push({
          type: "store",
          title: store.name,
          description: `${store.orders} active orders`,
          id: store.id,
          data: store,
          page: store.page,
        });
      });

    // Orders
    globalSearchData.orders
      .filter(
        (order) =>
          order.id.toLowerCase().includes(queryLower) ||
          order.customer.toLowerCase().includes(queryLower) ||
          order.store.toLowerCase().includes(queryLower),
      )
      .forEach((order) => {
        results.push({
          type: "order",
          title: `Order ${order.id}`,
          description: `${order.customer} • ${order.store} • ${order.total}`,
          id: order.id,
          data: order,
          page: order.page,
        });
      });

    // Menu items
    globalSearchData.menuItems
      .filter(
        (item) =>
          item.name.toLowerCase().includes(queryLower) ||
          item.category.toLowerCase().includes(queryLower),
      )
      .forEach((item) => {
        results.push({
          type: "menu-item",
          title: item.name,
          description: `${item.category} • ${item.orders} orders`,
          id: item.id,
          data: item,
          page: item.page,
        });
      });

    // Employees
    globalSearchData.employees
      .filter(
        (employee) =>
          employee.name.toLowerCase().includes(queryLower) ||
          employee.role.toLowerCase().includes(queryLower),
      )
      .forEach((employee) => {
        results.push({
          type: "employee",
          title: employee.name,
          description: `${employee.role} at ${employee.store}`,
          id: employee.id,
          data: employee,
          page: employee.page,
        });
      });

    // Settings
    globalSearchData.settings
      .filter(
        (setting) =>
          setting.name.toLowerCase().includes(queryLower) ||
          setting.description.toLowerCase().includes(queryLower),
      )
      .forEach((setting) => {
        results.push({
          type: "setting",
          title: setting.name,
          description: setting.description,
          id: setting.id,
          data: setting,
          page: setting.page,
        });
      });

    setMobileSearchResults(results.slice(0, 6));
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, unread: false } : notif,
      ),
    );
  };

  // Helper function to get human-readable route labels
  const getRouteLabel = (route: string): string => {
    const routeLabels: Record<string, string> = {
      "/orders/history": "Order History",
      "/orders/active": "Active Orders",
      "/menus": "Menu Management",
      "/reports": "Reports",
      "/venues": "Venues",
      "/employees": "Employees",
      "/ratings": "Ratings",
      "/promotions": "Promotions",
      "/settings": "Settings",
    };
    return routeLabels[route] || route;
  };

  const handleNotificationClick = (notification: {
    id: number;
    title: string;
    route: string;
  }) => {
    // Mark as read
    handleMarkAsRead(notification.id);

    // Close the popover
    setNotificationPopoverOpen(false);

    // Navigate to the route
    if (notification.route) {
      navigate(notification.route);

      toast({
        title: notification.title,
        description: `Navigating to ${getRouteLabel(notification.route)}`,
      });
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, unread: false })),
    );
    toast({
      title: "All notifications marked as read",
      description: "You're all caught up!",
    });
  };

  const handleClearAll = () => {
    setNotifications([]);
    setNotificationPopoverOpen(false);
    toast({
      title: "Notifications cleared",
      description: "All notifications have been removed",
    });
  };

  const handleProfileAction = (action: string) => {
    if (action === "profile") {
      navigate("/settings?tab=profile");
    } else if (action === "settings") {
      navigate("/settings?tab=security");
    } else if (action === "logout") {
      // Thorough cleanup before logout
      cleanupAuthState();
      // Call the logout function from context
      logout();
      // Force page refresh to ensure complete cleanup
      window.location.href = "/login";
    }
  };

  // Comprehensive auth state cleanup function
  const cleanupAuthState = () => {
    // Remove all auth-related keys from localStorage
    const authKeys = [
      "isAuthenticated",
      "userEmail",
      "userProfile",
      "loginTimestamp",
    ];
    authKeys.forEach((key) => localStorage.removeItem(key));

    // Remove any Supabase auth keys (if any exist from previous implementations)
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
        localStorage.removeItem(key);
      }
    });

    // Clear sessionStorage as well
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (
        key.startsWith("supabase.auth.") ||
        key.includes("sb-") ||
        authKeys.includes(key)
      ) {
        sessionStorage.removeItem(key);
      }
    });

  };

  const handleViewAllNotifications = () => {
    setNotificationPopoverOpen(false); // Close the popover
    navigate("/notifications");
  };


  return (
    <header
      className={`bg-white border-b border-gray-200 px-2 sm:px-4 lg:px-6 py-2 sm:py-3 flex items-center justify-between shadow-sm w-full ${
        isHidden
          ? "transform -translate-y-full opacity-0"
          : "transform translate-y-0 opacity-100"
      } transition-all duration-300`}
    >
      <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
        {/* Hamburger button - properly sized for mobile touch */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="lg:hidden hover:bg-gray-100 w-10 h-10 sm:w-12 sm:h-12 p-2 sm:p-3 flex-shrink-0 touch-manipulation"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>

        {/* Enhanced Search - responsive visibility with dashboard and order history functionality */}
        <SearchInput
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchFocus={handleSearchFocus}
          onSearchBlur={handleSearchBlur}
          placeholder="Search orders, menus, stores, employees..."
        />

        {/* Notifications - mobile optimized */}
        <Popover
          open={notificationPopoverOpen}
          onOpenChange={setNotificationPopoverOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-gray-100 transition-colors w-9 h-9 sm:w-10 sm:h-10 touch-manipulation"
              aria-label="Open notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center p-0 shadow-lg">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-4 shadow-2xl border border-gray-200 bg-white rounded-xl mr-2 sm:mr-4 z-50" align="end">
            <NotificationsPanel
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAsRead={handleMarkAsRead}
              onNotificationClick={handleNotificationClick}
              onMarkAllAsRead={handleMarkAllAsRead}
              onClearAll={handleClearAll}
              onViewAll={handleViewAllNotifications}
            />
          </PopoverContent>
        </Popover>

        {/* User Profile - mobile optimized */}
        <div className="ml-4 sm:ml-6">
          <ProfileDropdown userProfile={userProfile} onProfileAction={handleProfileAction} />
        </div>
      </div>
    </header>
  );
};
