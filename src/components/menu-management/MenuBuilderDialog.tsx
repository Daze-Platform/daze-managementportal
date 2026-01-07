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
import { Plus, Trash2, ArrowLeft, ArrowRight, Save, Utensils } from 'lucide-react';
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
          : 'sm:max-w-2xl max-h-[85vh]'
      } p-0 gap-0 flex flex-col`}>
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {mode === 'create' ? 'Create Menu' : 'Edit Menu'}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              {currentStep === 1 ? 'Set up the basic details' : 'Add items to your menu'}
            </DialogDescription>
          </DialogHeader>
          
          {/* Step Indicator */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                currentStep === 1 
                  ? 'bg-foreground text-background' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-current/20 text-[11px] flex items-center justify-center font-bold">
                1
              </span>
              Details
            </button>
            <div className="w-6 h-px bg-border" />
            <button
              onClick={() => isStepValid(1) && setCurrentStep(2)}
              disabled={!isStepValid(1)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                currentStep === 2 
                  ? 'bg-foreground text-background' 
                  : 'text-muted-foreground hover:text-foreground disabled:opacity-50'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-current/20 text-[11px] flex items-center justify-center font-bold">
                2
              </span>
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
                  className="space-y-5"
                >
                  {/* Menu Name */}
                  <div className="space-y-2">
                    <Label htmlFor="menuName" className="text-sm font-medium">
                      Menu Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="menuName"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Summer Menu 2024"
                      className="h-11"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Category */}
                    <div className="space-y-2">
                      <Label htmlFor="menuCategory" className="text-sm font-medium">
                        Category
                      </Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select category" />
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

                    {/* Active Status */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Status</Label>
                      <div className="flex items-center justify-between h-11 px-3 rounded-md border border-input bg-background">
                        <span className={`text-sm ${formData.isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {formData.isActive ? 'Active' : 'Draft'}
                        </span>
                        <Switch
                          checked={formData.isActive}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="menuDescription" className="text-sm font-medium">Description</Label>
                    <Textarea
                      id="menuDescription"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your menu..."
                      className="min-h-[100px] resize-none"
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
                  className="space-y-6"
                >
                  {/* Add Item Form */}
                  <div className="p-4 rounded-lg border border-border bg-muted/30">
                    <h4 className="text-sm font-medium mb-4">Add Item</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="itemName" className="text-xs text-muted-foreground">Item Name</Label>
                        <Input
                          id="itemName"
                          value={currentItem.name}
                          onChange={(e) => setCurrentItem(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Grilled Chicken"
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="itemPrice" className="text-xs text-muted-foreground">Price</Label>
                        <PriceInput
                          id="itemPrice"
                          value={currentItem.price}
                          onChange={(price) => setCurrentItem(prev => ({ ...prev, price }))}
                          placeholder="0.00"
                          className="h-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="itemDescription" className="text-xs text-muted-foreground">Description</Label>
                      <Textarea
                        id="itemDescription"
                        value={currentItem.description}
                        onChange={(e) => setCurrentItem(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the item..."
                        className="h-16 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="itemCategory" className="text-xs text-muted-foreground">Category</Label>
                        <Select value={currentItem.category} onValueChange={(value) => setCurrentItem(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {itemCategories.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Availability</Label>
                        <div className="flex items-center justify-between h-10 px-3 rounded-md border border-input bg-background">
                          <span className={`text-sm ${currentItem.available ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {currentItem.available ? 'Available' : 'Unavailable'}
                          </span>
                          <Switch
                            checked={currentItem.available}
                            onCheckedChange={(checked) => setCurrentItem(prev => ({ ...prev, available: checked }))}
                          />
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={handleAddItem} 
                      className="w-full h-10 bg-foreground hover:bg-foreground/90 text-background" 
                      disabled={!currentItem.name || currentItem.price <= 0}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>

                  {/* Items List */}
                  {formData.items.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium">
                          Menu Items <span className="text-muted-foreground">({formData.items.length})</span>
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {formData.items.map((item, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-medium text-sm text-foreground">{item.name}</span>
                                <Badge variant="secondary" className="text-[10px]">{item.category}</Badge>
                                {!item.available && (
                                  <Badge variant="secondary" className="text-[10px] bg-destructive/10 text-destructive">Unavailable</Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-1">{item.description || 'No description'}</p>
                            </div>
                            <div className="flex items-center gap-3 ml-3">
                              <span className="text-sm font-semibold tabular-nums text-success">${item.price.toFixed(2)}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(index)}
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive transition-opacity"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
                        <Utensils className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">No items yet. Add your first item above.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between flex-shrink-0">
          <div>
            {currentStep > 1 && (
              <Button variant="ghost" onClick={() => setCurrentStep(currentStep - 1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            {currentStep < 2 ? (
              <Button 
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!isStepValid(currentStep)}
                className="bg-foreground hover:bg-foreground/90 text-background gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSave} 
                disabled={!isStepValid(1)}
                className="bg-foreground hover:bg-foreground/90 text-background gap-2"
              >
                <Save className="w-4 h-4" />
                {mode === 'create' ? 'Create Menu' : 'Save Changes'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
