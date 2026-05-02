import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDispatchLog, type DispatchDecisionRow } from "@/hooks/useDispatchLog";

const outcomePill = (outcome: DispatchDecisionRow["outcome"]) => {
  const meta: Record<DispatchDecisionRow["outcome"], { label: string; cls: string }> = {
    assigned: { label: "Assigned", cls: "bg-emerald-100 text-emerald-700 border-emerald-300" },
    no_eligible_courier: { label: "No eligible courier", cls: "bg-amber-100 text-amber-700 border-amber-300" },
    skipped_manual: { label: "Manual mode", cls: "bg-gray-100 text-gray-600 border-gray-300" },
    skipped_already_assigned: { label: "Already assigned", cls: "bg-slate-100 text-slate-600 border-slate-300" },
    skipped_status_terminal: { label: "Order closed", cls: "bg-slate-100 text-slate-600 border-slate-300" },
    error: { label: "Error", cls: "bg-red-100 text-red-700 border-red-300" },
  };
  const { label, cls } = meta[outcome];
  return <Badge variant="outline" className={cls}>{label}</Badge>;
};

const modePill = (mode: DispatchDecisionRow["mode"]) => {
  const cls = mode === "auto" ? "bg-blue-100 text-blue-700 border-blue-300" :
              mode === "hybrid" ? "bg-purple-100 text-purple-700 border-purple-300" :
              "bg-gray-100 text-gray-600 border-gray-300";
  return <Badge variant="outline" className={cls}>{mode}</Badge>;
};

const fmtTime = (iso: string) => {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return `${Math.floor(ms / 1000)}s ago`;
  if (ms < 3_600_000) return `${Math.floor(ms / 60_000)}m ago`;
  if (ms < 86_400_000) return `${Math.floor(ms / 3_600_000)}h ago`;
  return new Date(iso).toLocaleString();
};

const ExpandedRow = ({ row }: { row: DispatchDecisionRow }) => (
  <tr className="bg-muted/20">
    <td colSpan={6} className="px-4 py-3">
      <div className="space-y-2 text-xs font-mono">
        <div><strong>Order ID:</strong> {row.orderId}</div>
        {row.chosenCourierId && <div><strong>Chosen courier:</strong> {row.chosenCourierId}</div>}
        {row.errorMessage && <div className="text-destructive"><strong>Error:</strong> {row.errorMessage}</div>}
        {row.eligibleSummary !== null && row.eligibleSummary !== undefined && (
          <div>
            <strong>Eligible candidates ({row.eligibleCount ?? 0}):</strong>
            <pre className="mt-1 p-2 bg-background rounded border border-border overflow-x-auto text-[10px]">
              {JSON.stringify(row.eligibleSummary, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </td>
  </tr>
);

const DispatchLog = () => {
  const { userProfile } = useAuth();
  const tenantId = userProfile?.tenantId ?? null;
  const { rows, loading, error, refetch } = useDispatchLog(tenantId, 100);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-destructive">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dispatch log</h1>
          <p className="text-sm text-muted-foreground">Every dispatch decision, why it went the way it did. Last 100.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>Refresh</Button>
      </div>

      <Card className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="px-4 py-3 w-8"></th>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Mode</th>
              <th className="px-4 py-3">Outcome</th>
              <th className="px-4 py-3">Eligible</th>
              <th className="px-4 py-3">Order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  No dispatch decisions yet. Once a tenant is in 'auto' or 'hybrid' mode and orders flow, they'll appear here in real time.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <>
                <tr key={row.id} className="hover:bg-muted/20 cursor-pointer" onClick={() => toggle(row.id)}>
                  <td className="px-4 py-3">
                    {expanded.has(row.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{fmtTime(row.decidedAt)}</td>
                  <td className="px-4 py-3">{modePill(row.mode)}</td>
                  <td className="px-4 py-3">{outcomePill(row.outcome)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.eligibleCount ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs">{row.orderId.slice(0, 8)}…</td>
                </tr>
                {expanded.has(row.id) && <ExpandedRow row={row} />}
              </>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default DispatchLog;
