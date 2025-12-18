import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Store, Building2, MapPin } from 'lucide-react';
import { useStores } from '@/contexts/StoresContext';
import { useResort } from '@/contexts/DestinationContext';
import { Menu } from '@/pages/MenuManagement';

interface StoreAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menu: Menu | null;
  onAssign: (menuId: string, storeId: number | null) => void;
}

export const StoreAssignmentDialog: React.FC<StoreAssignmentDialogProps> = ({
  open,
  onOpenChange,
  menu,
  onAssign
}) => {
  const { stores } = useStores();
  const { currentResort } = useResort();
  const [selectedStoreId, setSelectedStoreId] = useState<string>(menu?.store_id?.toString() || '');

  const availableStores = stores.filter(store => 
    currentResort ? store.resortId === currentResort.id : true
  );

  const handleAssign = () => {
    if (menu) {
      const storeId = selectedStoreId === 'unassign' ? null : parseInt(selectedStoreId) || null;
      onAssign(menu.id, storeId);
      onOpenChange(false);
    }
  };

  const selectedStore = availableStores.find(store => store.id.toString() === selectedStoreId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Assign Menu to Store
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {menu && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🍽️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{menu.name}</h3>
                    <p className="text-sm text-gray-600">{menu.category}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <Label htmlFor="store-select">Select Store</Label>
            <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a store..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassign">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-gray-400" />
                    <span>Unassign from store</span>
                  </div>
                </SelectItem>
                {availableStores.map(store => (
                  <SelectItem key={store.id} value={store.id.toString()}>
                    <div className="flex items-center gap-3 py-1">
                      <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm ring-1 ring-black/5">
                        {store.logo ? (
                          <img 
                            src={store.logo} 
                            alt={store.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
                            <Store className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900">{store.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{store.address}</span>
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStore && (
            <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50/50 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-white border border-blue-100 shadow-md ring-1 ring-blue-500/10">
                      {selectedStore.logo ? (
                        <img 
                          src={selectedStore.logo} 
                          alt={selectedStore.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
                          <Store className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{selectedStore.name}</div>
                      <div className="text-xs text-gray-600">{selectedStore.address}</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 border border-blue-200">
                    Selected
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={!selectedStoreId}>
              {selectedStoreId === 'unassign' ? 'Unassign' : 'Assign to Store'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};