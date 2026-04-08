import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefundDialog } from "@/components/orders/RefundDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useToast } from "@/hooks/use-toast";
import { useStores } from "@/contexts/StoresContext";
import { format, startOfDay, startOfWeek, startOfMonth, subDays } from "date-fns";
import { useResort } from "@/contexts/DestinationContext";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  ChevronDown,
  ChevronRight,
  DollarSign,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Clock,
  User,
  Receipt,
  Filter,
  Truck,
  Store,
  CheckCircle,
  XCircle,
  Loader2,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  supabase_id: string;
  store: { name: string; logo: string; bgColor: string; customLogo?: string };
  customer: string;
  type: string;
  total: string;
  date: string;
  status: string;
  items: OrderItem[];
  refundStatus?: "none" | "partial" | "full";
  refundAmount?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE_OPTIONS = ["5", "10", "25", "50"];

const STORE_DISPLAY: Record<string, { logo: string; bgColor: string; customLogo?: string }> = {
  "salty-rose": {
    logo: "🌹",
    bgColor: "bg-gradient-to-br from-emerald-700 to-emerald-800",
    customLogo: "/images/stores/salty-rose-beach-bar-logo.webp",
  },
  "piazza-pizza": {
    logo: "🍕",
    bgColor: "bg-gradient-to-br from-red-700 to-red-800",
  },
  "sal-de-mar": {
    logo: "🌊",
    bgColor: "bg-gradient-to-br from-blue-700 to-blue-800",
  },
};

function getStoreDisplay(storeName: string | null | undefined) {
  if (!storeName) return { logo: "🏪", bgColor: "bg-gradient-to-br from-gray-600 to-gray-700" };
  const slug = storeName.toLowerCase().replace(/\s+/g, "-");
  return STORE_DISPLAY[slug] ?? { logo: "🏪", bgColor: "bg-gradient-to-br from-gray-600 to-gray-700" };
}

