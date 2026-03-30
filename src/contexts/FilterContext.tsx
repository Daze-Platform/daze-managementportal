import React, { createContext, useContext, useState, ReactNode } from "react";
import { DateRange } from "react-day-picker";

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

const STORAGE_KEY = "daze_report_filters";

function loadFilters(): { store: string; dateRange: DateRange | undefined } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        store: parsed.store || "all",
        dateRange: parsed.dateRange
          ? {
              from: parsed.dateRange.from ? new Date(parsed.dateRange.from) : undefined,
              to: parsed.dateRange.to ? new Date(parsed.dateRange.to) : undefined,
            }
          : { from: new Date(), to: new Date() },
      };
    }
  } catch {}
  return { store: "all", dateRange: { from: new Date(), to: new Date() } };
}

function saveFilters(store: string, dateRange: DateRange | undefined) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        store,
        dateRange: dateRange
          ? { from: dateRange.from?.toISOString(), to: dateRange.to?.toISOString() }
          : null,
      }),
    );
  } catch {}
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const initial = loadFilters();
  const [selectedStore, setSelectedStoreState] = useState(initial.store);
  const [selectedDateRange, setSelectedDateRangeState] = useState<
    DateRange | undefined
  >(initial.dateRange);

  const setSelectedStore = (store: string) => {
    setSelectedStoreState(store);
    saveFilters(store, selectedDateRange);
  };

  const setSelectedDateRange = (dateRange: DateRange | undefined) => {
    setSelectedDateRangeState(dateRange);
    saveFilters(selectedStore, dateRange);
  };

  const resetFilters = () => {
    const defaultRange = { from: new Date(), to: new Date() };
    setSelectedStoreState("all");
    setSelectedDateRangeState(defaultRange);
    saveFilters("all", defaultRange);
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
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};
