import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  DollarSign,
  Menu,
  Package,
  Receipt,
  Users,
  Gift,
  Settings,
  FileText,
} from "lucide-react";

interface SearchResult {
  type:
    | "store"
    | "revenue"
    | "menu-item"
    | "inventory"
    | "order"
    | "employee"
    | "promotion"
    | "setting"
    | "report";
  title: string;
  description: string;
  id: string;
  data: any;
}

interface SearchResultsProps {
  results: SearchResult[];
  onResultClick: (result: SearchResult) => void;
  isVisible: boolean;
}

export const SearchResults = ({
  results,
  onResultClick,
  isVisible,
}: SearchResultsProps) => {
  if (!isVisible || results.length === 0) return null;

  const getResultIcon = (type: string) => {
    switch (type) {
      case "store":
        return <Store className="w-4 h-4 text-blue-500" />;
      case "revenue":
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case "menu-item":
        return <Menu className="w-4 h-4 text-purple-500" />;
      case "inventory":
        return <Package className="w-4 h-4 text-orange-500" />;
      case "order":
        return <Receipt className="w-4 h-4 text-indigo-500" />;
      case "employee":
        return <Users className="w-4 h-4 text-cyan-500" />;
      case "promotion":
        return <Gift className="w-4 h-4 text-pink-500" />;
      case "setting":
        return <Settings className="w-4 h-4 text-gray-500" />;
      case "report":
        return <FileText className="w-4 h-4 text-emerald-500" />;
      default:
        return <Store className="w-4 h-4 text-gray-500" />;
    }
  };

  const getResultBadge = (type: string) => {
    switch (type) {
      case "store":
        return (
          <Badge variant="outline" className="text-xs">
            Store
          </Badge>
        );
      case "revenue":
        return (
          <Badge variant="outline" className="text-xs">
            Revenue
          </Badge>
        );
      case "menu-item":
        return (
          <Badge variant="outline" className="text-xs">
            Menu
          </Badge>
        );
      case "inventory":
        return (
          <Badge variant="outline" className="text-xs">
            Inventory
          </Badge>
        );
      case "order":
        return (
          <Badge variant="outline" className="text-xs">
            Order
          </Badge>
        );
      case "employee":
        return (
          <Badge variant="outline" className="text-xs">
            Employee
          </Badge>
        );
      case "promotion":
        return (
          <Badge variant="outline" className="text-xs">
            Promotion
          </Badge>
        );
      case "setting":
        return (
          <Badge variant="outline" className="text-xs">
            Setting
          </Badge>
        );
      case "report":
        return (
          <Badge variant="outline" className="text-xs">
            Report
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Item
          </Badge>
        );
    }
  };

  return (
    <Card className="absolute top-full left-0 right-0 mt-1 shadow-lg border border-gray-200 bg-white z-50 max-h-80 overflow-y-auto">
      <CardContent className="p-0">
        {results.map((result, index) => (
          <div
            key={`${result.type}-${result.id}-${index}`}
            onClick={() => onResultClick(result)}
            className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
          >
            <div className="flex-shrink-0">{getResultIcon(result.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {result.title}
                </h4>
                {getResultBadge(result.type)}
              </div>
              <p className="text-xs text-gray-500 truncate mt-1">
                {result.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
