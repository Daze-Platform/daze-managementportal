
import React from 'react';
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
      amount: Math.round(item.value * 50), // Convert percentage to estimated amount
      color: item.color.startsWith('#') ? `bg-[${item.color}]` : item.color,
      percentage: item.value,
      icon: icons[index] || CreditCard,
      trend: trends[index] || '+0%',
      description: descriptions[index] || 'Payment method'
    };
  }) : defaultPaymentData;

  const total = paymentData.reduce((sum, item) => sum + item.amount, 0);

  console.log('PaymentTypesSection rendering with data:', paymentData);

  return (
    <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Payment Methods
              </CardTitle>
              <p className="text-sm text-gray-600">Customer payment preferences & trends</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Diversity</div>
            <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 text-purple-600" />
              <span className="text-xs font-semibold text-purple-600">Growing</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Total Processed Highlight */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-gray-600">Total Processed</div>
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              This period
            </div>
          </div>
          <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ${total.toLocaleString()}
          </div>
        </div>

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
              <div key={index} className="bg-white/60 backdrop-blur-sm p-5 rounded-xl border border-white/30 hover:bg-white/80 transition-all duration-200 group">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${payment.color} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
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

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                  <div 
                    className={`${payment.color} h-3 rounded-full transition-all duration-500 relative overflow-hidden`}
                    style={{ width: `${payment.percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Insights */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600 text-sm">📊</span>
            </div>
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
        </div>
      </CardContent>
    </Card>
  );
};
