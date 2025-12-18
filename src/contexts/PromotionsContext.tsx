import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Promotion {
  id: string;
  title: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  store_id?: number;
  resort_id?: string;
  conditions: any;
  usage_limit?: number;
  usage_count: number;
  created_at?: string;
  updated_at?: string;
}

interface PromotionsContextType {
  promotions: Promotion[];
  loading: boolean;
  addPromotion: (promotion: Omit<Promotion, 'id' | 'created_at' | 'updated_at' | 'usage_count'>) => Promise<void>;
  updatePromotion: (promotion: Promotion) => Promise<void>;
  deletePromotion: (promotionId: string) => Promise<void>;
  refreshPromotions: () => Promise<void>;
  getPromotionsByStore: (storeId: number) => Promotion[];
  getActivePromotions: () => Promotion[];
}

const PromotionsContext = createContext<PromotionsContextType | undefined>(undefined);

export const PromotionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPromotions = async (showErrors = false) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Could not load promotions:', error.message);
        if (showErrors) {
          toast.error('Failed to load promotions');
        }
        return;
      }

      setPromotions((data || []) as Promotion[]);
    } catch (error) {
      console.warn('Network error loading promotions:', error);
      if (showErrors) {
        toast.error('Failed to load promotions');
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshPromotions = async () => {
    await loadPromotions(true);
  };

  const addPromotion = async (promotionData: Omit<Promotion, 'id' | 'created_at' | 'updated_at' | 'usage_count'>) => {
    // Create optimistic promotion with temporary ID
    const tempId = `temp-${Date.now()}`;
    const optimisticPromotion: Promotion = {
      ...promotionData,
      id: tempId,
      usage_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to local state immediately (optimistic update)
    setPromotions(prev => [optimisticPromotion, ...prev]);
    toast.success('Promotion added successfully');

    try {
      const { data, error } = await supabase
        .from('promotions')
        .insert([{ ...promotionData, usage_count: 0 }])
        .select()
        .single();

      if (error) {
        console.warn('Could not sync promotion to database:', error.message);
        // Keep the local version - it's still usable
        return;
      }

      // Replace temp ID with real ID from database
      setPromotions(prev => 
        prev.map(p => p.id === tempId ? (data as Promotion) : p)
      );
    } catch (error) {
      console.warn('Network error syncing promotion:', error);
      // Keep the local version
    }
  };

  const updatePromotion = async (updatedPromotion: Promotion) => {
    // Optimistic update
    setPromotions(prev => 
      prev.map(promotion => promotion.id === updatedPromotion.id ? updatedPromotion : promotion)
    );
    toast.success('Promotion updated successfully');

    try {
      const { error } = await supabase
        .from('promotions')
        .update({
          title: updatedPromotion.title,
          description: updatedPromotion.description,
          discount_type: updatedPromotion.discount_type,
          discount_value: updatedPromotion.discount_value,
          start_date: updatedPromotion.start_date,
          end_date: updatedPromotion.end_date,
          is_active: updatedPromotion.is_active,
          store_id: updatedPromotion.store_id,
          resort_id: updatedPromotion.resort_id,
          conditions: updatedPromotion.conditions,
          usage_limit: updatedPromotion.usage_limit,
          usage_count: updatedPromotion.usage_count,
        })
        .eq('id', updatedPromotion.id);

      if (error) {
        console.warn('Could not sync promotion update:', error.message);
      }
    } catch (error) {
      console.warn('Network error syncing promotion update:', error);
    }
  };

  const deletePromotion = async (promotionId: string) => {
    // Optimistic delete
    setPromotions(prev => prev.filter(promotion => promotion.id !== promotionId));
    toast.success('Promotion deleted successfully');

    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', promotionId);

      if (error) {
        console.warn('Could not sync promotion deletion:', error.message);
      }
    } catch (error) {
      console.warn('Network error syncing promotion deletion:', error);
    }
  };

  const getPromotionsByStore = (storeId: number): Promotion[] => {
    return promotions.filter(promotion => promotion.store_id === storeId);
  };

  const getActivePromotions = (): Promotion[] => {
    const now = new Date();
    return promotions.filter(promotion => 
      promotion.is_active && 
      new Date(promotion.start_date) <= now && 
      new Date(promotion.end_date) >= now
    );
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const value: PromotionsContextType = {
    promotions,
    loading,
    addPromotion,
    updatePromotion,
    deletePromotion,
    refreshPromotions,
    getPromotionsByStore,
    getActivePromotions,
  };

  return (
    <PromotionsContext.Provider value={value}>
      {children}
    </PromotionsContext.Provider>
  );
};

export const usePromotions = (): PromotionsContextType => {
  const context = useContext(PromotionsContext);
  if (!context) {
    throw new Error('usePromotions must be used within a PromotionsProvider');
  }
  return context;
};
