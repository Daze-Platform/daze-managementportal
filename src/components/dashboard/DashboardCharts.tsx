
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChartData {
  name: string;
  value?: number;
  orders?: number;
}

interface TopItem {
  name: string;
  orders: number;
  revenue: string;
  image: string;
  change: string;
}

interface DashboardChartsProps {
  storeName: string;
  revenueData: ChartData[];
  orderData: ChartData[];
  topItems: TopItem[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const
    }
  })
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.3 + i * 0.08,
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as const
    }
  })
};

export const DashboardCharts = ({ storeName, revenueData, orderData, topItems }: DashboardChartsProps) => {
  const isLoading = revenueData.length === 0 || orderData.length === 0;
  const hasRevenueData = revenueData.some((point) => typeof point.value === 'number');
  const hasOrderData = orderData.some((point) => typeof point.orders === 'number');

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
      {/* Revenue Chart */}
      <motion.div
        className="xl:col-span-2"
        custom={0}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <Card className="h-full shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-lg lg:text-xl">Weekly Revenue - {storeName}</CardTitle>
              <Badge variant="outline" className="w-fit text-xs">Last 7 days</Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            {isLoading ? (
              <ChartSkeleton />
            ) : !hasRevenueData ? (
              <EmptyChartState message="No data available" />
            ) : (
              <div className="h-52 lg:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={revenueData}
                    margin={{
                      top: 5,
                      right: 5,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Revenue']}
                      labelStyle={{ color: '#374151' }}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        fontSize: '12px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 4, stroke: '#3B82F6', strokeWidth: 2 }}
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationEasing="ease-out"
                      animationBegin={200}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Most Ordered Items */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <Card className="h-full shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg lg:text-xl">Most Ordered</CardTitle>
              <motion.div
                initial={{ rotate: -20, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                <Star className="w-5 h-5 text-yellow-500" />
              </motion.div>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <ScrollArea className="h-52 lg:h-72">
              <div className="space-y-3">
                {topItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-6 h-6 flex items-center justify-center text-sm flex-shrink-0">
                        {item.image}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.orders} orders
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {item.revenue}
                      </p>
                      <p className={`text-xs font-medium ${
                        item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.change}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>

      {/* Orders Chart */}
      <motion.div
        className="xl:col-span-3"
        custom={2}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-lg lg:text-xl">Orders by Hour - {storeName}</CardTitle>
              <Badge variant="outline" className="w-fit text-xs">Today</Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            {isLoading ? (
              <ChartSkeleton />
            ) : !hasOrderData ? (
              <EmptyChartState message="No data available" />
            ) : (
              <div className="h-52 lg:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={orderData}
                    margin={{
                      top: 5,
                      right: 5,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}`, 'Orders']}
                      labelStyle={{ color: '#374151' }}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        fontSize: '12px'
                      }}
                    />
                    <Bar 
                      dataKey="orders" 
                      fill="#10B981" 
                      radius={[2, 2, 0, 0]}
                      isAnimationActive={true}
                      animationDuration={1200}
                      animationEasing="ease-out"
                      animationBegin={400}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
