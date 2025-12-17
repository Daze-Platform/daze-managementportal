
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, Eye, UserPlus, Target } from 'lucide-react';

export const MarketingSection = () => {
  const marketingMetrics = [
    {
      name: 'New Customers',
      value: '431',
      change: '+15.2%',
      trend: 'up',
      icon: UserPlus,
      color: 'text-green-600'
    },
    {
      name: 'Active Users',
      value: '1,923',
      change: '+8.7%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      name: 'Menu Views',
      value: '15,642',
      change: '-2.1%',
      trend: 'down',
      icon: Eye,
      color: 'text-purple-600'
    }
  ];

  const campaigns = [
    { name: 'Piazza Specials', orders: 127, revenue: '$2,340', performance: 'excellent', color: 'bg-green-100 text-green-800' },
    { name: 'Seafood Happy Hour', orders: 89, revenue: '$1,567', performance: 'good', color: 'bg-blue-100 text-blue-800' },
    { name: 'Weekend Fish Tacos', orders: 203, revenue: '$4,821', performance: 'outstanding', color: 'bg-purple-100 text-purple-800' }
  ];

  console.log('MarketingSection rendering with metrics:', marketingMetrics);
  console.log('MarketingSection rendering with campaigns:', campaigns);

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Target className="w-4 h-4 text-green-600" />
          </div>
          <CardTitle className="text-lg">Marketing Performance</CardTitle>
        </div>
        <p className="text-sm text-gray-600">
          Customer engagement and campaign effectiveness
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-700">Key Metrics</div>
          {marketingMetrics.map((metric) => (
            <div key={metric.name} className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                  <metric.icon className={`w-4 h-4 ${metric.color}`} />
                </div>
                <span className="text-sm font-medium text-gray-900">{metric.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-900">{metric.value}</span>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  metric.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {metric.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Campaign Performance */}
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-700">Top Performing Campaigns</div>
          {campaigns.map((campaign) => (
            <div key={campaign.name} className="p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold text-gray-900">{campaign.name}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${campaign.color}`}>
                    {campaign.performance}
                  </span>
                </div>
                <div className="text-sm font-bold text-gray-900">{campaign.revenue}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">{campaign.orders} orders generated</div>
                <div className="text-xs text-gray-500">
                  ${(parseFloat(campaign.revenue.replace('$', '').replace(',', '')) / campaign.orders).toFixed(0)} avg. order
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Marketing insights */}
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="text-xs font-medium text-green-800 mb-1">🎯 Marketing Insight</div>
          <div className="text-xs text-green-700">
            Weekend Fish Tacos campaign shows highest ROI. Consider expanding similar promotions.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
