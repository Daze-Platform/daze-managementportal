import React, { useState, useEffect, useRef } from "react";
import { StoreForm } from "@/components/stores/StoreForm";
import { StoreDetails } from "@/components/stores/StoreDetails";
import { StoresList } from "@/components/stores/StoresList";
import { Sidebar } from "@/components/layout/Sidebar";
import { useStoreManagement } from "@/hooks/useStoreManagement";
import { Skeleton } from "@/components/ui/skeleton";

export const Stores = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const {
    stores,
    loading,
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
  } = useStoreManagement();

  // Scroll to top whenever the view changes (list → details → form → back)
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "instant" });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [view]);

  // Show store details view
  if (view === "details" && selectedStore) {
    return (
      <div className="relative" ref={topRef}>
        <div className="lg:hidden">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
        <StoreDetails
          store={selectedStore}
          onClose={handleBackToList}
          onEdit={handleEditStore}
          onDelete={handleDeleteStore}
        />
      </div>
    );
  }

  // Show form view
  if (view === "form") {
    return (
      <div className="relative" ref={topRef}>
        <div className="lg:hidden">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
        <div className="p-3 sm:p-4 lg:p-6">
          <StoreForm
            isOpen={true}
            onClose={handleCloseForm}
            onSubmit={handleSubmitStore}
            store={editingStore}
          />
        </div>
      </div>
    );
  }

  // Show stores list view — with skeleton while loading
  return (
    <div className="relative min-h-screen bg-gray-50" ref={topRef}>
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="space-y-6">
            {/* Header skeleton */}
            <div className="rounded-xl border bg-card shadow p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-32 rounded-md" />
              </div>
            </div>
            {/* List skeleton */}
            <div className="rounded-xl border bg-card shadow overflow-hidden p-4 sm:p-6 space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-border/50">
                  <Skeleton className="h-12 w-12 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                  <Skeleton className="h-5 w-5 rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <StoresList
            stores={stores}
            onCreateStore={handleCreateStore}
            onViewStore={handleViewStore}
          />
        )}
      </div>
    </div>
  );
};
