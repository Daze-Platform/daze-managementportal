import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useStores } from "@/contexts/StoresContext";
import { Store, StoreHours } from "@/types/store";
import { useResort } from "@/contexts/DestinationContext";

// Remove duplicate interface - using Store from StoresContext

import { defaultHours } from "@/data/defaultStores";

// Remove defaultStores as we're using the context data now

export const useStoreManagement = () => {
  const {
    stores,
    addStore,
    updateStore,
    deleteStore: deleteStoreFromContext,
  } = useStores();
  const { currentResort } = useResort();
  const [view, setView] = useState<"list" | "details" | "form">("list");
  const [selectedStore, setSelectedStore] = useState<Store | undefined>();
  const [editingStore, setEditingStore] = useState<Store | undefined>();
  const { toast } = useToast();

  // No need for local state management, using context

  const handleCreateStore = () => {
    console.log("handleCreateStore called!");
    setEditingStore(undefined);
    setView("form");
  };

  const handleViewStore = (store: Store) => {
    console.log("Viewing store:", store);
    setSelectedStore(store);
    setView("details");
  };

  const handleEditStore = () => {
    setEditingStore(selectedStore);
    setView("form");
  };

  const handleDeleteStore = (storeId: number) => {
    deleteStoreFromContext(storeId);
    setView("list");
    setSelectedStore(undefined);
    toast({
      title: "Venue deleted",
      description: "The venue has been successfully removed.",
    });
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedStore(undefined);
    setEditingStore(undefined);
  };

  const handleSubmitStore = async (storeData: any) => {
    // Don't auto-assign to resort - let users assign manually
    const storeWithResort = {
      ...storeData,
      resortId: storeData.resortId === "unassigned" ? null : storeData.resortId,
    };

    if (storeData.id) {
      // Update existing store
      const updatedStore: Store = {
        ...storeWithResort,
        id: storeData.id,
        customLogo: storeData.customLogo,
        hours: storeData.hours || defaultHours,
      };
      updateStore(updatedStore);
      toast({
        title: "Venue updated",
        description: "The venue has been successfully updated.",
      });
    } else {
      // Create new store
      try {
        const newStore: Store = {
          ...storeWithResort,
          id: Math.max(...stores.map((s) => s.id), 0) + 1,
          customLogo: storeData.customLogo,
          hours: storeData.hours || defaultHours,
        };
        console.log("Creating new venue:", newStore);
        await addStore(newStore);
        toast({
          title: "Venue created",
          description: "The new venue has been successfully added.",
          className: "bg-green-50 border-green-200 text-green-800",
        });
      } catch (error) {
        console.error("Venue creation failed:", error);
        toast({
          title: "Error",
          description: "Failed to create venue. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }
    handleBackToList();
  };

  const handleCloseForm = () => {
    setView(selectedStore ? "details" : "list");
    setEditingStore(undefined);
  };

  return {
    stores,
    view,
    selectedStore,
    editingStore,
    handleCreateStore,
    handleViewStore,
    handleEditStore,
    handleDeleteStore,
    handleBackToList,
    handleSubmitStore,
    handleCloseForm,
  };
};

// Re-export types for backward compatibility
export type { Store, StoreHours };
