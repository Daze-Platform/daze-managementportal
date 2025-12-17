
import React from 'react';
import { CategoryCard } from './CategoryCard';

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  modifierGroups: string[];
}

interface CategoryListProps {
  categories: MenuCategory[];
  onUpdateCategory: (categoryId: string, name: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddItem: (categoryId: string) => void;
  onEditItem: (categoryId: string, item: MenuItem) => void;
  onDeleteItem: (categoryId: string, itemId: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onUpdateCategory,
  onDeleteCategory,
  onAddItem,
  onEditItem,
  onDeleteItem
}) => {
  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onUpdateCategory={onUpdateCategory}
          onDeleteCategory={onDeleteCategory}
          onAddItem={onAddItem}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
        />
      ))}
    </div>
  );
};
