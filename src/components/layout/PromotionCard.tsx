import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export const PromotionCard = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/promotions');
  };

  return (
    <div className="px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
      <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-[2px] sm:p-1 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group w-full">
        
        {/* Background glow effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none"></div>
        <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-300/30 to-orange-300/20 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute -bottom-4 -left-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-tr from-pink-300/30 to-red-300/20 rounded-full blur-xl pointer-events-none"></div>
        
        {/* Content wrapper */}
        <div className="relative z-10 flex items-center justify-between gap-3 sm:gap-4 px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-br from-orange-500/90 via-red-500/90 to-pink-500/90 rounded-xl sm:rounded-2xl">
          
          {/* Left content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 flex-shrink-0" />
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-white leading-tight truncate">
                Boost Sales with Promotions
              </h3>
            </div>
            <p className="text-white/90 text-xs sm:text-sm leading-tight line-clamp-2">
              Create targeted campaigns to increase revenue and build customer loyalty.
            </p>
          </div>
          
          {/* Right button */}
          <Button 
            onClick={handleGetStarted}
            className="flex-shrink-0 bg-white text-orange-600 hover:bg-white/95 hover:text-orange-700 font-semibold min-h-[44px] px-4 sm:px-6 py-2.5 text-sm sm:text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};
