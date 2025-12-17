
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, ArrowUpRight, BarChart3 } from 'lucide-react';

interface RevenueData {
  total: number;
  growth: number;
  breakdown: Array<{
    label: string;
    amount: number;
    color: string;
    percentage: number;
  }>;
}

interface RevenueSectionProps {
  data?: RevenueData;
}

export const RevenueSection = ({ data }: RevenueSectionProps) => {
  const defaultData = {
    total: 4220.50,
    growth: 4.07,
    breakdown: [
      { label: 'Net Revenue', amount: 1928, color: 'bg-emerald-500', percentage: 45.7 },
      { label: 'Tax', amount: 1060, color: 'bg-blue-500', percentage: 25.1 },
      { label: 'Commission', amount: 844, color: 'bg-orange-500', percentage: 20.0 },
      { label: 'Tips', amount: 388, color: 'bg-purple-500', percentage: 9.2 }
    ]
  };

  const revenueData = data || defaultData;
  const revenueBreakdown = revenueData.breakdown.map(item => ({
    ...item,
    icon: item.label === 'Net Revenue' ? DollarSign :
          item.label === 'Tax' ? BarChart3 :
          item.label === 'Commission' ? ArrowUpRight : TrendingUp
  }));

  console.log('RevenueSection rendering with data:', revenueBreakdown);

  return (
    <Card className="bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Gross Revenue
              </CardTitle>
              <p className="text-sm text-gray-600">Revenue breakdown for the selected period</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Performance</div>
            <div className="flex items-center gap-1 bg-emerald-100 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-600">Excellent</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Total Revenue Highlight */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-gray-600">Total Revenue</div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>vs. previous 7 days</span>
            </div>
          </div>
          <div className="flex items-end gap-4">
            <span className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              ${revenueData.total.toLocaleString()}
            </span>
            <div className="flex items-center gap-1 bg-emerald-100 px-3 py-1.5 rounded-full mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-600">+{revenueData.growth}%</span>
            </div>
          </div>
        </div>

        {/* Enhanced Revenue Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Revenue Breakdown</h3>
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              Last 7 days
            </div>
          </div>
          
          {/* Visual Progress Bar */}
          <div className="flex h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            {revenueBreakdown.map((item, index) => (
              <div 
                key={index}
                className={`${item.color} transition-all duration-500 hover:brightness-110`}
                style={{ width: `${item.percentage}%` }}
                title={`${item.label}: $${item.amount} (${item.percentage}%)`}
              />
            ))}
          </div>
          
          {/* Breakdown Details */}
          <div className="grid grid-cols-2 gap-4">
            {revenueBreakdown.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-white/30 hover:bg-white/80 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center shadow-sm`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700">{item.label}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">${item.amount.toLocaleString()}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights Panel */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-xl border border-emerald-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-600 text-sm">💡</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-emerald-800 mb-1">Revenue Analysis</div>
              <div className="text-sm text-emerald-700">
                Strong performance with {revenueData.growth}% growth. Net revenue represents {revenueData.breakdown[0].percentage}% of total, indicating healthy profit margins. 
                <span className="font-medium"> Tips increased by 12% this week.</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
