import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DispatchDecisionRow {
  id: string;
  orderId: string;
  tenantId: string;
  decidedAt: string;
  mode: "manual" | "auto" | "hybrid";
  chosenCourierId: string | null;
  outcome:
    | "assigned"
    | "no_eligible_courier"
    | "skipped_manual"
    | "skipped_already_assigned"
    | "skipped_status_terminal"
    | "error";
  eligibleCount: number | null;
  eligibleSummary: unknown;
  errorMessage: string | null;
}

interface RawRow {
  id: string;
  order_id: string;
  tenant_id: string;
  decided_at: string;
  mode: string;
  chosen_courier_id: string | null;
  outcome: string;
  eligible_count: number | null;
  eligible_summary: unknown;
  error_message: string | null;
}

const fromRow = (r: RawRow): DispatchDecisionRow => ({
  id: r.id,
  orderId: r.order_id,
  tenantId: r.tenant_id,
  decidedAt: r.decided_at,
  mode: r.mode as DispatchDecisionRow["mode"],
  chosenCourierId: r.chosen_courier_id,
  outcome: r.outcome as DispatchDecisionRow["outcome"],
  eligibleCount: r.eligible_count,
  eligibleSummary: r.eligible_summary,
  errorMessage: r.error_message,
});

export const useDispatchLog = (tenantId: string | null, limit = 50) => {
  const [rows, setRows] = useState<DispatchDecisionRow[]>([]);
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
      .from("dispatch_decisions")
      .select(
        "id, order_id, tenant_id, decided_at, mode, chosen_courier_id, outcome, eligible_count, eligible_summary, error_message",
      )
      .eq("tenant_id", tenantId)
      .order("decided_at", { ascending: false })
      .limit(limit);
    if (err) {
      setError(err.message);
      setRows([]);
    } else {
      setError(null);
      setRows(((data ?? []) as RawRow[]).map(fromRow));
    }
    setLoading(false);
  }, [tenantId, limit]);

  useEffect(() => {
    refetch();
    if (!tenantId) return;
    const channel = supabase
      .channel(`mgmt-dispatch-log-${tenantId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "dispatch_decisions",
          filter: `tenant_id=eq.${tenantId}`,
        },
        () => refetch(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [tenantId, refetch]);

  return { rows, loading, error, refetch };
};
