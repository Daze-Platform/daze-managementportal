
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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

const AnimatedCounter = ({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <>{prefix}{displayValue.toLocaleString(undefined, { maximumFractionDigits: 1 })}{suffix}</>;
};

const statCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut" as const
    }
  })
};

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
  
  const statCards = [
    {
      title: 'Total Customers',
      value: analyticsData.totalCustomers,
      growth: analyticsData.customerGrowth,
      icon: Users,
      gradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-600',
      iconColor: 'text-blue-500',
      prefix: '',
      suffix: ''
    },
    {
      title: 'Customer Lifetime Value',
      value: analyticsData.lifetimeValue,
      growth: analyticsData.lifetimeValueGrowth,
      icon: DollarSign,
      gradient: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
      textColor: 'text-green-600',
      iconColor: 'text-green-500',
      prefix: '$',
      suffix: ''
    },
    {
      title: 'Retention Rate',
      value: analyticsData.retentionRate,
      growth: analyticsData.retentionGrowth,
      icon: UserCheck,
      gradient: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-600',
      iconColor: 'text-orange-500',
      prefix: '',
      suffix: '%'
    },
    {
      title: 'Avg. Satisfaction',
      value: analyticsData.satisfaction,
      growth: null,
      icon: Star,
      gradient: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-600',
      iconColor: 'text-purple-500',
      prefix: '',
      suffix: '★',
      extra: `Based on ${analyticsData.totalReviews} reviews`
    }
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Customer Stats Cards - Animated */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            custom={index}
            variants={statCardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, y: -4 }}
          >
            <Card className={`bg-gradient-to-br ${card.gradient} ${card.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group`}>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${card.textColor}`}>{card.title}</p>
                    <p className={`text-2xl font-bold ${card.textColor.replace('600', '900')}`}>
                      <AnimatedCounter value={card.value} prefix={card.prefix} suffix={card.suffix} />
                    </p>
                    {card.growth !== null ? (
                      <motion.p 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                        className={`text-xs ${card.textColor} mt-1 flex items-center gap-1`}
                      >
                        <TrendingUp className="w-3 h-3" />
                        +{card.growth}% from last month
                      </motion.p>
                    ) : (
                      <p className={`text-xs ${card.textColor} mt-1`}>{card.extra}</p>
                    )}
                  </div>
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <card.icon className={`w-8 h-8 ${card.iconColor}`} />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Customer Engagement Flow Chart - Animated */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <Card className="w-full shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
              Customer Engagement Flow
            </CardTitle>
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
      </motion.div>

      {/* Customer Segments and Order Value - Animated */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Customer Segments Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Card className="w-full shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                Customer Segments Analysis
              </CardTitle>
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
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <motion.div 
                          whileHover={{ scale: 1.2 }}
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
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Value Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Card className="w-full shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
                Order Value Distribution
              </CardTitle>
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
        </motion.div>
      </div>
    </div>
  );
};
