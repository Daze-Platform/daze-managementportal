import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { PriceInput } from '@/components/ui/price-input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, X, ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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

  const [currentItem, setCurrentItem] = useState<MenuItem>({
    name: '',
    description: '',
    price: 0,
    category: 'Main Course',
    available: true
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

  const categories = ['restaurant', 'breakfast', 'lunch', 'dinner', 'drinks', 'desserts', 'specials'];
  const itemCategories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Sides', 'Salads'];

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
  };

  const isValid = formData.name.trim() !== '' && formData.category.trim() !== '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${
        isMobile 
          ? 'w-full max-w-none h-full max-h-none m-0 rounded-none' 
          : 'sm:max-w-2xl'
      } p-0 gap-0 bg-background`}>
        
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setCurrentStep(1)}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <DialogTitle className="text-base font-semibold">
              {mode === 'create' ? 'New Menu' : 'Edit Menu'}
            </DialogTitle>
          </div>
          
          {/* Step indicator */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => setCurrentStep(1)}
              className={`text-xs font-medium px-2 py-1 rounded ${
                currentStep === 1 
                  ? 'bg-foreground text-background' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Details
            </button>
            <span className="text-muted-foreground text-xs">→</span>
            <button
              onClick={() => isValid && setCurrentStep(2)}
              disabled={!isValid}
              className={`text-xs font-medium px-2 py-1 rounded ${
                currentStep === 2 
                  ? 'bg-foreground text-background' 
                  : 'text-muted-foreground hover:text-foreground disabled:opacity-50'
              }`}
            >
              Items ({formData.items.length})
            </button>
          </div>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className={isMobile ? 'h-[calc(100vh-180px)]' : 'max-h-[60vh]'}>
          <div className="p-6">
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="menuName" className="text-sm font-medium">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="menuName"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Dinner Menu"
                    className="h-10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="menuCategory" className="text-sm font-medium">
                    Category
                  </Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat} className="capitalize">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="menuDescription" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="menuDescription"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Optional description..."
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-t border-border">
                  <div>
                    <Label className="text-sm font-medium">Active</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Menu is visible to customers
                    </p>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-5">
                {/* Add item form */}
                <div className="border border-border rounded-lg p-4 space-y-4">
                  <div className="text-sm font-medium">Add item</div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Name</Label>
                      <Input
                        value={currentItem.name}
                        onChange={(e) => setCurrentItem(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Item name"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Price</Label>
                      <PriceInput
                        value={currentItem.price}
                        onChange={(price) => setCurrentItem(prev => ({ ...prev, price }))}
                        placeholder="0.00"
                        className="h-9"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-xs">Description</Label>
                    <Input
                      value={currentItem.description}
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Optional description"
                      className="h-9"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Select 
                      value={currentItem.category} 
                      onValueChange={(value) => setCurrentItem(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="h-9 flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {itemCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      onClick={handleAddItem} 
                      size="sm"
                      disabled={!currentItem.name || currentItem.price <= 0}
                      className="h-9"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>

                {/* Items list */}
                {formData.items.length > 0 ? (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">
                      Items ({formData.items.length})
                    </div>
                    <div className="border border-border rounded-lg divide-y divide-border">
                      {formData.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium truncate">{item.name}</span>
                              <span className="text-xs text-muted-foreground">{item.category}</span>
                            </div>
                            <div className="text-sm text-foreground mt-0.5">
                              ${item.price.toFixed(2)}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No items added yet
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <div className="flex gap-2">
            {currentStep === 1 ? (
              <Button 
                onClick={() => setCurrentStep(2)}
                disabled={!isValid}
              >
                Continue
              </Button>
            ) : (
              <Button onClick={handleSave} disabled={!isValid}>
                {mode === 'create' ? 'Create Menu' : 'Save Changes'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
