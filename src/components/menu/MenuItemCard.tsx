import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Settings } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  modifierGroups: string[];
}

interface MenuItemCardProps {
  item: MenuItem;
  categoryId: string;
  onEditItem: (categoryId: string, item: MenuItem) => void;
  onDeleteItem: (categoryId: string, itemId: string) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  categoryId,
  onEditItem,
  onDeleteItem,
}) => {
  return (
    <div className="group flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/20 transition-all duration-200">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
          {item.name}
        </h4>
        <p className="text-sm text-gray-600 mt-1 mb-2">{item.description}</p>
        <div className="flex items-center space-x-4">
          <p className="text-sm font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-md">
            ${item.price.toFixed(2)}
          </p>
          {item.modifierGroups.length > 0 && (
            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className="text-xs bg-blue-50 text-blue-600 border-blue-200 flex items-center space-x-1"
              >
                <Settings className="w-3 h-3" />
                <span>
                  {item.modifierGroups.length} Option Set
                  {item.modifierGroups.length !== 1 ? "s" : ""}
                </span>
              </Badge>
            </div>
          )}
        </div>
      </div>
      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onEditItem(categoryId, item)}
          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
        >
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDeleteItem(categoryId, item.id)}
          className="text-gray-400 hover:text-red-500 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
