import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MenuItemsList } from "./MenuItemsList";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { Label } from "@/components/ui/label";
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

interface CategoryCardProps {
  category: MenuCategory;
  onUpdateCategory: (categoryId: string, name: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddItem: (categoryId: string) => void;
  onEditItem: (categoryId: string, item: MenuItem) => void;
  onDeleteItem: (categoryId: string, itemId: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onUpdateCategory,
  onDeleteCategory,
  onAddItem,
  onEditItem,
  onDeleteItem,
}) => {
  const [isEditing, setIsEditing] = useState(!category.name);
  const [tempName, setTempName] = useState(category.name);

  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isMobileOrTablet = isMobile || isTablet;

  const handleSave = () => {
    onUpdateCategory(category.id, tempName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempName(category.name);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleAddItemClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddItem(category.id);
  };

  return (
    <Card className="bg-white border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <CardHeader
        className={`border-b border-gray-100 ${isMobileOrTablet ? "p-3 sm:p-4" : "p-4"}`}
      >
        <div
          className={`flex ${isMobileOrTablet ? "flex-col gap-3" : "items-center justify-between gap-3"}`}
        >
          <div className="flex items-center flex-1 min-w-0">
            {isEditing ? (
              <div className="w-full space-y-2">
                <Label
                  htmlFor={`category-name-${category.id}`}
                  className="text-xs font-semibold text-gray-500"
                >
                  Category Name
                </Label>
                <div
                  className={`flex items-center gap-2 ${isMobileOrTablet ? "flex-col" : ""}`}
                >
                  <Input
                    id={`category-name-${category.id}`}
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className={`text-base font-semibold border-2 border-blue-300 focus:border-blue-500 ${
                      isMobileOrTablet
                        ? "h-12 text-lg"
                        : "h-11 sm:h-12 sm:text-lg"
                    }`}
                    autoFocus
                    placeholder="E.g. Appetizers"
                  />
                  <div
                    className={`flex gap-2 ${isMobileOrTablet ? "w-full" : "flex-shrink-0"}`}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSave}
                      className={`hover:bg-green-50 text-green-600 hover:text-green-700 ${
                        isMobileOrTablet
                          ? "flex-1 h-12 text-base"
                          : "p-2 h-11 w-11"
                      }`}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      {isMobileOrTablet && "Save"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      className={`hover:bg-red-50 text-red-500 hover:text-red-600 ${
                        isMobileOrTablet
                          ? "flex-1 h-12 text-base"
                          : "p-2 h-11 w-11"
                      }`}
                    >
                      <X className="w-4 h-4 mr-1" />
                      {isMobileOrTablet && "Cancel"}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <h3
                  className={`font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50/50 border-2 border-transparent hover:border-blue-200 flex-1 min-w-0 truncate ${
                    isMobileOrTablet ? "text-base" : "text-lg sm:text-xl"
                  }`}
                  onClick={() => setIsEditing(true)}
                >
                  {category.name}
                </h3>
                {!isMobileOrTablet && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="hover:bg-blue-50 text-gray-400 hover:text-blue-600 p-2 h-9 w-9 flex-shrink-0"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
          <div
            className={`flex items-center gap-2 ${isMobileOrTablet ? "w-full" : "flex-shrink-0"}`}
          >
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddItemClick}
              className={`border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 shadow-sm ${
                isMobileOrTablet
                  ? "flex-1 h-12 text-base font-semibold"
                  : "h-9 sm:h-10 text-xs sm:text-sm px-3 sm:px-4"
              }`}
            >
              <Plus className="w-4 h-4 mr-1 sm:mr-2" />
              Add Item
            </Button>
            {isMobileOrTablet ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 p-3 h-12 w-12"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            ) : null}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDeleteCategory(category.id)}
              className={`text-gray-400 hover:text-red-500 hover:bg-red-50 ${
                isMobileOrTablet ? "p-3 h-12 w-12" : "p-2 h-9 w-9"
              }`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className={isMobileOrTablet ? "p-3 sm:p-4" : "p-4"}>
        <MenuItemsList
          items={category.items}
          categoryId={category.id}
          onAddItem={onAddItem}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
        />
      </CardContent>
    </Card>
  );
};
