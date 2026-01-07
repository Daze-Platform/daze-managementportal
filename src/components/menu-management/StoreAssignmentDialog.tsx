import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Check, X } from 'lucide-react';
import { useStores } from '@/contexts/StoresContext';
import { useResort } from '@/contexts/DestinationContext';
import { Menu } from '@/pages/MenuManagement';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';

interface VenueAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menu: Menu | null;
  onAssign: (menuId: string, storeId: number | null) => void;
}

export const StoreAssignmentDialog: React.FC<VenueAssignmentDialogProps> = ({
  open,
  onOpenChange,
  menu,
  onAssign
}) => {
  const { stores } = useStores();
  const { currentResort } = useResort();
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

  useEffect(() => {
    if (menu) {
      setSelectedStoreId(menu.store_id || null);
    }
  }, [menu]);

  const availableVenues = stores.filter(store => 
    currentResort ? store.resortId === currentResort.id : true
  );

  const handleAssign = () => {
    if (menu) {
      onAssign(menu.id, selectedStoreId);
      onOpenChange(false);
    }
  };

  const handleUnassign = () => {
    if (menu) {
      onAssign(menu.id, null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Assign to Venue
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              {menu ? (
                <>Assigning <span className="font-medium text-foreground">{menu.name}</span></>
              ) : (
                'Select a venue for this menu'
              )}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Venue List */}
        <div className="px-6 pb-6">
          <ScrollArea className="h-72 -mx-1">
            <div className="space-y-1 px-1">
              {availableVenues.map(venue => {
                const isSelected = selectedStoreId === venue.id;
                
                return (
                  <motion.div
                    key={venue.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedStoreId(venue.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-foreground/5 ring-1 ring-foreground/10' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {venue.logo ? (
                        <img 
                          src={venue.logo} 
                          alt={venue.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground text-sm">{venue.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{venue.address}</span>
                      </div>
                    </div>
                    
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected 
                        ? 'border-foreground bg-foreground' 
                        : 'border-muted-foreground/30'
                    }`}>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Check className="w-3 h-3 text-background" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
              
              {availableVenues.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Building2 className="w-8 h-8 mx-auto mb-3 opacity-40" />
                  <p className="font-medium text-sm">No venues available</p>
                  <p className="text-xs mt-1">Create a venue first</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
          {menu?.store_id ? (
            <Button 
              variant="ghost" 
              onClick={handleUnassign}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4 mr-1.5" />
              Remove
            </Button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssign} 
              disabled={!selectedStoreId}
              className="bg-foreground hover:bg-foreground/90 text-background"
            >
              Assign
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
