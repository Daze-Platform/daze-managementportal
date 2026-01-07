import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Check, X } from 'lucide-react';
import { useStores } from '@/contexts/StoresContext';
import { useResort } from '@/contexts/DestinationContext';
import { Menu } from '@/pages/MenuManagement';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    if (open && menu) {
      setSelectedStoreId(menu.store_id || null);
    }
  }, [open, menu]);

  const availableVenues = stores.filter(store => 
    currentResort ? store.resortId === currentResort.id : true
  );

  const handleAssign = () => {
    if (menu && selectedStoreId !== null) {
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

  if (!menu) return null;

  const isAssigned = menu.store_id !== undefined && menu.store_id !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <div className="p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Assign Venue</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Select a venue for "{menu.name}"
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[300px]">
          <div className="px-6 pb-4 space-y-1">
            {availableVenues.length > 0 ? (
              availableVenues.map((venue) => {
                const isSelected = selectedStoreId === venue.id;
                return (
                  <button
                    key={venue.id}
                    type="button"
                    onClick={() => setSelectedStoreId(venue.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center ${
                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          {venue.logo ? (
                            <img 
                              src={venue.logo} 
                              alt={venue.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{venue.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {venue.address}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Building2 className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No venues available</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/30">
          <div>
            {isAssigned && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUnassign}
                className="text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4 mr-1" />
                Remove
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAssign}
              disabled={selectedStoreId === null}
            >
              Assign
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
