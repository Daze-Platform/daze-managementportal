
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StoreStats {
  revenue: number;
  orders: number;
  customers: number;
  avgOrder: number;
  trends: {
    revenue: number;
    orders: number;
    customers: number;
    avgOrder: number;
  };
}

interface DashboardStatsProps {
  stats: StoreStats;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const formatTrend = (value: number) => {
    const isPositive = value >= 0;
    return {
      value: `${isPositive ? '+' : ''}${value}%`,
      color: isPositive ? 'text-green-600' : 'text-red-600',
      bgColor: isPositive ? 'bg-green-100' : 'bg-red-100',
      icon: isPositive ? ArrowUpRight : ArrowDownRight
    };
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-600 truncate mb-1">Total Revenue</p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900 mb-2">${stats.revenue.toLocaleString()}</p>
              <div className="flex items-center">
                {(() => {
                  const trend = formatTrend(stats.trends.revenue);
                  const Icon = trend.icon;
                  return (
                    <>
                      <Icon className="w-3 h-3 mr-1" />
                      <span className={`text-xs font-medium ${trend.color}`}>{trend.value}</span>
                    </>
                  );
                })()}
              </div>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-600 truncate mb-1">Total Orders</p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900 mb-2">{stats.orders.toLocaleString()}</p>
              <div className="flex items-center">
                {(() => {
                  const trend = formatTrend(stats.trends.orders);
                  const Icon = trend.icon;
                  return (
                    <>
                      <Icon className="w-3 h-3 mr-1" />
                      <span className={`text-xs font-medium ${trend.color}`}>{trend.value}</span>
                    </>
                  );
                })()}
              </div>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-600 truncate mb-1">Active Customers</p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900 mb-2">{stats.customers.toLocaleString()}</p>
              <div className="flex items-center">
                {(() => {
                  const trend = formatTrend(stats.trends.customers);
                  const Icon = trend.icon;
                  return (
                    <>
                      <Icon className="w-3 h-3 mr-1" />
                      <span className={`text-xs font-medium ${trend.color}`}>{trend.value}</span>
                    </>
                  );
                })()}
              </div>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-600 truncate mb-1">Avg. Order Value</p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900 mb-2">${stats.avgOrder.toFixed(2)}</p>
              <div className="flex items-center">
                {(() => {
                  const trend = formatTrend(stats.trends.avgOrder);
                  const Icon = trend.icon;
                  return (
                    <>
                      <Icon className="w-3 h-3 mr-1" />
                      <span className={`text-xs font-medium ${trend.color}`}>{trend.value}</span>
                    </>
                  );
                })()}
              </div>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
