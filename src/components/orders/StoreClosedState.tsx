
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Store, Clock, Pause, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StoreClosedStateProps {
  storeName: string;
  storeStatus: 'open' | 'closed';
  orderStatus: 'active' | 'paused';
  onResumeOrders: () => void;
  onOpenStore?: () => void;
}

export const StoreClosedState = ({ 
  storeName, 
  storeStatus, 
  orderStatus, 
  onResumeOrders, 
  onOpenStore 
}: StoreClosedStateProps) => {
  
  const getDisplayInfo = () => {
    if (storeStatus === 'closed') {
      return {
        title: 'Venue Closed',
        message: storeName === 'All Venues' ? 'All venues are currently closed' : `${storeName} is currently closed`,
        buttonText: 'Start Orders',
        buttonAction: () => {
          // When store is closed, opening it should also activate orders
          if (onOpenStore) {
            onOpenStore();
          }
          onResumeOrders();
        },
        statusText: 'Venue closed',
        statusColor: 'red',
        icon: Store
      };
    } else if (orderStatus === 'paused') {
      return {
        title: 'All caught up!',
        message: 'No new orders at the moment. Your venue is currently paused from receiving new orders.',
        buttonText: 'Resume Taking Orders',
        buttonAction: () => {
          console.log('Resume Taking Orders button clicked');
          onResumeOrders();
        },
        statusText: 'Venue is paused',
        statusColor: 'orange',
        icon: Pause
      };
    }
    
    // Fallback (shouldn't reach here)
    return {
      title: 'Orders Inactive',
      message: 'Orders are currently inactive',
      buttonText: 'Start Orders',
      buttonAction: onResumeOrders,
      statusText: 'Inactive',
      statusColor: 'gray',
      icon: Store
    };
  };

  const displayInfo = getDisplayInfo();
  const IconComponent = displayInfo.icon;

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 p-4 pt-[20vh] overflow-y-auto scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
      <div className="w-full max-w-sm sm:max-w-md mx-auto">
        <Card className="shadow-xl border-0 bg-white">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="mb-6">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-${displayInfo.statusColor === 'red' ? 'red' : 'orange'}-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6`}>
                <IconComponent className={`w-8 h-8 sm:w-10 sm:h-10 text-${displayInfo.statusColor === 'red' ? 'red' : 'orange'}-600`} />
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{displayInfo.title}</h2>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-4 leading-relaxed px-2">
                {displayInfo.message}
              </p>
              <div className={`flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 bg-${displayInfo.statusColor === 'red' ? 'red' : 'orange'}-50 rounded-lg py-2 sm:py-3 px-3 sm:px-4 mx-2`}>
                <div className={`w-2 h-2 bg-${displayInfo.statusColor === 'red' ? 'red' : 'orange'}-500 rounded-full animate-pulse flex-shrink-0`}></div>
                <span className="font-medium">{displayInfo.statusText}</span>
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 flex-shrink-0" />
                <span className="truncate">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
            
            <Button 
              onClick={displayInfo.buttonAction}
              size="lg"
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 mb-3"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
              {displayInfo.buttonText}
            </Button>
            
            <Link to="/settings" className="block w-full">
              <Button 
                variant="outline"
                size="lg"
                className="w-full border border-gray-200 hover:bg-gray-50 text-gray-800 py-3 sm:py-4 text-base sm:text-lg font-medium"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                Venue Settings
              </Button>
            </Link>
            
            <p className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6 leading-relaxed px-2">
              Need help? Check your <Link to="/settings" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">venue settings</Link> or contact support.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
