
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, Clock, Store } from 'lucide-react';

export const DowntimeSection = () => {
  const stores = [
    { name: 'Brother Fox', color: 'bg-amber-500', downtime: '4h 15m', status: 'concerning' },
    { name: 'Sister Hen', color: 'bg-rose-500', downtime: '7h 10m', status: 'critical' },
    { name: 'Cousin Wolf', color: 'bg-sky-500', downtime: '2h 24m', status: 'normal' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-center gap-2">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"
            >
              <Clock className="w-4 h-4 text-gray-600" />
            </motion.div>
            <CardTitle className="text-lg">Store Downtime</CardTitle>
          </div>
          <p className="text-sm text-gray-600">
            Time when stores were temporarily closed
          </p>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border shadow-sm"
          >
            <div className="text-sm text-gray-600 mb-2">Total Downtime</div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">13h 49m</span>
              <motion.div 
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-1 bg-red-100 px-2 py-1 rounded-full"
              >
                <TrendingDown className="w-3 h-3 text-red-600" />
                <span className="text-xs font-medium text-red-600">+2.3h</span>
              </motion.div>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs. previous period</p>
          </motion.div>

          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700">Store Performance</div>
            
            {stores.map((store, index) => (
              <motion.div 
                key={store.name} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm rounded-lg border hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <motion.div 
                    whileHover={{ rotate: 10 }}
                    className={`w-8 h-8 ${store.color} rounded-full flex items-center justify-center shadow-sm`}
                  >
                    <Store className="w-4 h-4 text-white" />
                  </motion.div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{store.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      {store.status === 'critical' && (
                        <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                          🔴
                        </motion.span>
                      )}
                      {store.status === 'critical' && 'Needs attention'}
                      {store.status === 'concerning' && '🟡 Monitor closely'}
                      {store.status === 'normal' && '🟢 Within limits'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{store.downtime}</div>
                  <div className="text-xs text-gray-500">offline</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Performance summary */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="bg-blue-50 p-3 rounded-lg border border-blue-200"
          >
            <div className="text-xs font-medium text-blue-800 mb-1">📊 Summary</div>
            <div className="text-xs text-blue-700">
              Sister Hen had the longest downtime. Consider staff scheduling optimization.
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
