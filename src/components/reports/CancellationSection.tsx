
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, TrendingUp, XCircle, AlertTriangle } from 'lucide-react';

interface CancellationData {
  rate: number;
  totalCancelled: number;
  reasons: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
}

interface CancellationSectionProps {
  data?: CancellationData;
}

const AnimatedCounter = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <>{displayValue}</>;
};

export const CancellationSection = ({ data }: CancellationSectionProps) => {
  const defaultData = {
    rate: 7.8,
    totalCancelled: 23,
    reasons: [
      { reason: 'Unavailable items', count: 14, percentage: 61 },
      { reason: 'Auto-rejected (busy)', count: 6, percentage: 26 },
      { reason: 'Store too busy', count: 3, percentage: 13 }
    ]
  };

  const cancellationData = data || defaultData;
  const rejectionReasons = cancellationData.reasons.map((reason, index) => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500'];
    return {
      ...reason,
      color: colors[index] || 'bg-gray-500'
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200/50 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden relative group">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-center gap-2">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: -10 }}
              className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center"
            >
              <XCircle className="w-4 h-4 text-red-600" />
            </motion.div>
            <CardTitle className="text-lg">Order Cancellations</CardTitle>
          </div>
          <p className="text-sm text-gray-600">
            Track orders that couldn't be fulfilled
          </p>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10">
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border shadow-sm"
            >
              <div className="text-sm text-gray-600 mb-1">Total Cancellations</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  <AnimatedCounter value={cancellationData.totalCancelled} />
                </span>
                <motion.div 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-1 bg-red-100 px-2 py-1 rounded-full"
                >
                  <TrendingDown className="w-3 h-3 text-red-600" />
                  <span className="text-xs font-medium text-red-600">-2.1%</span>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border shadow-sm"
            >
              <div className="text-sm text-gray-600 mb-1">Cancellation Rate</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">{cancellationData.rate}%</span>
                <motion.div 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full"
                >
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs font-medium text-green-600">-0.5%</span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700">Top Cancellation Reasons</div>
            
            {rejectionReasons.map((item, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.4 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2, delay: index * 0.3 }}
                      className={`w-3 h-3 ${item.color} rounded-full`}
                    />
                    <span className="text-sm text-gray-700">{item.reason}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">{item.count} orders</span>
                    <div className="text-xs text-gray-500">{item.percentage}%</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.5, ease: "easeOut" }}
                    className={`${item.color} h-2 rounded-full`}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Actionable insight - Animated */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="bg-orange-50 p-3 rounded-lg border border-orange-200 flex items-start gap-2"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
            </motion.div>
            <div>
              <div className="text-xs font-medium text-orange-800 mb-1">Action Needed</div>
              <div className="text-xs text-orange-700">
                61% of cancellations are due to unavailable items. Update inventory management.
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
