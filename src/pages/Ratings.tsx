
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { OverallRating } from '@/components/ratings/OverallRating';
import { TopRatedItems } from '@/components/ratings/TopRatedItems';
import { RecentReviews } from '@/components/ratings/RecentReviews';
import { motion } from 'framer-motion';
import { Star, Calendar } from 'lucide-react';

import { format } from 'date-fns';

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
    { name: 'Charbroiled Oysters', rating: 4.9, reviews: 48, emoji: '🦪', venue: 'Brother Fox' },
    { name: 'Sister Hen Old Fashioned', rating: 4.8, reviews: 62, emoji: '🥃', venue: 'Sister Hen' },
    { name: 'The Wolf Sandwich', rating: 4.8, reviews: 35, emoji: '🥪', venue: 'Cousin Wolf' },
    { name: 'Seafood Paella', rating: 4.7, reviews: 28, emoji: '🥘', venue: 'Brother Fox' },
    { name: 'The Lavender Bee', rating: 4.6, reviews: 41, emoji: '🍸', venue: 'Sister Hen' }
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
  const lastUpdatedLabel = format(new Date(), 'MMM dd, yyyy');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring' as const, stiffness: 200, damping: 20 }
    }
  };

  return (
    <motion.div 
      className="min-h-screen p-6 md:p-8 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center shadow-lg">
            <Star className="w-7 h-7 text-accent-foreground fill-accent-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Customer Satisfaction</h1>
            <p className="text-gray-600 text-sm mt-0.5 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              Last updated {lastUpdatedLabel}
            </p>
          </div>
        </div>
        
        <DateRangePicker value={dateRange} onChange={setDateRange} className="w-64" />
      </motion.div>

      {/* Main Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <OverallRating 
          overall={ratingsData.overall}
          totalReviews={ratingsData.totalReviews}
          breakdown={ratingsData.breakdown}
        />
        <TopRatedItems items={ratingsData.topRatedItems} />
      </motion.div>

      {/* Reviews Section */}
      <motion.div variants={itemVariants}>
        <RecentReviews 
          reviews={ratingsData.recentReviews}
          totalReviews={ratingsData.totalReviews}
          reviewsChange={ratingsData.reviewsChange}
        />
      </motion.div>
    </motion.div>
  );
};
