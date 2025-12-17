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

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading promotions:', error);
        toast.error('Failed to load promotions');
        return;
      }

      setPromotions((data || []) as Promotion[]);
    } catch (error) {
      console.error('Error loading promotions:', error);
      toast.error('Failed to load promotions');
    } finally {
      setLoading(false);
    }
  };

  const refreshPromotions = async () => {
    await loadPromotions();
  };

  const addPromotion = async (promotionData: Omit<Promotion, 'id' | 'created_at' | 'updated_at' | 'usage_count'>) => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .insert([{ ...promotionData, usage_count: 0 }])
        .select()
        .single();

      if (error) {
        console.error('Error adding promotion:', error);
        toast.error('Failed to add promotion');
        return;
      }

      setPromotions(prev => [data as Promotion, ...prev]);
      toast.success('Promotion added successfully');
    } catch (error) {
      console.error('Error adding promotion:', error);
      toast.error('Failed to add promotion');
    }
  };

  const updatePromotion = async (updatedPromotion: Promotion) => {
    try {
      const { data, error } = await supabase
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
        .eq('id', updatedPromotion.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating promotion:', error);
        toast.error('Failed to update promotion');
        return;
      }

      setPromotions(prev => 
        prev.map(promotion => promotion.id === updatedPromotion.id ? data as Promotion : promotion)
      );
      toast.success('Promotion updated successfully');
    } catch (error) {
      console.error('Error updating promotion:', error);
      toast.error('Failed to update promotion');
    }
  };

  const deletePromotion = async (promotionId: string) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', promotionId);

      if (error) {
        console.error('Error deleting promotion:', error);
        toast.error('Failed to delete promotion');
        return;
      }

      setPromotions(prev => prev.filter(promotion => promotion.id !== promotionId));
      toast.success('Promotion deleted successfully');
    } catch (error) {
      console.error('Error deleting promotion:', error);
      toast.error('Failed to delete promotion');
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