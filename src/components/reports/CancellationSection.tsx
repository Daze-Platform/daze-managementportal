
import React from 'react';
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

  console.log('CancellationSection rendering with data:', rejectionReasons);

  return (
    <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <XCircle className="w-4 h-4 text-red-600" />
          </div>
          <CardTitle className="text-lg">Order Cancellations</CardTitle>
        </div>
        <p className="text-sm text-gray-600">
          Track orders that couldn't be fulfilled
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-lg border">
            <div className="text-sm text-gray-600 mb-1">Total Cancellations</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{cancellationData.totalCancelled}</span>
              <div className="flex items-center gap-1 bg-red-100 px-2 py-1 rounded-full">
                <TrendingDown className="w-3 h-3 text-red-600" />
                <span className="text-xs font-medium text-red-600">-2.1%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-lg border">
            <div className="text-sm text-gray-600 mb-1">Cancellation Rate</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{cancellationData.rate}%</span>
              <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs font-medium text-green-600">-0.5%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-700">Top Cancellation Reasons</div>
          
          {rejectionReasons.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                  <span className="text-sm text-gray-700">{item.reason}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">{item.count} orders</span>
                  <div className="text-xs text-gray-500">{item.percentage}%</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${item.color} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Actionable insight */}
        <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs font-medium text-orange-800 mb-1">Action Needed</div>
            <div className="text-xs text-orange-700">
              61% of cancellations are due to unavailable items. Update inventory management.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
