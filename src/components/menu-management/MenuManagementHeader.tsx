import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle, ChevronDown, Building2 } from "lucide-react";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import { useStores } from "@/contexts/StoresContext";
import { useResort } from "@/contexts/DestinationContext";

interface MenuStore {
  id: string;
  name: string;
  emoji: string;
  location: string;
  isActive: boolean;
}

interface MenuManagementHeaderProps {
  selectedStore: MenuStore;
  onSelectStore: (store: MenuStore) => void;
}

export const MenuManagementHeader: React.FC<MenuManagementHeaderProps> = ({
  selectedStore,
  onSelectStore,
}) => {
  const { stores: allStores } = useStores();
  const { currentResort } = useResort();

  // Remove duplicates and show all stores for menu management
  const uniqueStores = allStores.filter(
    (store, index, self) => index === self.findIndex((s) => s.id === store.id),
  );

  const stores: MenuStore[] = uniqueStores.map((store) => ({
    id: store.id.toString(),
    name: store.name,
    emoji: store.logo,
    location: store.address,
    isActive: store.activeOrders > 0,
  }));
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isMobileOrTablet = isMobile || isTablet;

  return (
    <div className="flex flex-col gap-4 sm:gap-6 min-h-[120px] sm:min-h-[140px]">
      <div className="min-w-0 flex-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
          Menu Management
        </h1>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Create and manage your restaurant menus
        </p>
      </div>

      <div className="flex-shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={`flex items-center space-x-2 sm:space-x-3 px-3 py-2 h-auto bg-white/90 backdrop-blur border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 w-full justify-between ${
                isMobile ? "min-h-[40px]" : "min-h-[44px]"
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium text-gray-900 text-sm hover:text-blue-700 transition-colors duration-200 truncate">
                    {selectedStore.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate hidden sm:block">
                    {selectedStore.location}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 sm:w-72 bg-white/95 backdrop-blur-lg border border-gray-200/50 shadow-xl rounded-lg p-2 z-50"
          >
            <div className="p-3 border-b border-gray-100 mb-2">
              <div className="flex items-center space-x-2 text-gray-600">
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-medium">Select Venue</span>
              </div>
            </div>
            {stores.map((store) => (
              <DropdownMenuItem
                key={store.id}
                onClick={() => onSelectStore(store)}
                className={`rounded-md p-3 cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:border-blue-200 ${
                  selectedStore.id === store.id
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-blue-50"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 text-sm hover:text-blue-700 transition-colors duration-200 truncate">
                        {store.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {store.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {store.isActive ? (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    ) : (
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    )}
                    {selectedStore.id === store.id && (
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
