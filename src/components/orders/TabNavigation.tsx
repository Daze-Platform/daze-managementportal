
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface Tab {
  id: string;
  label: string;
  count: number;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TabNavigation = ({ tabs, activeTab, onTabChange }: TabNavigationProps) => {
  const getTabStyle = (tabId: string) => {
    const baseStyle = "flex items-center space-x-3 px-6 py-4 font-medium text-sm transition-all duration-200 relative border-b-2";
    
    if (activeTab === tabId) {
      return `${baseStyle} border-blue-500 text-blue-600 bg-blue-50/50`;
    }
    
    return `${baseStyle} border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50`;
  };

  const getCountBadgeStyle = (tabId: string, count: number) => {
    if (count === 0) {
      return "bg-gray-100 text-gray-500 border-gray-200";
    }
    
    if (activeTab === tabId) {
      return "bg-blue-100 text-blue-700 border-blue-200";
    }
    
    if (tabId === 'new' && count > 0) {
      return "bg-green-500 text-white border-green-600 animate-bounce";
    }
    
    if (tabId === 'ready' && count > 0) {
      return "bg-orange-100 text-orange-700 border-orange-200";
    }
    
    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  const getNewOrdersEmphasis = (tabId: string, count: number) => {
    if (tabId === 'new' && count > 0) {
      return 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500 shadow-lg transform hover:scale-[1.02] transition-all duration-200';
    }
    return '';
  };

  return (
    <div className="flex bg-white relative">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`${getTabStyle(tab.id)} ${getNewOrdersEmphasis(tab.id, tab.count)}`}
        >
          <span className={`${tab.id === 'new' && tab.count > 0 ? 'font-bold text-green-700' : 'font-semibold'}`}>
            {tab.label}
          </span>
          <Badge 
            variant="secondary" 
            className={`h-6 px-2 text-xs font-semibold ${getCountBadgeStyle(tab.id, tab.count)}`}
          >
            {tab.count}
          </Badge>
        </button>
      ))}
    </div>
  );
};
