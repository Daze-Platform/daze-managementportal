import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Smartphone, Zap } from 'lucide-react';

export const WaitingForOrdersState = () => {
  return (
    <div className="h-full flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-lg mx-auto">
        <Card className="w-full text-center border-0 shadow-2xl bg-white">
          <CardContent className="p-6 sm:p-8 lg:p-12">
            {/* Modern illustration with layered design */}
            <div className="relative mb-6 sm:mb-8">
              {/* Main phone illustration */}
              <div className="relative mx-auto w-28 h-28 sm:w-32 sm:h-32 mb-4 sm:mb-6">
                {/* Phone outline */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-xl transform rotate-3">
                  <div className="absolute inset-2 bg-white rounded-2xl flex items-center justify-center">
                    <div className="text-2xl sm:text-3xl">📱</div>
                  </div>
                </div>
                
                {/* Floating notification bubbles */}
                <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
                </div>
                
                {/* Signal waves */}
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-1">
                    <div className="w-1 h-2 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="w-1 h-3 sm:h-4 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '75ms' }}></div>
                    <div className="w-1 h-4 sm:h-5 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                  </div>
                </div>
              </div>

              {/* Floating action icons */}
              <div 
                className="absolute top-6 sm:top-8 left-6 sm:left-8 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  animation: 'float 3s ease-in-out infinite'
                }}
              >
                <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div 
                className="absolute top-2 sm:top-4 right-6 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center animate-bounce shadow-lg"
                style={{ animationDelay: '300ms' }}
              >
                <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="absolute bottom-6 sm:bottom-8 left-8 sm:left-12 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>

            {/* Modern typography */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Ready for orders
              </h2>
              
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-sm mx-auto px-2">
                Your restaurant is live and ready to receive customer orders
              </p>
            </div>

            {/* Status indicator with modern design */}
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex items-center bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-sm">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                    <div className="absolute inset-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-ping opacity-40"></div>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-green-700">Online & Active</span>
                </div>
              </div>
            </div>

            {/* Loading dots with modern styling */}
            <div className="flex justify-center items-center space-x-2 mb-4 sm:mb-6">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
              </div>
            </div>

            {/* Subtle call-to-action text */}
            <p className="text-sm text-gray-500 font-medium">
              New orders will appear here shortly
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Custom CSS for float animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `
      }} />
    </div>
  );
};
