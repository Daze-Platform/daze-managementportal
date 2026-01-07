import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Building2, MapPin, Edit2, Trash2, Upload, X, Store as StoreIcon, Edit, Phone, Mail, User, Calendar, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDestination } from '@/contexts/DestinationContext';
import { useStores } from '@/contexts/StoresContext';
import { StoreAssignmentDialog } from './StoreAssignmentDialog';
import { StoreLogo } from '@/components/stores/StoreLogo';


export interface Destination {
  id: string;
  name: string;
  location: string;
  address: string;
  phone?: string;
  email?: string;
  manager: string;
  status: 'active' | 'inactive';
  storeCount: number;
  createdAt: string;
  logo?: string;
}

// Legacy alias for backwards compatibility
export type Resort = Destination;

export const DestinationManagement = () => {
  const { destinations, addDestination, updateDestination, deleteDestination } = useDestination();
  const { getStoresByDestination, addStore, updateStore, deleteStore } = useStores();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [isStoreDialogOpen, setIsStoreDialogOpen] = useState(false);
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>('');
  const [editingStore, setEditingStore] = useState<any>(null);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    phone: '',
    email: '',
    manager: '',
    logo: ''
  });

  const [logoPreview, setLogoPreview] = useState<string>('');

  const handleCreateDestination = () => {
    setEditingDestination(null);
    setFormData({
      name: '',
      location: '',
      address: '',
      phone: '',
      email: '',
      manager: '',
      logo: ''
    });
    setLogoPreview('');
    setIsCreateDialogOpen(true);
  };

  const handleEditDestination = (destination: Destination) => {
    setEditingDestination(destination);
    setFormData({
      name: destination.name,
      location: destination.location,
      address: destination.address,
      phone: destination.phone || '',
      email: destination.email || '',
      manager: destination.manager,
      logo: destination.logo || ''
    });
    setLogoPreview(destination.logo || '');
    setIsCreateDialogOpen(true);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    // Use base64 encoding for reliable local demo experience
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFormData({ ...formData, logo: result });
      setLogoPreview(result);
      setIsUploading(false);
      toast({
        title: "Logo uploaded",
        description: "Your logo has been added successfully.",
      });
    };
    reader.onerror = () => {
      setIsUploading(false);
      toast({
        title: "Upload failed",
        description: "Please try again.",
        variant: "destructive"
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setFormData({ ...formData, logo: '' });
    setLogoPreview('');
  };

  const handleSubmitDestination = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDestination) {
      const updatedDestination = { ...editingDestination, ...formData };
      updateDestination(updatedDestination);
      toast({
        title: "Destination updated",
        description: `${formData.name} has been successfully updated.`,
      });
    } else {
      const newDestination: Destination = {
        id: formData.name.toLowerCase().replace(/\s+/g, '-'),
        ...formData,
        status: 'active',
        storeCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      addDestination(newDestination);
      toast({
        title: "Destination created",
        description: `${formData.name} has been successfully created.`,
        className: "bg-green-50 border-green-200 text-green-800",
      });
    }
    
    setIsCreateDialogOpen(false);
    setEditingDestination(null);
    setLogoPreview('');
  };

  const handleDeleteDestination = (destinationId: string, destinationName: string) => {
    if (window.confirm(`Are you sure you want to delete "${destinationName}"? This action cannot be undone.`)) {
      deleteDestination(destinationId);
      toast({
        title: "Destination deleted",
        description: "The destination has been successfully removed.",
      });
    }
  };

  const handleAddStore = (destinationId: string) => {
    setSelectedDestinationId(destinationId);
    setEditingStore(null);
    setIsStoreDialogOpen(true);
  };

  const handleEditStore = (destinationId: string, store: any) => {
    setSelectedDestinationId(destinationId);
    setEditingStore(store);
    setIsStoreDialogOpen(true);
  };

  const handleStoreDelete = (storeId: number, storeName: string) => {
    if (window.confirm(`Are you sure you want to delete "${storeName}"? This action cannot be undone.`)) {
      deleteStore(storeId);
      toast({
        title: "Venue Deleted",
        description: `${storeName} has been successfully deleted.`,
      });
    }
  };

  const handleStoreSave = (store: any) => {
    if (editingStore) {
      updateStore(store);
      toast({
        title: "Venue Updated",
        description: `${store.name} has been successfully updated.`,
      });
    } else {
      const existingStore = getStoresByDestination('').find(s => s.id === store.id);
      if (existingStore) {
        updateStore(store);
        toast({
          title: "Venue Assigned",
          description: `${store.name} has been assigned to this destination.`,
        });
      } else {
        addStore(store);
        toast({
          title: "Venue Created",
          description: `${store.name} has been successfully created.`,
          className: "bg-green-50 border-green-200 text-green-800",
        });
      }
    }
    setIsStoreDialogOpen(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="space-y-4 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Building2 className="h-5 w-5" />
                Destination Management
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage your destination properties and their associated venues
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreateDestination} className="flex items-center gap-2 w-full sm:w-auto">
                  <Plus className="h-4 w-4" />
                  <span className="sm:inline">Add Destination</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">
                    {editingDestination ? 'Edit Destination' : 'Create New Destination'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitDestination} className="space-y-4 sm:space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="logo" className="text-sm font-medium">Destination Logo</Label>
                      <div className="mt-2">
                        {logoPreview ? (
                          <div className="relative inline-block">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-lg ring-1 ring-black/5">
                              <img
                                src={logoPreview}
                                alt="Logo preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="absolute -top-2 -right-2 h-7 w-7 rounded-full p-0 bg-white shadow-md border-gray-200 hover:bg-red-50 hover:border-red-200"
                              onClick={handleRemoveLogo}
                              disabled={isUploading}
                            >
                              <X className="h-3.5 w-3.5 text-gray-500 hover:text-red-500" />
                            </Button>
                          </div>
                        ) : (
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100/50">
                            {isUploading ? (
                              <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                            ) : (
                              <Upload className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                        )}
                        <div className="mt-2">
                          <input
                            type="file"
                            id="logo"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                            disabled={isUploading}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('logo')?.click()}
                            className="text-xs"
                            disabled={isUploading}
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              logoPreview ? 'Change Logo' : 'Upload Logo'
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Recommended: Square image, max 5MB
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Destination Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Lily Hall Pensacola"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="e.g. Pensacola, FL"
                          required
                        />
                      </div>
                    </div>
                  
                    <div>
                      <Label htmlFor="address">Full Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="e.g. 1105 E Cervantes St, Pensacola, FL 32501"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="(850) 208-6913"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="info@destination.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="manager">Destination Manager</Label>
                      <Input
                        id="manager"
                        value={formData.manager}
                        onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                        placeholder="Manager name"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="order-2 sm:order-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="order-1 sm:order-2">
                      {editingDestination ? 'Update Destination' : 'Create Destination'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            {destinations.map((destination) => {
              const destinationStores = getStoresByDestination(destination.id);
              
              return (
                <Card key={destination.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="flex-1 space-y-4">
                            <div className="flex flex-col xs:flex-row xs:items-center gap-3">
                            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0 bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-md ring-1 ring-black/5">
                              {destination.logo ? (
                                <img
                                  src={destination.logo}
                                  alt={`${destination.name} logo`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-xl">
                                  {destination.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg sm:text-xl text-foreground truncate">{destination.name}</h3>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">{destination.location}</span>
                              </div>
                            </div>
                            <Badge variant={destination.status === 'active' ? 'default' : 'secondary'} className="flex-shrink-0">
                              {destination.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-3 text-sm text-muted-foreground">
                            <div className="space-y-2">
                              <p className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                <span className="break-words">{destination.address}</span>
                              </p>
                              {destination.phone && (
                                <p className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 flex-shrink-0" />
                                  <span>{destination.phone}</span>
                                </p>
                              )}
                              {destination.email && (
                                <p className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 flex-shrink-0" />
                                  <span className="break-all">{destination.email}</span>
                                </p>
                              )}
                              <p className="flex items-center gap-2">
                                <User className="h-4 w-4 flex-shrink-0" />
                                <span><strong>Manager:</strong> {destination.manager}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 flex-shrink-0" />
                                <span><strong>Created:</strong> {destination.createdAt}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditDestination(destination)}
                            className="flex items-center gap-1 flex-1 sm:flex-none"
                          >
                            <Edit2 className="h-3 w-3" />
                            <span>Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDestination(destination.id, destination.name)}
                            className="flex items-center gap-1 text-destructive hover:text-destructive-foreground hover:bg-destructive flex-1 sm:flex-none"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Delete</span>
                          </Button>
                        </div>
                      </div>

                      {/* Venue Management Section */}
                      <div className="mt-6 p-3 sm:p-4 bg-muted/50 rounded-lg space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <StoreIcon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                            <h4 className="font-medium text-foreground">Assigned Venues</h4>
                            <Badge variant="secondary">{destinationStores.length}</Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddStore(destination.id)}
                            className="flex items-center gap-1 w-full sm:w-auto"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add Venue</span>
                          </Button>
                        </div>

                        {destinationStores.length > 0 ? (
                          <div className="space-y-3">
                            {destinationStores.map((store) => (
                              <div key={store.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-background rounded-lg border">
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                  <StoreLogo 
                                    logo={store.logo}
                                    customLogo={store.customLogo}
                                    bgColor={store.bgColor}
                                    size="md"
                                    variant="sleek"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-foreground truncate">{store.name}</h5>
                                    <p className="text-sm text-muted-foreground truncate">{store.address}</p>
                                    {store.locationDescription && (
                                      <p className="text-xs text-muted-foreground/80 mt-1 line-clamp-2">{store.locationDescription}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                  <Badge variant="outline" className="text-xs flex-shrink-0">
                                    {store.activeOrders} orders
                                  </Badge>
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditStore(destination.id, store)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleStoreDelete(store.id, store.name)}
                                      className="h-8 w-8 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-muted-foreground">
                            <StoreIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground/40" />
                            <p className="text-sm">No venues assigned to this destination yet.</p>
                            <p className="text-xs text-muted-foreground/60 mt-1">Click "Add Venue" to get started.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <StoreAssignmentDialog
        isOpen={isStoreDialogOpen}
        onClose={() => setIsStoreDialogOpen(false)}
        onSave={handleStoreSave}
        destinationId={selectedDestinationId}
        store={editingStore}
      />
    </div>
  );
};

// Legacy alias for backwards compatibility
export const ResortManagement = DestinationManagement;
