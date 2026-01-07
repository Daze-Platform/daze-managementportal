import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileUp, Sparkles } from 'lucide-react';
import { MenuList } from './MenuList';
import { MenuImport } from './MenuImport';
import { Menu } from '@/pages/MenuManagement';
import { motion } from 'framer-motion';

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
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{menus.length}</span>
          <span>{menus.length === 1 ? 'menu' : 'menus'}</span>
          <span className="text-border">•</span>
          <span>{selectedStoreName}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <MenuImport />
          <Button 
            onClick={onShowCreateDialog}
            className="h-10 px-4 bg-foreground hover:bg-foreground/90 text-background font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Menu
          </Button>
        </div>
      </div>

      {/* Menu Grid or Empty State */}
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
