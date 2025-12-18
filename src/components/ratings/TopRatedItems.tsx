
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, TrendingUp } from 'lucide-react';

interface TopRatedItem {
  name: string;
  rating: number;
  reviews: number;
  emoji: string;
  store?: string;
}

interface TopRatedItemsProps {
  items: TopRatedItem[];
}

const foodImages: Record<string, string> = {
  'Charbroiled Oysters': 'https://images.unsplash.com/photo-1606731219412-3eb5a4e94673?w=100&h=100&fit=crop&crop=center',
  'Sister Hen Old Fashioned': 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=100&h=100&fit=crop&crop=center',
  'The Wolf Sandwich': 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=100&h=100&fit=crop&crop=center',
  'Seafood Paella': 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=100&h=100&fit=crop&crop=center',
  'The Lavender Bee': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=100&h=100&fit=crop&crop=center'
};

export const TopRatedItems = ({ items }: TopRatedItemsProps) => {
  const getImageForItem = (itemName: string) => {
    if (foodImages[itemName]) {
      return foodImages[itemName];
    }
    
    // Fallback images based on keywords
    if (itemName.toLowerCase().includes('oyster') || itemName.toLowerCase().includes('seafood')) {
      return 'https://images.unsplash.com/photo-1606731219412-3eb5a4e94673?w=120&h=120&fit=crop&crop=center';
    }
    if (itemName.toLowerCase().includes('cocktail') || itemName.toLowerCase().includes('fashioned') || itemName.toLowerCase().includes('bee')) {
      return 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=120&h=120&fit=crop&crop=center';
    }
    if (itemName.toLowerCase().includes('sandwich') || itemName.toLowerCase().includes('wolf')) {
      return 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=120&h=120&fit=crop&crop=center';
    }
    if (itemName.toLowerCase().includes('paella') || itemName.toLowerCase().includes('steak')) {
      return 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=120&h=120&fit=crop&crop=center';
    }
    if (itemName.toLowerCase().includes('taco') || itemName.toLowerCase().includes('chorizo')) {
      return 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=120&h=120&fit=crop&crop=center';
    }
    
    return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=120&h=120&fit=crop&crop=center';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-50';
    if (rating >= 4.0) return 'text-orange-600 bg-orange-50';
    if (rating >= 3.5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getPerformanceLabel = (rating: number) => {
    if (rating >= 4.5) return 'Exceptional';
    if (rating >= 4.0) return 'Excellent';
    if (rating >= 3.5) return 'Good';
    return 'Needs Improvement';
  };

  const topItem = items[0];
  const averageRating = items.reduce((sum, item) => sum + item.rating, 0) / items.length;

  return (
    <Card className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
              <Star className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Top Rated Items
              </CardTitle>
              <p className="text-sm text-muted-foreground">Customer favorites ranked by rating</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Avg Rating</div>
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${getRatingColor(averageRating)}`}>
              <Star className="w-3 h-3 fill-current" />
              <span className="text-sm font-bold">{averageRating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {items.slice(0, 5).map((item, index) => (
          <div 
            key={index} 
            className="group bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-white/60 hover:bg-white hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              {/* Rank & Image */}
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-lg ring-1 ring-black/5 group-hover:shadow-xl transition-all duration-300">
                  <img
                    src={getImageForItem(item.name)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=120&h=120&fit=crop&crop=center';
                    }}
                  />
                </div>
                {/* Rank badge */}
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                  {index + 1}
                </div>
              </div>
              
              {/* Item Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-base leading-tight group-hover:text-amber-600 transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      {item.store && (
                        <span className="text-xs text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-full font-medium">
                          {item.store}
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-bold text-foreground">{item.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {item.reviews} reviews
                      </span>
                    </div>
                  </div>
                  
                  {/* Rating Score with Performance Label */}
                  <div className="text-right ml-4">
                    <div className={`text-lg font-bold ${getRatingColor(item.rating).split(' ')[0]}`}>
                      {item.rating}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getPerformanceLabel(item.rating)}
                    </div>
                  </div>
                </div>

                {/* Rating bar */}
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(item.rating / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Enhanced Insights Panel */}
        <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-xl border border-amber-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🏆</span>
            </div>
            <div className="flex-1">
              <div className="text-base font-bold text-amber-800 mb-2">Performance Insights</div>
              <div className="space-y-2 text-sm text-amber-700">
                <p>
                  <span className="font-semibold">{topItem?.name}</span> leads with <span className="font-semibold">{topItem?.rating} stars</span> from {topItem?.reviews} reviews.
                </p>
                <p>
                  Your menu maintains an average rating of <span className="font-semibold">{averageRating.toFixed(1)} stars</span> with {items.filter(item => item.rating >= 4.0).length} items above 4.0.
                </p>
                <p className="text-amber-600 font-medium">
                  💡 Consider featuring top-rated items in promotions to boost sales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
