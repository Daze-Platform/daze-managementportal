import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Tag,
  Settings2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PosConfig {
  location_id: string | null;
  api_key: string | null;
  account_id: string | null;
  ordering_api_base: string | null;
  env: string;
  provider: string;
}

interface SyncSummary {
  totalDazeItems: number;
  totalOmnivoreItems: number;
  matched: number;
  unmatched: number;
  priceDiscrepancies: number;
}

interface PriceDiscrepancy {
  dazeName: string;
  dazePrice: number;
  omnivorePrice: number | null;
}

interface SyncResult {
  summary: SyncSummary;
  unmatched: string[];
  priceDiscrepancies: PriceDiscrepancy[];
  persistResult?: { updated: number; total: number } | null;
}

interface MenuSyncPanelProps {
  /** Optional callback after a successful sync with persist=true */
  onSyncComplete?: (result: SyncResult) => void;
  /** Store slug to look up POS config (e.g. "piazza-pizza") */
  storeSlug?: string;
  /** Tenant ID (UUID) to scope the POS config lookup */
  tenantId?: string;
}

export const MenuSyncPanel = ({
  onSyncComplete,
  storeSlug,
  tenantId,
}: MenuSyncPanelProps) => {
  const [status, setStatus] = useState<"idle" | "syncing" | "done" | "error">("idle");
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [persisting, setPersisting] = useState(false);

  // POS config loaded from DB
  const [posConfig, setPosConfig] = useState<PosConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(false);
  const [configNotFound, setConfigNotFound] = useState(false);

  // Fallback hardcoded config (used when no storeSlug/tenantId props provided)
  const FALLBACK_CONFIG = {
    locationId: "cgX7Lndi",
    apiKey: "8a4ff5cff50a4afba41c2b1b4e7cd78a",
    accountId: "AixdjR9i",
    orderingApiBase: "https://daze-piazza-pizza.vercel.app/api",
    tenantSlug: "piazza-pizza",
    env: "sandbox",
  };

  useEffect(() => {
    if (!storeSlug || !tenantId) {
      // No props — use fallback; no config fetch needed
      setConfigNotFound(false);
      return;
    }

    const fetchPosConfig = async () => {
      setConfigLoading(true);
      setConfigNotFound(false);
      try {
        const { data, error: fetchError } = await (supabase as any)
          .from("pos_configs")
          .select("location_id, api_key, account_id, ordering_api_base, env, provider")
          .eq("store_slug", storeSlug)
          .eq("tenant_id", tenantId)
          .maybeSingle();

        if (fetchError) {
          console.warn("POS config fetch error:", fetchError.message);
          setConfigNotFound(true);
        } else if (!data) {
          setConfigNotFound(true);
        } else {
          setPosConfig(data as PosConfig);
          setConfigNotFound(false);
        }
      } catch (err) {
        console.warn("Unexpected error fetching POS config:", err);
        setConfigNotFound(true);
      } finally {
        setConfigLoading(false);
      }
    };

    fetchPosConfig();
  }, [storeSlug, tenantId]);

  const getActiveConfig = () => {
    if (storeSlug && tenantId && posConfig) {
      return {
        locationId: posConfig.location_id ?? "",
        apiKey: posConfig.api_key ?? "",
        accountId: posConfig.account_id ?? "",
        orderingApiBase: posConfig.ordering_api_base
          ? `${posConfig.ordering_api_base.replace(/\/$/, "")}/api`
          : "https://daze-piazza-pizza.vercel.app/api",
        tenantSlug: storeSlug,
        env: posConfig.env,
      };
    }
    return FALLBACK_CONFIG;
  };

  const runSync = async (persist = false) => {
    setStatus("syncing");
    setError(null);
    setResult(null);

    const cfg = getActiveConfig();

    try {
      const res = await fetch(`${cfg.orderingApiBase}/omnivore-menu-sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationId: cfg.locationId,
          apiKey: cfg.apiKey,
          tenantSlug: cfg.tenantSlug,
          supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
          supabaseKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          persist,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Sync failed (HTTP ${res.status})`);
      }

      const data: SyncResult = await res.json();
      setResult(data);
      setStatus("done");
      if (persist && onSyncComplete) onSyncComplete(data);
    } catch (err: any) {
      setError(err?.message || "Menu sync failed");
      setStatus("error");
    } finally {
      setPersisting(false);
    }
  };

  const handlePersist = () => {
    setPersisting(true);
    runSync(true);
  };

  const activeEnv = storeSlug && tenantId && posConfig ? posConfig.env : FALLBACK_CONFIG.env;

  return (
    <Card className="border border-border/60 bg-white/90 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <RefreshCw className="w-4 h-4 text-primary" />
          POS Menu Sync
          {/* Env badge */}
          {!configLoading && !configNotFound && (
            <span className="ml-auto">
              {activeEnv === "production" ? (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs font-medium">
                  Live
                </Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs font-medium">
                  Sandbox
                </Badge>
              )}
            </span>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Pull the live menu from Omnivore and match item IDs to your Daze catalog.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Config loading */}
        {configLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Loading POS configuration…
          </div>
        )}

        {/* No config found */}
        {!configLoading && configNotFound && (
          <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <Settings2 className="w-4 h-4 shrink-0" />
            No POS config found. Set up in Settings &rarr; POS Integration.
          </div>
        )}

        {/* Action buttons — only show when config is available or using fallback */}
        {!configLoading && !configNotFound && (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => runSync(false)}
              disabled={status === "syncing"}
              className="gap-2"
            >
              {status === "syncing" && !persisting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              Preview Sync
            </Button>
            {result && result.summary.matched > 0 && (
              <Button
                size="sm"
                onClick={handlePersist}
                disabled={status === "syncing"}
                className="gap-2"
              >
                {persisting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5" />
                )}
                Save {result.summary.matched} Mappings
              </Button>
            )}
          </div>
        )}

        {/* Error */}
        {status === "error" && error && (
          <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <XCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-3">
            {/* Summary badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                <CheckCircle className="w-3 h-3 mr-1" />
                {result.summary.matched} matched
              </Badge>
              {result.summary.unmatched > 0 && (
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {result.summary.unmatched} unmatched
                </Badge>
              )}
              {result.summary.priceDiscrepancies > 0 && (
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                  <Tag className="w-3 h-3 mr-1" />
                  {result.summary.priceDiscrepancies} price mismatches
                </Badge>
              )}
              <Badge variant="outline" className="text-muted-foreground">
                {result.summary.totalOmnivoreItems} items in Omnivore
              </Badge>
            </div>

            {/* Persist result */}
            {result.persistResult && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                Saved {result.persistResult.updated}/{result.persistResult.total} item mappings to the catalog.
              </div>
            )}

            {/* Unmatched items */}
            {result.unmatched.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Items with no Omnivore match — will use first available item:
                </p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {result.unmatched.map((name) => (
                    <div
                      key={name}
                      className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1"
                    >
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price discrepancies */}
            {result.priceDiscrepancies.length > 0 && (
              <div>
                <Separator className="my-2" />
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Price discrepancies (Daze vs Omnivore):
                </p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {result.priceDiscrepancies.map((item) => (
                    <div
                      key={item.dazeName}
                      className="text-xs text-orange-700 bg-orange-50 rounded px-2 py-1 flex justify-between"
                    >
                      <span>{item.dazeName}</span>
                      <span className="font-mono">
                        Daze ${item.dazePrice.toFixed(2)} ↔ POS ${item.omnivorePrice?.toFixed(2) ?? "?"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
