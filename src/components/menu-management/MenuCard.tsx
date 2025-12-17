
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ClipboardList, Clock, Sparkles, Users, MoreVertical, Store } from 'lucide-react';
import { Menu } from '@/pages/MenuManagement';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';

interface MenuCardProps {
  menu: Menu;
  iconConfig: { bg: string; iconColor: string };
  onEditMenu: (menu: Menu) => void;
  onToggleMenuStatus: (menuId: string) => void;
  onDeleteMenu: (menuId: string) => void;
  onAssignStore: (menu: Menu) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ menu, iconConfig, onEditMenu, onToggleMenuStatus, onDeleteMenu, onAssignStore }) => {
  const { bg, iconColor } = iconConfig;
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isMobileOrTablet = isMobile || isTablet;

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className={`relative ${isMobileOrTablet ? 'p-4' : 'p-5'}`}>
        <div className="flex items-start gap-3.5">
          {/* Professional Menu Icon */}
          <div className={`w-8 h-8 lg:w-10 lg:h-10 ${bg} rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm`}>
            <ClipboardList className={`w-4 h-4 lg:w-5 lg:h-5 ${iconColor}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className={`${isMobileOrTablet ? 'text-base' : 'text-lg'} font-semibold text-gray-900 truncate flex-1 group-hover:text-primary transition-colors duration-200`}>
                {menu.name}
              </h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={menu.is_active}
                    onCheckedChange={() => onToggleMenuStatus(menu.id)}
                    className="w-4 h-4"
                  />
                  <span className="text-xs text-gray-600 select-none">Active</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hover:bg-gray-100 p-1.5 h-8 w-8 rounded-lg transition-colors duration-200">
                      <MoreVertical className="w-3.5 h-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg z-50 rounded-lg">
                    <DropdownMenuItem 
                      onClick={() => onEditMenu(menu)}
                      className="hover:bg-blue-50 text-sm cursor-pointer rounded-md"
                    >
                      Edit Menu Details
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onAssignStore(menu)}
                      className="hover:bg-blue-50 text-sm cursor-pointer rounded-md"
                    >
                      Assign to Store
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDeleteMenu(menu.id)}
                      className="text-red-600 hover:bg-red-50 text-sm rounded-md"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <p className="text-gray-600 mb-3 text-sm leading-relaxed line-clamp-2">
              {menu.description}
            </p>
            
            {/* Professional stats */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-1.5 text-gray-500 hover:text-primary transition-colors duration-200">
                <Clock className="w-3.5 h-3.5 flex-shrink-0 text-blue-500" />
                <span className="text-xs">Updated {menu.updated_at ? new Date(menu.updated_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                }) : 'Never'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 hover:text-primary transition-colors duration-200">
                <Sparkles className="w-3.5 h-3.5 flex-shrink-0 text-indigo-500" />
                <span className="text-xs font-medium">{Array.isArray(menu.items) ? menu.items.length : 0} items</span>
              </div>
              {menu.store_id && (
                <div className="flex items-center gap-1.5 text-gray-500 hover:text-primary transition-colors duration-200">
                  <Store className="w-3.5 h-3.5 flex-shrink-0 text-green-500" />
                  <span className="text-xs">Store #{menu.store_id}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
