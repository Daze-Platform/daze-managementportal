import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';
import { storeMenuTemplates } from '@/data/storeMenuTemplates';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  modifierGroups?: string[];
  modifiers?: any[];
}

export interface Menu {
  id: string;
  name: string;
  description?: string;
  category: string;
  is_active: boolean;
  store_id?: number;
  resort_id?: string;
  items: MenuItem[];
  created_at?: string;
  updated_at?: string;
}

interface MenusContextType {
  menus: Menu[];
  loading: boolean;
  addMenu: (menu: Omit<Menu, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateMenu: (menu: Menu) => Promise<void>;
  deleteMenu: (menuId: string) => Promise<void>;
  refreshMenus: () => Promise<void>;
  getMenusByStore: (storeId: number) => Menu[];
}

const MenusContext = createContext<MenusContextType | undefined>(undefined);

// Convert store menu templates to Menu format
const createInitialMenus = (): Menu[] => {
  const menus: Menu[] = [];
  
  // Brother Fox - Food Menu (Store ID: 1)
  const brotherFoxTemplate = storeMenuTemplates['brother-fox'];
  if (brotherFoxTemplate) {
    const items: MenuItem[] = [];
    brotherFoxTemplate.categories.forEach(category => {
      category.items.forEach(item => {
        items.push({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          category: category.name,
          modifierGroups: item.modifierGroups,
        });
      });
    });
    
    menus.push({
      id: 'menu-brother-fox-food',
      name: 'Food Menu',
      description: 'Wood-fired hearth cuisine featuring shared plates, charbroiled oysters, and seasonal dishes',
      category: 'restaurant',
      is_active: true,
      store_id: 1,
      items,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  
  // Sister Hen - Cocktails & Bar Snacks (Store ID: 2)
  const sisterHenTemplate = storeMenuTemplates['sister-hen'];
  if (sisterHenTemplate) {
    const items: MenuItem[] = [];
    sisterHenTemplate.categories.forEach(category => {
      category.items.forEach(item => {
        items.push({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          category: category.name,
          modifierGroups: item.modifierGroups,
        });
      });
    });
    
    menus.push({
      id: 'menu-sister-hen-cocktails',
      name: 'Cocktails & Bar Snacks',
      description: 'Prohibition-era inspired cocktails and elevated bar snacks',
      category: 'bar',
      is_active: true,
      store_id: 2,
      items,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  
  // Cousin Wolf - Breakfast Menu (Store ID: 3)
  const cousinWolfTemplate = storeMenuTemplates['cousin-wolf'];
  if (cousinWolfTemplate) {
    const items: MenuItem[] = [];
    cousinWolfTemplate.categories.forEach(category => {
      category.items.forEach(item => {
        items.push({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          category: category.name,
          modifierGroups: item.modifierGroups,
        });
      });
    });
    
    menus.push({
      id: 'menu-cousin-wolf-breakfast',
      name: 'Breakfast Menu',
      description: 'Grab-and-go breakfast favorites from our courtyard food truck',
      category: 'food-truck',
      is_active: true,
      store_id: 3,
      items,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  
  return menus;
};

export const MenusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menus, setMenus] = useState<Menu[]>(createInitialMenus);
  const [loading] = useState(false);

  const refreshMenus = async () => {
    // No-op for demo mode - data is already in state
    toast.success('Menus refreshed');
  };

  const addMenu = async (menuData: Omit<Menu, 'id' | 'created_at' | 'updated_at'>) => {
    const newMenu: Menu = {
      ...menuData,
      id: `menu-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setMenus(prev => [newMenu, ...prev]);
    toast.success('Menu added successfully');
  };

  const updateMenu = async (updatedMenu: Menu) => {
    setMenus(prev => 
      prev.map(menu => 
        menu.id === updatedMenu.id 
          ? { ...updatedMenu, updated_at: new Date().toISOString() }
          : menu
      )
    );
    toast.success('Menu updated successfully');
  };

  const deleteMenu = async (menuId: string) => {
    setMenus(prev => prev.filter(menu => menu.id !== menuId));
    toast.success('Menu deleted successfully');
  };

  const getMenusByStore = (storeId: number): Menu[] => {
    return menus.filter(menu => menu.store_id === storeId);
  };

  const value: MenusContextType = {
    menus,
    loading,
    addMenu,
    updateMenu,
    deleteMenu,
    refreshMenus,
    getMenusByStore,
  };

  return (
    <MenusContext.Provider value={value}>
      {children}
    </MenusContext.Provider>
  );
};

export const useMenus = (): MenusContextType => {
  const context = useContext(MenusContext);
  if (!context) {
    throw new Error('useMenus must be used within a MenusProvider');
  }
  return context;
};
