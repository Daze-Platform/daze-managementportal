import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StoreLogo } from './StoreLogo';
import { Store } from '@/types/store';

interface StoresListProps {
  stores: Store[];
  onCreateStore: () => void;
  onViewStore: (store: Store) => void;
}

export const StoresList = ({ stores, onCreateStore, onViewStore }: StoresListProps) => {
  // Remove duplicates based on ID
  const uniqueStores = stores.filter((store, index, self) => 
    index === self.findIndex(s => s.id === store.id)
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Stores</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your business locations ({uniqueStores.length} {uniqueStores.length === 1 ? 'store' : 'stores'})
            </p>
          </div>
          <Button 
            onClick={() => {
              console.log('Add Store button clicked!');
              onCreateStore();
            }}
            className="w-full sm:w-auto"
            size="default"
          >
            Add Store
          </Button>
        </div>
      </div>

      {uniqueStores.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <div className="flex flex-col items-center justify-center text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl sm:text-3xl">🏪</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No stores yet
            </h3>
            <p className="text-gray-600 text-sm sm:text-base max-w-sm mb-6">
              Create your first store to start managing your business locations
            </p>
            <Button 
              onClick={onCreateStore}
              size="lg"
              className="w-full sm:w-auto"
            >
              Add Your First Store
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {uniqueStores.map((store) => (
              <Card 
                key={store.id} 
                className="hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 hover:border-gray-300"
                onClick={() => onViewStore(store)}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <StoreLogo
                        logo={store.logo}
                        customLogo={store.customLogo}
                        bgColor={store.bgColor}
                        size="md"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate mb-1">{store.name}</h3>
                        <p className="text-gray-600 text-sm flex items-center">
                          <span className="mr-2">📍</span>
                          <span className="truncate">{store.address}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 flex-shrink-0">
                      {store.activeOrders > 0 && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-600 font-medium whitespace-nowrap">
                            <span className="hidden sm:inline">{store.activeOrders} active orders</span>
                            <span className="sm:hidden">{store.activeOrders}</span>
                          </span>
                        </div>
                      )}
                      <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};