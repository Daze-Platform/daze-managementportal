import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StoreLogo } from './StoreLogo';
import { Store } from '@/types/store';
import { Plus, ChevronRight, MapPin, Activity } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/animated-container';

interface StoresListProps {
  stores: Store[];
  onCreateStore: () => void;
  onViewStore: (store: Store) => void;
}

export const StoresList = ({ stores, onCreateStore, onViewStore }: StoresListProps) => {
  const uniqueStores = stores.filter((store, index, self) => 
    index === self.findIndex(s => s.id === store.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <Card className="border-border/50 bg-card shadow-glass">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Stores</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your business locations ({uniqueStores.length} {uniqueStores.length === 1 ? 'store' : 'stores'})
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={() => {
                    console.log('Add Store button clicked!');
                    onCreateStore();
                  }}
                  className="w-full sm:w-auto gradient-primary text-primary-foreground hover:opacity-90 shadow-md"
                  size="default"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Store
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Stores List */}
      {uniqueStores.length === 0 ? (
        <FadeIn delay={0.1}>
          <Card className="border-border/50 bg-card shadow-glass">
            <CardContent className="p-8 sm:p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <motion.div 
                  className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-4xl">🏪</span>
                </motion.div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No stores yet
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm mb-6">
                  Create your first store to start managing your business locations
                </p>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={onCreateStore}
                    size="lg"
                    className="gradient-primary text-primary-foreground hover:opacity-90 shadow-md"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Store
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      ) : (
        <FadeIn delay={0.1}>
          <Card className="border-border/50 bg-card shadow-glass overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <StaggerContainer className="space-y-3">
                {uniqueStores.map((store, index) => (
                  <StaggerItem key={store.id}>
                    <motion.div
                      whileHover={{ scale: 1.01, x: 4 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card 
                        className="group cursor-pointer border border-border/50 hover:border-primary/30 hover:shadow-elevated transition-all duration-300 overflow-hidden"
                        onClick={() => onViewStore(store)}
                      >
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <StoreLogo
                                  logo={store.logo}
                                  customLogo={store.customLogo}
                                  bgColor={store.bgColor}
                                  size="md"
                                  variant="sleek"
                                />
                              </motion.div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-foreground text-base sm:text-lg truncate group-hover:text-primary transition-colors">
                                  {store.name}
                                </h3>
                                <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
                                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span className="truncate">{store.address}</span>
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 flex-shrink-0">
                              {store.activeOrders > 0 && (
                                <motion.div 
                                  className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full"
                                  initial={{ scale: 0.9, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: index * 0.1 }}
                                >
                                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-sm text-emerald-700 font-medium whitespace-nowrap">
                                    <span className="hidden sm:inline">{store.activeOrders} active</span>
                                    <span className="sm:hidden">{store.activeOrders}</span>
                                  </span>
                                </motion.div>
                              )}
                              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </CardContent>
          </Card>
        </FadeIn>
      )}
    </div>
  );
};
