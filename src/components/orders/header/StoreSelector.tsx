
import React from 'react';
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils"
import { useStores } from '@/contexts/StoresContext';
import { useResort } from '@/contexts/ResortContext';

interface OrderStore {
  id: string;
  name: string;
}

interface StoreSelectorProps {
  selectedStore: string;
  onStoreChange: (storeId: string) => void;
  className?: string;
}

// Mock function to get store order counts - in real app this would come from props
const getStoreOrderCount = (storeId: string): number => {
  if (storeId === 'all') return 0;
  // Return 0 for all stores since order counts will come from actual data
  return 0;
};

const StoreSelectorTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-12 sm:h-11 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 sm:py-2.5 text-base sm:text-sm font-medium text-gray-900 shadow-sm ring-offset-background placeholder:text-gray-500 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ease-out [&>span]:line-clamp-1 touch-manipulation",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-5 w-5 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0 transition-transform duration-500 ease-out data-[state=open]:rotate-180" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))

const StoreSelectorContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-[9999] max-h-96 min-w-[8rem] overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-900 shadow-2xl",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      side="bottom"
      align="start"
      sideOffset={8}
      alignOffset={0}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))

const StoreSelectorItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-md py-3 sm:py-2.5 pl-10 sm:pl-8 pr-2 text-base sm:text-sm text-gray-900 outline-none hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-all duration-300 ease-out touch-manipulation",
      className
    )}
    {...props}
  >
    <span className="absolute left-3 sm:left-2 flex h-4 w-4 sm:h-3.5 sm:w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-5 w-5 sm:h-4 sm:w-4 text-blue-600" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))

export const StoreSelector = ({ selectedStore, onStoreChange, className }: StoreSelectorProps) => {
  const { stores: allStores, getStoresByResort } = useStores();
  const { currentResort } = useResort();
  
  console.log('StoreSelector - All stores:', allStores);
  console.log('StoreSelector - Current resort:', currentResort);
  
  // Get all stores regardless of resort assignment and remove duplicates
  // This ensures all stores are available in dropdowns without duplicates
  const availableStores = allStores.filter((store, index, self) => 
    index === self.findIndex(s => s.id === store.id)
  );
  
  console.log('StoreSelector - Available stores:', availableStores);
  
  // Transform stores to match order format and add "All Stores" option
  const stores: OrderStore[] = [
    { id: 'all', name: 'All Stores' },
    ...availableStores.map(store => ({
      id: store.id.toString(),
      name: store.name
    }))
  ];
  
  console.log('🏪 StoreSelector - Available dropdown stores:', stores);
  console.log('🎯 StoreSelector - Currently selected store:', selectedStore);
  return (
    <SelectPrimitive.Root value={selectedStore} onValueChange={onStoreChange}>
      <StoreSelectorTrigger className={className}>
        <SelectPrimitive.Value />
      </StoreSelectorTrigger>
      <StoreSelectorContent>
        {stores.map((store) => {
          const orderCount = getStoreOrderCount(store.id);
          return (
            <StoreSelectorItem key={store.id} value={store.id}>
              <div className="flex items-center justify-between w-full">
                <span>{store.name}</span>
                {orderCount > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="ml-2 bg-orange-500 text-white border-orange-600 text-xs px-1.5 py-0.5 min-w-[18px] h-4 flex items-center justify-center font-bold"
                  >
                    {orderCount}
                  </Badge>
                )}
              </div>
            </StoreSelectorItem>
          );
        })}
      </StoreSelectorContent>
    </SelectPrimitive.Root>
  );
};
