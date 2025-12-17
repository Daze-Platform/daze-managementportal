
import React from 'react';
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
      color: 'text-blue-600'
    },
    { 
      name: 'Avg. Hours/Week', 
      value: '32.5', 
      change: '+1.2h', 
      trend: 'up', 
      icon: Clock,
      color: 'text-green-600'
    },
    { 
      name: 'Performance Score', 
      value: '4.2/5', 
      change: '+0.3', 
      trend: 'up', 
      icon: Award,
      color: 'text-purple-600'
    }
  ];

  const topPerformers = [
    { name: 'Sarah Johnson', role: 'Kitchen Manager', score: 4.8, hours: 40, efficiency: 95 },
    { name: 'Mike Chen', role: 'Head Chef', score: 4.7, hours: 38, efficiency: 92 },
    { name: 'Lisa Rodriguez', role: 'Server Lead', score: 4.6, hours: 35, efficiency: 89 }
  ];

  const staffingIssues = [
    { store: 'Piazza', issue: 'Short-staffed', severity: 'high', color: 'text-red-600' },
    { store: 'Red Fish Blue Fish', issue: 'Training needed', severity: 'medium', color: 'text-yellow-600' },
    { store: 'Sal De Mar', issue: 'Fully staffed', severity: 'low', color: 'text-green-600' }
  ];

  console.log('TeamSection rendering with metrics:', teamMetrics);
  console.log('TeamSection rendering with performers:', topPerformers);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <CardTitle className="text-lg">Team Performance</CardTitle>
        </div>
        <p className="text-sm text-gray-600">
          Staff productivity and management insights
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Team Metrics */}
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-700">Key Metrics</div>
          {teamMetrics.map((metric) => (
            <div key={metric.name} className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                  <metric.icon className={`w-4 h-4 ${metric.color}`} />
                </div>
                <span className="text-sm font-medium text-gray-900">{metric.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-900">{metric.value}</span>
                <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs font-medium text-green-600">{metric.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Top Performers */}
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-700">Top Performers</div>
          {topPerformers.map((performer, index) => (
            <div key={performer.name} className="p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                  </div>
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
                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${performer.efficiency}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Staffing Status */}
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-700">Staffing Status</div>
          {staffingIssues.map((item) => (
            <div key={item.store} className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                  {item.severity === 'high' && <AlertCircle className="w-3 h-3 text-red-600" />}
                  {item.severity === 'medium' && <Clock className="w-3 h-3 text-yellow-600" />}
                  {item.severity === 'low' && <UserCheck className="w-3 h-3 text-green-600" />}
                </div>
                <span className="text-sm font-medium text-gray-900">{item.store}</span>
              </div>
              <span className={`text-sm font-medium ${item.color}`}>{item.issue}</span>
            </div>
          ))}
        </div>

        {/* Team insights */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="text-xs font-medium text-blue-800 mb-1">👥 Team Insight</div>
          <div className="text-xs text-blue-700">
            Performance scores are up 7% this month. Sarah Johnson leads with exceptional efficiency.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
