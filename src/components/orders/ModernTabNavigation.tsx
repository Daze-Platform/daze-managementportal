import React from "react";
import { Badge } from "@/components/ui/badge";

interface Tab {
  id: string;
  label: string;
  count: number;
  color?: string;
}

interface ModernTabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const ModernTabNavigation = ({
  tabs,
  activeTab,
  onTabChange,
}: ModernTabNavigationProps) => {
  const getTabColors = (tabId: string, isActive: boolean) => {
    const colors = {
      new: isActive
        ? "bg-emerald-500 text-white border-emerald-500"
        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200",
      progress: isActive
        ? "bg-blue-500 text-white border-blue-500"
        : "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200",
      ready: isActive
        ? "bg-amber-500 text-white border-amber-500"
        : "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200",
      fulfillment: isActive
        ? "bg-purple-500 text-white border-purple-500"
        : "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200",
      fulfilled: isActive
        ? "bg-green-600 text-white border-green-600"
        : "bg-green-50 text-green-700 hover:bg-green-100 border-green-200",
      scheduled: isActive
        ? "bg-indigo-500 text-white border-indigo-500"
        : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200",
      "eighty-six": isActive
        ? "bg-red-600 text-white border-red-600"
        : "bg-red-50 text-red-700 hover:bg-red-100 border-red-200",
    };
    return (
      colors[tabId as keyof typeof colors] ||
      (isActive
        ? "bg-gray-500 text-white border-gray-500"
        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200")
    );
  };

  return (
    <div className="bg-white border-b border-gray-200/50">
      <div className="tab-navigation px-3 sm:px-4 py-2 sm:py-2.5 animate-fade-in">
        <div className="flex space-x-1 sm:space-x-1.5 overflow-x-auto">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg font-semibold text-xs transition-all duration-300 whitespace-nowrap min-h-[32px] sm:min-h-[36px] border-2 hover:shadow-md animate-scale-in flex-shrink-0 ${getTabColors(tab.id, activeTab === tab.id)}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="font-semibold text-xs">{tab.label}</span>
              <Badge
                variant="secondary"
                className={`${activeTab === tab.id ? "bg-white/20 text-white border-white/30" : "bg-gray-200 text-gray-700 border-gray-300"} text-xs px-1.5 py-0.5 flex-shrink-0 font-bold min-w-[18px] justify-center transition-all duration-200`}
              >
                {tab.count}
              </Badge>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
