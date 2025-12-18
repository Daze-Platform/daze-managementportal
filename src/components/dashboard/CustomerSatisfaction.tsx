
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, TrendingUp, Users } from 'lucide-react';

interface CustomerSatisfactionData {
  overall: number;
  foodQuality: number;
  serviceSpeed: number;
  cleanliness: number;
  value: number;
  totalReviews: number;
}

interface CustomerSatisfactionProps {
  data: CustomerSatisfactionData;
}

export const CustomerSatisfaction = ({ data }: CustomerSatisfactionProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
            ? 'text-yellow-400 fill-current opacity-50' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const categories = [
    { label: 'Food Quality', value: data.foodQuality, icon: '🍽️' },
    { label: 'Service Speed', value: data.serviceSpeed, icon: '⚡' },
    { label: 'Cleanliness', value: data.cleanliness, icon: '✨' },
    { label: 'Value', value: data.value, icon: '💰' },
  ];

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2 px-3 sm:px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg lg:text-xl">Customer Satisfaction</CardTitle>
          <div className="flex items-center gap-1 sm:gap-2">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <span className="text-xs sm:text-sm text-gray-600">
              <span className="hidden sm:inline">{data.totalReviews.toLocaleString()} reviews</span>
              <span className="sm:hidden">{data.totalReviews.toLocaleString()}</span>
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3 px-3 sm:px-6">
        <div className="space-y-3 sm:space-y-4">
          {/* Overall Rating */}
          <div className="flex items-center justify-between p-3 sm:p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center shadow-md ring-1 ring-black/5">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 fill-current" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold text-gray-900">{data.overall.toFixed(1)}</p>
                <p className="text-xs sm:text-sm text-gray-600">Overall Rating</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {renderStars(data.overall)}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="space-y-2 sm:space-y-3">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-base sm:text-lg">{category.icon}</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-900">{category.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars(category.value)}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900 w-6 sm:w-8">
                    {category.value.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="bg-green-50 p-2 sm:p-3 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              <span className="text-xs sm:text-sm font-medium text-green-800">
                Satisfaction trending upward
              </span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              +0.3 points from last month
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
