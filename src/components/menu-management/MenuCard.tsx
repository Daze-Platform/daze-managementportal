import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, MapPin, Edit3, Building2, Trash2, Utensils } from 'lucide-react';
import { Menu } from '@/pages/MenuManagement';
import { useStores } from '@/contexts/StoresContext';
import { Switch } from '@/components/ui/switch';

interface MenuCardProps {
  menu: Menu;
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
    ? stores.find(s => s.id === menu.store_id)?.name || `Venue #${menu.store_id}`
    : null;

  const itemCount = Array.isArray(menu.items) ? menu.items.length : 0;

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground truncate mb-1">
              {menu.name}
            </h3>
            <span className="text-xs text-muted-foreground capitalize">
              {menu.category}
            </span>
          </div>
          
          <Badge 
            variant="secondary" 
            className={`shrink-0 text-xs font-medium ${
              menu.is_active 
                ? 'bg-success/10 text-success border-success/20' 
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {menu.is_active ? 'Live' : 'Draft'}
          </Badge>
        </div>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {menu.description || 'No description provided'}
        </p>
        
        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5" />
            <span>{itemCount} items</span>
          </div>
          {venueName && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate max-w-[120px]">{venueName}</span>
            </div>
          )}
          {!venueName && (
            <span className="text-muted-foreground/60 italic text-xs">Unassigned</span>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Switch
            checked={menu.is_active}
            onCheckedChange={() => onToggleMenuStatus(menu.id)}
            aria-label="Toggle menu status"
          />
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onEditMenu(menu)}
              className="h-8 px-3 text-xs"
            >
              <Edit3 className="w-3.5 h-3.5 mr-1.5" />
              Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onAssignStore(menu)}
              className="h-8 px-3 text-xs"
            >
              <Building2 className="w-3.5 h-3.5 mr-1.5" />
              Assign
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
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
      </div>
    </div>
  );
};
