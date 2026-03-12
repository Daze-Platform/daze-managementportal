import React, { createContext, useContext, useState, useEffect } from 'react';
import { Destination } from '@/components/settings/DestinationManagement';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DestinationContextType {
  currentDestination: Destination | null;
  destinations: Destination[];
  setCurrentDestination: (destination: Destination | null) => void;
  setDestinations: (destinations: Destination[]) => void;
  addDestination: (destination: Destination) => void;
  updateDestination: (destination: Destination) => void;
  deleteDestination: (destinationId: string) => void;
  // Legacy aliases for backwards compatibility
  currentResort: Destination | null;
  resorts: Destination[];
}

const DestinationContext = createContext<DestinationContextType | undefined>(undefined);

const defaultDestinations: Destination[] = [
  {
    id: 'pensacola-beach-resort',
    name: 'Pensacola Beach Resort',
    location: 'Pensacola Beach FL',
    address: '165 Fort Pickens Rd, Pensacola Beach, FL 32561',
    phone: '(850) 916-9755',
    email: 'info@pensacolabeachresort.com',
    manager: 'Jay Culham',
    status: 'active',
    storeCount: 1,
    createdAt: '2026-03-10',
    logo: ''
  },
  {
    id: 'innisfree-piazza-pizza',
    name: 'Innisfree Hotels — Piazza Pizza',
    location: 'Pensacola Beach FL',
    address: 'Hilton Pensacola Beach, 12 Via De Luna Dr, Pensacola Beach, FL 32561',
    phone: '(850) 916-2999',
    email: 'mrodriguez@innisfreehotels.com',
    manager: 'Manuel Rodriguez',
    status: 'active',
    storeCount: 1,
    createdAt: '2026-03-11',
    logo: ''
  }
];

