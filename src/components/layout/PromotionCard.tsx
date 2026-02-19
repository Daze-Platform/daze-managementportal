import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, X } from 'lucide-react';

export const PromotionCard = () => {
  const navigate = useNavigate();
  const [isDismissed, setIsDismissed] = useState(false);

  const handleGetStarted = () => {
    navigate('/promotions');
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div className="px-3 py-2 sm:px-4 sm:py-3 lg:px-6">
      <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-[1px] sm:p-[2px] rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group w-full">
        
        {/* Background glow effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none"></div>
        <div className="absolute -top-6 -right-6 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-300/30 to-orange-300/20 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute -bottom-6 -left-6 w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-tr from-pink-300/30 to-red-300/20 rounded-full blur-xl pointer-events-none"></div>
        
        {/* Content wrapper */}
        <div className="relative z-10 flex items-center justify-between gap-3 sm:gap-4 px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-br from-orange-500/90 via-red-500/90 to-pink-500/90 rounded-xl sm:rounded-2xl">
          
          {/* Left content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 flex-shrink-0" />
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white leading-tight truncate">
                Boost Sales with Promotions
              </h3>
            </div>
            <p className="text-white/90 text-xs sm:text-sm leading-tight line-clamp-1">
              Create targeted campaigns to increase revenue.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              onClick={handleGetStarted}
              className="flex-shrink-0 bg-white text-orange-600 hover:bg-white/95 hover:text-orange-700 font-semibold min-h-[40px] px-3 sm:px-4 py-2 text-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
            >
              Create
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDismissed(true)}
              className="text-white/80 hover:text-white hover:bg-white/10 h-9 w-9"
              aria-label="Dismiss promotion"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
