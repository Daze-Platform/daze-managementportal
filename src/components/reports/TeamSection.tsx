
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, Clock, Award, UserCheck, AlertCircle } from 'lucide-react';

export const TeamSection = () => {
  const teamMetrics = [
    { 
      name: 'Active Staff', 
      value: '24', 
      change: '+2', 
      trend: 'up', 
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      name: 'Avg. Hours/Week', 
      value: '32.5', 
      change: '+1.2h', 
      trend: 'up', 
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      name: 'Performance Score', 
      value: '4.2/5', 
      change: '+0.3', 
      trend: 'up', 
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const topPerformers = [
    { name: 'Sarah Johnson', role: 'Kitchen Manager', score: 4.8, hours: 40, efficiency: 95 },
    { name: 'Mike Chen', role: 'Head Chef', score: 4.7, hours: 38, efficiency: 92 },
    { name: 'Lisa Rodriguez', role: 'Server Lead', score: 4.6, hours: 35, efficiency: 89 }
  ];

  const staffingIssues = [
    { store: 'Brother Fox', issue: 'Short-staffed', severity: 'high', color: 'text-red-600' },
    { store: 'Sister Hen', issue: 'Training needed', severity: 'medium', color: 'text-yellow-600' },
    { store: 'Cousin Wolf', issue: 'Fully staffed', severity: 'low', color: 'text-green-600' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-center gap-2">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: -10 }}
              className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <Users className="w-4 h-4 text-blue-600" />
            </motion.div>
            <CardTitle className="text-lg">Team Performance</CardTitle>
          </div>
          <p className="text-sm text-gray-600">
            Staff productivity and management insights
          </p>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10">
          {/* Team Metrics */}
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700">Key Metrics</div>
            {teamMetrics.map((metric, index) => (
              <motion.div 
                key={metric.name} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.2 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm rounded-lg border hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <motion.div 
                    whileHover={{ rotate: 10 }}
                    className={`w-8 h-8 ${metric.bgColor} rounded-lg flex items-center justify-center`}
                  >
                    <metric.icon className={`w-4 h-4 ${metric.color}`} />
                  </motion.div>
                  <span className="text-sm font-medium text-gray-900">{metric.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-900">{metric.value}</span>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                    className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full"
                  >
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-xs font-medium text-green-600">{metric.change}</span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Top Performers */}
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700">Top Performers</div>
            {topPerformers.map((performer, index) => (
              <motion.div 
                key={performer.name} 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="p-3 bg-white/80 backdrop-blur-sm rounded-lg border hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center"
                    >
                      <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">#{index + 1}</span>
                    </motion.div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{performer.name}</div>
                      <div className="text-xs text-gray-500">{performer.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{performer.score}★</div>
                    <div className="text-xs text-gray-500">{performer.hours}h/week</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">Efficiency: {performer.efficiency}%</div>
                  <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${performer.efficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 0.7, ease: "easeOut" }}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Staffing Status */}
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700">Staffing Status</div>
            {staffingIssues.map((item, index) => (
              <motion.div 
                key={item.store} 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.7 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm rounded-lg border cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    {item.severity === 'high' && (
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                        <AlertCircle className="w-3 h-3 text-red-600" />
                      </motion.div>
                    )}
                    {item.severity === 'medium' && <Clock className="w-3 h-3 text-yellow-600" />}
                    {item.severity === 'low' && <UserCheck className="w-3 h-3 text-green-600" />}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.store}</span>
                </div>
                <span className={`text-sm font-medium ${item.color}`}>{item.issue}</span>
              </motion.div>
            ))}
          </div>

          {/* Team insights */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="bg-blue-50 p-3 rounded-lg border border-blue-200"
          >
            <div className="text-xs font-medium text-blue-800 mb-1">👥 Team Insight</div>
            <div className="text-xs text-blue-700">
              Performance scores are up 7% this month. Sarah Johnson leads with exceptional efficiency.
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
