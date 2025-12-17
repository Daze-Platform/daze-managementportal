import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, ArrowLeft, Save, X } from 'lucide-react';
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
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [formData, setFormData] = useState<MenuFormData>({
    name: initialData.name || '',
    description: initialData.description || '',
    category: initialData.category || 'restaurant',
    isActive: initialData.isActive ?? true,
    items: initialData.items || []
  });

  const [currentItem, setCurrentItem] = useState<MenuItem>({
    name: '',
    description: '',
    price: 0,
    category: 'Main Course',
    available: true
  });

  const categories = [
    'restaurant', 'breakfast', 'lunch', 'dinner', 'drinks', 'desserts', 'specials', 'custom'
  ];

  const itemCategories = [
    'Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Sides', 'Salads', 'Soups', 'Pizza', 'Burgers', 'Sandwiches'
  ];

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
    setShowCustomCategory(false);
    setCustomCategory('');
  };

  const handleCategoryChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomCategory(true);
      setFormData(prev => ({ ...prev, category: '' }));
    } else {
      setShowCustomCategory(false);
      setCustomCategory('');
      setFormData(prev => ({ ...prev, category: value }));
    }
  };

  const handleCustomCategorySubmit = () => {
    if (customCategory.trim()) {
      setFormData(prev => ({ ...prev, category: customCategory.trim() }));
      setShowCustomCategory(false);
      setCustomCategory('');
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.name.trim() !== '' && formData.category.trim() !== '';
      case 2:
        return true; // Items are optional
      default:
        return true;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`${
        isMobile 
          ? 'w-[100vw] max-w-none h-[100vh] max-h-none m-0 rounded-none p-0 overflow-hidden' 
          : 'sm:max-w-4xl w-[90vw] max-h-[90vh]'
      } bg-white border border-gray-200 shadow-xl`}>
        
        {/* Header */}
        <div className={`flex-shrink-0 bg-white ${
          isMobile ? 'p-4 pb-3' : 'p-6 pb-4'
        } border-b border-gray-100`}>
          <DialogHeader>
            <DialogTitle className={`${
              isMobile ? 'text-xl' : 'text-2xl'
            } font-bold text-gray-900 flex items-center gap-3`}>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🍽️</span>
              </div>
              {mode === 'create' ? 'Create New Menu' : 'Edit Menu'}
            </DialogTitle>
          </DialogHeader>
          
          {/* Step Indicator */}
          <div className="flex items-center mt-4 space-x-4">
            <div className={`flex items-center space-x-2 ${currentStep === 1 ? 'text-blue-600' : currentStep > 1 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep === 1 ? 'bg-blue-100 text-blue-600' : currentStep > 1 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                1
              </div>
              <span className="font-medium">Menu Details</span>
            </div>
            <div className={`w-12 h-px ${currentStep > 1 ? 'bg-green-300' : 'bg-gray-300'}`} />
            <div className={`flex items-center space-x-2 ${currentStep === 2 ? 'text-blue-600' : currentStep > 2 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep === 2 ? 'bg-blue-100 text-blue-600' : currentStep > 2 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                2
              </div>
              <span className="font-medium">Menu Items</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-4' : 'p-6'}`}>
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="menuName" className="text-sm font-medium text-gray-700">Menu Name *</Label>
                    <Input
                      id="menuName"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Summer Menu 2024"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="menuCategory" className="text-sm font-medium text-gray-700">Category</Label>
                    {!showCustomCategory ? (
                      <Select 
                        value={formData.category} 
                        onValueChange={handleCategoryChange}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.filter(cat => cat !== 'custom').map(cat => (
                            <SelectItem key={cat} value={cat}>
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </SelectItem>
                          ))}
                          <SelectItem value="custom" className="text-blue-600 font-medium">
                            + Add New Category
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="mt-1 flex gap-2">
                        <Input
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder="Enter custom category name"
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleCustomCategorySubmit();
                            } else if (e.key === 'Escape') {
                              setShowCustomCategory(false);
                              setCustomCategory('');
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={handleCustomCategorySubmit}
                          disabled={!customCategory.trim()}
                          size="sm"
                          className="px-3"
                        >
                          Add
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowCustomCategory(false);
                            setCustomCategory('');
                          }}
                          size="sm"
                          className="px-3"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="menuActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !!checked }))}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="menuActive" className="text-sm font-medium text-gray-700 select-none cursor-pointer">Menu Active</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="menuDescription" className="text-sm font-medium text-gray-700">Description</Label>
                  <Textarea
                    id="menuDescription"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your menu..."
                    className="mt-1 h-32"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Add Item Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add Menu Item</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="itemName" className="text-sm font-medium">Item Name</Label>
                      <Input
                        id="itemName"
                        value={currentItem.name}
                        onChange={(e) => setCurrentItem(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Grilled Chicken"
                      />
                    </div>
                    <div>
                      <Label htmlFor="itemPrice" className="text-sm font-medium">Price ($)</Label>
                      <Input
                        id="itemPrice"
                        type="number"
                        step="0.01"
                        value={currentItem.price}
                        onChange={(e) => setCurrentItem(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="itemDescription" className="text-sm font-medium">Description</Label>
                    <Textarea
                      id="itemDescription"
                      value={currentItem.description}
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the item..."
                      className="h-20"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="itemCategory" className="text-sm font-medium">Category</Label>
                      <Select value={currentItem.category} onValueChange={(value) => setCurrentItem(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {itemCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="itemAvailable"
                        checked={currentItem.available}
                        onCheckedChange={(checked) => setCurrentItem(prev => ({ ...prev, available: !!checked }))}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="itemAvailable" className="text-sm font-medium select-none cursor-pointer">Available</Label>
                    </div>
                  </div>

                  <Button onClick={handleAddItem} className="w-full" disabled={!currentItem.name || currentItem.price <= 0}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </CardContent>
              </Card>

              {/* Items List */}
              {formData.items.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Menu Items ({formData.items.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {formData.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                              {item.available ? (
                                <Badge variant="default" className="text-xs bg-green-100 text-green-700">Available</Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">Unavailable</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                            <p className="text-sm font-semibold text-green-600">${item.price.toFixed(2)}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex-shrink-0 bg-gray-50 border-t border-gray-100 ${
          isMobile ? 'p-4' : 'p-6'
        }`}>
          <div className="flex justify-between">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              {currentStep < 2 ? (
                <Button 
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!isStepValid(currentStep)}
                >
                  Next
                </Button>
              ) : (
                <Button onClick={handleSave} disabled={!isStepValid(1)}>
                  <Save className="w-4 h-4 mr-2" />
                  {mode === 'create' ? 'Create Menu' : 'Save Changes'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};