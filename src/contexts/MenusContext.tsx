import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

export const MenusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMenus = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading menus:', error);
        toast.error('Failed to load menus');
        return;
      }

      setMenus((data || []) as Menu[]);
    } catch (error) {
      console.error('Error loading menus:', error);
      toast.error('Failed to load menus');
    } finally {
      setLoading(false);
    }
  };

  const refreshMenus = async () => {
    await loadMenus();
  };

  const addMenu = async (menuData: Omit<Menu, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('menus')
        .insert([menuData])
        .select()
        .single();

      if (error) {
        console.error('Error adding menu:', error);
        toast.error('Failed to add menu');
        return;
      }

      setMenus(prev => [data as Menu, ...prev]);
      toast.success('Menu added successfully');
    } catch (error) {
      console.error('Error adding menu:', error);
      toast.error('Failed to add menu');
    }
  };

  const updateMenu = async (updatedMenu: Menu) => {
    try {
      const { data, error } = await supabase
        .from('menus')
        .update({
          name: updatedMenu.name,
          description: updatedMenu.description,
          category: updatedMenu.category,
          is_active: updatedMenu.is_active,
          store_id: updatedMenu.store_id,
          resort_id: updatedMenu.resort_id,
          items: updatedMenu.items,
        })
        .eq('id', updatedMenu.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating menu:', error);
        toast.error('Failed to update menu');
        return;
      }

      setMenus(prev => 
        prev.map(menu => menu.id === updatedMenu.id ? data as Menu : menu)
      );
      toast.success('Menu updated successfully');
    } catch (error) {
      console.error('Error updating menu:', error);
      toast.error('Failed to update menu');
    }
  };

  const deleteMenu = async (menuId: string) => {
    try {
      const { error } = await supabase
        .from('menus')
        .delete()
        .eq('id', menuId);

      if (error) {
        console.error('Error deleting menu:', error);
        toast.error('Failed to delete menu');
        return;
      }

      setMenus(prev => prev.filter(menu => menu.id !== menuId));
      toast.success('Menu deleted successfully');
    } catch (error) {
      console.error('Error deleting menu:', error);
      toast.error('Failed to delete menu');
    }
  };

  const getMenusByStore = (storeId: number): Menu[] => {
    return menus.filter(menu => menu.store_id === storeId);
  };

  useEffect(() => {
    loadMenus();
  }, []);

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