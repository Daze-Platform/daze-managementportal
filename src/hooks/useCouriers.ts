import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface CourierRosterRow {
  courierId: string;
  tenantId: string;
  isAvailable: boolean;
  latitude: number | null;
  longitude: number | null;
  lastLocationUpdate: string | null;
  currentDeliveryId: string | null;
  activeOrders: number;
  isStale: boolean;
}

const STALE_THRESHOLD_MS = 2 * 60 * 1000;

interface RawRow {
  courier_id: string;
  tenant_id: string;
  is_available: boolean | null;
  latitude: number | null;
  longitude: number | null;
  last_location_update: string | null;
  current_delivery_id: string | null;
}

const fromRow = async (rows: RawRow[]): Promise<CourierRosterRow[]> => {
  if (rows.length === 0) return [];
  const { data: counts } = await supabase
    .from("orders")
    .select("courier_user_id")
    .in("courier_user_id", rows.map((r) => r.courier_id))
    .in("status", ["pending", "confirmed", "preparing", "ready", "delivering"]);

  const countMap = new Map<string, number>();
  (counts ?? []).forEach((row) => {
    const id = (row as { courier_user_id: string }).courier_user_id;
    countMap.set(id, (countMap.get(id) ?? 0) + 1);
  });

  return rows.map((r) => {
    const lastMs = r.last_location_update ? new Date(r.last_location_update).getTime() : 0;
    return {
      courierId: r.courier_id,
      tenantId: r.tenant_id,
      isAvailable: !!r.is_available,
      latitude: r.latitude,
      longitude: r.longitude,
      lastLocationUpdate: r.last_location_update,
      currentDeliveryId: r.current_delivery_id,
      activeOrders: countMap.get(r.courier_id) ?? 0,
      isStale: !lastMs || Date.now() - lastMs > STALE_THRESHOLD_MS,
    };
  });
};

export const useCouriers = (tenantId: string | null) => {
  const [rows, setRows] = useState<CourierRosterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!tenantId) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: err } = await supabase
      .from("courier_status")
      .select("courier_id, tenant_id, is_available, latitude, longitude, last_location_update, current_delivery_id")
      .eq("tenant_id", tenantId)
      .order("last_location_update", { ascending: false, nullsFirst: false });
    if (err) {
      setError(err.message);
      setRows([]);
    } else {
      setError(null);
      setRows(await fromRow((data ?? []) as RawRow[]));
    }
    setLoading(false);
  }, [tenantId]);

  useEffect(() => {
    refetch();
    if (!tenantId) return;
    const channel = supabase
      .channel(`mgmt-couriers-${tenantId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "courier_status", filter: `tenant_id=eq.${tenantId}` },
        () => refetch()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `tenant_id=eq.${tenantId}` },
        () => refetch()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [tenantId, refetch]);

  return { rows, loading, error, refetch };
};

export const useReassignOrder = () => {
  const { userId } = useAuth();
  return useCallback(async (orderId: string, courierId: string | null): Promise<{ ok: boolean; reason?: string }> => {
    if (!userId) return { ok: false, reason: "Not signed in" };
    const { data, error } = await supabase
      .from("orders")
      .update({ courier_user_id: courierId })
      .eq("id", orderId)
      .select("id")
      .maybeSingle();
    if (error) return { ok: false, reason: error.message };
    if (!data) return { ok: false, reason: "Order not found or RLS blocked update" };
    return { ok: true };
  }, [userId]);
};
