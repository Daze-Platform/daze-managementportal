import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Order {
  id: string;
  items: string;
  type: string;
  time: string;
  deliverTime: string;
  icon: string;
  iconBg: string;
  status?: string;
  customer?: string;
  estimatedTime?: string;
  priority?: "normal" | "high" | "urgent";
  platformFee?: string;
  storeId?: string;
  storeName?: string;
  courier?: string;
  scheduledFor?: string;
  isVisible?: boolean;
  locationType?: "Room" | "Beach" | "Pool" | "Table";
  createdAt?: string;
}

export interface OrderData {
  new: Order[];
  progress: Order[];
  ready: Order[];
  fulfillment: Order[];
  fulfilled: Order[];
  scheduled: Order[];
}

// Map DB status → UI tab
const STATUS_TO_TAB: Record<string, keyof OrderData> = {
  pending: "new",
  confirmed: "new",
  preparing: "progress",
  ready: "ready",
  delivering: "fulfillment",
  delivered: "fulfilled",
};

// Map UI tab → DB status (for updates)
const TAB_TO_STATUS: Record<string, string> = {
  new: "pending",
  progress: "preparing",
  ready: "ready",
  fulfillment: "delivering",
  fulfilled: "delivered",
};

function mapOrderType(orderType: string): string {
  switch (orderType) {
    case "beach":
    case "pool":
    case "room_service":
      return "Delivery";
    default:
      return "Pick Up";
  }
}

function mapLocationType(
  orderType: string,
): "Room" | "Beach" | "Pool" | "Table" {
  switch (orderType) {
    case "beach":
      return "Beach";
    case "pool":
      return "Pool";
    case "room_service":
      return "Room";
    default:
      return "Table";
  }
}

function mapIcon(orderType: string): { icon: string; iconBg: string } {
  return mapOrderType(orderType) === "Delivery"
    ? { icon: "\u{1F69A}", iconBg: "bg-purple-500" }
    : { icon: "\u{1F3EA}", iconBg: "bg-green-600" };
}

function formatTimeAgo(dateStr: string): string {
  const diffMin = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 60000,
  );
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${Math.floor(diffHrs / 24)}d ago`;
}

function formatDeliverTime(orderType: string, createdAt: string): string {
  const uiType = mapOrderType(orderType);
  const date = new Date(createdAt);
  const timeStr = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const isToday = date.toDateString() === new Date().toDateString();
  const dayLabel = isToday
    ? "today"
    : date.toLocaleDateString([], { weekday: "short" });
  return uiType === "Delivery"
    ? `Deliver ${dayLabel}, at ${timeStr}`
    : `Pickup ${dayLabel}, at ${timeStr}`;
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

interface DbOrder {
  id: string;
  order_number: number;
  status: string;
  order_type: string;
  total_cents: number;
  subtotal_cents: number;
  guest_id: string | null;
  guest_location: unknown;
  created_at: string;
  updated_at: string;
  estimated_ready_at: string | null;
  tenant_id: string;
  guests?: { name: string | null } | null;
  order_items?: Array<{ name: string; quantity: number }>;
}

function transformDbOrder(dbOrder: DbOrder): Order {
  const uiType = mapOrderType(dbOrder.order_type);
  let { icon, iconBg } = mapIcon(dbOrder.order_type);

  // Build items string
  const itemCount = dbOrder.order_items?.length ?? 0;
  const itemsStr =
    itemCount > 0
      ? `${itemCount} item${itemCount > 1 ? "s" : ""}, ${formatCents(dbOrder.total_cents)}`
      : `Order #${dbOrder.order_number}, ${formatCents(dbOrder.total_cents)}`;

  const customer =
    dbOrder.guests?.name || `Guest #${dbOrder.order_number}`;

  // Estimated time
  let estimatedTime = "15 min";
  if (dbOrder.status === "ready") estimatedTime = "Ready";
  if (dbOrder.status === "delivered" || dbOrder.status === "delivering")
    estimatedTime = "Completed";
  if (dbOrder.estimated_ready_at) {
    const diffMin = Math.max(
      0,
      Math.round(
        (new Date(dbOrder.estimated_ready_at).getTime() - Date.now()) / 60000,
      ),
    );
    estimatedTime = diffMin > 0 ? `${diffMin} min` : "Ready";
  }

  // Completed orders get check icon
  if (dbOrder.status === "delivered") {
    icon = "\u2705";
    iconBg = uiType === "Delivery" ? "bg-green-500" : "bg-blue-500";
  }

  return {
    id: dbOrder.id,
    items: itemsStr,
    type: uiType,
    time: formatTimeAgo(dbOrder.created_at),
    deliverTime: formatDeliverTime(dbOrder.order_type, dbOrder.created_at),
    icon,
    iconBg,
    status:
      dbOrder.status === "delivered"
        ? uiType === "Delivery"
          ? "Delivered"
          : "Picked Up"
        : undefined,
    customer,
    estimatedTime,
    priority: "normal",
    platformFee: formatCents(Math.round(dbOrder.total_cents * 0.03)),
    isVisible: true,
    locationType: mapLocationType(dbOrder.order_type),
    createdAt: dbOrder.created_at,
  };
}