export const DestinationProvider = ({ children }: { children: React.ReactNode }) => {
  const [destinations, setDestinationsState] = useState<Destination[]>(defaultDestinations);
  const [currentDestination, setCurrentDestination] = useState<Destination | null>(defaultDestinations[0]);
  const [loading, setLoading] = useState(true);

  // Load destinations from Supabase on mount
  // Note: DB resorts table uses map schema (lat/lng/zoom), not management schema.
  // For now, use hardcoded defaults. Will wire to DB once schema is aligned.
  useEffect(() => {
    // loadDestinationsFromDatabase();
    setLoading(false);
  }, []);

  const loadDestinationsFromDatabase = async () => {
    try {
      const { data: destinationsData, error } = await supabase
        .from('resorts')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('Could not load destinations from database:', error.message);
        // Keep using defaults - already set in state
        return;
      }

      if (destinationsData && destinationsData.length > 0) {
        // Convert database format to our Destination type
        const convertedDestinations: Destination[] = destinationsData.map(destination => ({
          id: destination.id,
          name: destination.name,
          location: destination.location || '',
          address: destination.address || '',
          phone: destination.phone || '',
          email: destination.email || '',
          manager: destination.manager || '',
          status: (destination.status as 'active' | 'inactive') || 'active',
          storeCount: destination.store_count || 0,
          createdAt: destination.created_at?.split('T')[0] || '',
          logo: destination.logo || ''
        }));

        setDestinationsState(convertedDestinations);
        
        // Get current destination from localStorage or use first destination
        const savedCurrentDestinationId = localStorage.getItem('currentDestinationId') || localStorage.getItem('currentResortId');
        const currentDestinationToSet = savedCurrentDestinationId 
          ? convertedDestinations.find(d => d.id === savedCurrentDestinationId) || convertedDestinations[0]
          : convertedDestinations[0];
        
        setCurrentDestination(currentDestinationToSet);
        localStorage.setItem('currentDestinationId', currentDestinationToSet.id);
      } else {
        // Try to insert default destinations
        insertDefaultDestinations();
      }
    } catch (error) {
      console.warn('Network error loading destinations:', error);
      // Keep using defaults - already set in state
    } finally {
      setLoading(false);
    }
  };

  const insertDefaultDestinations = async () => {
    try {
      await supabase
        .from('resorts')
        .insert(defaultDestinations.map(destination => ({
          id: destination.id,
          name: destination.name,
          location: destination.location,
          address: destination.address,
          phone: destination.phone,
          email: destination.email,
          manager: destination.manager,
          status: destination.status,
          store_count: destination.storeCount,
          logo: destination.logo
        })));
      // Defaults already in state, no need to update
    } catch (error) {
      console.warn('Could not seed default destinations:', error);
    }
  };

  // Save current destination ID to localStorage when it changes
  useEffect(() => {
    if (currentDestination) {
      localStorage.setItem('currentDestinationId', currentDestination.id);
    }
  }, [currentDestination]);

  const setDestinations = (newDestinations: Destination[]) => {
    setDestinationsState(newDestinations);
  };

  const addDestination = async (destination: Destination) => {
    // Optimistic update
    const newDestinations = [...destinations, destination];
    setDestinationsState(newDestinations);
    toast.success('Destination added successfully');

    try {
      const { error } = await supabase
        .from('resorts')
        .insert({
          id: destination.id,
          name: destination.name,
          location: destination.location,
          address: destination.address,
          phone: destination.phone,
          email: destination.email,
          manager: destination.manager,
          status: destination.status,
          store_count: destination.storeCount,
          logo: destination.logo
        });

      if (error) {
        console.warn('Could not sync destination to database:', error.message);
      }
    } catch (error) {
      console.warn('Network error syncing destination:', error);
    }
  };

  const updateDestination = async (updatedDestination: Destination) => {
    // Optimistic update
    const newDestinations = destinations.map(destination => 
      destination.id === updatedDestination.id ? updatedDestination : destination
    );
    setDestinationsState(newDestinations);
    
    // Update current destination if it's the one being edited
    if (currentDestination && currentDestination.id === updatedDestination.id) {
      setCurrentDestination(updatedDestination);
    }
    toast.success('Destination updated successfully');

    try {
      const { error } = await supabase
        .from('resorts')
        .update({
          name: updatedDestination.name,
          location: updatedDestination.location,
          address: updatedDestination.address,
          phone: updatedDestination.phone,
          email: updatedDestination.email,
          manager: updatedDestination.manager,
          status: updatedDestination.status,
          store_count: updatedDestination.storeCount,
          logo: updatedDestination.logo
        })
        .eq('id', updatedDestination.id);

      if (error) {
        console.warn('Could not sync destination update:', error.message);
      }
    } catch (error) {
      console.warn('Network error syncing destination update:', error);
    }
  };

  const deleteDestination = async (destinationId: string) => {
    // Optimistic delete
    const newDestinations = destinations.filter(destination => destination.id !== destinationId);
    setDestinationsState(newDestinations);
    
    // If current destination is deleted, set to first available or null
    if (currentDestination && currentDestination.id === destinationId) {
      const nextDestination = newDestinations.length > 0 ? newDestinations[0] : null;
      setCurrentDestination(nextDestination);
      if (nextDestination) {
        localStorage.setItem('currentDestinationId', nextDestination.id);
      } else {
        localStorage.removeItem('currentDestinationId');
      }
    }
    toast.success('Destination deleted successfully');

    try {
      const { error } = await supabase
        .from('resorts')
        .delete()
        .eq('id', destinationId);

      if (error) {
        console.warn('Could not sync destination deletion:', error.message);
      }
    } catch (error) {
      console.warn('Network error syncing destination deletion:', error);
    }
  };

  return (
    <DestinationContext.Provider value={{
      currentDestination,
      destinations,
      setCurrentDestination,
      setDestinations,
      addDestination,
      updateDestination,
      deleteDestination,
      // Legacy aliases
      currentResort: currentDestination,
      resorts: destinations
    }}>
      {children}
    </DestinationContext.Provider>
  );
};

// New hook name
export const useDestination = () => {
  const context = useContext(DestinationContext);
  if (context === undefined) {
    throw new Error('useDestination must be used within a DestinationProvider');
  }
  return context;
};

// Legacy alias for backwards compatibility
export const useResort = useDestination;

// Legacy alias for the provider
export const ResortProvider = DestinationProvider;
