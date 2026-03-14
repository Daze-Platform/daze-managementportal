import React, { useState } from "react";
import { StoreForm } from "@/components/stores/StoreForm";
import { StoreDetails } from "@/components/stores/StoreDetails";
import { StoresList } from "@/components/stores/StoresList";
import { Sidebar } from "@/components/layout/Sidebar";
import { useStoreManagement } from "@/hooks/useStoreManagement";

export const Stores = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
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
  } = useStoreManagement();

  // Show store details view
  if (view === "details" && selectedStore) {
    return (
      <div className="relative">
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
      <div className="relative">
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

  // Show stores list view
  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
        <StoresList
          stores={stores}
          onCreateStore={handleCreateStore}
          onViewStore={handleViewStore}
        />
      </div>
    </div>
  );
};
