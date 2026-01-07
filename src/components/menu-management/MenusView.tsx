import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileUp } from 'lucide-react';
import { MenuList } from './MenuList';
import { MenuImport } from './MenuImport';
import { Menu } from '@/pages/MenuManagement';

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
  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{menus.length}</span>
          {' '}{menus.length === 1 ? 'menu' : 'menus'}
          {' '}in {selectedStoreName}
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <MenuImport />
          <Button 
            onClick={onShowCreateDialog}
            className="flex-1 sm:flex-none h-9 px-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Menu
          </Button>
        </div>
      </div>

      {/* Menu Grid */}
      <MenuList
        menus={menus}
        onEditMenu={onEditMenu}
        onToggleMenuStatus={onToggleMenuStatus}
        onDeleteMenu={onDeleteMenu}
        onAssignStore={onAssignStore}
      />
    </div>
  );
};
