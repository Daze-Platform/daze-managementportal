
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RatingStars } from './RatingStars';

interface BreakdownItem {
  stars: number;
  count: number;
  percentage: number;
}

interface OverallRatingProps {
  overall: number;
  totalReviews: number;
  breakdown: BreakdownItem[];
}

const renderRatingBar = (percentage: number) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className="bg-blue-600 h-2 rounded-full"
      style={{ width: `${percentage}%` }}
    />
  </div>
);

export const OverallRating = ({ overall, totalReviews, breakdown }: OverallRatingProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Overall rating</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="text-4xl font-bold">{overall}</div>
            <div className="flex items-center mt-2">
              <RatingStars rating={overall} />
            </div>
            <p className="text-sm text-gray-500 mt-2">based on {totalReviews} reviews</p>
          </div>
          
          <div className="space-y-3">
            {breakdown.map((item) => (
              <div key={item.stars} className="flex items-center gap-3 text-sm">
                <span className="w-2 text-gray-600">{item.stars}</span>
                <div className="flex-1">
                  {renderRatingBar(item.percentage)}
                </div>
                <span className="text-gray-500 w-16 text-right">{item.count} ({item.percentage}%)</span>
              </div>
            ))}
          </div>

          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <p className="text-sm text-orange-700">
              ⚡ Over the last 7 days, you were rated the same as the top store
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
