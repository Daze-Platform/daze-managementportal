import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, CheckCircle, Package, DollarSign } from "lucide-react";
import { Menu } from "@/pages/MenuManagement";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";

interface MenuStatsProps {
  menus: Menu[];
}

export const MenuStats: React.FC<MenuStatsProps> = ({ menus }) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isMobileOrTablet = isMobile || isTablet;

  const totalMenus = menus.length;
  const activeMenus = menus.filter((menu) => menu.is_active).length;
  const totalItems = menus.reduce(
    (acc, menu) => acc + (Array.isArray(menu.items) ? menu.items.length : 0),
    0,
  );
  const avgPrice = totalItems > 0 ? (totalItems * 12.49) / totalItems : 0; // Sample calculation

  const stats = [
    {
      title: "Total Menus",
      value: totalMenus.toString(),
      icon: Star,
      color: "bg-blue-50",
      iconColor: "text-blue-500",
      borderColor: "border-blue-100",
    },
    {
      title: "Active Menus",
      value: activeMenus.toString(),
      icon: CheckCircle,
      color: "bg-green-50",
      iconColor: "text-green-500",
      borderColor: "border-green-100",
    },
    {
      title: "Total Items",
      value: totalItems.toString(),
      icon: Package,
      color: "bg-purple-50",
      iconColor: "text-purple-500",
      borderColor: "border-purple-100",
    },
    {
      title: "Avg. Price",
      value: `$${avgPrice.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-blue-50",
      iconColor: "text-blue-500",
      borderColor: "border-blue-100",
    },
  ];

  return (
    <div
      className={`grid grid-cols-2 lg:grid-cols-4 gap-3 ${
        isMobileOrTablet ? "h-[70px]" : "h-[80px]"
      }`}
    >
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card
            key={index}
            className={`${stat.borderColor} ${stat.color} border shadow-none hover:shadow-sm transition-shadow duration-200 h-full w-full`}
          >
            <CardContent
              className={`${
                isMobileOrTablet ? "p-2.5" : "p-3"
              } h-full w-full flex items-center justify-between`}
            >
              <div className="flex-1 min-w-0 pr-2">
                <div
                  className={`${
                    isMobileOrTablet ? "text-lg" : "text-xl"
                  } font-bold text-gray-900 mb-0.5 leading-tight truncate`}
                >
                  {stat.value}
                </div>
                <div
                  className={`${
                    isMobileOrTablet ? "text-xs" : "text-sm"
                  } text-gray-600 font-medium leading-tight truncate`}
                >
                  {stat.title}
                </div>
              </div>
              <div
                className={`${
                  isMobileOrTablet ? "w-6 h-6" : "w-7 h-7"
                } ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}
              >
                <IconComponent
                  className={`${
                    isMobileOrTablet ? "w-3 h-3" : "w-4 h-4"
                  } ${stat.iconColor}`}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
