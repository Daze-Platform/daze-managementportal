
import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  starSize?: string;
}

export const RatingStars = ({ rating, starSize = 'w-4 h-4' }: RatingStarsProps) => {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`${starSize} transition-colors ${
            i < Math.floor(rating) 
              ? 'fill-accent text-accent' 
              : i < rating 
                ? 'fill-accent/50 text-accent/50' 
                : 'text-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  );
};
