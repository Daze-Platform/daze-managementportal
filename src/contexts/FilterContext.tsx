import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DateRange } from 'react-day-picker';

interface FilterContextType {
  selectedStore: string;
  setSelectedStore: (store: string) => void;
  selectedDateRange: DateRange | undefined;
  setSelectedDateRange: (dateRange: DateRange | undefined) => void;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date()
  });

  const resetFilters = () => {
    setSelectedStore('all');
    setSelectedDateRange({
      from: new Date(),
      to: new Date()
    });
  };

  return (
    <FilterContext.Provider
      value={{
        selectedStore,
        setSelectedStore,
        selectedDateRange,
        setSelectedDateRange,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};