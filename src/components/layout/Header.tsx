import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Search, User, Settings, LogOut, UserCircle, Clock, X, CheckCircle, AlertCircle, Info, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useGlobalSearch, globalSearchData } from '@/hooks/useGlobalSearch';
import { SearchResults } from '@/components/dashboard/SearchResults';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isHidden?: boolean;
}

export const Header = ({ onToggleSidebar, isHidden = false }: HeaderProps) => {
  const { logout, userProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const isOrderHistory = location.pathname === '/orders/history';
  
  // Global search functionality that works across all pages
  const { searchQuery, setSearchQuery, searchResults, hasResults } = useGlobalSearch();
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Separate state for mobile search to avoid conflicts
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [mobileSearchResults, setMobileSearchResults] = useState<any[]>([]);
  
  const [notificationPopoverOpen, setNotificationPopoverOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      title: 'Refund Processed',
      message: 'Successfully refunded $10.00 for order #67899886 at Brother Fox', 
      time: '2 min ago', 
      unread: true, 
      type: 'success' 
    },
    { 
      id: 2, 
      title: 'Menu Update',
      message: 'Menu item "Grilled Salmon" updated at Sister Hen', 
      time: '1 hour ago', 
      unread: false, 
      type: 'info' 
    },
    { 
      id: 3, 
      title: 'Report Available',
      message: 'Daily sales report for Lily Hall is now available', 
      time: '3 hours ago', 
      unread: false, 
      type: 'info' 
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleSearchResultClick = (result: any) => {
    console.log('Search result clicked:', result);
    setShowSearchResults(false);
    setSearchQuery('');
    
    // Navigate to the appropriate page if specified
    if (result.page && result.page !== location.pathname) {
      navigate(result.page);
    }
    
    // Handle different result types with enhanced navigation and toasts
    switch (result.type) {
      case 'order':
        toast({
          title: "Order Found",
          description: `Order ${result.data.id} - ${result.data.customer}`,
        });
        break;
      case 'store':
        toast({
          title: "Store Found",
          description: `${result.data.name} - ${result.data.orders} active orders`,
        });
        break;
      case 'revenue':
        toast({
          title: "Revenue Data",
          description: `${result.title}: $${result.data.value}`,
        });
        break;
      case 'menu-item':
        toast({
          title: "Menu Item Found",
          description: `${result.title} - ${result.data.orders} orders`,
        });
        break;
      case 'inventory':
        toast({
          title: "Inventory Item",
          description: `${result.title} - ${result.data.urgency} urgency`,
        });
        break;
      case 'employee':
        toast({
          title: "Employee Found",
          description: `${result.data.name} - ${result.data.role}`,
        });
        break;
      case 'promotion':
        toast({
          title: "Promotion Found",
          description: `${result.data.name} - ${result.data.discount} discount`,
        });
        break;
      case 'setting':
        toast({
          title: "Setting Found",
          description: result.data.description,
        });
        break;
      case 'report':
        toast({
          title: "Report Found",
          description: result.data.description,
        });
        break;
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('Header search input changed to:', value, 'Current searchQuery:', searchQuery);
    setSearchQuery(value);
    setShowSearchResults(value.trim().length > 0);
  };

  const handleSearchFocus = () => {
    console.log('Header search focused, current query:', searchQuery);
    if (searchQuery.trim().length > 0) {
      setShowSearchResults(true);
    }
  };

  const handleSearchBlur = () => {
    console.log('Header search blurred');
    // Delay hiding to allow for clicks on results
    setTimeout(() => {
      setShowSearchResults(false);
    }, 200);
  };

  // Mobile search functionality - uses global search data
  const handleMobileSearch = (query: string) => {
    console.log('Mobile search query:', query);
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
      .filter(store => store.name.toLowerCase().includes(queryLower))
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

    // Orders
    globalSearchData.orders
      .filter(order => 
        order.id.toLowerCase().includes(queryLower) ||
        order.customer.toLowerCase().includes(queryLower) ||
        order.store.toLowerCase().includes(queryLower)
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

    // Menu items
    globalSearchData.menuItems
      .filter(item => 
        item.name.toLowerCase().includes(queryLower) ||
        item.category.toLowerCase().includes(queryLower)
      )
      .forEach(item => {
        results.push({
          type: 'menu-item',
          title: item.name,
          description: `${item.category} • ${item.orders} orders`,
          id: item.id,
          data: item,
          page: item.page,
        });
      });

    // Employees
    globalSearchData.employees
      .filter(employee => 
        employee.name.toLowerCase().includes(queryLower) ||
        employee.role.toLowerCase().includes(queryLower)
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

    // Settings
    globalSearchData.settings
      .filter(setting => 
        setting.name.toLowerCase().includes(queryLower) ||
        setting.description.toLowerCase().includes(queryLower)
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

    console.log('Mobile search results:', results);
    setMobileSearchResults(results.slice(0, 6));
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
    console.log(`Marking notification ${id} as read`);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, unread: false }))
    );
    toast({
      title: "All notifications marked as read",
      description: "You're all caught up!",
    });
    console.log('Marking all notifications as read');
  };

  const handleClearAll = () => {
    setNotifications([]);
    setNotificationPopoverOpen(false);
    toast({
      title: "Notifications cleared",
      description: "All notifications have been removed",
    });
    console.log('Clearing all notifications');
  };

  const handleProfileAction = (action: string) => {
    if (action === 'profile') {
      navigate('/settings?tab=profile');
    } else if (action === 'settings') {
      navigate('/settings?tab=security');
    } else if (action === 'logout') {
      console.log('Logging out user...');
      // Thorough cleanup before logout
      cleanupAuthState();
      // Call the logout function from context
      logout();
      // Force page refresh to ensure complete cleanup
      window.location.href = '/login';
    }
  };

  // Comprehensive auth state cleanup function
  const cleanupAuthState = () => {
    // Remove all auth-related keys from localStorage
    const authKeys = ['isAuthenticated', 'userEmail', 'userProfile', 'loginTimestamp'];
    authKeys.forEach(key => localStorage.removeItem(key));
    
    // Remove any Supabase auth keys (if any exist from previous implementations)
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear sessionStorage as well
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-') || authKeys.includes(key)) {
        sessionStorage.removeItem(key);
      }
    });
    
    console.log('Auth state cleanup completed');
  };

  const handleViewAllNotifications = () => {
    navigate('/notifications');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationBg = (type: string, unread: boolean) => {
    if (!unread) return 'bg-gray-50';
    
    switch (type) {
      case 'success': return 'bg-green-50 border-l-4 border-l-green-500';
      case 'warning': return 'bg-yellow-50 border-l-4 border-l-yellow-500';
      case 'error': return 'bg-red-50 border-l-4 border-l-red-500';
      case 'info': return 'bg-blue-50 border-l-4 border-l-blue-500';
      default: return 'bg-blue-50 border-l-4 border-l-blue-500';
    }
  };

  const getSearchPlaceholder = () => {
    return "Search orders, menus, stores, employees...";
  };

  // Helper function to get user's full name
  const getFullName = () => {
    if (!userProfile) return 'User';
    return `${userProfile.firstName} ${userProfile.lastName}`;
  };

  // Helper function to get user's initials
  const getUserInitials = () => {
    if (!userProfile) return 'U';
    return `${userProfile.firstName.charAt(0)}${userProfile.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <header className={`bg-white border-b border-gray-200 px-2 sm:px-4 lg:px-6 py-2 sm:py-3 flex items-center justify-between shadow-sm w-full ${
      isHidden ? 'transform -translate-y-full opacity-0' : 'transform translate-y-0 opacity-100'
    } transition-all duration-300`}>
      <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
        {/* Hamburger button - properly sized for mobile touch */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleSidebar} 
          className="lg:hidden hover:bg-gray-100 w-10 h-10 sm:w-12 sm:h-12 p-2 sm:p-3 flex-shrink-0 touch-manipulation"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
        
        {/* Enhanced Search - responsive visibility with dashboard and order history functionality */}
        <div className="relative hidden md:block flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={getSearchPlaceholder()}
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-sm transition-all duration-200 hover:border-gray-400"
            onKeyDown={(e) => console.log('Key pressed:', e.key, 'Current value:', e.currentTarget.value)}
          />
          
          {/* Global Search Results - works on all pages */}
          {showSearchResults && hasResults && (
            <SearchResults
              results={searchResults}
              onResultClick={handleSearchResultClick}
              isVisible={true}
            />
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
        {/* Mobile search - simplified and always visible */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden hover:bg-gray-100 w-10 h-10 touch-manipulation bg-blue-50"
              onClick={() => console.log('Mobile search button clicked!')}
            >
              <Search className="w-5 h-5 text-blue-600" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[calc(100vw-2rem)] max-w-sm p-4 mx-4" align="end" side="bottom">
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-900 mb-2">Search</div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders, stores, menu items..."
                  value={mobileSearchQuery}
                  onChange={(e) => {
                    const value = e.target.value;
                    console.log('Mobile search input changed:', value);
                    handleMobileSearch(value);
                  }}
                  autoFocus
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-sm"
                />
              </div>
              
              {/* Mobile Search Results */}
              {mobileSearchResults.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                  {mobileSearchResults.map((result, index) => (
                    <div
                      key={result.id}
                      onClick={() => {
                        console.log('Mobile search result clicked:', result);
                        handleSearchResultClick(result);
                        setMobileSearchQuery('');
                        setMobileSearchResults([]);
                      }}
                      className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="text-sm font-medium text-gray-900">{result.title}</div>
                      <div className="text-xs text-gray-600 mt-1">{result.description}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {mobileSearchQuery.trim().length > 0 && mobileSearchResults.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No results found for "{mobileSearchQuery}"
                </div>
              )}
              
              {mobileSearchQuery.trim().length === 0 && (
                <div className="text-center py-3 text-gray-400 text-sm">
                  Start typing to search stores, orders, and menu items...
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Notifications - mobile optimized */}
        <Popover open={notificationPopoverOpen} onOpenChange={setNotificationPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 transition-colors w-9 h-9 sm:w-10 sm:h-10 touch-manipulation">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center p-0 shadow-lg">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[calc(100vw-1rem)] max-w-sm sm:max-w-md md:w-96 p-0 shadow-2xl border border-gray-200 bg-white rounded-xl overflow-hidden mr-2 sm:mr-4 z-50" align="end">
            {/* Enhanced Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">Notifications</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {unreadCount > 0 ? (
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        All caught up!
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg px-3 py-1.5 h-auto font-medium transition-colors"
                    >
                      Mark all read
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                     onClick={(e) => {
                       e.stopPropagation();
                       handleClearAll();
                     }}
                    className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg px-2 py-1.5 h-auto transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md ring-1 ring-black/5">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">No notifications</p>
                  <p className="text-gray-400 text-sm mt-1">We'll notify you when something important happens</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-5 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-all duration-200 group ${
                      getNotificationBg(notification.type, notification.unread)
                    }`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                          notification.unread ? 'bg-white ring-1 ring-black/5' : 'bg-gray-100'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h5 className={`text-sm font-semibold leading-tight ${
                              notification.unread ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h5>
                            <p className={`text-sm mt-1 leading-relaxed ${
                              notification.unread ? 'text-gray-700' : 'text-gray-600'
                            }`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center mt-3 text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1.5" />
                              {notification.time}
                            </div>
                          </div>
                          
                          {notification.unread && (
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleViewAllNotifications}
                  className="w-full text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg font-medium py-2"
                >
                  View all notifications
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* User Profile - mobile optimized */}
        <div className="flex items-center space-x-3 sm:space-x-4 ml-4 sm:ml-6">
          <div className="hidden sm:block text-right">
            <div className="text-sm font-medium text-gray-900 truncate max-w-16 sm:max-w-none">{getFullName()}</div>
            <div className="text-xs text-gray-500 hidden lg:block">Manager • Online</div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-xl hover:bg-gray-100 transition-colors touch-manipulation p-0">
                <Avatar className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl shadow-md ring-1 ring-black/5">
                  <AvatarImage src={userProfile?.avatar || ""} alt={getFullName()} className="rounded-xl" />
                  <AvatarFallback className="bg-primary text-white font-semibold text-xs sm:text-sm rounded-xl">{getUserInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 shadow-lg border-0 mr-2 sm:mr-4 z-50" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 rounded-xl shadow-md ring-1 ring-black/5">
                      <AvatarImage src={userProfile?.avatar || ""} alt={getFullName()} className="rounded-xl" />
                      <AvatarFallback className="bg-primary text-white font-semibold rounded-xl">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium leading-none text-gray-900">{getFullName()}</p>
                      <p className="text-xs leading-none text-gray-500 mt-1">{userProfile?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 bg-green-50 rounded-md">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-700 font-medium">Online</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleProfileAction('profile')}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <UserCircle className="mr-3 h-4 w-4 text-gray-500" />
                <div className="flex flex-col">
                  <span className="text-sm">Profile</span>
                  <span className="text-xs text-gray-500">Manage your account</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleProfileAction('settings')}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <Settings className="mr-3 h-4 w-4 text-gray-500" />
                <div className="flex flex-col">
                  <span className="text-sm">Settings</span>
                  <span className="text-xs text-gray-500">Preferences & privacy</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleProfileAction('logout')}
                className="cursor-pointer hover:bg-red-50 transition-colors text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span className="text-sm">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
