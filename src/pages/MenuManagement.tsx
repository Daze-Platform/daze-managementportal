import React, { useState } from 'react';
import { MenusView } from '@/components/menu-management/MenusView';
import { ModifiersView } from '@/components/menu-management/ModifiersView';
import { CreateMenuDialog } from '@/components/menu-management/CreateMenuDialog';
import { MenuBuilderDialog } from '@/components/menu-management/MenuBuilderDialog';
import { StoreAssignmentDialog } from '@/components/menu-management/StoreAssignmentDialog';
import { useMenus, Menu as SupabaseMenu } from '@/contexts/MenusContext';
import { useStores } from '@/contexts/StoresContext';

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
            name: 'Grilled Chicken Caesar Salad',
            description: 'Fresh romaine lettuce, grilled chicken breast, parmesan cheese, croutons, and Caesar dressing',
            price: 14.99,
            category: 'Salads',
            modifiers: []
          },
          {
            name: 'Classic Cheeseburger',
            description: 'Angus beef patty, cheddar cheese, lettuce, tomato, onion, pickle, served with fries',
            price: 16.99,
            category: 'Burgers',
            modifiers: []
          },
          {
            name: 'Margherita Pizza',
            description: 'Fresh mozzarella, tomato sauce, basil, olive oil on wood-fired crust',
            price: 18.99,
            category: 'Pizza',
            modifiers: []
          },
          {
            name: 'Fish & Chips',
            description: 'Beer-battered cod, hand-cut fries, coleslaw, tartar sauce',
            price: 19.99,
            category: 'Main Courses',
            modifiers: []
          },
          {
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Menu Management</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Professional menu creation and management tools for F&B operations</p>
          </div>
        </div>

      {/* Improved Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('menus')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'menus'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Menus
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                activeTab === 'menus' 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {legacyMenus.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('modifiers')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'modifiers'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Option Sets
            </button>
          </nav>
        </div>
      </div>

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
      </div>
    </div>
  );
};