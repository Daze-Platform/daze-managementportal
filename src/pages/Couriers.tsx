import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Wifi, WifiOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCouriers, type CourierRosterRow } from "@/hooks/useCouriers";

const fmtTime = (iso: string | null) => {
  if (!iso) return "—";
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return `${Math.floor(ms / 1000)}s ago`;
  if (ms < 3_600_000) return `${Math.floor(ms / 60_000)}m ago`;
  return new Date(iso).toLocaleString();
};

const fmtCourier = (id: string) => id.slice(0, 8);

const loadColor = (n: number) => {
  if (n === 0) return "bg-emerald-100 text-emerald-700 border-emerald-300";
  if (n === 1) return "bg-yellow-100 text-yellow-700 border-yellow-300";
  if (n === 2) return "bg-orange-100 text-orange-700 border-orange-300";
  return "bg-red-100 text-red-700 border-red-300";
};

const StatusPill = ({ row }: { row: CourierRosterRow }) => {
  if (row.isStale) {
    return (
      <Badge
        variant="outline"
        className="bg-gray-100 text-gray-600 border-gray-300"
      >
        <WifiOff className="w-3 h-3 mr-1" />
        Offline (stale)
      </Badge>
    );
  }
  if (!row.isAvailable) {
    return (
      <Badge
        variant="outline"
        className="bg-slate-100 text-slate-600 border-slate-300"
      >
        <WifiOff className="w-3 h-3 mr-1" />
        Off duty
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="bg-emerald-100 text-emerald-700 border-emerald-300"
    >
      <Wifi className="w-3 h-3 mr-1" />
      Online
    </Badge>
  );
};

const Couriers = () => {
  const { userProfile } = useAuth();
  const tenantId = userProfile?.tenantId ?? null;
  const { rows, loading, error } = useCouriers(tenantId);

  const summary = useMemo(() => {
    const online = rows.filter((r) => r.isAvailable && !r.isStale).length;
    const stale = rows.filter((r) => r.isStale).length;
    const idle = rows.filter(
      (r) => r.isAvailable && !r.isStale && r.activeOrders === 0,
    ).length;
    const totalActiveOrders = rows.reduce((sum, r) => sum + r.activeOrders, 0);
    return { online, stale, idle, totalActiveOrders };
  }, [rows]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Couriers</h1>
        <p className="text-sm text-muted-foreground">
          Live roster of food runners on shift, their load, and last known
          location.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Online</div>
          <div className="text-2xl font-bold">{summary.online}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Idle (0 orders)</div>
          <div className="text-2xl font-bold text-emerald-600">
            {summary.idle}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">
            Active orders carried
          </div>
          <div className="text-2xl font-bold">{summary.totalActiveOrders}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">
            Stale (no heartbeat)
          </div>
          <div className="text-2xl font-bold text-gray-500">
            {summary.stale}
          </div>
        </Card>
      </div>

      <Card className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="px-4 py-3">Courier</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Active orders</th>
              <th className="px-4 py-3">Last update</th>
              <th className="px-4 py-3">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  No couriers on shift yet. They'll appear here as they sign up
                  and toggle online.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.courierId} className="hover:bg-muted/20">
                <td className="px-4 py-3 font-mono text-xs">
                  {fmtCourier(row.courierId)}…
                </td>
                <td className="px-4 py-3">
                  <StatusPill row={row} />
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={loadColor(row.activeOrders)}
                  >
                    {row.activeOrders}{" "}
                    {row.activeOrders === 1 ? "order" : "orders"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {fmtTime(row.lastLocationUpdate)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {row.latitude != null && row.longitude != null ? (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {row.latitude.toFixed(5)}, {row.longitude.toFixed(5)}
                    </span>
                  ) : (
                    <span className="text-xs">No location</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <p className="text-xs text-muted-foreground">
        Tip: a roster MAP (live courier pins on a Mapbox 3D resort map) is a
        follow-up — Mapbox isn't installed in this project yet. The data here is
        the same source the courier portal uses.
      </p>
    </div>
  );
};

export default Couriers;
