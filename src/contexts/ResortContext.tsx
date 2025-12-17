import React, { createContext, useContext, useState, useEffect } from 'react';
import { Resort } from '@/components/settings/ResortManagement';
import { supabase } from '@/integrations/supabase/client';

interface ResortContextType {
  currentResort: Resort | null;
  resorts: Resort[];
  setCurrentResort: (resort: Resort | null) => void;
  setResorts: (resorts: Resort[]) => void;
  addResort: (resort: Resort) => void;
  updateResort: (resort: Resort) => void;
  deleteResort: (resortId: string) => void;
}

const ResortContext = createContext<ResortContextType | undefined>(undefined);

const defaultResorts: Resort[] = [
  {
    id: 'lily-hall-pensacola',
    name: 'Lily Hall Pensacola',
    location: 'Old East Hill, Pensacola, FL',
    address: '1105 E Cervantes St, Pensacola, FL 32501',
    phone: '(850) 208-6913',
    email: 'info@lilyhall.com',
    manager: 'Kari Thomas',
    status: 'active',
    storeCount: 3,
    createdAt: '2024-01-15',
    logo: ''
  }
];

export const ResortProvider = ({ children }: { children: React.ReactNode }) => {
  const [resorts, setResortsState] = useState<Resort[]>([]);
  const [currentResort, setCurrentResort] = useState<Resort | null>(null);
  const [loading, setLoading] = useState(true);

  // Load resorts from Supabase on mount
  useEffect(() => {
    loadResortsFromDatabase();
  }, []);

  const loadResortsFromDatabase = async () => {
    try {
      const { data: resortsData, error } = await supabase
        .from('resorts')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (resortsData && resortsData.length > 0) {
        // Convert database format to our Resort type
        const convertedResorts: Resort[] = resortsData.map(resort => ({
          id: resort.id,
          name: resort.name,
          location: resort.location || '',
          address: resort.address || '',
          phone: resort.phone || '',
          email: resort.email || '',
          manager: resort.manager || '',
          status: (resort.status as 'active' | 'inactive') || 'active',
          storeCount: resort.store_count || 0,
          createdAt: resort.created_at?.split('T')[0] || '',
          logo: resort.logo || ''
        }));

        setResortsState(convertedResorts);
        
        // Get current resort from localStorage or use first resort
        const savedCurrentResortId = localStorage.getItem('currentResortId');
        const currentResortToSet = savedCurrentResortId 
          ? convertedResorts.find(r => r.id === savedCurrentResortId) || convertedResorts[0]
          : convertedResorts[0];
        
        setCurrentResort(currentResortToSet);
        localStorage.setItem('currentResortId', currentResortToSet.id);
      } else {
        // Insert default resorts if none exist
        await insertDefaultResorts();
      }
    } catch (error) {
      console.error('Error loading resorts:', error);
      // Fallback to defaults
      setResortsState(defaultResorts);
      setCurrentResort(defaultResorts[0]);
    } finally {
      setLoading(false);
    }
  };

  const insertDefaultResorts = async () => {
    try {
      const { data, error } = await supabase
        .from('resorts')
        .insert(defaultResorts.map(resort => ({
          id: resort.id,
          name: resort.name,
          location: resort.location,
          address: resort.address,
          phone: resort.phone,
          email: resort.email,
          manager: resort.manager,
          status: resort.status,
          store_count: resort.storeCount,
          logo: resort.logo
        })))
        .select();

      if (error) throw error;

      setResortsState(defaultResorts);
      setCurrentResort(defaultResorts[0]);
      localStorage.setItem('currentResortId', defaultResorts[0].id);
    } catch (error) {
      console.error('Error inserting default resorts:', error);
    }
  };

  // Save current resort ID to localStorage when it changes
  useEffect(() => {
    if (currentResort) {
      localStorage.setItem('currentResortId', currentResort.id);
    }
  }, [currentResort]);

  const setResorts = (newResorts: Resort[]) => {
    setResortsState(newResorts);
  };

  const addResort = async (resort: Resort) => {
    try {
      const { error } = await supabase
        .from('resorts')
        .insert({
          id: resort.id,
          name: resort.name,
          location: resort.location,
          address: resort.address,
          phone: resort.phone,
          email: resort.email,
          manager: resort.manager,
          status: resort.status,
          store_count: resort.storeCount,
          logo: resort.logo
        });

      if (error) throw error;

      const newResorts = [...resorts, resort];
      setResortsState(newResorts);
    } catch (error) {
      console.error('Error adding resort:', error);
    }
  };

  const updateResort = async (updatedResort: Resort) => {
    console.log('Updating resort with data:', updatedResort);
    console.log('Logo data length:', updatedResort.logo?.length || 0);
    
    try {
      const { error } = await supabase
        .from('resorts')
        .update({
          name: updatedResort.name,
          location: updatedResort.location,
          address: updatedResort.address,
          phone: updatedResort.phone,
          email: updatedResort.email,
          manager: updatedResort.manager,
          status: updatedResort.status,
          store_count: updatedResort.storeCount,
          logo: updatedResort.logo
        })
        .eq('id', updatedResort.id);

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Resort update successful in database');

      const newResorts = resorts.map(resort => 
        resort.id === updatedResort.id ? updatedResort : resort
      );
      setResortsState(newResorts);
      
      // Update current resort if it's the one being edited
      if (currentResort && currentResort.id === updatedResort.id) {
        setCurrentResort(updatedResort);
      }
      
      console.log('Resort state updated successfully');
    } catch (error) {
      console.error('Error updating resort:', error);
    }
  };

  const deleteResort = async (resortId: string) => {
    try {
      const { error } = await supabase
        .from('resorts')
        .delete()
        .eq('id', resortId);

      if (error) throw error;

      const newResorts = resorts.filter(resort => resort.id !== resortId);
      setResortsState(newResorts);
      
      // If current resort is deleted, set to first available or null
      if (currentResort && currentResort.id === resortId) {
        const nextResort = newResorts.length > 0 ? newResorts[0] : null;
        setCurrentResort(nextResort);
        if (nextResort) {
          localStorage.setItem('currentResortId', nextResort.id);
        } else {
          localStorage.removeItem('currentResortId');
        }
      }
    } catch (error) {
      console.error('Error deleting resort:', error);
    }
  };

  return (
    <ResortContext.Provider value={{
      currentResort,
      resorts,
      setCurrentResort,
      setResorts,
      addResort,
      updateResort,
      deleteResort
    }}>
      {children}
    </ResortContext.Provider>
  );
};

export const useResort = () => {
  const context = useContext(ResortContext);
  if (context === undefined) {
    throw new Error('useResort must be used within a ResortProvider');
  }
  return context;
};