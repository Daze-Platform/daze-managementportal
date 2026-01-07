import React from 'react';
import { Menu } from '@/pages/MenuManagement';
import { useStores } from '@/contexts/StoresContext';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Building2, Trash2, FileText } from 'lucide-react';

interface MenuListProps {
  menus: Menu[];
  onEditMenu: (menu: Menu) => void;
  onToggleMenuStatus: (menuId: string) => void;
  onDeleteMenu: (menuId: string) => void;
  onAssignStore: (menu: Menu) => void;
}

export const MenuList: React.FC<MenuListProps> = ({ 
  menus, 
  onEditMenu, 
  onToggleMenuStatus, 
  onDeleteMenu, 
  onAssignStore 
}) => {
  const { stores } = useStores();

  const getVenueName = (storeId?: number) => {
    if (!storeId) return '—';
    const store = stores.find(s => s.id === storeId);
    return store?.name || '—';
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (menus.length === 0) {
    return (
      <div className="border border-border rounded-lg bg-card">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium text-foreground mb-1">No menus yet</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            Create your first menu to start adding items and assigning it to venues.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-[1fr_120px_140px_100px_80px_44px] gap-4 px-4 py-3 bg-muted/30 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wide">
        <div>Menu</div>
        <div>Category</div>
        <div>Venue</div>
        <div>Items</div>
        <div>Status</div>
        <div></div>
      </div>

      {/* Table rows */}
      <div className="divide-y divide-border">
        {menus.map((menu) => (
          <div 
            key={menu.id} 
            className="grid grid-cols-[1fr_120px_140px_100px_80px_44px] gap-4 px-4 py-3 items-center hover:bg-muted/20 transition-colors"
          >
            {/* Menu name & description */}
            <div className="min-w-0">
              <div className="font-medium text-sm text-foreground truncate">
                {menu.name}
              </div>
              {menu.description && (
                <div className="text-xs text-muted-foreground truncate mt-0.5">
                  {menu.description}
                </div>
              )}
            </div>

            {/* Category */}
            <div className="text-sm text-muted-foreground capitalize">
              {menu.category}
            </div>

            {/* Venue */}
            <div className="text-sm text-muted-foreground truncate">
              {getVenueName(menu.store_id)}
            </div>

            {/* Items count */}
            <div className="text-sm text-muted-foreground">
              {Array.isArray(menu.items) ? menu.items.length : 0}
            </div>

            {/* Status toggle */}
            <div>
              <Switch
                checked={menu.is_active}
                onCheckedChange={() => onToggleMenuStatus(menu.id)}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            {/* Actions */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onEditMenu(menu)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit details
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
        ))}
      </div>
    </div>
  );
};
