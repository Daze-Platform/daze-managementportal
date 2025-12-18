
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useResort } from '@/contexts/DestinationContext';

export const HotelSelector = () => {
  const { currentDestination, destinations, setCurrentDestination, currentResort, resorts } = useResort();
  
  // Use new naming or legacy aliases
  const current = currentDestination || currentResort;
  const allDestinations = destinations || resorts;

  const handleDestinationChange = (destinationId: string) => {
    const selected = allDestinations.find(d => d.id === destinationId);
    if (selected) {
      setCurrentDestination(selected);
      console.log('Destination changed to:', selected);
    }
  };

  if (!current || allDestinations.length === 0) {
    return (
      <div className="flex-shrink-0 px-4 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 border-b border-white/10">
        <div className="text-white text-sm">No destinations available</div>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 px-6 py-6 border-b border-white/10">
      <div className="w-full">
        <Select value={current.id} onValueChange={handleDestinationChange}>
          <SelectTrigger className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange/50 h-14 px-4 rounded-xl transition-all duration-200 backdrop-blur-sm">
            <div className="flex items-center w-full space-x-3 min-w-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden bg-white/10">
                {current.logo ? (
                  <img
                    src={current.logo}
                    alt={`${current.name} logo`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center rounded-lg">
                    <span className="text-white text-sm font-bold">
                      {current.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="text-white font-medium text-sm truncate">
                  {current.name}
                </div>
              </div>
            </div>
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 min-w-[280px] rounded-xl shadow-xl">
            {allDestinations.map((destination) => (
              <SelectItem 
                key={destination.id} 
                value={destination.id} 
                className="text-gray-900 p-3 rounded-lg m-1 focus:bg-brand-orange/10 data-[highlighted]:bg-brand-orange/10"
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden">
                    {destination.logo ? (
                      <img
                        src={destination.logo}
                        alt={`${destination.name} logo`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center rounded-lg">
                        <span className="text-white text-sm font-bold">
                          {destination.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{destination.name}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
