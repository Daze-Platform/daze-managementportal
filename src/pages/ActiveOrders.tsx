import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  RefreshCw,
  ShoppingBag,
  DollarSign,
  Clock,
  TrendingUp,
  AlertTriangle,
  MapPin,
  User,
  ChevronRight,
  Package,
} from "lucide-react";
import { useOrderManagement } from "@/hooks/useOrderManagement";
import { Order, OrderData } from "@/hooks/useOrderData";
import { useIsMobile } from "@/hooks/use-mobile";
import { useResort } from "@/contexts/DestinationContext";
import { useStores } from "@/contexts/StoresContext";

// ---------- helpers ----------

type StatusKey = "new" | "progress" | "ready" | "fulfillment" | "fulfilled" | "all";

const STATUS_META: Record<
  StatusKey,
  { label: string; color: string; dot: string; bg: string }
> = {
  all: {
    label: "All",
    color: "text-gray-700",
    dot: "bg-gray-400",
    bg: "bg-gray-100 border-gray-300",
  },
  new: {
    label: "New",
    color: "text-emerald-700",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50 border-emerald-200",
  },
  progress: {
    label: "Preparing",
    color: "text-blue-700",
    dot: "bg-blue-500",
    bg: "bg-blue-50 border-blue-200",
  },
  ready: {
    label: "Ready",
    color: "text-amber-700",
    dot: "bg-amber-500",
    bg: "bg-amber-50 border-amber-200",
  },
  fulfillment: {
    label: "Out",
    color: "text-violet-700",
    dot: "bg-violet-500",
    bg: "bg-violet-50 border-violet-200",
  },
  fulfilled: {
    label: "Done",
    color: "text-gray-500",
    dot: "bg-gray-400",
    bg: "bg-gray-50 border-gray-200",
  },
};

const PIPELINE_KEYS: StatusKey[] = [
  "new",
  "progress",
  "ready",
  "fulfillment",
  "fulfilled",
];

function parsePrice(items: string): number {
  const m = items.match(/\$([0-9.]+)/);
  return m ? parseFloat(m[1]) : 0;
}

function parseItemCount(items: string): number {
  const m = items.match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : 1;
}

function minutesAgo(createdAt?: string): number {
  if (!createdAt) return 0;
  return Math.max(
    0,
    Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000)
  );
}

function fmtMins(mins: number): string {
  if (mins < 1) return "<1m";
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function flattenOrders(
  data: OrderData,
  keys: StatusKey[]
): { order: Order; tab: StatusKey }[] {
  const out: { order: Order; tab: StatusKey }[] = [];
  for (const k of keys) {
    for (const o of data[k]) {
      out.push({ order: o, tab: k });
    }
  }
  out.sort((a, b) => {
    const aT = a.order.createdAt
      ? new Date(a.order.createdAt).getTime()
      : 0;
    const bT = b.order.createdAt
      ? new Date(b.order.createdAt).getTime()
      : 0;
    return bT - aT;
  });
  return out;
}

// ---------- sub-components ----------

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accent: string;
}) {
  return (
    <Card className="p-3 sm:p-4 flex items-center gap-3 border bg-card">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold tracking-tight leading-none">
          {value}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        {sub && (
          <p className="text-[11px] text-muted-foreground/70">{sub}</p>
        )}
      </div>
    </Card>
  );
}

