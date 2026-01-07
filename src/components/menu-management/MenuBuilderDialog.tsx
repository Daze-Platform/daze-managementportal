import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { PriceInput } from '@/components/ui/price-input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, ArrowLeft, ArrowRight, Utensils } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItem {
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

interface MenuFormData {
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  items: MenuItem[];
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
  initialData = {},
  mode = 'create'
}) => {
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<MenuFormData>({
    name: '',
    description: '',
    category: 'restaurant',
    isActive: true,
    items: []
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        category: initialData.category || 'restaurant',
        isActive: initialData.isActive ?? true,
        items: initialData.items || []
      });
      setCurrentStep(1);
    }
  }, [open, initialData]);

  const [currentItem, setCurrentItem] = useState<MenuItem>({
    name: '',
    description: '',
    price: 0,
    category: 'Main Course',
    available: true
  });

  const categories = ['restaurant', 'breakfast', 'lunch', 'dinner', 'drinks', 'desserts', 'specials'];
  const itemCategories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Sides', 'Salads', 'Soups', 'Pizza', 'Burgers', 'Sandwiches'];

  const handleAddItem = () => {
    if (currentItem.name && currentItem.price > 0) {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, { ...currentItem }]
      }));
      setCurrentItem({
        name: '',
        description: '',
        price: 0,
        category: 'Main Course',
        available: true
      });
    }
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
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
          ? 'w-full max-w-none h-full max-h-none m-0 rounded-none' 
          : 'sm:max-w-xl max-h-[85vh]'
      } p-0 gap-0 flex flex-col`}>
        
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

        {/* Content */}
        <ScrollArea className="flex-1">
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
                    />
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
                  {/* Add Item Form */}
                  <div className="p-4 rounded-lg border border-border bg-muted/30">
                    <h4 className="text-sm font-medium mb-3">Add Item</h4>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Name</Label>
                        <Input
                          value={currentItem.name}
                          onChange={(e) => setCurrentItem(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Item name"
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Price</Label>
                        <PriceInput
                          value={currentItem.price}
                          onChange={(price) => setCurrentItem(prev => ({ ...prev, price }))}
                          placeholder="0.00"
                          className="h-9"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                      <Label className="text-xs">Description</Label>
                      <Input
                        value={currentItem.description}
                        onChange={(e) => setCurrentItem(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description"
                        className="h-9"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
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

                    <Button 
                      onClick={handleAddItem} 
                      className="w-full h-9" 
                      disabled={!currentItem.name || currentItem.price <= 0}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
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
                            className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-medium text-sm">{item.name}</span>
                                <Badge variant="secondary" className="text-[10px]">{item.category}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{item.description || 'No description'}</p>
                            </div>
                            <div className="flex items-center gap-2 ml-3">
                              <span className="text-sm font-medium text-success">${item.price.toFixed(2)}</span>
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
        </ScrollArea>

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
