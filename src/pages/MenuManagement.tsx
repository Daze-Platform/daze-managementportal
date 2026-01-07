import React, { useState } from 'react';
import { MenusView } from '@/components/menu-management/MenusView';
import { ModifiersView } from '@/components/menu-management/ModifiersView';
import { CreateMenuDialog } from '@/components/menu-management/CreateMenuDialog';
import { MenuBuilderDialog } from '@/components/menu-management/MenuBuilderDialog';
import { StoreAssignmentDialog } from '@/components/menu-management/StoreAssignmentDialog';
import { useMenus, Menu as SupabaseMenu } from '@/contexts/MenusContext';
import { useStores } from '@/contexts/StoresContext';
import { motion } from 'framer-motion';

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

// Legacy interface for compatibility with existing components - now renamed to avoid conflict
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
  const [activeTab, setActiveTab] = useState('menus');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showMenuBuilder, setShowMenuBuilder] = useState(false);
  const [showStoreAssignment, setShowStoreAssignment] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [assigningMenu, setAssigningMenu] = useState<Menu | null>(null);
  const { menus, loading, addMenu, updateMenu, deleteMenu } = useMenus();
  const { stores } = useStores();
  
  const [selectedStore] = useState(() => stores[0] || {
    id: 1,
    name: 'Default Store',
    address: 'No address'
  });

  // Pass Supabase menus directly to components
  const legacyMenus = menus;

  const handleShowCreateDialog = () => {
    setShowCreateDialog(true);
  };

  const handleCreateMenu = async (option: string) => {
    setShowCreateDialog(false);
    
    if (option === 'scratch') {
      setEditingMenu(null);
      setShowMenuBuilder(true);
    } else if (option === 'sample') {
      // Create sample menu with template data
      await addMenu({
        name: 'Sample Restaurant Menu',
        description: 'Professional menu template with sample items',
        category: 'restaurant',
        is_active: true,
        store_id: selectedStore.id,
        items: [
          {
            id: 'sample-1',
            name: 'Grilled Chicken Caesar Salad',
            description: 'Fresh romaine lettuce, grilled chicken breast, parmesan cheese, croutons, and Caesar dressing',
            price: 14.99,
            category: 'Salads',
            modifiers: []
          },
          {
            id: 'sample-2',
            name: 'Classic Cheeseburger',
            description: 'Angus beef patty, cheddar cheese, lettuce, tomato, onion, pickle, served with fries',
            price: 16.99,
            category: 'Burgers',
            modifiers: []
          },
          {
            id: 'sample-3',
            name: 'Margherita Pizza',
            description: 'Fresh mozzarella, tomato sauce, basil, olive oil on wood-fired crust',
            price: 18.99,
            category: 'Pizza',
            modifiers: []
          },
          {
            id: 'sample-4',
            name: 'Fish & Chips',
            description: 'Beer-battered cod, hand-cut fries, coleslaw, tartar sauce',
            price: 19.99,
            category: 'Main Courses',
            modifiers: []
          },
          {
            id: 'sample-5',
            name: 'Chocolate Lava Cake',
            description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
            price: 8.99,
            category: 'Desserts',
            modifiers: []
          }
        ]
      });
    }
  };

  const handleMenuBuilderSave = async (menuData: any) => {
    if (editingMenu) {
      // Update existing menu
      await updateMenu({
        ...editingMenu,
        name: menuData.name,
        description: menuData.description,
        category: menuData.category,
        is_active: menuData.isActive,
        items: menuData.items
      });
    } else {
      // Create new menu
      await addMenu({
        name: menuData.name,
        description: menuData.description,
        category: menuData.category,
        is_active: menuData.isActive,
        store_id: selectedStore.id,
        items: menuData.items
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
    // For now, just toggle active status
    const originalMenu = menus.find(m => m.id === menu.id);
    if (originalMenu) {
      updateMenu({
        ...originalMenu,
        is_active: !originalMenu.is_active
      });
    }
  };

  const handleToggleMenuStatus = (menuId: string) => {
    const menu = menus.find(m => m.id === menuId);
    if (menu) {
      updateMenu({
        ...menu,
        is_active: !menu.is_active
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

  const handleStoreAssignment = async (menuId: string, storeId: number | null) => {
    const menu = menus.find(m => m.id === menuId);
    if (menu) {
      await updateMenu({
        ...menu,
        store_id: storeId
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Editorial Header */}
        <motion.header 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 sm:mb-14"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-border max-w-[60px]" />
            <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground">
              F&B Operations
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-3">
            Menu Management
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Design, organize, and publish your culinary offerings with precision.
          </p>
        </motion.header>

        {/* Refined Tab Navigation */}
        <motion.nav 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('menus')}
              className={`relative px-5 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'menus'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="relative z-10">Menus</span>
              {legacyMenus.length > 0 && (
                <span className={`ml-2 text-xs tabular-nums ${
                  activeTab === 'menus' ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {legacyMenus.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('modifiers')}
              className={`relative px-5 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'modifiers'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Option Sets
            </button>
          </div>
        </motion.nav>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'menus' ? (
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
                initialData={editingMenu ? {
                  name: editingMenu.name,
                  description: editingMenu.description || '',
                  category: editingMenu.category,
                  isActive: editingMenu.is_active,
                  items: editingMenu.items || []
                } : undefined}
                mode={editingMenu ? 'edit' : 'create'}
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
