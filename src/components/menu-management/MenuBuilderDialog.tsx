import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { PriceInput } from '@/components/ui/price-input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, ArrowLeft, ArrowRight, Utensils, Upload, Sparkles, X, Building2, Pencil, Check } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { useStores } from '@/contexts/StoresContext';
import { useDestination } from '@/contexts/DestinationContext';
import { findBestMatchingImage, simulateImageGeneration } from '@/utils/menuImageMatcher';

interface MenuItem {
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
}

interface MenuFormData {
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  items: MenuItem[];
  venueId?: string;
}

interface MenuBuilderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (menuData: MenuFormData) => void;
  initialData?: Partial<MenuFormData>;
  mode: 'create' | 'edit';
}

export const MenuBuilderDialog: React.FC<MenuBuilderDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  initialData,
  mode = 'create',
}) => {
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const isEditMode = editingItemIndex !== null;
  const { stores, getStoresByDestination } = useStores();
  const { currentDestination } = useDestination();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<MenuFormData>({
    name: '',
    description: '',
    category: 'restaurant',
    isActive: true,
    items: [],
    venueId: ''
  });

  // Get venues for current destination
  const availableVenues = currentDestination 
    ? getStoresByDestination(currentDestination.id)
    : stores;

  const [imagePreview, setImagePreview] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  useEffect(() => {
    if (!open) return;

    setFormData({
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      category: initialData?.category ?? 'restaurant',
      isActive: initialData?.isActive ?? true,
      items: initialData?.items ?? [],
      venueId: ''
    });
    setCurrentStep(1);
    setImagePreview('');
    setIsGenerating(false);
    setGenerationProgress(0);
  }, [open, initialData]);

  const [currentItem, setCurrentItem] = useState<MenuItem>({
    name: '',
    description: '',
    price: 0,
    category: 'Main Course',
    available: true
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerateImage = async () => {
    if (!currentItem.name) {
      toast({
        title: "Name required",
        description: "Please enter an item name first",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate AI generation with progress animation
    await simulateImageGeneration((progress) => {
      setGenerationProgress(progress);
    });

    // Smart keyword-based image matching
    const matchedImage = findBestMatchingImage(currentItem.name, currentItem.description);
    setImagePreview(matchedImage);
    setIsGenerating(false);
    setGenerationProgress(0);

    toast({
      title: "Image generated!",
      description: "AI matched an image for your menu item",
    });
  };

  const categories = ['restaurant', 'breakfast', 'lunch', 'dinner', 'drinks', 'desserts', 'specials'];
  const itemCategories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Sides', 'Salads', 'Soups', 'Pizza', 'Burgers', 'Sandwiches'];

  const handleAddItem = () => {
    if (currentItem.name && currentItem.price > 0) {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, { ...currentItem, image: imagePreview || undefined }]
      }));
      setCurrentItem({
        name: '',
        description: '',
        price: 0,
        category: 'Main Course',
        available: true
      });
      setImagePreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
    // If we're editing this item, cancel edit mode
    if (editingItemIndex === index) {
      handleCancelEdit();
    } else if (editingItemIndex !== null && index < editingItemIndex) {
      // Adjust index if we removed an item before the one being edited
      setEditingItemIndex(editingItemIndex - 1);
    }
  };

  const handleEditItem = (index: number) => {
    const item = formData.items[index];
    setCurrentItem({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      available: item.available
    });
    setImagePreview(item.image || '');
    setEditingItemIndex(index);
    // Scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleUpdateItem = () => {
    if (editingItemIndex !== null && currentItem.name && currentItem.price > 0) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.map((item, i) =>
          i === editingItemIndex
            ? { ...currentItem, image: imagePreview || undefined }
            : item
        )
      }));
      handleCancelEdit();
    }
  };

  const handleCancelEdit = () => {
    setCurrentItem({
      name: '',
      description: '',
      price: 0,
      category: 'Main Course',
      available: true
    });
    setImagePreview('');
    setEditingItemIndex(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
    setCurrentStep(1);
  };

  const handleClose = () => {
    onOpenChange(false);
    setCurrentStep(1);
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.name.trim() !== '' && formData.category.trim() !== '';
      case 2:
        return true;
      default:
        return true;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`${
        isMobile 
          ? 'fixed inset-0 w-full max-w-none h-[100dvh] max-h-none m-0 rounded-none translate-x-0 translate-y-0 left-0 top-0' 
          : 'sm:max-w-xl max-h-[85vh]'
      } p-0 gap-0 flex flex-col overflow-hidden`}>
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {mode === 'create' ? 'Create Menu' : 'Edit Menu'}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {currentStep === 1 ? 'Set up the basic details' : 'Add items to your menu'}
            </DialogDescription>
          </DialogHeader>
          
          {/* Steps */}
          <div className="flex items-center gap-4 mt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`text-sm font-medium transition-colors ${
                currentStep === 1 ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs mr-2 ${
                currentStep === 1 ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
              }`}>1</span>
              Details
            </button>
            <div className="w-8 h-px bg-border" />
            <button
              type="button"
              onClick={() => isStepValid(1) && setCurrentStep(2)}
              disabled={!isStepValid(1)}
              className={`text-sm font-medium transition-colors disabled:opacity-50 ${
                currentStep === 2 ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs mr-2 ${
                currentStep === 2 ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
              }`}>2</span>
              Items
            </button>
          </div>
        </div>

        {/* Content - Single Scroll Container */}
        <div 
          className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y dialog-scroll-container"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="p-6">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="menuName">Menu Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="menuName"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Summer Menu 2024"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <div className="flex items-center justify-between h-10 px-3 rounded-md border border-input bg-background">
                        <span className="text-sm">{formData.isActive ? 'Active' : 'Draft'}</span>
                        <Switch
                          checked={formData.isActive}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="menuDescription">Description</Label>
                    <Textarea
                      id="menuDescription"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your menu..."
                      className="min-h-[80px] resize-none"
                      onPointerDown={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Venue Assignment */}
                  <div className="space-y-2">
                    <Label>Assign to Venue</Label>
                    <Select 
                      value={formData.venueId} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, venueId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a venue" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableVenues.length > 0 ? (
                          availableVenues.map(venue => (
                            <SelectItem key={venue.id} value={venue.id.toString()}>
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                {venue.name}
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>No venues available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      The menu will be available at this venue
                    </p>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-5"
                >
                  {/* Add/Edit Item Form */}
                  <div ref={formRef} className={`p-4 rounded-lg border bg-muted/30 ${isEditMode ? 'border-primary ring-1 ring-primary/20' : 'border-border'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium">{isEditMode ? 'Edit Item' : 'Add Item'}</h4>
                      {isEditMode && (
                        <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="h-6 w-6 p-0">
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    {/* Name & Price - FIRST (most important fields) */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Name <span className="text-destructive">*</span></Label>
                        <Input
                          value={currentItem.name}
                          onChange={(e) => setCurrentItem(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Item name"
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Price <span className="text-destructive">*</span></Label>
                        <PriceInput
                          value={currentItem.price}
                          onChange={(price) => setCurrentItem(prev => ({ ...prev, price }))}
                          placeholder="0.00"
                          className="h-9"
                        />
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="space-y-1 mb-3">
                      <Label className="text-xs">Description</Label>
                      <Input
                        value={currentItem.description}
                        onChange={(e) => setCurrentItem(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description (optional)"
                        className="h-9"
                      />
                    </div>

                    {/* Category & Availability */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="space-y-1">
                        <Label className="text-xs">Category</Label>
                        <Select value={currentItem.category} onValueChange={(value) => setCurrentItem(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {itemCategories.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Availability</Label>
                        <div className="flex items-center justify-between h-9 px-3 rounded-md border border-input bg-background">
                          <span className="text-xs">{currentItem.available ? 'Available' : 'Unavailable'}</span>
                          <Switch
                            checked={currentItem.available}
                            onCheckedChange={(checked) => setCurrentItem(prev => ({ ...prev, available: checked }))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Image Section - LAST (compact, optional) */}
                    <div className="mb-4">
                      <Label className="text-xs mb-2 block">Image (optional)</Label>
                      <div className="flex items-start gap-3">
                        {/* Compact square preview */}
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border bg-muted/50 flex-shrink-0">
                          <AnimatePresence mode="wait">
                            {isGenerating ? (
                              <motion.div
                                key="generating"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-purple-500/20"
                              >
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  <Sparkles className="w-5 h-5 text-purple-500" />
                                </motion.div>
                              </motion.div>
                            ) : imagePreview ? (
                              <motion.div
                                key="preview"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="relative w-full h-full"
                              >
                                <img
                                  src={imagePreview}
                                  alt="Item preview"
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={handleRemoveImage}
                                  className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center"
                              >
                                <Upload className="w-5 h-5 text-muted-foreground" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        {/* Action buttons - stacked vertically */}
                        <div className="flex flex-col gap-2 flex-1">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="item-image-upload"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 justify-start"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isGenerating}
                          >
                            <Upload className="w-3.5 h-3.5 mr-2" />
                            Upload Image
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 justify-start"
                            onClick={handleGenerateImage}
                            disabled={isGenerating || !currentItem.name}
                          >
                            <Sparkles className="w-3.5 h-3.5 mr-2" />
                            Generate with AI
                            <Badge variant="secondary" className="ml-auto text-[9px] px-1 py-0">BETA</Badge>
                          </Button>
                          {isGenerating && (
                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${generationProgress}%` }}
                                transition={{ duration: 0.2 }}
                              />
                            </div>
                          )}
                          {!currentItem.name && !isGenerating && (
                            <p className="text-[10px] text-muted-foreground">Enter item name to enable AI generation</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Add/Update Item Button */}
                    {isEditMode ? (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          onClick={handleCancelEdit} 
                          className="flex-1 h-9"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleUpdateItem} 
                          className="flex-1 h-9" 
                          disabled={!currentItem.name || currentItem.price <= 0}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={handleAddItem} 
                        className="w-full h-9" 
                        disabled={!currentItem.name || currentItem.price <= 0}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                      </Button>
                    )}
                  </div>

                  {/* Items List */}
                  {formData.items.length > 0 ? (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">
                        Items <span className="text-muted-foreground">({formData.items.length})</span>
                      </h4>
                      <div className="space-y-2">
                        {formData.items.map((item, index) => (
                          <div 
                            key={index}
                            className={`p-3 rounded-lg border bg-card transition-colors ${
                              editingItemIndex === index 
                                ? 'border-primary ring-1 ring-primary/20' 
                                : 'border-border'
                            }`}
                          >
                            {/* Mobile: stacked layout, Desktop: horizontal */}
                            <div className="flex gap-3">
                              {/* Image */}
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                                  <Utensils className="w-5 h-5 text-muted-foreground" />
                                </div>
                              )}
                              
                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                {/* Name and actions row */}
                                <div className="flex items-start justify-between gap-2">
                                  <span className="font-medium text-sm leading-tight">{item.name}</span>
                                  <div className="flex items-center gap-0.5 flex-shrink-0">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditItem(index)}
                                      className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveItem(index)}
                                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                </div>
                                
                                {/* Description */}
                                <p className="text-xs text-muted-foreground truncate mt-0.5">{item.description || 'No description'}</p>
                                
                                {/* Category and price row */}
                                <div className="flex items-center justify-between gap-2 mt-1.5">
                                  <Badge variant="secondary" className="text-[10px] max-w-[120px] truncate">{item.category}</Badge>
                                  <span className="text-sm font-semibold text-success">${item.price.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                        <Utensils className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">No items yet</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between flex-shrink-0 bg-muted/30">
          <div>
            {currentStep > 1 && (
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep(currentStep - 1)}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleClose}>
              Cancel
            </Button>
            {currentStep < 2 ? (
              <Button 
                size="sm"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!isStepValid(currentStep)}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button size="sm" onClick={handleSave} disabled={!isStepValid(1)}>
                {mode === 'create' ? 'Create Menu' : 'Save Changes'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
