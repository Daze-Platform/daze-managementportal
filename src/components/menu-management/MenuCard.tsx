import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Clock, Sparkles, MoreVertical, MapPin, Edit3, Building2, Trash2 } from 'lucide-react';
import { Menu } from '@/pages/MenuManagement';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';
import { useStores } from '@/contexts/StoresContext';

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
  const { stores } = useStores();
  
  const venueName = menu.store_id 
    ? stores.find(s => s.id === menu.store_id)?.name || `Venue #${menu.store_id}`
    : null;

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Status indicator bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${menu.is_active ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gray-200'}`} />
      
      <div className={`relative ${isMobileOrTablet ? 'p-4 pt-5' : 'p-6 pt-7'}`}>
        <div className="flex items-start gap-4">
          {/* Enhanced Menu Icon */}
          <div className={`w-12 h-12 lg:w-14 lg:h-14 ${bg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ring-4 ring-white`}>
            <ClipboardList className={`w-5 h-5 lg:w-6 lg:h-6 ${iconColor}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className={`${isMobileOrTablet ? 'text-lg' : 'text-xl'} font-bold text-gray-900 truncate group-hover:text-primary transition-colors duration-200`}>
                  {menu.name}
                </h3>
                <Badge variant="secondary" className="mt-1.5 text-xs font-medium bg-gray-100 text-gray-600 border-0">
                  {menu.category.charAt(0).toUpperCase() + menu.category.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                  <Checkbox
                    checked={menu.is_active}
                    onCheckedChange={() => onToggleMenuStatus(menu.id)}
                    className="w-4 h-4 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                  />
                  <span className={`text-xs font-medium select-none ${menu.is_active ? 'text-emerald-600' : 'text-gray-500'}`}>
                    {menu.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hover:bg-gray-100 p-2 h-9 w-9 rounded-xl transition-colors duration-200">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-xl rounded-xl p-1.5">
                    <DropdownMenuItem 
                      onClick={() => onEditMenu(menu)}
                      className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-blue-50 text-sm cursor-pointer rounded-lg font-medium text-gray-700 hover:text-blue-700"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Menu Details
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onAssignStore(menu)}
                      className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-indigo-50 text-sm cursor-pointer rounded-lg font-medium text-gray-700 hover:text-indigo-700"
                    >
                      <Building2 className="w-4 h-4" />
                      Assign to Venue
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1.5" />
                    <DropdownMenuItem 
                      onClick={() => onDeleteMenu(menu.id)}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-red-600 hover:bg-red-50 text-sm rounded-lg font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Menu
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <p className="text-gray-500 mb-4 text-sm leading-relaxed line-clamp-2">
              {menu.description || 'No description provided'}
            </p>
            
            {/* Enhanced stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <span className="text-xs font-medium">{menu.updated_at ? new Date(menu.updated_at).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                }) : 'Never'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <span className="text-xs font-medium">{Array.isArray(menu.items) ? menu.items.length : 0} items</span>
              </div>
              {venueName && (
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <span className="text-xs font-medium truncate max-w-24">{venueName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
