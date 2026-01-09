
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefundDialog } from '@/components/orders/RefundDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useToast } from '@/hooks/use-toast';
import { useStores } from '@/contexts/StoresContext';
import { useFilters } from '@/contexts/FilterContext';
import { format } from 'date-fns';
import { useResort } from '@/contexts/DestinationContext';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { ChevronDown, ChevronRight, DollarSign, ChevronLeft, ChevronRight as ChevronRightIcon, Calendar, Clock, MapPin, User, Receipt, Filter, Truck, Utensils, Store, CheckCircle, XCircle } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  store: { name: string; logo: string; bgColor: string; customLogo?: string };
  customer: string;
  type: string;
  total: string;
  date: string;
  status: string;
  items: OrderItem[];
  refundStatus?: 'none' | 'partial' | 'full';
  refundAmount?: string;
}

export const OrderHistory = () => {
  const { stores: allStores, getStoresByResort } = useStores();
  const { currentResort } = useResort();
  const { scrollDirection, isAtTop } = useScrollDirection();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('last7days');
  const [itemsPerPage, setItemsPerPage] = useState<string>('10');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { toast } = useToast();

  // Get all stores regardless of resort assignment and remove duplicates
  // This ensures all stores are available in dropdowns without duplicates
  const availableStores = allStores.filter((store, index, self) => 
    index === self.findIndex(s => s.id === store.id)
  );

  // Transform stores to match dropdown format
  const stores = [
    { id: 'all', name: 'All venues' },
    ...availableStores.map(store => ({
      id: store.id.toString(),
      name: store.name
    }))
  ];

  // Create filtered orders based on selected store
  const filteredOrders = React.useMemo(() => {
    const allOrdersData = [
      {
        id: '#67899886',
        storeId: '1', // Brother Fox ID
        store: { 
          name: 'Brother Fox', 
          logo: '🦊', 
          bgColor: 'bg-gradient-to-br from-amber-700 to-amber-800',
          customLogo: '/images/stores/brother-fox-logo.jpg'
        },
        customer: 'Lucie Morgan',
        type: 'Pickup',
        total: '$76.45',
        date: 'May 7, 2021 11:50AM',
        status: 'Completed',
        refundStatus: 'partial' as const,
        refundAmount: '$24.99',
        items: [
          { id: '1', name: 'Wood-Fired Oysters', price: 24.99, quantity: 2 },
          { id: '2', name: 'Seasonal Vegetable Platter', price: 8.99, quantity: 1 },
          { id: '3', name: 'Craft Lemonade', price: 3.99, quantity: 3 }
        ]
      },
      {
        id: '#67899887',
        storeId: '2', // Sister Hen ID
        store: { 
          name: 'Sister Hen', 
          logo: '🐔', 
          bgColor: 'bg-gradient-to-br from-purple-800 to-purple-900',
          customLogo: '/images/stores/sister-hen-logo.jpg'
        },
        customer: 'Adam Smith',
        type: 'Delivery',
        total: '$42.95',
        date: 'May 7, 2021 11:50AM',
        status: 'Canceled',
        items: [
          { id: '4', name: 'Signature Cocktail', price: 12.99, quantity: 2 },
          { id: '5', name: 'Charcuterie Board', price: 8.49, quantity: 2 }
        ]
      },
      {
        id: '#67899888',
        storeId: '3', // Cousin Wolf ID
        store: { 
          name: 'Cousin Wolf', 
          logo: '🐺', 
          bgColor: 'bg-gradient-to-br from-emerald-700 to-emerald-800',
          customLogo: '/images/stores/cousin-wolf-logo.webp'
        },
        customer: 'John Cordoba',
        type: 'Delivery',
        total: '$28.47',
        date: 'May 7, 2021 11:50AM',
        status: 'Completed',
        items: [
          { id: '6', name: 'Breakfast Burrito', price: 6.99, quantity: 2 },
          { id: '7', name: 'Fresh Squeezed OJ', price: 4.99, quantity: 1 },
          { id: '8', name: 'Coffee', price: 5.25, quantity: 2 }
        ]
      },
      {
        id: '#67899889',
        storeId: '1', // Brother Fox ID
        store: { 
          name: 'Brother Fox', 
          logo: '🦊', 
          bgColor: 'bg-gradient-to-br from-amber-700 to-amber-800',
          customLogo: '/images/stores/brother-fox-logo.jpg'
        },
        customer: 'John Cordoba',
        type: 'Delivery',
        total: '$91.23',
        date: 'May 7, 2021 11:50AM',
        status: 'Completed',
        items: [
          { id: '9', name: 'Charbroiled Octopus', price: 32.50, quantity: 2 },
          { id: '10', name: 'Artisan Bread & Olive Oil', price: 13.11, quantity: 2 }
        ]
      },
      {
        id: '#67899890',
        storeId: '2', // Sister Hen ID
        store: { 
          name: 'Sister Hen', 
          logo: '🐔', 
          bgColor: 'bg-gradient-to-br from-purple-800 to-purple-900',
          customLogo: '/images/stores/sister-hen-logo.jpg'
        },
        customer: 'Sarah Johnson',
        type: 'Pickup',
        total: '$54.32',
        date: 'May 6, 2021 2:30PM',
        status: 'Completed',
        refundStatus: 'full' as const,
        refundAmount: '$54.32',
        items: [
          { id: '11', name: 'Old Fashioned', price: 18.99, quantity: 1 },
          { id: '12', name: 'Deviled Eggs', price: 12.99, quantity: 1 },
          { id: '13', name: 'Bourbon Flight', price: 8.99, quantity: 2 },
          { id: '14', name: 'Sparkling Water', price: 4.99, quantity: 3 }
        ]
      },
      {
        id: '#67899891',
        storeId: '3', // Cousin Wolf ID
        store: { 
          name: 'Cousin Wolf', 
          logo: '🐺', 
          bgColor: 'bg-gradient-to-br from-emerald-700 to-emerald-800',
          customLogo: '/images/stores/cousin-wolf-logo.webp'
        },
        customer: 'Michael Chen',
        type: 'Delivery',
        total: '$67.84',
        date: 'May 6, 2021 1:15PM',
        status: 'Completed',
        items: [
          { id: '15', name: 'Avocado Toast', price: 16.99, quantity: 1 },
          { id: '16', name: 'Southern Breakfast Plate', price: 24.99, quantity: 1 },
          { id: '17', name: 'Hash Browns', price: 7.99, quantity: 2 },
          { id: '18', name: 'Beignets', price: 6.99, quantity: 2 }
        ]
      },
      {
        id: '#67899892',
        storeId: '1', // Brother Fox ID
        store: { 
          name: 'Brother Fox', 
          logo: '🦊', 
          bgColor: 'bg-gradient-to-br from-amber-700 to-amber-800',
          customLogo: '/images/stores/brother-fox-logo.jpg'
        },
        customer: 'Emma Rodriguez',
        type: 'Pickup',
        total: '$39.75',
        date: 'May 5, 2021 7:45PM',
        status: 'Completed',
        items: [
          { id: '19', name: 'Grilled Salmon', price: 14.99, quantity: 2 },
          { id: '20', name: 'Charred Shrimp', price: 9.99, quantity: 1 }
        ]
      }
    ];

    // Filter orders by selected store and status
    let result = allOrdersData;

    if (selectedStore !== 'all') {
      console.log(`OrderHistory: Filtering orders for store ID "${selectedStore}"`);
      result = result.filter(order => order.storeId === selectedStore);
      console.log(`OrderHistory: Found ${result.length} orders for store "${selectedStore}"`);
    } else {
      console.log('OrderHistory: Showing all orders');
    }

    if (selectedStatus !== 'all') {
      switch (selectedStatus) {
        case 'completed':
          result = result.filter(o => o.status === 'Completed');
          break;
        case 'canceled':
          result = result.filter(o => o.status === 'Canceled');
          break;
        case 'refunded':
          result = result.filter(o => (o as any).refundStatus && (o as any).refundStatus !== 'none');
          break;
      }
      console.log(`OrderHistory: Applied status filter "${selectedStatus}" → ${result.length} orders`);
    }

    return result;
  }, [selectedStore, selectedStatus]);
  
  const orders = filteredOrders;

  const handleOrderClick = (order: Order) => {
    setExpandedOrder(expandedOrder === order.id ? null : order.id);
  };

  const handleRefundClick = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOrder(order);
    setIsRefundDialogOpen(true);
  };

  const handleRefund = async (refundData: any) => {
    try {
      console.log('Processing refund:', refundData);
      
      toast({
        variant: "default",
        title: "✅ Refund Processed Successfully",
        description: `$${refundData.amount.toFixed(2)} has been refunded for order ${refundData.orderId}. Customer will receive funds within 3-5 business days.`,
      });
    } catch (error) {
      toast({
        title: "❌ Refund Failed",
        description: "There was an error processing the refund. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-100 font-semibold px-3 py-1.5 flex items-center gap-2 w-fit shadow-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Completed</span>
          </Badge>
        );
      case 'Canceled':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300 hover:bg-red-100 font-semibold px-3 py-1.5 flex items-center gap-2 w-fit shadow-sm">
            <XCircle className="w-4 h-4" />
            <span>Canceled</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="font-medium px-3 py-1.5 flex items-center gap-2 w-fit">
            <span>{status}</span>
          </Badge>
        );
    }
  };

  const getOrderTypeBadge = (type: string) => {
    if (type === 'Delivery') {
      return (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 font-medium px-3 py-1.5 flex items-center gap-2 w-fit">
          <Utensils className="w-3.5 h-3.5" />
          <span>Delivery</span>
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 font-medium px-3 py-1.5 flex items-center gap-2 w-fit">
          <Store className="w-3.5 h-3.5" />
          <span>Pickup</span>
        </Badge>
      );
    }
  };

  const getRefundBadge = (order: Order) => {
    if (!order.refundStatus || order.refundStatus === 'none') {
      return null;
    }

    switch (order.refundStatus) {
      case 'partial':
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-100 font-semibold px-3 py-1.5 flex items-center gap-2 w-fit shadow-sm animate-fade-in">
            <DollarSign className="w-4 h-4" />
            <span>Partially Refunded {order.refundAmount}</span>
          </Badge>
        );
      case 'full':
        return (
          <Badge className="bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-100 font-semibold px-3 py-1.5 flex items-center gap-2 w-fit shadow-sm animate-fade-in">
            <DollarSign className="w-4 h-4" />
            <span>Fully Refunded {order.refundAmount}</span>
          </Badge>
        );
      default:
        return null;
    }
  };

  const StoreLogoDisplay = ({ store }: { store: Order['store'] }) => (
    <div className="flex items-center space-x-3">
      <div className={`w-10 h-10 ${store.customLogo ? 'bg-white' : store.bgColor} rounded-lg flex items-center justify-center shadow-sm overflow-hidden border border-gray-200`}>
        {store.customLogo ? (
          <img 
            src={store.customLogo} 
            alt={`${store.name} logo`} 
            className="w-full h-full object-contain p-1"
          />
        ) : (
          <span className="text-white text-sm">{store.logo}</span>
        )}
      </div>
      <span className="font-medium text-gray-900">{store.name}</span>
    </div>
  );

  const MobileOrderCard = ({ order, index }: { order: Order; index: number }) => (
    <Card key={index} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
      <CardContent className="p-0">
        {/* Header Section */}
        <div className="p-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                className="w-8 h-8 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
                onClick={() => handleOrderClick(order)}
              >
                {expandedOrder === order.id ? (
                  <ChevronDown className="w-4 h-4 text-blue-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>
              <div className={`w-10 h-10 ${order.store.customLogo ? 'bg-white' : order.store.bgColor} rounded-lg flex items-center justify-center shadow-sm overflow-hidden border border-gray-200`}>
                {order.store.customLogo ? (
                  <img 
                    src={order.store.customLogo} 
                    alt={`${order.store.name} logo`} 
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <span className="text-white text-sm">{order.store.logo}</span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{order.store.name}</h3>
                <p className="text-xs text-gray-500">{order.id}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg text-gray-900 mb-2">{order.total}</div>
              <div className="flex flex-col gap-2">
                {getStatusBadge(order.status)}
                {getRefundBadge(order)}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{order.customer}</span>
            </div>
            <div className="flex items-center justify-start">
              {getOrderTypeBadge(order.type)}
            </div>
            <div className="flex items-center space-x-2 col-span-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{order.date}</span>
            </div>
          </div>

          {/* Always show refund button for all orders */}
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => handleRefundClick(order, e)}
            className="w-full flex items-center justify-center space-x-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <DollarSign className="w-4 h-4" />
            <span>Process Refund</span>
          </Button>
        </div>

        {/* Expanded Details */}
        {expandedOrder === order.id && (
          <div className="border-t border-gray-100 bg-gray-50/50">
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <Receipt className="w-4 h-4" />
                  <span>Order Items</span>
                </h4>
                <Badge variant="outline" className="text-xs bg-white">
                  {order.items.length} items
                </Badge>
              </div>
              
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg p-2 border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 text-sm">{item.name}</h5>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">
                            {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                          <p className="font-semibold text-sm text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 pt-2 border-t border-gray-200 bg-white rounded-lg p-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">
                    Total ({order.items.length} items)
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {order.total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen flex flex-col">
        {/* Collapsing Header */}
        <div className={`flex-shrink-0 bg-white border-b border-gray-200 transition-all duration-300 ${
          scrollDirection === 'down' && !isAtTop ? 'transform -translate-y-full opacity-0 h-0 overflow-hidden' : 'p-3 sm:p-4'
        }`}>
          <div className="max-w-7xl mx-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Order History</h1>
            <p className="text-gray-600 text-xs sm:text-sm">Track and manage your past orders</p>
          </div>
        </div>
        
        {/* Compact Filters - Always Visible */}
        <div className={`flex-shrink-0 bg-white border-b border-gray-100 transition-all duration-300 ${
          scrollDirection === 'down' && !isAtTop ? 'py-2' : 'py-3 sm:py-4'
        }`}>
          <div className="max-w-7xl mx-auto px-3 sm:px-4">
            <div className={`flex ${scrollDirection === 'down' && !isAtTop ? 'flex-row items-center space-x-3' : 'flex-col space-y-3 sm:space-y-4'}`}>
              {(scrollDirection === 'up' || isAtTop) && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Filter className="w-4 h-4" />
                  <span className="font-medium">Filters:</span>
                </div>
              )}
              
              <div className={`flex ${scrollDirection === 'down' && !isAtTop ? 'flex-row space-x-2' : 'flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3'}`}>
                <Select value={selectedStore} onValueChange={setSelectedStore}>
                  <SelectTrigger className={`border-gray-200 bg-white ${scrollDirection === 'down' && !isAtTop ? 'w-32 h-8 text-xs' : 'w-full sm:w-48'}`}>
                    <SelectValue placeholder="All stores" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        <div className="flex items-center gap-2">
                          <span>{store.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className={`border-gray-200 bg-white ${scrollDirection === 'down' && !isAtTop ? 'w-32 h-8 text-xs' : 'w-full sm:w-40'}`}>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>

                <div className={`${scrollDirection === 'down' && !isAtTop ? 'w-44' : 'w-full sm:w-64'}`}>
                  <DateRangePicker value={dateRange} onChange={setDateRange} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="max-w-7xl mx-auto">
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <div className="bg-white m-4 rounded-lg shadow-sm border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                      <TableHead className="w-8"></TableHead>
                      <TableHead className="font-semibold">Order</TableHead>
                      <TableHead className="font-semibold">Store</TableHead>
                      <TableHead className="font-semibold">Customer</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Total</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order, index) => (
                      <React.Fragment key={order.id}>
                        <TableRow 
                          className="hover:bg-gray-50/50 cursor-pointer transition-colors border-b border-gray-100"
                          onClick={() => handleOrderClick(order)}
                        >
                          <TableCell>
                            <button className="w-8 h-8 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center">
                              {expandedOrder === order.id ? (
                                <ChevronDown className="w-4 h-4 text-blue-600" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-semibold text-gray-900">{order.id}</div>
                              <div className="text-xs text-gray-500">{order.items.length} items</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <StoreLogoDisplay store={order.store} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-900">{order.customer}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3 mb-2">
                              {getOrderTypeBadge(order.type)}
                              {getStatusBadge(order.status)}
                            </div>
                            <div>
                              {getRefundBadge(order)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-bold text-lg text-gray-900">{order.total}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{order.date}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => handleRefundClick(order, e)}
                              className="flex items-center space-x-1 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                            >
                              <DollarSign className="w-3 h-3" />
                              <span>Refund</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                        
                        {/* Desktop Order Details Row */}
                        {expandedOrder === order.id && (
                          <TableRow className="bg-gray-50/30 hover:bg-gray-50/30">
                            <TableCell colSpan={8} className="p-0">
                              <div className="p-4 bg-gradient-to-r from-gray-50/50 to-white">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                                    <Receipt className="w-5 h-5" />
                                    <span>Order Details</span>
                                  </h4>
                                  <div className="flex items-center space-x-3">
                                    <Badge variant="outline" className="bg-white">
                                      {order.items.length} items
                                    </Badge>
                                    <Button
                                      size="sm"
                                      onClick={(e) => handleRefundClick(order, e)}
                                      className="bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2 shadow-sm"
                                    >
                                      <DollarSign className="w-4 h-4" />
                                      <span>Process Refund</span>
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                                  {order.items.map((item) => (
                                    <div key={item.id} className="bg-white rounded-lg border border-gray-100 p-3 hover:shadow-sm transition-shadow">
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                          <h5 className="font-semibold text-gray-900 mb-1">{item.name}</h5>
                                          <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-500">
                                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                                            </p>
                                            <p className="font-bold text-gray-900">
                                              ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                
                                <div className="bg-white rounded-lg p-3 border border-gray-200">
                                  <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-900 text-lg">
                                      Order Total ({order.items.length} items)
                                    </span>
                                    <span className="text-xl font-bold text-gray-900">
                                      {order.total}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
                
                {/* Desktop Pagination */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 border-t border-gray-100">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600 font-medium">Show:</span>
                    <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                      <SelectTrigger className="w-20 h-8 border-gray-200 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-600">per page</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600 font-medium">1-4 of 4 orders</span>
                    <div className="flex items-center space-x-1">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-200">
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-200">
                        <ChevronRightIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Card Layout */}
            <div className="lg:hidden">
              <div className="p-4 space-y-3">
                {orders.map((order, index) => (
                  <MobileOrderCard key={order.id} order={order} index={index} />
                ))}
                
                {/* Mobile Pagination */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                          <SelectTrigger className="w-28 h-9 border-gray-200 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                            <SelectItem value="5">5 per page</SelectItem>
                            <SelectItem value="10">10 per page</SelectItem>
                            <SelectItem value="25">25 per page</SelectItem>
                            <SelectItem value="50">50 per page</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600 font-medium">1-4 of 4</span>
                        <div className="flex items-center space-x-1">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-200">
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-200">
                            <ChevronRightIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        <RefundDialog
          order={selectedOrder}
          isOpen={isRefundDialogOpen}
          onClose={() => setIsRefundDialogOpen(false)}
          onRefund={handleRefund}
        />
      </div>
    </div>
  );
};
