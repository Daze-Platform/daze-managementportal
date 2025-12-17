
import React from 'react';
import { Button } from '@/components/ui/button';
import { MenuItemCard } from './MenuItemCard';
import { Plus } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  modifierGroups: string[];
}

interface MenuItemsListProps {
  items: MenuItem[];
  categoryId: string;
  onAddItem: (categoryId: string) => void;
  onEditItem: (categoryId: string, item: MenuItem) => void;
  onDeleteItem: (categoryId: string, itemId: string) => void;
}

export const MenuItemsList: React.FC<MenuItemsListProps> = ({
  items,
  categoryId,
  onAddItem,
  onEditItem,
  onDeleteItem
}) => {
  const handleAddItemClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddItem(categoryId);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/30">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <Plus className="w-5 h-5 text-gray-400" />
        </div>
        <p className="text-gray-500 mb-4 text-sm text-center">No items in this category yet</p>
        <Button 
          size="sm"
          onClick={handleAddItemClick}
          className="bg-blue-500 hover:bg-blue-600 text-white h-9 sm:h-10 text-xs sm:text-sm px-3 sm:px-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add First Item
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <MenuItemCard
          key={item.id}
          item={item}
          categoryId={categoryId}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
        />
      ))}
    </div>
  );
};
