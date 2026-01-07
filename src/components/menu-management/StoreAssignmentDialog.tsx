import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-white rounded-2xl border-0 shadow-2xl">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              Assign to Venue
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Select a venue to assign this menu to
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5">
          {/* Menu Info Card */}
          {menu && (
            <Card className="border-gray-100 bg-gray-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-white text-lg">🍽️</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{menu.name}</h3>
                    <p className="text-sm text-gray-500">{menu.category} • {Array.isArray(menu.items) ? menu.items.length : 0} items</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Venue Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700">Select Venue</Label>
            <ScrollArea className="h-64 rounded-xl border border-gray-200 bg-white">
              <div className="p-2 space-y-2">
                {availableVenues.map(venue => (
                  <div
                    key={venue.id}
                    onClick={() => setSelectedStoreId(venue.id)}
                    className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedStoreId === venue.id 
                        ? 'bg-indigo-50 border-2 border-indigo-500 shadow-sm' 
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-sm ring-2 ${
                      selectedStoreId === venue.id ? 'ring-indigo-500/20' : 'ring-gray-100'
                    }`}>
                      {venue.logo ? (
                        <img 
                          src={venue.logo} 
                          alt={venue.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <Building2 className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900">{venue.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 truncate mt-0.5">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{venue.address}</span>
                      </div>
                    </div>
                    {selectedStoreId === venue.id && (
                      <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                
                {availableVenues.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Building2 className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No venues available</p>
                    <p className="text-sm">Create a venue first to assign menus</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          {menu?.store_id ? (
            <Button 
              variant="ghost" 
              onClick={handleUnassign}
              className="text-gray-600 hover:text-red-600 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-2" />
              Unassign
            </Button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-200">
              Cancel
            </Button>
            <Button 
              onClick={handleAssign} 
              disabled={!selectedStoreId}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md"
            >
              Assign to Venue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};