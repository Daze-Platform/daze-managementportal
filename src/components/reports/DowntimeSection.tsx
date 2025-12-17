
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, Clock, Store } from 'lucide-react';

export const DowntimeSection = () => {
  const stores = [
    { name: 'Piazza', color: 'bg-purple-500', downtime: '4h 15m', status: 'concerning' },
    { name: 'Red Fish Blue Fish', color: 'bg-red-500', downtime: '7h 10m', status: 'critical' },
    { name: 'Sal De Mar', color: 'bg-blue-500', downtime: '2h 24m', status: 'normal' },
  ];

  console.log('DowntimeSection rendering with stores:', stores);

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-gray-600" />
          </div>
          <CardTitle className="text-lg">Store Downtime</CardTitle>
        </div>
        <p className="text-sm text-gray-600">
          Time when stores were temporarily closed
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600 mb-2">Total Downtime</div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-gray-900">13h 49m</span>
            <div className="flex items-center gap-1 bg-red-100 px-2 py-1 rounded-full">
              <TrendingDown className="w-3 h-3 text-red-600" />
              <span className="text-xs font-medium text-red-600">+2.3h</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">vs. previous period</p>
        </div>

        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-700">Store Performance</div>
          
          {stores.map((store) => (
            <div key={store.name} className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 ${store.color} rounded-full flex items-center justify-center`}>
                  <Store className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{store.name}</div>
                  <div className="text-xs text-gray-500">
                    {store.status === 'critical' && '🔴 Needs attention'}
                    {store.status === 'concerning' && '🟡 Monitor closely'}
                    {store.status === 'normal' && '🟢 Within limits'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{store.downtime}</div>
                <div className="text-xs text-gray-500">offline</div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance summary */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="text-xs font-medium text-blue-800 mb-1">📊 Summary</div>
          <div className="text-xs text-blue-700">
            Red Fish Blue Fish had the longest downtime. Consider staff scheduling optimization.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
