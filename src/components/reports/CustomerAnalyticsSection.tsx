
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Tooltip } from 'recharts';
import { Users, UserCheck, Clock, TrendingUp, Star, DollarSign } from 'lucide-react';

const customerOrderFrequency = [
  { frequency: 'First-time', customers: 45, percentage: 35 },
  { frequency: '2-5 orders', customers: 38, percentage: 30 },
  { frequency: '6-10 orders', customers: 25, percentage: 20 },
  { frequency: '11+ orders', customers: 19, percentage: 15 }
];

const orderTimePreferences = [
  { time: '11-12 PM', orders: 25 },
  { time: '12-1 PM', orders: 45 },
  { time: '1-2 PM', orders: 38 },
  { time: '6-7 PM', orders: 52 },
  { time: '7-8 PM', orders: 68 },
  { time: '8-9 PM', orders: 42 }
];

const refinedCustomerSegments = [
  { name: 'VIP Customers', value: 15, color: '#8B5CF6', avgOrderValue: 45.80, orders: '15+ orders', description: 'High-value loyal customers' },
  { name: 'Regular Customers', value: 25, color: '#3B82F6', avgOrderValue: 32.50, orders: '6-14 orders', description: 'Frequent repeat customers' },
  { name: 'Occasional Customers', value: 35, color: '#10B981', avgOrderValue: 28.90, orders: '2-5 orders', description: 'Moderate engagement' },
  { name: 'New Customers', value: 25, color: '#F59E0B', avgOrderValue: 22.15, orders: '1 order', description: 'First-time buyers' }
];

const customerValueDistribution = [
  { range: '$0-15', customers: 28, color: '#EF4444' },
  { range: '$16-30', customers: 45, color: '#F59E0B' },
  { range: '$31-50', customers: 32, color: '#10B981' },
  { range: '$51+', customers: 22, color: '#8B5CF6' }
];

// New stacked area chart data for customer engagement
const customerEngagementData = [
  { month: 'Jan', contacted: 320, opened: 280, positive: 180, replied: 120 },
  { month: 'Feb', contacted: 380, opened: 320, positive: 220, replied: 150 },
  { month: 'Mar', contacted: 420, opened: 380, positive: 280, replied: 200 },
  { month: 'Apr', contacted: 350, opened: 310, positive: 240, replied: 180 },
  { month: 'May', contacted: 480, opened: 420, positive: 320, replied: 240 },
  { month: 'Jun', contacted: 520, opened: 460, positive: 360, replied: 280 }
];

const chartConfig = {
  contacted: {
    label: "Contacted",
    color: "#3B82F6",
  },
  opened: {
    label: "Opened",
    color: "#10B981",
  },
  positive: {
    label: "Positive",
    color: "#F59E0B",
  },
  replied: {
    label: "Replied",
    color: "#8B5CF6",
  },
}

interface CustomerAnalyticsData {
  totalCustomers: number;
  customerGrowth: number;
  lifetimeValue: number;
  lifetimeValueGrowth: number;
  retentionRate: number;
  retentionGrowth: number;
  satisfaction: number;
  totalReviews: number;
}

interface CustomerAnalyticsSectionProps {
  data?: CustomerAnalyticsData;
}

export const CustomerAnalyticsSection = ({ data }: CustomerAnalyticsSectionProps) => {
  const defaultData = {
    totalCustomers: 1247,
    customerGrowth: 12,
    lifetimeValue: 186,
    lifetimeValueGrowth: 8.5,
    retentionRate: 73.2,
    retentionGrowth: 2.1,
    satisfaction: 4.7,
    totalReviews: 892
  };

  const analyticsData = data || defaultData;
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Customer Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Customers</p>
                <p className="text-2xl font-bold text-blue-900">{analyticsData.totalCustomers.toLocaleString()}</p>
                <p className="text-xs text-blue-600 mt-1">+{analyticsData.customerGrowth}% from last month</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Customer Lifetime Value</p>
                <p className="text-2xl font-bold text-green-900">${analyticsData.lifetimeValue}</p>
                <p className="text-xs text-green-600 mt-1">+{analyticsData.lifetimeValueGrowth}% increase</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Retention Rate</p>
                <p className="text-2xl font-bold text-orange-900">{analyticsData.retentionRate}%</p>
                <p className="text-xs text-orange-600 mt-1">+{analyticsData.retentionGrowth}% improvement</p>
              </div>
              <UserCheck className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Avg. Satisfaction</p>
                <p className="text-2xl font-bold text-purple-900">{analyticsData.satisfaction}★</p>
                <p className="text-xs text-purple-600 mt-1">Based on {analyticsData.totalReviews} reviews</p>
              </div>
              <Star className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Engagement Flow Chart - Properly contained */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Customer Engagement Flow</CardTitle>
          <p className="text-sm text-gray-600">Track how customers interact with your marketing campaigns</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="w-full" style={{ height: '300px' }}>
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={customerEngagementData}
                  margin={{ 
                    top: 20, 
                    right: 30, 
                    left: 20, 
                    bottom: 20 
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    interval={0}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    width={50}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                  />
                  <defs>
                    <linearGradient id="contactedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="openedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="repliedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="contacted"
                    stackId="1"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="url(#contactedGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="opened"
                    stackId="1"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="url(#openedGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="positive"
                    stackId="1"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    fill="url(#positiveGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="replied"
                    stackId="1"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    fill="url(#repliedGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Customer Segments and Order Value - Side by Side with proper spacing */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Customer Segments Analysis */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Customer Segments Analysis</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div className="flex justify-center items-center">
                <div className="w-full max-w-[240px] lg:max-w-[280px]">
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={refinedCustomerSegments}
                        cx="50%"
                        cy="50%"
                        outerRadius={85}
                        dataKey="value"
                        label={(entry) => `${entry.value}%`}
                      >
                        {refinedCustomerSegments.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-3 flex flex-col justify-center">
                {refinedCustomerSegments.map((segment, index) => (
                  <div key={index} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-3.5 h-3.5 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: segment.color }}
                      />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{segment.name}</p>
                        <p className="text-xs text-gray-600">{segment.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 text-sm">${segment.avgOrderValue}</p>
                      <p className="text-xs text-gray-600">{segment.orders}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Value Distribution */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Order Value Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-64 lg:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerValueDistribution} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="range" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    width={40}
                  />
                  <Tooltip formatter={(value) => [value, 'Customers']} />
                  <Bar dataKey="customers" radius={[6, 6, 0, 0]} maxBarSize={50}>
                    {customerValueDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
