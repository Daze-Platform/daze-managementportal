import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryList } from "./CategoryList";
import { Plus, ChefHat, Sparkles } from "lucide-react";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";

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

interface CategoryManagerProps {
  categories: MenuCategory[];
  onAddCategory: () => void;
  onUpdateCategory: (categoryId: string, name: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddItem: (categoryId: string) => void;
  onEditItem: (categoryId: string, item: MenuItem) => void;
  onDeleteItem: (categoryId: string, itemId: string) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddItem,
  onEditItem,
  onDeleteItem,
}) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isMobileOrTablet = isMobile || isTablet;

  return (
    <div className={`space-y-${isMobileOrTablet ? "4" : "5"}`}>
      {/* Compact Header */}
      <div
        className={`${isMobileOrTablet ? "text-center space-y-3" : "flex items-center justify-between"}`}
      >
        <div className={isMobileOrTablet ? "space-y-1" : ""}>
          <h2
            className={`${
              isMobileOrTablet ? "text-lg" : "text-xl"
            } font-bold text-gray-900 flex items-center ${
              isMobileOrTablet ? "justify-center" : ""
            } gap-2`}
          >
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <ChefHat className="w-3 h-3 text-white" />
            </div>
            Menu Categories
          </h2>
          <p
            className={`text-gray-600 ${isMobileOrTablet ? "text-sm" : "text-sm"} mt-1`}
          >
            {isMobileOrTablet
              ? "Organize your menu items"
              : "Organize your menu with categories and items"}
          </p>
        </div>

        <Button
          onClick={onAddCategory}
          className={`bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-200 ${
            isMobileOrTablet
              ? "w-full h-10 text-sm font-semibold rounded-lg touch-manipulation"
              : "h-9 text-sm"
          }`}
        >
          <Plus className="w-4 h-4 mr-2" />
          {isMobileOrTablet ? "Add Category" : "Add Category"}
        </Button>
      </div>

      {categories.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50/50 to-white/80 backdrop-blur-sm overflow-hidden">
          <CardContent
            className={`flex flex-col items-center justify-center ${
              isMobileOrTablet ? "py-8 px-4" : "py-12 px-6"
            } text-center`}
          >
            {/* Compact Empty State */}
            <div className={`relative ${isMobileOrTablet ? "mb-4" : "mb-6"}`}>
              <div
                className={`${
                  isMobileOrTablet ? "w-16 h-16" : "w-20 h-20"
                } bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-md relative`}
              >
                <ChefHat
                  className={`${isMobileOrTablet ? "w-8 h-8" : "w-10 h-10"} text-blue-600`}
                />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
            </div>

            <h3
              className={`${
                isMobileOrTablet ? "text-lg" : "text-xl"
              } font-bold mb-2 text-gray-900`}
            >
              {isMobileOrTablet
                ? "Create your first category"
                : "Ready to build your menu?"}
            </h3>

            <p
              className={`text-gray-600 mb-5 leading-relaxed ${
                isMobileOrTablet ? "text-sm max-w-xs" : "text-sm max-w-md"
              }`}
            >
              {isMobileOrTablet
                ? 'Start organizing your menu with categories like "Appetizers", "Main Courses", etc.'
                : 'Categories help organize your menu items and make it easy for customers to browse. Start by adding categories like "Appetizers", "Main Courses", "Desserts", etc.'}
            </p>

            <Button
              onClick={onAddCategory}
              className={`bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                isMobileOrTablet
                  ? "w-full max-w-xs h-10 text-sm font-semibold rounded-lg touch-manipulation"
                  : "px-6 py-2 text-sm rounded-lg"
              }`}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isMobileOrTablet
                ? "Add First Category"
                : "Create Your First Category"}
            </Button>

            {/* Compact Mobile Tips */}
            {isMobileOrTablet && (
              <div className="mt-6 space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Popular Categories
                </p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {[
                    "🥗 Salads",
                    "🍕 Pizza",
                    "🍔 Burgers",
                    "🍰 Desserts",
                    "☕ Beverages",
                  ].map((category) => (
                    <span
                      key={category}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <CategoryList
          categories={categories}
          onUpdateCategory={onUpdateCategory}
          onDeleteCategory={onDeleteCategory}
          onAddItem={onAddItem}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
        />
      )}
    </div>
  );
};
