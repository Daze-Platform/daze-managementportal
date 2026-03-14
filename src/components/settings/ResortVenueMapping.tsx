import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Building2, Store, Plus, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Resort {
  id: string;
  name: string;
  location: string;
}

interface Store {
  id: number;
  name: string;
  address: string;
}

interface Mapping {
  store_id: number;
  resort_id: string;
  store: Store;
}

export const ResortVenueMapping = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedResortId, setSelectedResortId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      // Load resorts for this tenant
      const { data: resortData } = await supabase
        .from("resorts")
        .select("id, name, location")
        .eq("tenant_id", userProfile?.tenantId)
        .order("name");

      // Load all stores
      const { data: storeData } = await supabase
        .from("stores")
        .select("id, name, address")
        .order("name");

      // Load current mappings
      const { data: mapData } = await supabase
        .from("store_resort_availability")
        .select("store_id, resort_id");

      if (resortData) setResorts(resortData);
      if (storeData) setAllStores(storeData);

      if (mapData && storeData) {
        const storeMap = Object.fromEntries(storeData.map((s) => [s.id, s]));
        setMappings(
          mapData.map((m) => ({ ...m, store: storeMap[m.store_id] })).filter((m) => m.store),
        );
      }
    } catch (err) {
      console.warn("Could not load venue mapping data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [userProfile?.tenantId]);

  const storesForResort = (resortId: string) =>
    mappings.filter((m) => m.resort_id === resortId).map((m) => m.store);

  const unassignedStores = (resortId: string) =>
    allStores.filter((s) => !mappings.some((m) => m.resort_id === resortId && m.store_id === s.id));

  const handleRemove = async (storeId: number, resortId: string) => {
    const { error } = await supabase
      .from("store_resort_availability")
      .delete()
      .eq("store_id", storeId)
      .eq("resort_id", resortId);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
      return;
    }

    setMappings((prev) => prev.filter((m) => !(m.store_id === storeId && m.resort_id === resortId)));
    toast({ title: "Venue removed from resort" });
  };

  const handleAssign = async (storeId: number) => {
    if (!selectedResortId) return;
    setSaving(true);

    const { error } = await supabase.from("store_resort_availability").insert({
      store_id: storeId,
      resort_id: selectedResortId,
    });

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      const store = allStores.find((s) => s.id === storeId);
      if (store) {
        setMappings((prev) => [...prev, { store_id: storeId, resort_id: selectedResortId, store }]);
      }
      toast({ title: "Venue assigned to resort" });
      setAssignDialogOpen(false);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        Manage which venues are available for ordering at each resort.
      </div>

      {resorts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Building2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>No resorts found. Add a resort in the Destinations section first.</p>
        </div>
      )}

      {resorts.map((resort) => {
        const assigned = storesForResort(resort.id);
        return (
          <Card key={resort.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{resort.name}</CardTitle>
                  {resort.location && (
                    <span className="text-xs text-muted-foreground">{resort.location}</span>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => { setSelectedResortId(resort.id); setAssignDialogOpen(true); }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Assign Venue
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {assigned.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No venues assigned yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {assigned.map((store) => (
                    <Badge key={store.id} variant="secondary" className="flex items-center gap-1 pr-1">
                      <Store className="h-3 w-3" />
                      {store.name}
                      <button
                        className="ml-1 hover:text-destructive transition-colors"
                        onClick={() => handleRemove(store.id, resort.id)}
                        title="Remove from resort"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Assign venue dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Venue to Resort</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            {selectedResortId && unassignedStores(selectedResortId).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                All venues are already assigned to this resort.
              </p>
            ) : (
              selectedResortId &&
              unassignedStores(selectedResortId).map((store) => (
                <div
                  key={store.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:border-primary transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm">{store.name}</p>
                    {store.address && (
                      <p className="text-xs text-muted-foreground">{store.address}</p>
                    )}
                  </div>
                  <Button size="sm" onClick={() => handleAssign(store.id)} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Assign"}
                  </Button>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
