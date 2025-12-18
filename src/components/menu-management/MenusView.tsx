
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { MenuList } from './MenuList';
import { MenuImport } from './MenuImport';
import { Menu } from '@/pages/MenuManagement';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';

interface MenusViewProps {
  menus: Menu[];
  selectedStoreName: string;
  onShowCreateDialog: () => void;
  onEditMenu: (menu: Menu) => void;
  onToggleMenuStatus: (menuId: string) => void;
  onDeleteMenu: (menuId: string) => void;
  onAssignStore: (menu: Menu) => void;
}

export const MenusView: React.FC<MenusViewProps> = ({
  menus,
  selectedStoreName,
  onShowCreateDialog,
  onEditMenu,
  onToggleMenuStatus,
  onDeleteMenu,
  onAssignStore
}) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isMobileOrTablet = isMobile || isTablet;

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className={`flex flex-col space-y-4 sm:space-y-6 p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50`}>
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Menu Collection
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2 leading-relaxed">
              Professional menu management for {selectedStoreName} - Create, organize, and manage your culinary offerings
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              onClick={onShowCreateDialog}
              className={`${
                isMobile ? 'h-12' : 'h-12'
              } bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 px-6 py-3 text-sm sm:text-base font-semibold rounded-lg border-0`}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Create New Menu
            </Button>
            <MenuImport />
          </div>
        </div>
      </div>

      <div className={`${isMobileOrTablet ? 'p-6' : 'p-6 sm:p-8'}`}>
        <MenuList
          menus={menus}
          onEditMenu={onEditMenu}
          onToggleMenuStatus={onToggleMenuStatus}
          onDeleteMenu={onDeleteMenu}
          onAssignStore={onAssignStore}
        />
      </div>
    </div>
  );
};
