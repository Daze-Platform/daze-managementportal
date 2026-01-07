import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, Building2 } from 'lucide-react';
import { useStores } from '@/contexts/StoresContext';
import { useResort } from '@/contexts/DestinationContext';
import { Menu } from '@/pages/MenuManagement';

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle className="text-base font-semibold">
            Assign to venue
          </DialogTitle>
        </DialogHeader>

        <div className="p-4">
          {menu && (
            <div className="text-sm text-muted-foreground mb-4">
              Select a venue for <span className="font-medium text-foreground">{menu.name}</span>
            </div>
          )}

          <ScrollArea className="h-64">
            <div className="space-y-1">
              {/* Unassign option */}
              <button
                onClick={() => setSelectedStoreId(null)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  selectedStoreId === null 
                    ? 'bg-muted' 
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-muted-foreground">No venue</div>
                </div>
                {selectedStoreId === null && (
                  <Check className="w-4 h-4 text-foreground" />
                )}
              </button>

              {availableVenues.map(venue => (
                <button
                  key={venue.id}
                  onClick={() => setSelectedStoreId(venue.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    selectedStoreId === venue.id 
                      ? 'bg-muted' 
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-md overflow-hidden bg-muted flex-shrink-0">
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
                    <div className="text-sm font-medium text-foreground truncate">
                      {venue.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {venue.address}
                    </div>
                  </div>
                  {selectedStoreId === venue.id && (
                    <Check className="w-4 h-4 text-foreground" />
                  )}
                </button>
              ))}
              
              {availableVenues.length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No venues available
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
