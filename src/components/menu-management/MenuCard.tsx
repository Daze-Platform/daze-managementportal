import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Building2, Trash2 } from 'lucide-react';
import { Menu } from '@/pages/MenuManagement';
import { useStores } from '@/contexts/StoresContext';

interface MenuCardProps {
  menu: Menu;
  iconConfig: { bg: string; iconColor: string };
  onEditMenu: (menu: Menu) => void;
  onToggleMenuStatus: (menuId: string) => void;
  onDeleteMenu: (menuId: string) => void;
  onAssignStore: (menu: Menu) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ 
  menu, 
  onEditMenu, 
  onToggleMenuStatus, 
  onDeleteMenu, 
  onAssignStore 
}) => {
  const { stores } = useStores();
  
  const venueName = menu.store_id 
    ? stores.find(s => s.id === menu.store_id)?.name 
    : null;

  return (
    <div className="border border-border rounded-lg bg-card p-4 hover:border-border/80 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-sm text-foreground truncate">
            {menu.name}
          </h3>
          <p className="text-xs text-muted-foreground capitalize mt-0.5">
            {menu.category}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Switch
            checked={menu.is_active}
            onCheckedChange={() => onToggleMenuStatus(menu.id)}
            className="data-[state=checked]:bg-primary scale-90"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onEditMenu(menu)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAssignStore(menu)}>
                <Building2 className="w-4 h-4 mr-2" />
                Assign venue
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDeleteMenu(menu.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {menu.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {menu.description}
        </p>
      )}
      
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>{Array.isArray(menu.items) ? menu.items.length : 0} items</span>
        {venueName && (
          <>
            <span className="text-border">•</span>
            <span className="truncate">{venueName}</span>
          </>
        )}
      </div>
    </div>
  );
};
