
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RatingStars } from './RatingStars';
import { TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

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

export const OverallRating = ({ overall, totalReviews, breakdown }: OverallRatingProps) => {
  const getBarColor = (stars: number) => {
    if (stars === 5) return 'from-success to-success/70';
    if (stars === 4) return 'from-success/80 to-success/50';
    if (stars === 3) return 'from-warning to-warning/70';
    if (stars === 2) return 'from-accent to-accent/70';
    return 'from-destructive to-destructive/70';
  };

  return (
    <Card className="overflow-hidden border-border/50 bg-card shadow-elevated hover:shadow-elevated-lg transition-all duration-300">
      <CardHeader className="pb-4 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.05, rotate: -5 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <TrendingUp className="w-6 h-6 text-primary-foreground" />
          </motion.div>
          <div>
            <CardTitle className="text-xl font-bold text-foreground">Overall Rating</CardTitle>
            <p className="text-sm text-muted-foreground">Customer satisfaction score</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Rating Display */}
        <div className="flex items-center gap-6">
          <motion.div 
            className="relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div className="text-6xl font-bold text-foreground tracking-tight">{overall}</div>
            <div className="absolute -right-2 -top-1">
              <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-success/10 text-success border-0">
                +0.2
              </Badge>
            </div>
          </motion.div>
          
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-2">
              <RatingStars rating={overall} starSize="w-5 h-5" />
            </div>
            <p className="text-sm text-muted-foreground">
              Based on <span className="font-semibold text-foreground">{totalReviews}</span> reviews
            </p>
          </div>
        </div>
        
        {/* Rating Breakdown */}
        <div className="space-y-3">
          {breakdown.map((item, index) => (
            <motion.div 
              key={item.stars} 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <div className="w-8 flex items-center gap-1">
                <span className="text-sm font-semibold text-foreground">{item.stars}</span>
                <span className="text-xs text-muted-foreground">★</span>
              </div>
              
              <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full bg-gradient-to-r ${getBarColor(item.stars)} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
                />
              </div>
              
              <div className="w-20 text-right">
                <span className="text-sm font-medium text-foreground">{item.count}</span>
                <span className="text-xs text-muted-foreground ml-1">({item.percentage}%)</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Insight Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-success/10 via-success/5 to-transparent p-4 rounded-2xl border border-success/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-success/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-success" />
            </div>
            <p className="text-sm text-foreground">
              <span className="font-semibold">Great performance!</span>{' '}
              <span className="text-muted-foreground">Over the last 7 days, you were rated the same as top stores.</span>
            </p>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};
