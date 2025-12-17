
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { OverallRating } from '@/components/ratings/OverallRating';
import { TopRatedItems } from '@/components/ratings/TopRatedItems';
import { RecentReviews } from '@/components/ratings/RecentReviews';

const ratingsData = {
  overall: 4.0,
  totalReviews: 29,
  reviewsChange: 2.00,
  breakdown: [
    { stars: 5, count: 22, percentage: 76 },
    { stars: 4, count: 4, percentage: 14 },
    { stars: 3, count: 2, percentage: 7 },
    { stars: 2, count: 1, percentage: 3 },
    { stars: 1, count: 0, percentage: 0 }
  ],
  topRatedItems: [
    { name: 'The Crispy Bun', rating: 4.8, reviews: 72, emoji: '🍔' },
    { name: 'The Meaty One', rating: 4.6, reviews: 12, emoji: '🥩' },
    { name: 'Chicken Burrito', rating: 4.5, reviews: 20, emoji: '🌯' },
    { name: 'Chocolate cherry cheesecake', rating: 4.3, reviews: 7, emoji: '🍰' },
    { name: 'French Fries', rating: 4.1, reviews: 4, emoji: '🍟' }
  ],
  recentReviews: [
    {
      customer: 'Amanda Johnson',
      orders: 8,
      rating: 5,
      review: "Absolutely fantastic! The Crispy Bun was perfectly seasoned and arrived hot. Best burger I've had in months!",
      orderId: '#5657676901',
      date: 'May 9, 2021 2:30PM'
    },
    {
      customer: 'Michael Rodriguez',
      orders: 15,
      rating: 5,
      review: "Outstanding service and incredible food quality. The chicken burrito was packed with flavor and the delivery was super quick!",
      orderId: '#5657676902',
      date: 'May 9, 2021 1:15PM'
    },
    {
      customer: 'Sarah Chen',
      orders: 6,
      rating: 5,
      review: "This place never disappoints! Fresh ingredients, generous portions, and always on time. Highly recommend the chocolate cheesecake!",
      orderId: '#5657676903',
      date: 'May 8, 2021 7:45PM'
    },
    {
      customer: 'David Thompson',
      orders: 22,
      rating: 5,
      review: "Exceptional quality every single time. The staff clearly takes pride in their work. Will definitely order again!",
      orderId: '#5657676904',
      date: 'May 8, 2021 6:20PM'
    },
    {
      customer: 'Serena Smith',
      orders: 4,
      rating: 4,
      review: "They didn't include sauce for my french fries",
      orderId: '#5657676878',
      date: 'May 7, 2021 11:50AM'
    },
    {
      customer: 'Johny Smith',
      orders: 12,
      rating: 3,
      review: "Where are the smoothies?",
      orderId: '#5657676878',
      date: 'May 7, 2021 11:50AM'
    }
  ]
};

export const Ratings = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Customer satisfaction</h1>
          <p className="text-gray-500 text-sm mt-1">Last updated on Dec 28, 2021</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <DateRangePicker value={dateRange} onChange={setDateRange} className="w-64" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OverallRating 
          overall={ratingsData.overall}
          totalReviews={ratingsData.totalReviews}
          breakdown={ratingsData.breakdown}
        />
        <TopRatedItems items={ratingsData.topRatedItems} />
      </div>

      <RecentReviews 
        reviews={ratingsData.recentReviews}
        totalReviews={ratingsData.totalReviews}
        reviewsChange={ratingsData.reviewsChange}
      />
    </div>
  );
};
