
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Smartphone, Banknote, TrendingUp, ArrowRight } from 'lucide-react';

interface PaymentType {
  name: string;
  value: number;
  color: string;
}

interface PaymentTypesSectionProps {
  data?: PaymentType[];
}

const AnimatedCounter = ({ value, prefix = '' }: { value: number; prefix?: string }) => {
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
  
  return <>{prefix}{displayValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</>;
};

export const PaymentTypesSection = ({ data }: PaymentTypesSectionProps) => {
  const defaultPaymentData = [
    { 
      type: 'Credit/Debit Cards', 
      amount: 1928, 
      color: 'bg-blue-500', 
      percentage: 64,
      icon: CreditCard,
      trend: '+2.1%',
      description: 'Visa, Mastercard, Amex'
    },
    { 
      type: 'Digital Wallets', 
      amount: 760, 
      color: 'bg-purple-500', 
      percentage: 25,
      icon: Smartphone,
      trend: '+8.4%',
      description: 'Apple Pay, Google Pay, PayPal'
    },
    { 
      type: 'Cash Payments', 
      amount: 325, 
      color: 'bg-emerald-500', 
      percentage: 11,
      icon: Banknote,
      trend: '-1.2%',
      description: 'Physical cash transactions'
    }
  ];

  // Transform incoming data to match the internal format
  const paymentData = data ? data.map((item, index) => {
    const icons = [CreditCard, Smartphone, Banknote, CreditCard];
    const descriptions = ['Card payments', 'Digital wallets', 'Cash payments', 'Gift cards'];
    const trends = ['+2.1%', '+8.4%', '-1.2%', '+1.5%'];
    
    return {
      type: item.name,
      amount: Math.round(item.value * 50),
      color: item.color.startsWith('#') ? `bg-[${item.color}]` : item.color,
      percentage: item.value,
      icon: icons[index] || CreditCard,
      trend: trends[index] || '+0%',
      description: descriptions[index] || 'Payment method'
    };
  }) : defaultPaymentData;

  const total = paymentData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden relative group">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <CreditCard className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Payment Methods
                </CardTitle>
                <p className="text-sm text-gray-600">Customer payment preferences & trends</p>
              </div>
            </div>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-right"
            >
              <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Diversity</div>
              <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3 text-purple-600" />
                <span className="text-xs font-semibold text-purple-600">Growing</span>
              </div>
            </motion.div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 relative z-10">
          {/* Total Processed Highlight */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-600">Total Processed</div>
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                This period
              </div>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              $<AnimatedCounter value={total} />
            </div>
          </motion.div>

          {/* Payment Methods Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Payment Distribution</h3>
              <div className="text-xs text-gray-500">Sorted by volume</div>
            </div>

            {paymentData.map((payment, index) => {
              const IconComponent = payment.icon;
              const isPositiveTrend = !payment.trend.startsWith('-');
              
              return (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.3 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  className="bg-white/60 backdrop-blur-sm p-5 rounded-xl border border-white/30 hover:bg-white/80 transition-all duration-200 group/item cursor-pointer"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <motion.div 
                        whileHover={{ rotate: 10 }}
                        className={`w-10 h-10 ${payment.color} rounded-xl flex items-center justify-center shadow-sm group-hover/item:scale-105 transition-transform duration-200`}
                      >
                        <IconComponent className="w-5 h-5 text-white" />
                      </motion.div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900">{payment.type}</div>
                        <div className="text-xs text-gray-500">{payment.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">${payment.amount.toLocaleString()}</div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-gray-600">{payment.percentage}%</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          isPositiveTrend 
                            ? 'text-emerald-600 bg-emerald-100' 
                            : 'text-red-600 bg-red-100'
                        }`}>
                          {payment.trend}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar - Animated */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${payment.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.15 + 0.5, ease: "easeOut" }}
                      className={`${payment.color} h-3 rounded-full relative overflow-hidden`}
                    >
                      <motion.div 
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Enhanced Insights */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200"
          >
            <div className="flex items-start gap-3">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <span className="text-purple-600 text-sm">📊</span>
              </motion.div>
              <div className="space-y-2">
                <div className="text-sm font-semibold text-purple-800">Payment Insights</div>
                <div className="text-sm text-purple-700">
                  <div className="flex items-center gap-1 mb-1">
                    <ArrowRight className="w-3 h-3" />
                    Digital wallets showing strongest growth at +8.4%
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    <ArrowRight className="w-3 h-3" />
                    Cards remain dominant but consider promoting digital options
                  </div>
                  <div className="flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    <span className="font-medium">Recommendation:</span> Add cashback incentives for digital payments
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
