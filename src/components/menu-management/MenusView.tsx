import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
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
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {menus.length} {menus.length === 1 ? 'menu' : 'menus'}
        </div>
        <div className="flex items-center gap-2">
          <MenuImport />
          <Button 
            onClick={onShowCreateDialog}
            size="sm"
            className="h-8 px-3 text-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            New Menu
          </Button>
        </div>
      </div>

      {/* Menu list */}
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
