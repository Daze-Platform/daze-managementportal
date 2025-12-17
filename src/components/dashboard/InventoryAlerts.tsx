
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Package } from 'lucide-react';

interface InventoryItem {
  item: string;
  currentStock: number;
  minStock: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  cost: string;
}

interface InventoryAlertsProps {
  items: InventoryItem[];
}

export const InventoryAlerts = ({ items }: InventoryAlertsProps) => {
  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs">🔴 Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 text-xs">🟠 High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs">🟡 Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs">🔵 Low</Badge>;
      default:
        return <Badge className="text-xs">{urgency}</Badge>;
    }
  };

  const getStockPercentage = (current: number, min: number) => {
    return Math.round((current / min) * 100);
  };

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2 px-3 sm:px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg lg:text-xl">Inventory Alerts</CardTitle>
          <div className="flex items-center gap-1 sm:gap-2">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs hidden sm:inline-flex">
              {items.filter(item => item.urgency === 'critical').length} Critical
            </Badge>
            <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs sm:hidden">
              {items.filter(item => item.urgency === 'critical').length}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3 px-3 sm:px-6">
        <div className="space-y-2 sm:space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mb-2 sm:mb-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                      {item.item}
                    </p>
                    {getUrgencyBadge(item.urgency)}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500">
                    <span>Stock: {item.currentStock}/{item.minStock}</span>
                    <span className="hidden sm:inline">{item.cost}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className={`h-1.5 rounded-full ${
                        getStockPercentage(item.currentStock, item.minStock) < 25 ? 'bg-red-500' :
                        getStockPercentage(item.currentStock, item.minStock) < 50 ? 'bg-orange-500' :
                        getStockPercentage(item.currentStock, item.minStock) < 75 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(getStockPercentage(item.currentStock, item.minStock), 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between sm:block sm:text-right flex-shrink-0">
                <div className="sm:hidden text-xs text-gray-500">{item.cost}</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {getStockPercentage(item.currentStock, item.minStock)}%
                  </p>
                  <p className="text-xs text-gray-500">
                    of minimum
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
