
import React from 'react';
import { MenuCard } from './MenuCard';
import { Menu } from '@/pages/MenuManagement';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';
import { ChefHat } from 'lucide-react';

interface MenuListProps {
  menus: Menu[];
  onEditMenu: (menu: Menu) => void;
  onToggleMenuStatus: (menuId: string) => void;
  onDeleteMenu: (menuId: string) => void;
  onAssignStore: (menu: Menu) => void; // Keep prop name for compatibility (assigns to venue)
}

const professionalMenuIconColors = [
  { bg: 'bg-gradient-to-br from-blue-500 to-blue-600', iconColor: 'text-white' },
  { bg: 'bg-gradient-to-br from-indigo-500 to-indigo-600', iconColor: 'text-white' },
  { bg: 'bg-gradient-to-br from-green-500 to-green-600', iconColor: 'text-white' },
  { bg: 'bg-gradient-to-br from-purple-500 to-purple-600', iconColor: 'text-white' },
  { bg: 'bg-gradient-to-br from-orange-500 to-orange-600', iconColor: 'text-white' },
];

export const MenuList: React.FC<MenuListProps> = ({ menus, onEditMenu, onToggleMenuStatus, onDeleteMenu, onAssignStore }) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  if (menus.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
          <ChefHat className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          No menus created yet
        </h3>
        <p className="text-gray-600 text-base max-w-md leading-relaxed">
          Create your first professional menu to start organizing your restaurant's culinary offerings
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
      {menus.map((menu, index) => (
        <MenuCard
          key={menu.id}
          menu={menu}
          iconConfig={professionalMenuIconColors[index % professionalMenuIconColors.length]}
          onEditMenu={onEditMenu}
          onToggleMenuStatus={onToggleMenuStatus}
          onDeleteMenu={onDeleteMenu}
          onAssignStore={onAssignStore}
        />
      ))}
    </div>
  );
};
