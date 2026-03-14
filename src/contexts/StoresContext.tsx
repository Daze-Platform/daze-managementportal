import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Store } from "@/types/store";
import { defaultStores } from "@/data/defaultStores";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface StoresContextType {
  stores: Store[];
  getStoresByDestination: (destinationId: string) => Store[];
  // Legacy alias
  getStoresByResort: (resortId: string) => Store[];
  addStore: (store: Store) => void;
  updateStore: (store: Store) => void;
  deleteStore: (storeId: number) => void;
  refreshStores: () => void;
}

const StoresContext = createContext<StoresContextType | undefined>(undefined);

export const StoresProvider = ({ children }: { children: ReactNode }) => {
  const { userProfile } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStores = async (tenantId: string) => {
    try {
      // Scope stores to this tenant's resorts only
      const { data: resortRows } = await supabase
        .from("resorts")
        .select("id")
        .eq("tenant_id", tenantId);
      const resortIds = resortRows?.map((r) => r.id) ?? [];

      const query = supabase
        .from("stores")
        .select("*")
        .order("created_at", { ascending: true });
      const { data: storesData, error } = resortIds.length > 0
        ? await query.in("resort_id", resortIds)
        : await query.eq("resort_id", "no-match"); // no resorts → no stores

      if (error) {
        console.warn("Could not load stores from database:", error.message);
        // Keep using defaults - already set in state
        return;
      }

      if (storesData && storesData.length > 0) {
        // Convert database format to our Store type
        const convertedStores: Store[] = storesData.map((store) => ({
          id: store.id,
          name: store.name,
          address: store.address,
          locationDescription: store.location_description || "",
          logo: store.logo || "🏪",
          customLogo: store.custom_logo || "",
          bgColor: store.bg_color || "bg-blue-500",
          activeOrders: store.active_orders || 0,
          hours: (store.hours as any) || [],
          destinationId: store.resort_id || "",
          resortId: store.resort_id || "",
        }));

        setStores(convertedStores);
      } else {
        setStores([]);
      }
    } catch (error) {
      console.warn("Network error loading stores:", error);
      // Keep using defaults - already set in state
    } finally {
      setLoading(false);
    }
  };

  const seedDefaultStores = async () => {
    try {
      for (const store of defaultStores) {
        await supabase.from("stores").insert({
          name: store.name,
          address: store.address,
          location_description: store.locationDescription,
          logo: store.logo,
          custom_logo: store.customLogo,
          bg_color: store.bgColor,
          active_orders: store.activeOrders,
          hours: store.hours as any,
          resort_id: store.destinationId || store.resortId,
        });
      }
    } catch (error) {
      console.warn("Could not seed default stores:", error);
    }
  };

  useEffect(() => {
    if (userProfile?.tenantId) {
      loadStores(userProfile.tenantId);
    } else {
      setLoading(false);
    }
  }, [userProfile?.tenantId]);

  const refreshStores = () => {
    if (userProfile?.tenantId) loadStores(userProfile.tenantId);
  };

  const getStoresByDestination = (destinationId: string): Store[] => {
    return stores.filter(
      (store) =>
        store.destinationId === destinationId ||
        store.resortId === destinationId,
    );
  };

  // Legacy alias
  const getStoresByResort = getStoresByDestination;

  const addStore = async (store: Store) => {
    // If store has an ID, check if it already exists and update instead
    if (store.id && stores.find((s) => s.id === store.id)) {
      await updateStore(store);
      return;
    }

    // Create temp ID for optimistic update
    const tempId = Date.now();
    const optimisticStore = { ...store, id: tempId };

    // Optimistic update
    setStores((prev) => [...prev, optimisticStore]);
    toast.success("Venue created successfully");

    try {
      const { data, error } = await supabase
        .from("stores")
        .insert({
          name: store.name,
          address: store.address,
          location_description: store.locationDescription,
          logo: store.logo,
          custom_logo: store.customLogo,
          bg_color: store.bgColor,
          active_orders: store.activeOrders,
          hours: store.hours as any,
          resort_id: store.destinationId || store.resortId,
        })
        .select()
        .single();

      if (error) {
        console.warn("Could not sync store to database:", error.message);
        return;
      }

      // Replace temp ID with real ID from database
      setStores((prev) =>
        prev.map((s) => (s.id === tempId ? { ...store, id: data.id } : s)),
      );
    } catch (error) {
      console.warn("Network error syncing store:", error);
    }
  };

  const updateStore = async (updatedStore: Store) => {
    // Optimistic update
    setStores((prev) =>
      prev.map((store) =>
        store.id === updatedStore.id ? updatedStore : store,
      ),
    );
    toast.success("Venue updated successfully");

    try {
      const { error } = await supabase
        .from("stores")
        .update({
          name: updatedStore.name,
          address: updatedStore.address,
          location_description: updatedStore.locationDescription,
          logo: updatedStore.logo,
          custom_logo: updatedStore.customLogo,
          bg_color: updatedStore.bgColor,
          active_orders: updatedStore.activeOrders,
          hours: updatedStore.hours as any,
          resort_id: updatedStore.destinationId || updatedStore.resortId,
        })
        .eq("id", updatedStore.id);

      if (error) {
        console.warn("Could not sync store update:", error.message);
      }
    } catch (error) {
      console.warn("Network error syncing store update:", error);
    }
  };

  const deleteStore = async (storeId: number) => {
    // Optimistic delete
    setStores((prev) => prev.filter((store) => store.id !== storeId));
    toast.success("Venue deleted successfully");

    try {
      const { error } = await supabase
        .from("stores")
        .delete()
        .eq("id", storeId);

      if (error) {
        console.warn("Could not sync store deletion:", error.message);
      }
    } catch (error) {
      console.warn("Network error syncing store deletion:", error);
    }
  };

  return (
    <StoresContext.Provider
      value={{
        stores,
        getStoresByDestination,
        getStoresByResort,
        addStore,
        updateStore,
        deleteStore,
        refreshStores,
      }}
    >
      {children}
    </StoresContext.Provider>
  );
};

export const useStores = () => {
  const context = useContext(StoresContext);
  if (context === undefined) {
    throw new Error("useStores must be used within a StoresProvider");
  }
  return context;
};

export type { Store, StoreHours } from "@/types/store";
