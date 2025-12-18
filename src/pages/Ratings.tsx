
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { OverallRating } from '@/components/ratings/OverallRating';
import { TopRatedItems } from '@/components/ratings/TopRatedItems';
import { RecentReviews } from '@/components/ratings/RecentReviews';

const ratingsData = {
  overall: 4.7,
  totalReviews: 156,
  reviewsChange: 12.50,
  breakdown: [
    { stars: 5, count: 112, percentage: 72 },
    { stars: 4, count: 28, percentage: 18 },
    { stars: 3, count: 10, percentage: 6 },
    { stars: 2, count: 4, percentage: 3 },
    { stars: 1, count: 2, percentage: 1 }
  ],
  topRatedItems: [
    { name: 'Charbroiled Oysters', rating: 4.9, reviews: 48, emoji: '🦪', store: 'Brother Fox' },
    { name: 'Sister Hen Old Fashioned', rating: 4.8, reviews: 62, emoji: '🥃', store: 'Sister Hen' },
    { name: 'The Wolf Sandwich', rating: 4.8, reviews: 35, emoji: '🥪', store: 'Cousin Wolf' },
    { name: 'Seafood Paella', rating: 4.7, reviews: 28, emoji: '🥘', store: 'Brother Fox' },
    { name: 'The Lavender Bee', rating: 4.6, reviews: 41, emoji: '🍸', store: 'Sister Hen' }
  ],
  recentReviews: [
    {
      customer: 'Amanda Johnson',
      orders: 8,
      rating: 5,
      review: "The Charbroiled Oysters at Brother Fox were incredible! Perfectly seasoned with that herb butter and parmesan. Best oysters in Pensacola!",
      orderId: '#LH-2024-1201',
      date: 'Dec 15, 2024 7:30PM'
    },
    {
      customer: 'Michael Rodriguez',
      orders: 15,
      rating: 5,
      review: "Sister Hen's Old Fashioned is a masterpiece. The smoked cherry really elevates it. Such a cozy speakeasy vibe too!",
      orderId: '#LH-2024-1198',
      date: 'Dec 15, 2024 9:15PM'
    },
    {
      customer: 'Sarah Chen',
      orders: 6,
      rating: 5,
      review: "Cousin Wolf's breakfast tacos are my new weekend ritual! The Chorizo & Egg Taco with that salsa verde is absolutely perfect.",
      orderId: '#LH-2024-1195',
      date: 'Dec 14, 2024 9:45AM'
    },
    {
      customer: 'David Thompson',
      orders: 22,
      rating: 5,
      review: "The Prime Skirt Steak Asada at Brother Fox was cooked to perfection. That chimichurri sauce is incredible! Will definitely be back.",
      orderId: '#LH-2024-1192',
      date: 'Dec 14, 2024 8:20PM'
    },
    {
      customer: 'Emily Martinez',
      orders: 4,
      rating: 4,
      review: "Loved the Midnight Garden cocktail at Sister Hen - that mezcal and jalapeño combo is unique! Would've given 5 stars but the wait was a bit long.",
      orderId: '#LH-2024-1188',
      date: 'Dec 13, 2024 10:30PM'
    },
    {
      customer: 'James Wilson',
      orders: 12,
      rating: 3,
      review: "Cold Brew from Cousin Wolf was good but arrived lukewarm. Would appreciate better temperature control for deliveries.",
      orderId: '#LH-2024-1185',
      date: 'Dec 13, 2024 8:50AM'
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
          <p className="text-gray-500 text-sm mt-1">Last updated on Dec 18, 2024</p>
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
