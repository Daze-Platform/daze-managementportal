import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useStores } from '@/contexts/StoresContext';
import { Store } from '@/types/store';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search } from 'lucide-react';
import { StoreLogo } from '@/components/stores/StoreLogo';

interface StoreAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (store: Store) => void;
  resortId: string;
  store?: Store | null;
}

const bgColorOptions = [
  { value: 'bg-purple-500', label: 'Purple', color: '#8b5cf6' },
  { value: 'bg-red-500', label: 'Red', color: '#ef4444' },
  { value: 'bg-blue-500', label: 'Blue', color: '#3b82f6' },
  { value: 'bg-green-500', label: 'Green', color: '#22c55e' },
  { value: 'bg-orange-500', label: 'Orange', color: '#f97316' },
  { value: 'bg-pink-500', label: 'Pink', color: '#ec4899' },
  { value: 'bg-amber-500', label: 'Amber', color: '#f59e0b' },
  { value: 'bg-emerald-500', label: 'Emerald', color: '#10b981' },
  { value: 'bg-yellow-500', label: 'Yellow', color: '#eab308' },
  { value: 'bg-teal-500', label: 'Teal', color: '#14b8a6' },
];

import { defaultHours } from '@/data/defaultStores';

export const StoreAssignmentDialog = ({ 
  isOpen, 
  onClose, 
  onSave, 
  resortId, 
  store 
}: StoreAssignmentDialogProps) => {
  const { stores } = useStores();
  const [activeTab, setActiveTab] = useState<'assign' | 'create'>('assign');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExistingStore, setSelectedExistingStore] = useState<Store | null>(null);
  const [formData, setFormData] = useState({
    name: store?.name || '',
    address: store?.address || '',
    locationDescription: store?.locationDescription || '',
    logo: store?.logo || '🏪',
    bgColor: store?.bgColor || 'bg-blue-500',
    activeOrders: store?.activeOrders || 0,
  });

  const { toast } = useToast();

  // Get unassigned stores and stores from other resorts
  const availableStores = stores.filter(s => 
    s.resortId !== resortId && 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setActiveTab('assign');
      setSearchTerm('');
      setSelectedExistingStore(null);
      if (store) {
        setFormData({
          name: store.name,
          address: store.address,
          locationDescription: store.locationDescription || '',
          logo: store.logo,
          bgColor: store.bgColor,
          activeOrders: store.activeOrders,
        });
      } else {
        setFormData({
          name: '',
          address: '',
          locationDescription: '',
          logo: '🏪',
          bgColor: 'bg-blue-500',
          activeOrders: 0,
        });
      }
    }
  }, [isOpen, store]);

  const handleAssignExisting = () => {
    if (!selectedExistingStore) {
      toast({
        title: "No store selected",
        description: "Please select a store to assign to this resort.",
        variant: "destructive",
      });
      return;
    }

    // Update the existing store with new resort assignment
    const updatedStore: Store = {
      ...selectedExistingStore,
      resortId: resortId,
    };

    onSave(updatedStore);
    onClose();
    
    toast({
      title: "Store Assigned",
      description: `${selectedExistingStore.name} has been assigned to this resort.`,
    });
  };

  const handleCreateNew = () => {
    if (!formData.name.trim() || !formData.address.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newStore: Store = {
      id: store?.id || Date.now(),
      name: formData.name,
      address: formData.address,
      locationDescription: formData.locationDescription,
      logo: formData.logo,
      bgColor: formData.bgColor,
      activeOrders: formData.activeOrders,
      hours: store?.hours || defaultHours,
      resortId: resortId,
    };

    onSave(newStore);
    onClose();
    
    toast({
      title: "Success",
      description: `Store ${store ? 'updated' : 'created'} successfully.`,
      className: store ? undefined : "bg-green-50 border-green-200 text-green-800",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {store ? 'Edit Store' : 'Manage Store Assignment'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assign" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Assign Existing Store
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Store
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assign" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Available Stores</Label>
                <Input
                  id="search"
                  placeholder="Search stores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-4">
                {availableStores.length > 0 ? (
                  availableStores.map((availableStore) => (
                    <div
                      key={availableStore.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedExistingStore?.id === availableStore.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedExistingStore(availableStore)}
                    >
                      <div className="flex items-center justify-between">
                         <div className="flex items-center space-x-3">
                           <StoreLogo 
                             logo={availableStore.logo}
                             customLogo={availableStore.customLogo}
                             bgColor={availableStore.bgColor}
                             size="md"
                           />
                          <div>
                            <h4 className="font-medium">{availableStore.name}</h4>
                            <p className="text-sm text-gray-600">{availableStore.address}</p>
                            {availableStore.locationDescription && (
                              <p className="text-xs text-gray-500">{availableStore.locationDescription}</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Badge variant="outline">
                            {availableStore.resortId === 'unassigned' ? 'Unassigned' : 'Other Resort'}
                          </Badge>
                          <Badge variant="secondary">
                            {availableStore.activeOrders} orders
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No available stores found</p>
                    <p className="text-xs text-gray-400">Try adjusting your search or create a new store</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-4 mt-4">
            <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Store Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter store name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter store address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Location Description</Label>
              <Textarea
                id="description"
                value={formData.locationDescription}
                onChange={(e) => setFormData({ ...formData, locationDescription: e.target.value })}
                placeholder="Describe the store location for easy finding"
                rows={3}
              />
            </div>
          </div>

          {/* Visual Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Store Logo (Emoji)</Label>
              <Input
                id="logo"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="🏪"
                maxLength={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bgColor">Brand Color</Label>
              <Select
                value={formData.bgColor}
                onValueChange={(value) => setFormData({ ...formData, bgColor: value })}
              >
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-4 h-4 rounded ${formData.bgColor}`}
                      />
                      {bgColorOptions.find(option => option.value === formData.bgColor)?.label || 'Select Color'}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {bgColorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div 
                          className={`w-4 h-4 rounded ${option.value}`}
                        />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Store Preview */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Preview</Label>
            <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
              <div className={`w-12 h-12 rounded-lg ${formData.bgColor} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                {formData.logo}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{formData.name || 'Store Name'}</h3>
                <p className="text-sm text-gray-600">{formData.address || 'Store Address'}</p>
                {formData.locationDescription && (
                  <p className="text-xs text-gray-500 mt-1">{formData.locationDescription}</p>
                )}
              </div>
            </div>
          </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {activeTab === 'assign' ? (
            <Button onClick={handleAssignExisting} disabled={!selectedExistingStore}>
              Assign Store
            </Button>
          ) : (
            <Button onClick={handleCreateNew}>
              {store ? 'Update Store' : 'Create Store'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};