import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, MapPin, Edit3, Building2, Trash2, Clock, Utensils } from 'lucide-react';
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
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="group relative bg-card border border-border rounded-xl overflow-hidden transition-all duration-200 hover:border-foreground/20 hover:shadow-lg">
      {/* Top accent bar */}
      <div className={`h-1 ${menu.is_active ? 'bg-success' : 'bg-muted'}`} />
      
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">
                {menu.category}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground truncate leading-tight">
              {menu.name}
            </h3>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                onClick={() => onEditMenu(menu)}
                className="gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onAssignStore(menu)}
                className="gap-2"
              >
                <Building2 className="w-4 h-4" />
                Assign Venue
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDeleteMenu(menu.id)}
                className="gap-2 text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                Delete Menu
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-5 leading-relaxed">
          {menu.description || 'No description provided'}
        </p>
        
        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-5">
          <div className="flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5" />
            <span className="tabular-nums">{itemCount} items</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDate(menu.updated_at)}</span>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          {venueName ? (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate max-w-[120px]">{venueName}</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground/60 italic">Unassigned</span>
          )}
          
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${menu.is_active ? 'text-success' : 'text-muted-foreground'}`}>
              {menu.is_active ? 'Live' : 'Draft'}
            </span>
            <Switch
              checked={menu.is_active}
              onCheckedChange={() => onToggleMenuStatus(menu.id)}
              className="data-[state=checked]:bg-success"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
