import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, Save, Plug, CheckCircle, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useStores } from "@/contexts/StoresContext";

interface PosConfig {
  id?: string;
  tenant_id: string;
  store_slug: string;
  provider: string;
  location_id: string;
  api_key: string;
  account_id: string;
  ordering_api_base: string;
  env: "sandbox" | "production";
}

export const POSIntegration = () => {
  const { userProfile } = useAuth();
  const { stores } = useStores();
  const { toast } = useToast();

  const [selectedStoreSlug, setSelectedStoreSlug] = useState<string>("");
  const [config, setConfig] = useState<PosConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Auto-select first store with a slug
  useEffect(() => {
    if (!selectedStoreSlug && stores.length > 0) {
      const firstWithSlug = stores.find((s) => s.slug);
      if (firstWithSlug?.slug) setSelectedStoreSlug(firstWithSlug.slug);
    }
  }, [stores]);

  // Load config when store or tenant changes
  useEffect(() => {
    if (!selectedStoreSlug || !userProfile?.tenantId) return;

    const loadConfig = async () => {
      setLoading(true);
      const { data } = await (supabase as any)
        .from("pos_configs")
        .select("*")
        .eq("store_slug", selectedStoreSlug)
        .eq("tenant_id", userProfile.tenantId)
        .maybeSingle();

      if (data) {
        setConfig(data as PosConfig);
      } else {
        // Blank template for new config
        setConfig({
          tenant_id: userProfile.tenantId!,
          store_slug: selectedStoreSlug,
          provider: "omnivore",
          location_id: "",
          api_key: "",
          account_id: "",
          ordering_api_base: "",
          env: "sandbox",
        });
      }
      setLoading(false);
    };

    loadConfig();
  }, [selectedStoreSlug, userProfile?.tenantId]);

  const handleSave = async () => {
    if (!config || !userProfile?.tenantId) return;
    setSaving(true);

    const payload = {
      tenant_id: userProfile.tenantId,
      store_slug: selectedStoreSlug,
      provider: config.provider,
      location_id: config.location_id || null,
      api_key: config.api_key || null,
      account_id: config.account_id || null,
      ordering_api_base: config.ordering_api_base || null,
      env: config.env,
      updated_at: new Date().toISOString(),
    };

    const { error } = await (supabase as any)
      .from("pos_configs")
      .upsert(payload, { onConflict: "tenant_id,store_slug" });

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "POS configuration saved",
        description: `${selectedStoreSlug} — ${config.env === "production" ? "Live" : "Sandbox"}`,
        className: "bg-green-50 border-green-200 text-green-800",
      });
    }
    setSaving(false);
  };

  const storesWithSlug = stores.filter((s) => s.slug);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="w-5 h-5 text-primary" />
            POS Integration
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure Omnivore API credentials for each outlet. When Olo activates your
            production account, update the Location ID, API Key, and switch to{" "}
            <strong>Live</strong> mode.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Store selector */}
          <div>
            <Label htmlFor="store-select">Outlet</Label>
            <Select value={selectedStoreSlug} onValueChange={setSelectedStoreSlug}>
              <SelectTrigger id="store-select" className="mt-1">
                <SelectValue placeholder="Select outlet..." />
              </SelectTrigger>
              <SelectContent>
                {storesWithSlug.map((store) => (
                  <SelectItem key={store.slug} value={store.slug!}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Loading configuration…
            </div>
          )}

          {!loading && config && (
            <>
              <Separator />

              {/* Env badge */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Mode</span>
                <div className="flex gap-2">
                  <Button
                    variant={config.env === "sandbox" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setConfig({ ...config, env: "sandbox" })}
                  >
                    Sandbox
                  </Button>
                  <Button
                    variant={config.env === "production" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setConfig({ ...config, env: "production" })}
                    className={config.env === "production" ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    Live
                  </Button>
                </div>
                {config.env === "production" ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Live
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Sandbox
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="provider">POS Provider</Label>
                  <Select
                    value={config.provider}
                    onValueChange={(v) => setConfig({ ...config, provider: v })}
                  >
                    <SelectTrigger id="provider" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="omnivore">Omnivore (Micros)</SelectItem>
                      <SelectItem value="toast">Toast</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="account-id">Account ID</Label>
                  <Input
                    id="account-id"
                    className="mt-1 font-mono text-sm"
                    value={config.account_id}
                    onChange={(e) => setConfig({ ...config, account_id: e.target.value })}
                    placeholder="e.g. AixdjR9i"
                  />
                </div>

                <div>
                  <Label htmlFor="location-id">Location ID</Label>
                  <Input
                    id="location-id"
                    className="mt-1 font-mono text-sm"
                    value={config.location_id}
                    onChange={(e) => setConfig({ ...config, location_id: e.target.value })}
                    placeholder="e.g. cgX7Lndi"
                  />
                </div>

                <div>
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    className="mt-1 font-mono text-sm"
                    type="password"
                    value={config.api_key}
                    onChange={(e) => setConfig({ ...config, api_key: e.target.value })}
                    placeholder="Omnivore API key"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="ordering-base">Ordering App Base URL</Label>
                  <Input
                    id="ordering-base"
                    className="mt-1 font-mono text-sm"
                    value={config.ordering_api_base}
                    onChange={(e) => setConfig({ ...config, ordering_api_base: e.target.value })}
                    placeholder="https://daze-piazza-pizza.vercel.app"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The Vercel URL for this outlet's ordering app (without trailing slash).
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  {saving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Configuration
                </Button>
              </div>

              {config.env === "sandbox" && (
                <div className="text-xs text-muted-foreground bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                  <strong>Sandbox mode:</strong> Syncs against Omnivore's virtual POS — no real
                  orders fire. When Olo activates your Micros account, paste the real Location ID
                  and API Key here and switch to <strong>Live</strong>.
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
