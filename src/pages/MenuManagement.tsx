import React, { useState } from "react";
import { MenusView } from "@/components/menu-management/MenusView";
import { ModifiersView } from "@/components/menu-management/ModifiersView";
import { CreateMenuDialog } from "@/components/menu-management/CreateMenuDialog";
import { MenuBuilderDialog } from "@/components/menu-management/MenuBuilderDialog";
import { StoreAssignmentDialog } from "@/components/menu-management/StoreAssignmentDialog";
import { useMenus, Menu as SupabaseMenu } from "@/contexts/MenusContext";
import { useStores } from "@/contexts/StoresContext";
import { motion } from "framer-motion";

// Re-export Menu type for backwards compatibility
export interface Menu {
  id: string;
  name: string;
  description?: string;
  category: string;
  is_active: boolean;
  store_id?: number;
  resort_id?: string;
  items: any[];
  created_at?: string;
  updated_at?: string;
}

// Legacy interface for compatibility with existing components
interface LegacyMenuForRef {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  itemCount: number;
  lastUpdated: string;
  categories: MenuCategory[];
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  modifierGroups: string[];
}

export const MenuManagement = () => {
  const [activeTab, setActiveTab] = useState("menus");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showMenuBuilder, setShowMenuBuilder] = useState(false);
  const [showStoreAssignment, setShowStoreAssignment] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [assigningMenu, setAssigningMenu] = useState<Menu | null>(null);
  const { menus, loading, addMenu, updateMenu, deleteMenu } = useMenus();
  const { stores } = useStores();

  const [selectedStore] = useState(
    () =>
      stores[0] || {
        id: 1,
        name: "Default Store",
        address: "No address",
      },
  );

  const legacyMenus = menus;

  const handleShowCreateDialog = () => {
    setShowCreateDialog(true);
  };

  const handleCreateMenu = async (option: string) => {
    setShowCreateDialog(false);

    if (option === "scratch") {
      setEditingMenu(null);
      setShowMenuBuilder(true);
    } else if (option === "sample") {
      await addMenu({
        name: "Sample Restaurant Menu",
        description: "Professional menu template with sample items",
        category: "restaurant",
        is_active: true,
        store_id: selectedStore.id,
        items: [
          {
            id: "sample-1",
            name: "Grilled Chicken Caesar Salad",
            description:
              "Fresh romaine lettuce, grilled chicken breast, parmesan cheese, croutons, and Caesar dressing",
            price: 14.99,
            category: "Salads",
            modifiers: [],
          },
          {
            id: "sample-2",
            name: "Classic Cheeseburger",
            description:
              "Angus beef patty, cheddar cheese, lettuce, tomato, onion, pickle, served with fries",
            price: 16.99,
            category: "Burgers",
            modifiers: [],
          },
          {
            id: "sample-3",
            name: "Margherita Pizza",
            description:
              "Fresh mozzarella, tomato sauce, basil, olive oil on wood-fired crust",
            price: 18.99,
            category: "Pizza",
            modifiers: [],
          },
          {
            id: "sample-4",
            name: "Fish & Chips",
            description:
              "Beer-battered cod, hand-cut fries, coleslaw, tartar sauce",
            price: 19.99,
            category: "Main Courses",
            modifiers: [],
          },
          {
            id: "sample-5",
            name: "Chocolate Lava Cake",
            description:
              "Warm chocolate cake with molten center, served with vanilla ice cream",
            price: 8.99,
            category: "Desserts",
            modifiers: [],
          },
        ],
      });
    }
  };

  const handleMenuBuilderSave = async (menuData: any) => {
    if (editingMenu) {
      await updateMenu({
        ...editingMenu,
        name: menuData.name,
        description: menuData.description,
        category: menuData.category,
        is_active: menuData.isActive,
        items: menuData.items,
      });
    } else {
      await addMenu({
        name: menuData.name,
        description: menuData.description,
        category: menuData.category,
        is_active: menuData.isActive,
        store_id: selectedStore.id,
        items: menuData.items,
      });
    }
    setShowMenuBuilder(false);
    setEditingMenu(null);
  };

  const handleEditMenuDetails = (menu: Menu) => {
    setEditingMenu(menu);
    setShowMenuBuilder(true);
  };

  const handleEditMenu = (menu: Menu) => {
    const originalMenu = menus.find((m) => m.id === menu.id);
    if (originalMenu) {
      updateMenu({
        ...originalMenu,
        is_active: !originalMenu.is_active,
      });
    }
  };

  const handleToggleMenuStatus = (menuId: string) => {
    const menu = menus.find((m) => m.id === menuId);
    if (menu) {
      updateMenu({
        ...menu,
        is_active: !menu.is_active,
      });
    }
  };

  const handleDeleteMenu = async (menuId: string) => {
    await deleteMenu(menuId);
  };

  const handleAssignStore = (menu: Menu) => {
    setAssigningMenu(menu);
    setShowStoreAssignment(true);
  };

  const handleStoreAssignment = async (
    menuId: string,
    storeId: number | null,
  ) => {
    const menu = menus.find((m) => m.id === menuId);
    if (menu) {
      await updateMenu({
        ...menu,
        store_id: storeId,
      });
    }
    setShowStoreAssignment(false);
    setAssigningMenu(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading menus...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <nav className="text-sm text-muted-foreground mb-4">
            <span>Operations</span>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">Menu Management</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Menu Management
          </h1>
        </motion.header>

        {/* Tab Navigation */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="border-b border-border mb-8"
        >
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("menus")}
              className={`relative pb-3 text-sm font-medium transition-colors ${
                activeTab === "menus"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Menus
              {legacyMenus.length > 0 && (
                <span className="ml-2 text-xs tabular-nums text-muted-foreground">
                  {legacyMenus.length}
                </span>
              )}
              {activeTab === "menus" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("modifiers")}
              className={`relative pb-3 text-sm font-medium transition-colors ${
                activeTab === "modifiers"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Option Sets
              {activeTab === "modifiers" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                />
              )}
            </button>
          </div>
        </motion.nav>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === "menus" ? (
            <>
              <MenusView
                menus={legacyMenus}
                selectedStoreName={selectedStore.name}
                onShowCreateDialog={handleShowCreateDialog}
                onEditMenu={handleEditMenuDetails}
                onToggleMenuStatus={handleToggleMenuStatus}
                onDeleteMenu={handleDeleteMenu}
                onAssignStore={handleAssignStore}
              />
              <CreateMenuDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
                onContinue={handleCreateMenu}
              />
              <MenuBuilderDialog
                open={showMenuBuilder}
                onOpenChange={setShowMenuBuilder}
                onSave={handleMenuBuilderSave}
                initialData={
                  editingMenu
                    ? {
                        name: editingMenu.name,
                        description: editingMenu.description || "",
                        category: editingMenu.category,
                        isActive: editingMenu.is_active,
                        items: editingMenu.items || [],
                      }
                    : undefined
                }
                mode={editingMenu ? "edit" : "create"}
              />
              <StoreAssignmentDialog
                open={showStoreAssignment}
                onOpenChange={setShowStoreAssignment}
                menu={assigningMenu}
                onAssign={handleStoreAssignment}
              />
            </>
          ) : (
            <ModifiersView
              storeId={selectedStore.id.toString()}
              storeName={selectedStore.name}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};
