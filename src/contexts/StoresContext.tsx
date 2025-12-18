import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Store } from '@/types/store';
import { defaultStores } from '@/data/defaultStores';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStores = async () => {
    try {
      console.log('Loading stores from database...');
      const { data: storesData, error } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: true });

      console.log('Database query result:', { data: storesData, error });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      if (storesData && storesData.length > 0) {
        // Convert database format to our Store type
        const convertedStores: Store[] = storesData.map(store => ({
          id: store.id,
          name: store.name,
          address: store.address,
          locationDescription: store.location_description || '',
          logo: store.logo || '🏪',
          customLogo: store.custom_logo || '',
          bgColor: store.bg_color || 'bg-blue-500',
          activeOrders: store.active_orders || 0,
          hours: (store.hours as any) || [],
          destinationId: store.resort_id || '',
          resortId: store.resort_id || ''
        }));

        console.log('Converted stores:', convertedStores);
        setStores(convertedStores);
      } else {
        console.log('No stores found in database, seeding with default stores...');
        const seeded = await seedDefaultStores();
        if (!seeded) {
          // Fallback to in-memory defaults if seeding fails
          console.log('Using in-memory default stores as fallback');
          setStores(defaultStores);
        }
      }
    } catch (error) {
      console.error('Error loading stores:', error);
      // Fallback to defaults on any error
      setStores(defaultStores);
    } finally {
      setLoading(false);
    }
  };

  const seedDefaultStores = async (): Promise<boolean> => {
    try {
      console.log('Seeding default stores:', defaultStores);
      for (const store of defaultStores) {
        const { error } = await supabase
          .from('stores')
          .insert({
            name: store.name,
            address: store.address,
            location_description: store.locationDescription,
            logo: store.logo,
            custom_logo: store.customLogo,
            bg_color: store.bgColor,
            active_orders: store.activeOrders,
            hours: store.hours as any,
            resort_id: store.destinationId || store.resortId
          });

        if (error) {
          console.error('Error seeding store:', store.name, error);
          return false;
        }
      }
      // Reload stores after seeding
      const { data: newStoresData } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: true });

      if (newStoresData && newStoresData.length > 0) {
        const convertedStores: Store[] = newStoresData.map(store => ({
          id: store.id,
          name: store.name,
          address: store.address,
          locationDescription: store.location_description || '',
          logo: store.logo || '🏪',
          customLogo: store.custom_logo || '',
          bgColor: store.bg_color || 'bg-blue-500',
          activeOrders: store.active_orders || 0,
          hours: (store.hours as any) || [],
          destinationId: store.resort_id || '',
          resortId: store.resort_id || ''
        }));
        setStores(convertedStores);
        toast.success('Default stores loaded');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error seeding default stores:', error);
      return false;
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  const refreshStores = () => {
    loadStores();
  };

  const getStoresByDestination = (destinationId: string): Store[] => {
    return stores.filter(store => store.destinationId === destinationId || store.resortId === destinationId);
  };

  // Legacy alias
  const getStoresByResort = getStoresByDestination;

  const addStore = async (store: Store) => {
    // If store has an ID, check if it already exists and update instead
    if (store.id && stores.find(s => s.id === store.id)) {
      await updateStore(store);
      return;
    }
    
    try {
      console.log('Adding store:', store);
      const { data, error } = await supabase
        .from('stores')
        .insert({
          name: store.name,
          address: store.address,
          location_description: store.locationDescription,
          logo: store.logo,
          custom_logo: store.customLogo,
          bg_color: store.bgColor,
          active_orders: store.activeOrders,
          hours: store.hours as any,
          resort_id: store.destinationId || store.resortId
        })
        .select()
        .single();

      if (error) {
        console.error('Database insert error:', error);
        throw error;
      }

      console.log('Store added to database:', data);
      // Create updated store with the new database ID
      const newStore = { ...store, id: data.id };
      const newStores = [...stores, newStore];
      setStores(newStores);
      toast.success('Store created successfully');
      console.log('Updated stores list:', newStores);
    } catch (error) {
      console.error('Error adding store:', error);
      toast.error('Failed to create store');
      throw error; // Re-throw so the form can show the error
    }
  };

  const updateStore = async (updatedStore: Store) => {
    try {
      const { error } = await supabase
        .from('stores')
        .update({
          name: updatedStore.name,
          address: updatedStore.address,
          location_description: updatedStore.locationDescription,
          logo: updatedStore.logo,
          custom_logo: updatedStore.customLogo,
          bg_color: updatedStore.bgColor,
          active_orders: updatedStore.activeOrders,
          hours: updatedStore.hours as any,
          resort_id: updatedStore.destinationId || updatedStore.resortId
        })
        .eq('id', updatedStore.id);

      if (error) {
        console.error('Store update error:', error);
        throw error;
      }

      const newStores = stores.map(store => 
        store.id === updatedStore.id ? updatedStore : store
      );
      setStores(newStores);
    } catch (error) {
      console.error('Error updating store:', error);
    }
  };

  const deleteStore = async (storeId: number) => {
    try {
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', storeId);

      if (error) throw error;

      const newStores = stores.filter(store => store.id !== storeId);
      setStores(newStores);
    } catch (error) {
      console.error('Error deleting store:', error);
    }
  };

  return (
    <StoresContext.Provider value={{ 
      stores, 
      getStoresByDestination,
      getStoresByResort, 
      addStore, 
      updateStore, 
      deleteStore, 
      refreshStores 
    }}>
      {children}
    </StoresContext.Provider>
  );
};

export const useStores = () => {
  const context = useContext(StoresContext);
  if (context === undefined) {
    throw new Error('useStores must be used within a StoresProvider');
  }
  return context;
};

export type { Store, StoreHours } from '@/types/store';
