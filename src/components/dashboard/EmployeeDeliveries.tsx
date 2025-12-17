
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  avatar: string;
  deliveries: number;
  onTime: number;
  rating: number;
  earnings: string;
  status: string;
  color: string;
}

interface EmployeeDeliveriesProps {
  employees: Employee[];
}

export const EmployeeDeliveries = ({ employees }: EmployeeDeliveriesProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">🟢 Active</Badge>;
      case 'break':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs">⏸️ Break</Badge>;
      case 'offline':
        return <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 text-xs">⚫ Offline</Badge>;
      default:
        return <Badge className="text-xs">{status}</Badge>;
    }
  };

  const getOnTimePercentage = (onTime: number, total: number) => {
    return Math.round((onTime / total) * 100);
  };

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Deliveries Today</CardTitle>
          <Truck className="w-5 h-5 text-blue-500" />
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="grid grid-cols-1 gap-3">
          {employees.map((employee) => (
            <div key={employee.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`w-8 h-8 ${employee.color} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {employee.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {employee.name}
                    </p>
                    {getStatusBadge(employee.status)}
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-gray-500">
                      {employee.deliveries} deliveries
                    </p>
                    <p className="text-xs text-gray-500">
                      ★ {employee.rating}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-gray-900">
                  {employee.earnings}
                </p>
                <p className="text-xs text-green-600 font-medium">
                  {getOnTimePercentage(employee.onTime, employee.deliveries)}% on-time
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
