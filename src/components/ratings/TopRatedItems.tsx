
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Award, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface TopRatedItem {
  name: string;
  rating: number;
  reviews: number;
  emoji: string;
  venue?: string;
}

interface TopRatedItemsProps {
  items: TopRatedItem[];
}

const foodImages: Record<string, string> = {
  'Charbroiled Oysters': 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=200&h=200&fit=crop&crop=center',
  'Sister Hen Old Fashioned': 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=200&h=200&fit=crop&crop=center',
  'The Wolf Sandwich': 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=200&h=200&fit=crop&crop=center',
  'Seafood Paella': 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=200&h=200&fit=crop&crop=center',
  'The Lavender Bee': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&h=200&fit=crop&crop=center'
};

export const TopRatedItems = ({ items }: TopRatedItemsProps) => {
  const getImageForItem = (itemName: string) => {
    if (foodImages[itemName]) {
      return foodImages[itemName];
    }
    
    // Fallback images based on keywords
    if (itemName.toLowerCase().includes('oyster') || itemName.toLowerCase().includes('seafood')) {
      return 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=200&h=200&fit=crop&crop=center';
    }
    if (itemName.toLowerCase().includes('cocktail') || itemName.toLowerCase().includes('fashioned') || itemName.toLowerCase().includes('bee')) {
      return 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=200&h=200&fit=crop&crop=center';
    }
    if (itemName.toLowerCase().includes('sandwich') || itemName.toLowerCase().includes('wolf')) {
      return 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=200&h=200&fit=crop&crop=center';
    }
    if (itemName.toLowerCase().includes('paella') || itemName.toLowerCase().includes('steak')) {
      return 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=200&h=200&fit=crop&crop=center';
    }
    if (itemName.toLowerCase().includes('taco') || itemName.toLowerCase().includes('chorizo')) {
      return 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&h=200&fit=crop&crop=center';
    }
    
    return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop&crop=center';
  };

  const getRatingVariant = (rating: number) => {
    if (rating >= 4.5) return { bg: 'bg-success/10', text: 'text-success', label: 'Exceptional' };
    if (rating >= 4.0) return { bg: 'bg-warning/10', text: 'text-warning', label: 'Excellent' };
    if (rating >= 3.5) return { bg: 'bg-accent/10', text: 'text-accent', label: 'Good' };
    return { bg: 'bg-destructive/10', text: 'text-destructive', label: 'Needs Work' };
  };

  const topItem = items[0];
  const averageRating = items.reduce((sum, item) => sum + item.rating, 0) / items.length;
  const ratingVariant = getRatingVariant(averageRating);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
    }
  };

  return (
    <Card className="overflow-hidden border-border/50 bg-card shadow-elevated hover:shadow-elevated-lg transition-all duration-300">
      {/* Header with gradient accent */}
      <CardHeader className="pb-4 bg-gradient-to-br from-accent/5 via-transparent to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-12 h-12 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Award className="w-6 h-6 text-accent-foreground" />
            </motion.div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                Top Rated Items
              </CardTitle>
              <p className="text-sm text-muted-foreground">Customer favorites by rating</p>
            </div>
          </div>
          
          <motion.div 
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${ratingVariant.bg}`}
            whileHover={{ scale: 1.02 }}
          >
            <Star className={`w-4 h-4 ${ratingVariant.text} fill-current`} />
            <span className={`text-lg font-bold ${ratingVariant.text}`}>
              {averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground font-medium">avg</span>
          </motion.div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 pt-0">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {items.slice(0, 5).map((item, index) => {
            const variant = getRatingVariant(item.rating);
            return (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="group relative overflow-hidden bg-secondary/30 hover:bg-secondary/50 p-4 rounded-2xl border border-border/50 hover:border-border transition-all duration-300 hover:shadow-md"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center gap-4">
                  {/* Rank Badge + Image */}
                  <div className="relative flex-shrink-0">
                    <motion.div 
                      className="w-16 h-16 rounded-xl overflow-hidden bg-muted shadow-md ring-2 ring-background"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <img
                        src={getImageForItem(item.name)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop&crop=center';
                        }}
                      />
                    </motion.div>
                    
                    {/* Rank badge */}
                    <div className={`absolute -top-1.5 -left-1.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg ${
                      index === 0 
                        ? 'bg-gradient-to-br from-accent to-accent/80 text-accent-foreground' 
                        : 'bg-primary text-primary-foreground'
                    }`}>
                      {index + 1}
                    </div>

                    {/* Hot badge for top item */}
                    {index === 0 && (
                      <motion.div 
                        className="absolute -bottom-1 -right-1"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <Flame className="w-5 h-5 text-accent fill-accent" />
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-base leading-tight group-hover:text-primary transition-colors truncate">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {item.venue && (
                            <Badge variant="secondary" className="text-xs px-2 py-0.5 font-medium">
                              {item.venue}
                            </Badge>
                          )}
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                            <span className="text-sm font-semibold text-foreground">{item.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({item.reviews} reviews)
                          </span>
                        </div>
                      </div>
                      
                      {/* Performance Label */}
                      <Badge 
                        variant="outline" 
                        className={`${variant.bg} ${variant.text} border-0 text-xs font-medium shrink-0`}
                      >
                        {variant.label}
                      </Badge>
                    </div>

                    {/* Rating Progress Bar */}
                    <div className="mt-3 w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.rating / 5) * 100}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Insights Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-gradient-to-br from-accent/5 via-accent/3 to-transparent p-5 rounded-2xl border border-accent/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <div className="text-base font-semibold text-foreground mb-2">Performance Insights</div>
              <div className="space-y-1.5 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">{topItem?.name}</span> leads with{' '}
                  <span className="font-semibold text-accent">{topItem?.rating} stars</span> from {topItem?.reviews} reviews.
                </p>
                <p>
                  Menu average: <span className="font-semibold text-foreground">{averageRating.toFixed(1)}</span> with{' '}
                  <span className="text-success font-medium">{items.filter(item => item.rating >= 4.0).length} items</span> above 4.0
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};
