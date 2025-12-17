import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const PromotionCard = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/promotions');
  };

  return (
    <div className="flex justify-center px-2">
      <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-0.5 sm:p-1 md:p-1.5 m-1 sm:m-1.5 md:m-2 rounded-lg sm:rounded-xl overflow-hidden shadow-lg sm:shadow-xl min-h-[4px] sm:min-h-[5px] md:min-h-[6px] lg:min-h-[7.5px] hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] group w-full max-w-5xl lg:max-w-7xl">
        
        {/* Enhanced background effects - mobile optimized */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none"></div>
        <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 md:-top-4 md:-right-4 w-6 h-6 sm:w-10 sm:h-10 md:w-14 md:h-14 bg-gradient-to-br from-yellow-300/30 to-orange-300/20 rounded-full blur-sm sm:blur-md md:blur-lg pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-4 h-4 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-tr from-pink-300/30 to-red-300/20 rounded-full blur-sm sm:blur-md pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
        
        {/* Subtle animated border glow */}
        <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        
        {/* Content wrapper - mobile optimized */}
        <div className="relative z-10 flex items-center justify-between h-full px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2">
          
          {/* Left content area - mobile responsive */}
          <div className="flex-1 space-y-0.5 max-w-[50%] sm:max-w-[45%] pr-1 sm:pr-2">
            <div className="space-y-0.5">
              <h3 className="text-[8px] sm:text-xs md:text-sm font-bold text-white leading-tight tracking-tight drop-shadow-sm">
                Boost Sales with Smart Promotions
              </h3>
              <p className="text-white/95 text-[7px] sm:text-xs leading-tight font-medium drop-shadow-sm hidden sm:block">
                Create targeted promotions to increase revenue and build customer loyalty across all your locations.
              </p>
              <p className="text-white/80 text-[6px] sm:text-xs font-medium hidden md:block">
                Drive repeat visits • Increase order value
              </p>
            </div>
          </div>
          
          {/* Center illustration area - mobile responsive */}
          <div className="flex-shrink-0 relative w-[25%] sm:w-[30%] h-full flex items-center justify-center">
            <div className="relative w-full h-2 sm:h-3 md:h-4 lg:h-5">
              
              {/* Main promotional badge - mobile responsive */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 bg-gradient-to-br from-yellow-300 via-amber-300 to-orange-400 rounded-full flex items-center justify-center shadow-md sm:shadow-lg border border-white/40 backdrop-blur-sm group-hover:animate-pulse">
                <div className="text-[6px] sm:text-xs md:text-sm font-black text-orange-900 drop-shadow-sm">%</div>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30 rounded-full"></div>
              </div>
              
              {/* Enhanced floating elements - mobile responsive */}
              <div className="absolute -top-0.5 left-0 w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 lg:w-3 lg:h-3 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 rounded-full flex items-center justify-center shadow-sm sm:shadow-md border border-white/50 backdrop-blur-sm animate-bounce group-hover:animate-pulse" style={{animationDelay: '0.2s'}}>
                <div className="w-0.5 h-0.5 bg-white/90 rounded-full drop-shadow-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30 rounded-full"></div>
              </div>
              
              <div className="absolute -top-0.5 right-0 w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 lg:w-3 lg:h-3 bg-gradient-to-br from-violet-400 via-purple-400 to-fuchsia-500 rounded-full flex items-center justify-center shadow-sm sm:shadow-md border border-white/50 backdrop-blur-sm animate-bounce group-hover:animate-pulse" style={{animationDelay: '0.4s'}}>
                <div className="w-0.5 h-0.5 bg-white/90 rounded-full drop-shadow-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30 rounded-full"></div>
              </div>
              
              <div className="absolute -bottom-0.5 left-1/4 w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-sm sm:shadow-md border border-white/50 backdrop-blur-sm animate-bounce group-hover:animate-pulse" style={{animationDelay: '0.6s'}}>
                <div className="w-0.5 h-0.5 bg-white/90 rounded-full drop-shadow-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30 rounded-full"></div>
              </div>
              
              <div className="absolute -bottom-0.5 right-1/4 w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-gradient-to-br from-pink-400 via-rose-400 to-red-500 rounded-full flex items-center justify-center shadow-sm sm:shadow-md border border-white/50 backdrop-blur-sm animate-bounce group-hover:animate-pulse" style={{animationDelay: '0.8s'}}>
                <div className="w-0.5 h-0.5 bg-white/90 rounded-full drop-shadow-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30 rounded-full"></div>
              </div>
              
              {/* Additional sparkle effects - mobile responsive */}
              <div className="absolute top-0 left-1/2 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white/60 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-0 right-1/3 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white/50 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
            </div>
          </div>
          
          {/* Right button area - mobile responsive */}
          <div className="flex-shrink-0 w-[25%] flex justify-end">
            <Button 
              onClick={handleGetStarted}
              className="bg-white/95 backdrop-blur-sm text-orange-600 hover:bg-white hover:text-orange-700 font-semibold px-1 py-0.5 sm:px-2 sm:py-1 text-[6px] sm:text-xs rounded-md sm:rounded-lg shadow-sm sm:shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 border border-white/20"
            >
              Create →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
