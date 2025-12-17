
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface OrderCardItemsProps {
  items: string;
  platformFee?: string;
}

export const OrderCardItems = ({ items, platformFee }: OrderCardItemsProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const orderValue = parseFloat(items.split('$')[1] || '0');

  const getItemDetails = () => {
    const baseItems = [
      'Large Iced Coffee - $4.50',
      'Blueberry Muffin - $3.25',
      'Avocado Toast - $8.75'
    ];
    
    if (orderValue > 40) {
      return [
        'Specialty Latte - $6.50',
        'Croissant Sandwich - $12.00',
        'Fresh Fruit Bowl - $9.25',
        'Extra Shot - $1.50'
      ];
    } else if (orderValue > 25) {
      return baseItems;
    } else {
      return baseItems.slice(0, 2);
    }
  };

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between p-3 bg-gray-50/70 rounded-lg border border-gray-100/50">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-sm text-gray-900 font-medium truncate flex-1">{items}</div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {platformFee && (
            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200 px-2 py-0.5 rounded-full">
              Fee: {platformFee}
            </Badge>
          )}
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger 
              className="flex items-center justify-center text-blue-600 hover:text-blue-700 transition-colors p-1.5 hover:bg-blue-50 rounded-full w-8 h-8"
              onClick={(e) => e.stopPropagation()}
            >
              {isDropdownOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-white border border-gray-200 shadow-xl rounded-lg">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b bg-gray-50/50">
                Order Items
              </div>
              {getItemDetails().map((item, index) => (
                <DropdownMenuItem key={index} className="px-3 py-2.5 text-sm hover:bg-gray-50">
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
