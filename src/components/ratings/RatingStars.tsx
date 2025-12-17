
import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  starSize?: string;
}

export const RatingStars = ({ rating, starSize = 'w-4 h-4' }: RatingStarsProps) => {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`${starSize} ${
            i < Math.floor(rating) ? 'fill-orange-400 text-orange-400' : 'text-gray-300'
          }`}
        />
      ))}
    </>
  );
};