function getDateStart(range: string): Date | null {
  const now = new Date();
  switch (range) {
    case "today":
      return startOfDay(now);
    case "week":
      return startOfWeek(now, { weekStartsOn: 1 });
    case "month":
      return startOfMonth(now);
    case "last7days":
      return startOfDay(subDays(now, 6));
    default:
      return null; // "all"
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export const OrderHistory = () => {
  const { stores: allStores } = useStores();
  const { currentResort } = useResort();
  const { scrollDirection, isAtTop } = useScrollDirection();
  const { userProfile } = useAuth();
  const tenantId = userProfile?.tenantId ?? null;

  // UI state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDateRange, setSelectedDateRange] = useState<string>("last7days");
  const [itemsPerPage, setItemsPerPage] = useState<string>("10");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { toast } = useToast();

  // Data state
  const [rawOrders, setRawOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // ── Fetch from Supabase ────────────────────────────────────────────────────
  useEffect(() => {
    if (!tenantId) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        let query = supabase
          .from("orders")
          .select("*, order_items(name, quantity, unit_price), guests(name, email)")
          .eq("tenant_id", tenantId)
          .in("status", ["delivered", "completed", "fulfilled"]);

        // Date filter
        let startDate: Date | null = null;
        if (dateRange?.from) {
          startDate = startOfDay(dateRange.from);
        } else {
          startDate = getDateStart(selectedDateRange);
        }

        if (startDate) {
          query = query.gte("created_at", startDate.toISOString());
        }

        if (dateRange?.to) {
          const endDate = new Date(dateRange.to);
          endDate.setHours(23, 59, 59, 999);
          query = query.lte("created_at", endDate.toISOString());
        }

        query = query.order("created_at", { ascending: false });

        const { data, error } = await query;

        if (error) {
          console.error("OrderHistory fetch error:", error);
          setFetchError(error.message);
          setRawOrders([]);
        } else {
          setRawOrders(data ?? []);
        }
      } catch (err: any) {
        console.error("OrderHistory unexpected error:", err);
        setFetchError(err?.message ?? "Unknown error");
        setRawOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [tenantId, selectedDateRange, dateRange]);

  // ── Map raw Supabase rows → Order shape ───────────────────────────────────
  const mappedOrders: Order[] = useMemo(() => {
    return rawOrders.map((row) => {
      const storeDisplay = getStoreDisplay(row.store_name ?? row.store_id);
      const items: OrderItem[] = (row.order_items ?? []).map((oi: any, idx: number) => ({
        id: oi.id ?? String(idx),
        name: oi.name ?? "Item",
        price: typeof oi.unit_price === "number" ? oi.unit_price : parseFloat(oi.unit_price ?? "0"),
        quantity: oi.quantity ?? 1,
      }));

      const total = typeof row.total_amount === "number"
        ? `$${row.total_amount.toFixed(2)}`
        : row.total_amount
          ? `$${parseFloat(row.total_amount).toFixed(2)}`
          : "$0.00";

      const guestName = row.guests?.name ?? row.customer_name ?? "Guest";
      const statusRaw: string = row.status ?? "completed";
      const statusDisplay =
        statusRaw === "delivered" || statusRaw === "fulfilled"
          ? "Completed"
          : statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1);

      const orderType = row.order_type === "delivery" ? "Delivery" : "Pickup";

      return {
        id: `#${row.id?.slice(0, 8).toUpperCase()}`,
        supabase_id: row.id,
        store: {
          name: row.store_name ?? "Unknown Venue",
          ...storeDisplay,
        },
        customer: guestName,
        type: orderType,
        total,
        date: row.created_at
          ? format(new Date(row.created_at), "MMM d, yyyy h:mmaaa")
          : "—",
        status: statusDisplay,
        items,
        refundStatus: row.refund_status ?? "none",
        refundAmount: row.refund_amount ? `$${parseFloat(row.refund_amount).toFixed(2)}` : undefined,
      };
    });
  }, [rawOrders]);

  // ── Client-side filters (store, status, search) ───────────────────────────
  const availableStores = allStores.filter(
    (store, index, self) => index === self.findIndex((s) => s.id === store.id),
  );

  const stores = [
    { id: "all", name: "All venues" },
    ...availableStores.map((store) => ({
      id: store.id.toString(),
      name: store.name,
    })),
  ];

  const filteredOrders = useMemo(() => {
    let result = mappedOrders;

    if (selectedStatus !== "all") {
      switch (selectedStatus) {
        case "completed":
          result = result.filter((o) => o.status === "Completed");
          break;
        case "canceled":
          result = result.filter((o) => o.status === "Canceled");
          break;
        case "refunded":
          result = result.filter(
            (o) => o.refundStatus && o.refundStatus !== "none",
          );
          break;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (o) =>
          o.customer.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q) ||
          o.supabase_id.toLowerCase().includes(q),
      );
    }

    return result;
  }, [mappedOrders, selectedStatus, searchQuery]);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const pageSize = parseInt(itemsPerPage, 10) || 10;
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pagedOrders = filteredOrders.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, searchQuery, selectedDateRange, dateRange, itemsPerPage]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleOrderClick = (order: Order) => {
    setExpandedOrder(expandedOrder === order.supabase_id ? null : order.supabase_id);
  };

  const handleRefundClick = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOrder(order);
    setIsRefundDialogOpen(true);
  };

  const handleRefund = async (refundData: any) => {
    try {
      toast({
        variant: "default",
        title: "Refund Processed Successfully",
        description: `$${refundData.amount.toFixed(2)} has been refunded for order ${refundData.orderId}. Customer will receive funds within 3-5 business days.`,
      });
    } catch (error) {
      toast({
        title: "Refund Failed",
        description: "There was an error processing the refund. Please try again.",
        variant: "destructive",
      });
    }
  };

  // ── Sub-components ─────────────────────────────────────────────────────────
  const getOrderMetaBadges = (order: Order) => {
    const isPartialRefund = order.refundStatus === "partial";
    const isFullRefund = order.refundStatus === "full";
    const hasRefund = isPartialRefund || isFullRefund;

    return (
      <div className="inline-flex flex-wrap items-center gap-1.5">
        {order.type === "Delivery" ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 tracking-wide">
            <Truck className="w-3 h-3" />
            Delivery
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 tracking-wide">
            <Store className="w-3 h-3" />
            Pickup
          </span>
        )}

        {order.status === "Completed" ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 tracking-wide">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        ) : order.status === "Canceled" ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[11px] font-semibold text-red-700 tracking-wide">
            <XCircle className="w-3 h-3" />
            Canceled
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 border border-gray-200 px-2.5 py-0.5 text-[11px] font-semibold text-gray-600 tracking-wide">
            {order.status}
          </span>
        )}

        {hasRefund && (
          <span
            className="inline-flex items-center gap-1 rounded-full bg-orange-50 border border-orange-200 px-2.5 py-0.5 text-[11px] font-semibold text-orange-700 tracking-wide"
            title={isPartialRefund ? `Partial refund ${order.refundAmount}` : `Full refund ${order.refundAmount}`}
          >
            <DollarSign className="w-3 h-3" />
            {isPartialRefund ? "Partial Refund" : "Refunded"}
          </span>
        )}
      </div>
    );
  };

  const StoreLogoDisplay = ({ store }: { store: Order["store"] }) => (
    <div className="flex items-center space-x-3">
      <div
        className={`w-10 h-10 ${store.customLogo ? "bg-white" : store.bgColor} rounded-xl flex items-center justify-center shadow-sm overflow-hidden border border-gray-200`}
      >
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

  const MobileOrderCard = ({
    order,
    index,
  }: {
    order: Order;
    index: number;
  }) => (
    <Card
      key={index}
      className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white"
    >
      <CardContent className="p-0">
        <div className="p-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center space-x-3 min-w-0">
              <button
                className="w-8 h-8 flex-shrink-0 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
                onClick={() => handleOrderClick(order)}
              >
                {expandedOrder === order.supabase_id ? (
                  <ChevronDown className="w-4 h-4 text-blue-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>
              <div
                className={`w-10 h-10 flex-shrink-0 ${order.store.customLogo ? "bg-white" : order.store.bgColor} rounded-xl flex items-center justify-center shadow-sm overflow-hidden border border-gray-200`}
              >
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
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm truncate">
                  {order.store.name}
                </h3>
                <p className="text-xs text-gray-400 font-mono">{order.id}</p>
              </div>
            </div>
            <div className="flex-shrink-0 ml-3 text-right">
              <div className="font-bold text-lg text-gray-900">
                {order.total}
              </div>
            </div>
          </div>
          <div className="pl-[4.25rem]">
            {getOrderMetaBadges(order)}
          </div>
        </div>

        <div className="p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{order.customer}</span>
            </div>
            <div className="flex items-center space-x-2 col-span-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{order.date}</span>
            </div>
          </div>

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

        {expandedOrder === order.supabase_id && (
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
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-2 border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 text-sm">
                          {item.name}
                        </h5>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">
                            {item.quantity} x ${item.price.toFixed(2)}
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

              <div className="mt-3 pt-2 border-t border-gray-200 bg-white rounded-xl p-2">
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

  // ── Loading skeleton ───────────────────────────────────────────────────────
  const LoadingSkeleton = () => (
    <div className="space-y-3 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 animate-pulse border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
            <div className="h-5 bg-gray-200 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );

  // ── Pagination info ────────────────────────────────────────────────────────
  const startItem = filteredOrders.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, filteredOrders.length);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 page-fade-in">
      <div className="min-h-screen flex flex-col">
        {/* Collapsing Header */}
        <div
          className={`flex-shrink-0 bg-white border-b border-gray-200 transition-all duration-300 ${
            scrollDirection === "down" && !isAtTop
              ? "transform -translate-y-full opacity-0 h-0 overflow-hidden"
              : "p-3 sm:p-4"
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              Order History
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm">
              Track and manage your past orders
            </p>
          </div>
        </div>

        {/* Compact Filters - Always Visible */}
        <div
          className={`flex-shrink-0 bg-white border-b border-gray-100 transition-all duration-300 ${
            scrollDirection === "down" && !isAtTop ? "py-2" : "py-3 sm:py-4"
          }`}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-4">
            <div
              className={`flex ${scrollDirection === "down" && !isAtTop ? "flex-row items-center space-x-3" : "flex-col space-y-3 sm:space-y-4"}`}
            >
              {(scrollDirection === "up" || isAtTop) && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Filter className="w-4 h-4" />
                  <span className="font-medium">Filters:</span>
                </div>
              )}

              <div
                className={`flex ${scrollDirection === "down" && !isAtTop ? "flex-row space-x-2" : "flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3"}`}
              >
                {/* Date quick-pick */}
                <Select value={selectedDateRange} onValueChange={(v) => { setSelectedDateRange(v); setDateRange(undefined); }}>
                  <SelectTrigger
                    className={`border-gray-200 bg-white ${scrollDirection === "down" && !isAtTop ? "w-32 h-8 text-xs" : "w-full sm:w-40"}`}
                  >
                    <SelectValue placeholder="Date range" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="last7days">Last 7 days</SelectItem>
                    <SelectItem value="week">This week</SelectItem>
                    <SelectItem value="month">This month</SelectItem>
                    <SelectItem value="all">All time</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger
                    className={`border-gray-200 bg-white ${scrollDirection === "down" && !isAtTop ? "w-32 h-8 text-xs" : "w-full sm:w-40"}`}
                  >
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>

                <div
                  className={`${scrollDirection === "down" && !isAtTop ? "w-44" : "w-full sm:w-64"}`}
                >
                  <DateRangePicker
                    value={dateRange}
                    onChange={(range) => {
                      setDateRange(range);
                      if (range?.from) setSelectedDateRange("all");
                    }}
                  />
                </div>

                {/* Search */}
                <div className={`relative ${scrollDirection === "down" && !isAtTop ? "w-44" : "w-full sm:w-56"}`}>
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search customer or order..."
                    className={`pl-8 border-gray-200 bg-white ${scrollDirection === "down" && !isAtTop ? "h-8 text-xs" : ""}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <LoadingSkeleton />
            ) : fetchError ? (
              <div className="p-8 text-center">
                <p className="text-red-600 font-medium mb-1">Failed to load orders</p>
                <p className="text-sm text-gray-500">{fetchError}</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-12 text-center">
                <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No orders found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchQuery ? "Try adjusting your search or filters." : "Completed orders will appear here."}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block">
                  <div className="bg-white m-4 rounded-xl shadow-sm border border-gray-200">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                          <TableHead className="w-8"></TableHead>
                          <TableHead className="font-semibold">Order</TableHead>
                          <TableHead className="font-semibold">Store</TableHead>
                          <TableHead className="font-semibold">Customer</TableHead>
                          <TableHead className="font-semibold">Type</TableHead>
                          <TableHead className="font-semibold text-right">
                            Total
                          </TableHead>
                          <TableHead className="font-semibold">Date</TableHead>
                          <TableHead className="font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pagedOrders.map((order) => (
                          <React.Fragment key={order.supabase_id}>
                            <TableRow
                              className="hover:bg-gray-50/50 cursor-pointer transition-colors border-b border-gray-100"
                              onClick={() => handleOrderClick(order)}
                            >
                              <TableCell>
                                <button className="w-8 h-8 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center">
                                  {expandedOrder === order.supabase_id ? (
                                    <ChevronDown className="w-4 h-4 text-blue-600" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                  )}
                                </button>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-semibold text-gray-900">
                                    {order.id}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {order.items.length} items
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <StoreLogoDisplay store={order.store} />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <User className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-900">
                                    {order.customer}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>{getOrderMetaBadges(order)}</TableCell>
                              <TableCell className="text-right">
                                <span className="font-bold text-lg text-gray-900">
                                  {order.total}
                                </span>
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

                            {expandedOrder === order.supabase_id && (
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
                                        <div
                                          key={item.id}
                                          className="bg-white rounded-xl border border-gray-100 p-3 hover:shadow-sm transition-shadow"
                                        >
                                          <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                              <h5 className="font-semibold text-gray-900 mb-1">
                                                {item.name}
                                              </h5>
                                              <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-500">
                                                  Qty: {item.quantity} x $
                                                  {item.price.toFixed(2)}
                                                </p>
                                                <p className="font-bold text-gray-900">
                                                  $
                                                  {(item.price * item.quantity).toFixed(2)}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>

                                    <div className="bg-white rounded-xl p-3 border border-gray-200">
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
                        <span className="text-sm text-gray-600 font-medium">
                          Show:
                        </span>
                        <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                          <SelectTrigger className="w-20 h-8 border-gray-200 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                            {ITEMS_PER_PAGE_OPTIONS.map((v) => (
                              <SelectItem key={v} value={v}>{v}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-gray-600">per page</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600 font-medium">
                          {startItem}-{endItem} of {filteredOrders.length} orders
                        </span>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-gray-200"
                            disabled={safePage <= 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-gray-200"
                            disabled={safePage >= totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          >
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
                    {pagedOrders.map((order, index) => (
                      <MobileOrderCard key={order.supabase_id} order={order} index={index} />
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
                                {ITEMS_PER_PAGE_OPTIONS.map((v) => (
                                  <SelectItem key={v} value={v}>{v} per page</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-600 font-medium">
                              {startItem}-{endItem} of {filteredOrders.length}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 border-gray-200"
                                disabled={safePage <= 1}
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 border-gray-200"
                                disabled={safePage >= totalPages}
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                              >
                                <ChevronRightIcon className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
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
