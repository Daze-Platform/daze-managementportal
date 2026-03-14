import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MenuHeader } from "./MenuHeader";
import { CategoryManager } from "./CategoryManager";
import { ModifierGroupManager } from "./ModifierGroupManager";
import { MenuItemForm } from "./MenuItemForm";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";

interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

interface ModifierGroup {
  id: string;
  name: string;
  type: "single" | "multiple";
  required: boolean;
  options: ModifierOption[];
}

interface Menu {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  categories: MenuCategory[];
}

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

interface MenuBuilderProps {
  menu: Menu;
  onSave: (menu: Menu) => void;
  onCancel: () => void;
  isNew?: boolean;
}

export const MenuBuilder: React.FC<MenuBuilderProps> = ({
  menu,
  onSave,
  onCancel,
  isNew,
}) => {
  const [currentMenu, setCurrentMenu] = useState<Menu>(menu);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isMobileOrTablet = isMobile || isTablet;

  // Sample modifier groups - in a real app, this would come from a global state or API
  const [availableModifierGroups] = useState<ModifierGroup[]>([
    {
      id: "sizes",
      name: "Sizes",
      type: "single",
      required: true,
      options: [
        { id: "1", name: "Small", price: 0 },
        { id: "2", name: "Medium", price: 2.0 },
        { id: "3", name: "Large", price: 4.0 },
      ],
    },
    {
      id: "sauces",
      name: "Extra Sauces",
      type: "multiple",
      required: false,
      options: [
        { id: "1", name: "BBQ Sauce", price: 0.5 },
        { id: "2", name: "Ranch Dressing", price: 0.5 },
        { id: "3", name: "Hot Sauce", price: 0.5 },
        { id: "4", name: "Garlic Aioli", price: 0.75 },
      ],
    },
    {
      id: "toppings",
      name: "Premium Toppings",
      type: "multiple",
      required: false,
      options: [
        { id: "1", name: "Extra Cheese", price: 1.5 },
        { id: "2", name: "Bacon", price: 2.0 },
        { id: "3", name: "Avocado", price: 1.75 },
      ],
    },
    {
      id: "spice-level",
      name: "Spice Level",
      type: "single",
      required: false,
      options: [
        { id: "1", name: "Mild", price: 0 },
        { id: "2", name: "Medium", price: 0 },
        { id: "3", name: "Hot", price: 0 },
        { id: "4", name: "Extra Hot", price: 0 },
      ],
    },
  ]);

  const handleMenuUpdate = (updates: Partial<Menu>) => {
    setCurrentMenu((prev) => ({ ...prev, ...updates }));
  };

  const addCategory = () => {
    const newCategory: MenuCategory = {
      id: Date.now().toString(),
      name: "",
      items: [],
    };
    setCurrentMenu((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
  };

  const updateCategory = (categoryId: string, name: string) => {
    setCurrentMenu((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId ? { ...cat, name } : cat,
      ),
    }));
  };

  const deleteCategory = (categoryId: string) => {
    setCurrentMenu((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat.id !== categoryId),
    }));
  };

  const handleAddItem = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setShowItemForm(true);
    setEditingItem(null);
  };

  const handleEditItem = (categoryId: string, item: MenuItem) => {
    setSelectedCategoryId(categoryId);
    setEditingItem(item);
    setShowItemForm(true);
  };

  const addMenuItem = (categoryId: string, item: MenuItem) => {
    setCurrentMenu((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId ? { ...cat, items: [...cat.items, item] } : cat,
      ),
    }));
    setShowItemForm(false);
    setSelectedCategoryId("");
    setEditingItem(null);
  };

  const updateMenuItem = (categoryId: string, item: MenuItem) => {
    setCurrentMenu((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map((i) => (i.id === item.id ? item : i)),
            }
          : cat,
      ),
    }));
    setShowItemForm(false);
    setSelectedCategoryId("");
    setEditingItem(null);
  };

  const deleteMenuItem = (categoryId: string, itemId: string) => {
    setCurrentMenu((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, items: cat.items.filter((i) => i.id !== itemId) }
          : cat,
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Much More Compact Fixed Header */}
      <div
        className={`sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm ${
          isMobileOrTablet ? "px-3 py-1.5" : "px-4 sm:px-6 lg:px-8 py-2"
        }`}
      >
        <MenuHeader
          menu={currentMenu}
          onMenuUpdate={handleMenuUpdate}
          onCancel={onCancel}
          isNew={isNew}
        />
      </div>

      {/* Optimized Content Area */}
      <div
        className={`flex-1 ${isMobileOrTablet ? "px-3 py-2" : "px-4 sm:px-6 lg:px-8 py-3"}`}
      >
        <div className="max-w-7xl mx-auto">
          <div
            className={`bg-white ${
              isMobileOrTablet ? "rounded-lg shadow-sm" : "rounded-xl shadow-sm"
            } border border-gray-200`}
          >
            <div className={`${isMobileOrTablet ? "p-3" : "p-4"}`}>
              <CategoryManager
                categories={currentMenu.categories}
                onAddCategory={addCategory}
                onUpdateCategory={updateCategory}
                onDeleteCategory={deleteCategory}
                onAddItem={handleAddItem}
                onEditItem={handleEditItem}
                onDeleteItem={deleteMenuItem}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Buttons */}
      <div
        className={`sticky bottom-0 z-20 bg-white border-t border-gray-200 shadow-lg ${
          isMobileOrTablet ? "px-3 py-3" : "px-4 sm:px-6 lg:px-8 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div
            className={`flex ${isMobileOrTablet ? "flex-col gap-3" : "flex-row justify-end gap-3"}`}
          >
            <Button
              variant="outline"
              onClick={onCancel}
              className={`border-gray-200 hover:bg-gray-50 text-gray-700 ${
                isMobileOrTablet ? "h-11 text-base" : "h-10 text-sm px-6"
              }`}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={() => onSave(currentMenu)}
              className={`${
                isMobileOrTablet
                  ? "h-11 text-base font-semibold"
                  : "h-10 text-sm px-8 font-medium"
              }`}
            >
              Save Menu
            </Button>
          </div>
        </div>
      </div>

      {/* Responsive Menu Item Form */}
      {showItemForm && (
        <MenuItemForm
          item={editingItem}
          availableModifierGroups={availableModifierGroups}
          onSave={(item) => {
            if (editingItem) {
              updateMenuItem(selectedCategoryId, item);
            } else {
              addMenuItem(selectedCategoryId, item);
            }
          }}
          onCancel={() => {
            setShowItemForm(false);
            setSelectedCategoryId("");
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};
