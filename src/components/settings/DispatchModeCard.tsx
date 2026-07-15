import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type Mode = "manual" | "auto" | "hybrid";

const MODE_META: Record<
  Mode,
  { title: string; sub: string; warning?: string }
> = {
  manual: {
    title: "Manual",
    sub: "Orders sit in the Available Orders queue. Couriers self-claim on the courier portal. Best for solo runners or high-touch concierge experiences.",
  },
  auto: {
    title: "Auto",
    sub: "When a guest places an order, the system instantly assigns the closest idle online courier (cap 3 active orders per courier). Best when you have multiple runners and want the load split fairly.",
    warning:
      "Make sure couriers are signed up and toggled online before you flip this — otherwise orders fall through to the Available queue.",
  },
  hybrid: {
    title: "Hybrid",
    sub: "Orders sit in Available for 60 seconds (giving couriers a chance to manually claim), then the algorithm auto-assigns whichever idle courier is closest. Best of both worlds.",
  },
};

interface TenantSettings {
  dispatch_mode?: Mode;
  max_concurrent_orders?: number;
  hybrid_grace_seconds?: number;
}

export const DispatchModeCard = () => {
  const { userProfile } = useAuth();
  const tenantId = userProfile?.tenantId ?? null;
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<Mode>("manual");
  const [originalMode, setOriginalMode] = useState<Mode>("manual");
  const [tenantName, setTenantName] = useState<string>("");

  useEffect(() => {
    if (!tenantId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("tenants")
        .select("name, settings")
        .eq("id", tenantId)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        toast({
          title: "Failed to load dispatch settings",
          description: error?.message ?? "Tenant not found",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      const settings = (data.settings ?? {}) as TenantSettings;
      const current = (settings.dispatch_mode as Mode) ?? "manual";
      setMode(current);
      setOriginalMode(current);
      setTenantName(data.name ?? "");
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [tenantId, toast]);

  const handleSave = async () => {
    if (!tenantId) return;
    setSaving(true);
    const { data: tRow, error: readErr } = await supabase
      .from("tenants")
      .select("settings")
      .eq("id", tenantId)
      .maybeSingle();
    if (readErr || !tRow) {
      toast({
        title: "Could not save",
        description: readErr?.message ?? "Tenant not found",
        variant: "destructive",
      });
      setSaving(false);
      return;
    }
    const merged = {
      ...((tRow.settings ?? {}) as TenantSettings),
      dispatch_mode: mode,
    };
    const { error } = await supabase
      .from("tenants")
      .update({ settings: merged })
      .eq("id", tenantId);
    if (error) {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Dispatch mode updated",
        description: `${tenantName || "Tenant"} is now in ${MODE_META[mode].title} mode.`,
        variant: "success",
      });
      setOriginalMode(mode);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!tenantId) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          You're not associated with a tenant yet.
        </CardContent>
      </Card>
    );
  }

  const dirty = mode !== originalMode;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispatch mode</CardTitle>
        <CardDescription>
          Controls how new orders get assigned to your couriers. You can flip
          this at any time — changes take effect on the next order.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={mode}
          onValueChange={(v) => setMode(v as Mode)}
          className="space-y-3"
        >
          {(Object.keys(MODE_META) as Mode[]).map((key) => {
            const meta = MODE_META[key];
            const selected = mode === key;
            return (
              <Label
                key={key}
                htmlFor={`mode-${key}`}
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  selected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/30"
                }`}
              >
                <RadioGroupItem
                  id={`mode-${key}`}
                  value={key}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      {meta.title}
                    </span>
                    {key === originalMode && (
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {meta.sub}
                  </p>
                </div>
              </Label>
            );
          })}
        </RadioGroup>

        {dirty && MODE_META[mode].warning && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{MODE_META[mode].warning}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          {dirty && (
            <Button
              variant="outline"
              onClick={() => setMode(originalMode)}
              disabled={saving}
            >
              Cancel
            </Button>
          )}
          <Button onClick={handleSave} disabled={!dirty || saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DispatchModeCard;