function PipelineChip({
  statusKey,
  count,
  active,
  onClick,
}: {
  statusKey: StatusKey;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  const meta = STATUS_META[statusKey];
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${
        active
          ? `${meta.bg} ${meta.color} ring-2 ring-offset-1 ring-current/20`
          : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted"
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${meta.dot} flex-shrink-0`} />
      {meta.label}
      {count > 0 && (
        <span className="ml-0.5 font-bold">{count}</span>
      )}
    </button>
  );
}

function OrderRow({
  order,
  tab,
  onClick,
  isLate,
}: {
  order: Order;
  tab: StatusKey;
  onClick: () => void;
  isLate: boolean;
}) {
  const meta = STATUS_META[tab];
  const age = minutesAgo(order.createdAt);

  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 border-b border-border/50 last:border-b-0 ${
        isLate ? "bg-red-50/50" : ""
      }`}
    >
      {/* Status dot */}
      <span
        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${meta.dot} ${
          tab === "new" ? "animate-pulse" : ""
        }`}
      />

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-foreground">
            #{order.id.slice(-4)}
          </span>
          <span className="text-sm text-muted-foreground truncate">
            {order.customer || "Guest"}
          </span>
          {isLate && (
            <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">
            {parseItemCount(order.items)} item
            {parseItemCount(order.items) !== 1 ? "s" : ""}
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <Badge
            variant="outline"
            className={`text-[10px] px-1.5 py-0 h-4 font-medium ${
              order.type === "Delivery"
                ? "bg-blue-50 text-blue-600 border-blue-200"
                : "bg-green-50 text-green-600 border-green-200"
            }`}
          >
            {order.type}
          </Badge>
          {order.storeName && (
            <>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground truncate">
                {order.storeName}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right side — price + time */}
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-foreground">
          ${parsePrice(order.items).toFixed(2)}
        </p>
        <p
          className={`text-xs ${
            isLate ? "text-red-500 font-medium" : "text-muted-foreground"
          }`}
        >
          {fmtMins(age)}
        </p>
      </div>

      <ChevronRight className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
    </motion.button>
  );
}

function OrderDetailSheet({
  order,
  tab,
  open,
  onClose,
}: {
  order: Order | null;
  tab: StatusKey | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!order || !tab) return null;
  const meta = STATUS_META[tab];
  const age = minutesAgo(order.createdAt);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${meta.dot}`} />
            <SheetTitle className="text-lg">
              Order #{order.id.slice(-4)}
            </SheetTitle>
          </div>
          <SheetDescription>
            <Badge
              variant="outline"
              className={`${meta.bg} ${meta.color} text-xs`}
            >
              {meta.label}
            </Badge>
            <span className="ml-2 text-muted-foreground">
              {fmtMins(age)} ago
            </span>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5">
          {/* Customer */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {order.customer || "Guest"}
              </p>
              <p className="text-xs text-muted-foreground">{order.type}</p>
            </div>
          </div>

          <Separator />

          {/* Order info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span>{order.items}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{order.deliverTime}</span>
            </div>
            {order.locationType && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{order.locationType}</span>
              </div>
            )}
            {order.estimatedTime && (
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span>ETA: {order.estimatedTime}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Financials */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold text-lg">
                ${parsePrice(order.items).toFixed(2)}
              </span>
            </div>
            {order.platformFee && (
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Platform fee</span>
                <span>{order.platformFee}</span>
              </div>
            )}
          </div>

          {age > 15 && tab !== "fulfilled" && (
            <>
              <Separator />
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
                <span>
                  This order has been waiting <strong>{fmtMins(age)}</strong>{" "}
                  — check with kitchen staff
                </span>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ---------- main component ----------

export const ActiveOrders = () => {
  const [statusFilter, setStatusFilter] = useState<StatusKey>("all");
  const [detailOrder, setDetailOrder] = useState<{
    order: Order;
    tab: StatusKey;
  } | null>(null);

  const isMobile = useIsMobile();
  const { currentResort } = useResort();
  const { stores: allStores, getStoresByDestination } = useStores();
  const tenantStores = currentResort?.id
    ? getStoresByDestination(currentResort.id)
    : allStores;

  const {
    orderData,
    selectedStore,
    setSelectedStore,
    getOrderTypeCount,
  } = useOrderManagement();

  const stores = [
    { id: "all", name: "All Venues" },
    ...tenantStores.map((s) => ({ id: s.id.toString(), name: s.name })),
  ];

  // Flatten all orders into a single feed
  const allOrders = useMemo(
    () => flattenOrders(orderData, PIPELINE_KEYS),
    [orderData]
  );

  // Apply store filter
  const storeFiltered = useMemo(() => {
    if (selectedStore === "all") return allOrders;
    return allOrders.filter((o) => o.order.storeId === selectedStore);
  }, [allOrders, selectedStore]);

  // Apply status filter
  const visibleOrders = useMemo(() => {
    if (statusFilter === "all") return storeFiltered;
    return storeFiltered.filter((o) => (o.tab as string) === statusFilter);
  }, [storeFiltered, statusFilter]);

  // KPI computations
  const activeCount =
    (getOrderTypeCount("new") || 0) +
    (getOrderTypeCount("progress") || 0) +
    (getOrderTypeCount("ready") || 0) +
    (getOrderTypeCount("fulfillment") || 0);

  const allActiveOrders = storeFiltered.filter(
    (o) => o.tab !== "fulfilled"
  );
  const completedOrders = storeFiltered.filter(
    (o) => o.tab === "fulfilled"
  );

  const totalRevenue = storeFiltered.reduce(
    (sum, o) => sum + parsePrice(o.order.items),
    0
  );

  const avgWaitMins =
    allActiveOrders.length > 0
      ? Math.round(
          allActiveOrders.reduce(
            (sum, o) => sum + minutesAgo(o.order.createdAt),
            0
          ) / allActiveOrders.length
        )
      : 0;

  const totalProcessed = allActiveOrders.length + completedOrders.length;
  const completionRate =
    totalProcessed > 0
      ? Math.round((completedOrders.length / totalProcessed) * 100)
      : 100;

  // Late orders (>15 min, not completed)
  const lateOrderIds = new Set(
    storeFiltered
      .filter(
        (o) =>
          o.tab !== "fulfilled" && minutesAgo(o.order.createdAt) > 15
      )
      .map((o) => o.order.id)
  );

  const lateCount = lateOrderIds.size;

  const pipelineCounts: Record<StatusKey, number> = {
    all: storeFiltered.length,
    new: getOrderTypeCount("new") || 0,
    progress: getOrderTypeCount("progress") || 0,
    ready: getOrderTypeCount("ready") || 0,
    fulfillment: getOrderTypeCount("fulfillment") || 0,
    fulfilled: getOrderTypeCount("fulfilled") || 0,
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* --- Header --- */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Live Orders
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Real-time order intelligence
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={selectedStore}
              onValueChange={setSelectedStore}
            >
              <SelectTrigger className="w-[140px] sm:w-[180px] h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {stores.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* --- KPI Strip --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard
            icon={ShoppingBag}
            label="Active Orders"
            value={activeCount.toString()}
            sub={lateCount > 0 ? `${lateCount} over 15m` : undefined}
            accent="bg-emerald-500"
          />
          <KpiCard
            icon={DollarSign}
            label="Revenue Today"
            value={`$${totalRevenue.toFixed(0)}`}
            sub={`${storeFiltered.length} total orders`}
            accent="bg-blue-500"
          />
          <KpiCard
            icon={Clock}
            label="Avg Wait"
            value={fmtMins(avgWaitMins)}
            sub={allActiveOrders.length > 0 ? "active orders" : "no active"}
            accent={avgWaitMins > 15 ? "bg-red-500" : "bg-amber-500"}
          />
          <KpiCard
            icon={TrendingUp}
            label="Completion"
            value={`${completionRate}%`}
            sub={`${completedOrders.length} completed`}
            accent="bg-violet-500"
          />
        </div>

        {/* --- Status Pipeline --- */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <PipelineChip
            statusKey="all"
            count={storeFiltered.length}
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          />
          {PIPELINE_KEYS.map((k) => (
            <PipelineChip
              key={k}
              statusKey={k}
              count={pipelineCounts[k]}
              active={statusFilter === k}
              onClick={() =>
                setStatusFilter(statusFilter === k ? "all" : k)
              }
            />
          ))}
        </div>

        {/* --- Late Orders Alert --- */}
        {lateCount > 0 && statusFilter === "all" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3"
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div className="text-sm">
              <strong>{lateCount} order{lateCount > 1 ? "s" : ""}</strong>{" "}
              waiting more than 15 minutes — check with kitchen
            </div>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto text-red-700 border-red-300 hover:bg-red-100"
              onClick={() => setStatusFilter("new")}
            >
              View
            </Button>
          </motion.div>
        )}

        {/* --- Order Feed --- */}
        <Card className="overflow-hidden border">
          <div className="px-4 py-2.5 bg-muted/30 border-b flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              {visibleOrders.length} order
              {visibleOrders.length !== 1 ? "s" : ""}
              {statusFilter !== "all" &&
                ` · ${STATUS_META[statusFilter as StatusKey]?.label ?? ""}`}
            </p>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {visibleOrders.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center px-4"
                >
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                    <ShoppingBag className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    No orders
                    {statusFilter !== "all"
                      ? ` with "${STATUS_META[statusFilter as StatusKey]?.label}" status`
                      : " yet"}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    Orders will appear here in real time
                  </p>
                </motion.div>
              ) : (
                visibleOrders.map(({ order, tab }) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    tab={tab}
                    isLate={lateOrderIds.has(order.id)}
                    onClick={() => setDetailOrder({ order, tab })}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </Card>
      </div>

      {/* --- Detail Sheet --- */}
      <OrderDetailSheet
        order={detailOrder?.order ?? null}
        tab={detailOrder?.tab ?? null}
        open={!!detailOrder}
        onClose={() => setDetailOrder(null)}
      />
    </div>
  );
};