function groupOrdersByTab(orders: DbOrder[]): OrderData {
  const result: OrderData = {
    new: [],
    progress: [],
    ready: [],
    fulfillment: [],
    fulfilled: [],
    scheduled: [],
  };

  for (const dbOrder of orders) {
    if (dbOrder.status === "cancelled") continue;
    const tab = STATUS_TO_TAB[dbOrder.status] || "new";
    result[tab].push(transformDbOrder(dbOrder));
  }

  // Sort each tab: newest first
  for (const tab of Object.keys(result) as Array<keyof OrderData>) {
    result[tab].sort((a, b) => {
      const aT = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bT = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bT - aT;
    });
  }

  return result;
}

export const useOrderData = () => {
  const [orderData, setOrderData] = useState<OrderData>({
    new: [],
    progress: [],
    ready: [],
    fulfillment: [],
    fulfilled: [],
    scheduled: [],
  });

  const { userProfile } = useAuth();
  const tenantId = userProfile?.tenantId;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;

  const fetchOrders = useCallback(async () => {
    if (!tenantId) return; // Don't fetch until tenant is known
    try {
      const { data, error } = await sb
        .from("orders")
        .select("*, guests(name), order_items(name, quantity)")
        .eq("tenant_id", tenantId)
        .neq("status", "cancelled")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch orders:", error);
        return;
      }

      if (data) {
        setOrderData(groupOrdersByTab(data as DbOrder[]));
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  }, [sb, tenantId]);

  // Initial fetch + realtime subscription
  useEffect(() => {
    if (!tenantId) return;
    fetchOrders();

    const channel = sb
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `tenant_id=eq.${tenantId}`,
        },
        () => {
          fetchOrders();
        },
      )
      .subscribe();

    return () => {
      sb.removeChannel(channel);
    };
  }, [fetchOrders, sb, tenantId]);

  // No-op — orders load from DB automatically
  const generateInitialOrders = useCallback(() => {}, []);

  const moveOrder = useCallback(
    async (
      orderId: string,
      fromTab: keyof OrderData,
      toTab: keyof OrderData,
    ) => {
      const newStatus = TAB_TO_STATUS[toTab];
      if (!newStatus) return;

      // Optimistic local update
      setOrderData((prev) => {
        const updated = { ...prev };
        const idx = updated[fromTab].findIndex((o) => o.id === orderId);
        if (idx === -1) return prev;

        const order = { ...updated[fromTab][idx] };
        if (toTab === "fulfilled" || toTab === "fulfillment") {
          order.status =
            order.type === "Delivery" ? "Delivered" : "Picked Up";
          order.icon = "\u2705";
          order.iconBg =
            order.type === "Delivery" ? "bg-green-500" : "bg-blue-500";
          order.estimatedTime = "Completed";
        }

        updated[fromTab] = updated[fromTab].filter((o) => o.id !== orderId);
        updated[toTab] = [order, ...updated[toTab]];
        return updated;
      });

      // Persist to DB
      const updatePayload: Record<string, unknown> = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };
      if (newStatus === "delivered") {
        updatePayload.completed_at = new Date().toISOString();
      }

      const { error } = await sb
        .from("orders")
        .update(updatePayload)
        .eq("id", orderId);

      if (error) {
        console.error("Failed to update order status:", error);
        fetchOrders(); // re-sync on failure
      }
    },
    [sb, fetchOrders],
  );

  const removeOrder = useCallback(
    async (orderId: string, fromTab: keyof OrderData) => {
      // Optimistic remove
      setOrderData((prev) => {
        const updated = { ...prev };
        updated[fromTab] = updated[fromTab].filter((o) => o.id !== orderId);
        return updated;
      });

      // Cancel in DB
      const { error } = await sb
        .from("orders")
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) {
        console.error("Failed to cancel order:", error);
        fetchOrders();
      }
    },
    [sb, fetchOrders],
  );

  const scheduleOrder = useCallback(
    (
      orderId: string,
      fromTab: keyof OrderData,
      scheduledTime: string,
    ) => {
      // Schedule is local-only (no DB column yet)
      setOrderData((prev) => {
        const updated = { ...prev };
        const idx = updated[fromTab].findIndex((o) => o.id === orderId);
        if (idx === -1) return prev;

        const order = { ...updated[fromTab][idx] };
        order.icon = "\u{1F4C5}";
        order.iconBg = "bg-purple-600";
        order.scheduledFor = scheduledTime;
        order.estimatedTime = scheduledTime;
        order.deliverTime = `Scheduled for ${scheduledTime}`;

        updated[fromTab] = updated[fromTab].filter((o) => o.id !== orderId);
        updated.scheduled = [order, ...updated.scheduled];
        return updated;
      });
    },
    [],
  );

  return {
    orderData,
    moveOrder,
    removeOrder,
    scheduleOrder,
    generateInitialOrders,
  };
};
