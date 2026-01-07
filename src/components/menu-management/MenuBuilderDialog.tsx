import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { PriceInput } from '@/components/ui/price-input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Minus, ArrowLeft, Save, ClipboardList, Utensils, DollarSign, FileText, Tag } from 'lucide-react';
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
    name: '',
    description: '',
    category: 'restaurant',
    isActive: true,
    items: []
  });

  // Reset form when dialog opens with new data
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
      setShowCustomCategory(false);
      setCustomCategory('');
    }
  }, [open, initialData]);

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
      } bg-white border-0 shadow-2xl rounded-2xl`}>
        
        {/* Header */}
        <div className={`flex-shrink-0 ${
          isMobile ? 'p-4 pb-3' : 'p-6 pb-4'
        } bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100`}>
          <DialogHeader>
            <DialogTitle className={`${
              isMobile ? 'text-xl' : 'text-2xl'
            } font-bold text-gray-900 flex items-center gap-3`}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              {mode === 'create' ? 'Create New Menu' : 'Edit Menu Details'}
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              {mode === 'create' 
                ? 'Build your menu from scratch with categories and items' 
                : 'Update your menu information and items'}
            </DialogDescription>
          </DialogHeader>
          
          {/* Step Indicator */}
          <div className="flex items-center mt-5 space-x-3">
            <button
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                currentStep === 1 
                  ? 'bg-white shadow-md text-blue-600 ring-2 ring-blue-500/20' 
                  : currentStep > 1 
                    ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                    : 'bg-gray-100 text-gray-400'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 1 ? 'bg-blue-500 text-white' : currentStep > 1 ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-white'
              }`}>
                {currentStep > 1 ? '✓' : '1'}
              </div>
              Menu Details
            </button>
            <div className={`w-8 h-0.5 rounded ${currentStep > 1 ? 'bg-emerald-300' : 'bg-gray-200'}`} />
            <button
              onClick={() => isStepValid(1) && setCurrentStep(2)}
              disabled={!isStepValid(1)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                currentStep === 2 
                  ? 'bg-white shadow-md text-blue-600 ring-2 ring-blue-500/20' 
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200 disabled:hover:bg-gray-100'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-white'
              }`}>
                2
              </div>
              Menu Items
            </button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className={`flex-1 ${isMobile ? 'h-[calc(100vh-220px)]' : 'max-h-[calc(90vh-280px)]'}`}>
          <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Menu Name */}
                <div className="space-y-2">
                  <Label htmlFor="menuName" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FileText className="w-4 h-4 text-gray-400" />
                    Menu Name *
                  </Label>
                  <Input
                    id="menuName"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Summer Menu 2024"
                    className="h-12 text-base border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="menuCategory" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Tag className="w-4 h-4 text-gray-400" />
                      Category
                    </Label>
                    {!showCustomCategory ? (
                      <Select 
                        value={formData.category} 
                        onValueChange={handleCategoryChange}
                      >
                        <SelectTrigger className="h-12 border-gray-200">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-xl shadow-xl border-gray-200">
                          {categories.filter(cat => cat !== 'custom').map(cat => (
                            <SelectItem key={cat} value={cat} className="py-2.5">
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </SelectItem>
                          ))}
                          <SelectItem value="custom" className="text-blue-600 font-medium py-2.5">
                            + Add New Category
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder="Enter custom category name"
                          className="flex-1 h-12"
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
                          className="h-12 px-4"
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
                          className="h-12 px-4"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Active Status */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Status</Label>
                    <div 
                      onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                      className={`h-12 flex items-center gap-3 px-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        formData.isActive 
                          ? 'border-emerald-500 bg-emerald-50' 
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <Checkbox
                        id="menuActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !!checked }))}
                        className="w-5 h-5 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                      />
                      <Label htmlFor="menuActive" className={`text-sm font-medium select-none cursor-pointer ${
                        formData.isActive ? 'text-emerald-700' : 'text-gray-600'
                      }`}>
                        {formData.isActive ? 'Menu is Active' : 'Menu is Inactive'}
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="menuDescription" className="text-sm font-semibold text-gray-700">Description</Label>
                  <Textarea
                    id="menuDescription"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your menu - highlight specialties, seasonal offerings, or cuisine style..."
                    className="min-h-[120px] text-base border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
            )}

          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Add Item Form */}
              <Card className="border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100 py-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-gray-500" />
                    Add Menu Item
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="itemName" className="text-sm font-semibold text-gray-700">Item Name</Label>
                      <Input
                        id="itemName"
                        value={currentItem.name}
                        onChange={(e) => setCurrentItem(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Grilled Chicken"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemPrice" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        Price
                      </Label>
                      <PriceInput
                        id="itemPrice"
                        value={currentItem.price}
                        onChange={(price) => setCurrentItem(prev => ({ ...prev, price }))}
                        placeholder="0.00"
                        className="h-11"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="itemDescription" className="text-sm font-semibold text-gray-700">Description</Label>
                    <Textarea
                      id="itemDescription"
                      value={currentItem.description}
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the item..."
                      className="h-20 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="itemCategory" className="text-sm font-semibold text-gray-700">Category</Label>
                      <Select value={currentItem.category} onValueChange={(value) => setCurrentItem(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-xl shadow-xl">
                          {itemCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Availability</Label>
                      <div 
                        onClick={() => setCurrentItem(prev => ({ ...prev, available: !prev.available }))}
                        className={`h-11 flex items-center gap-3 px-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          currentItem.available 
                            ? 'border-emerald-500 bg-emerald-50' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <Checkbox
                          id="itemAvailable"
                          checked={currentItem.available}
                          onCheckedChange={(checked) => setCurrentItem(prev => ({ ...prev, available: !!checked }))}
                          className="w-4 h-4 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        />
                        <Label htmlFor="itemAvailable" className={`text-sm font-medium select-none cursor-pointer ${
                          currentItem.available ? 'text-emerald-700' : 'text-gray-600'
                        }`}>
                          {currentItem.available ? 'Available' : 'Unavailable'}
                        </Label>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleAddItem} 
                    className="w-full h-11 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md" 
                    disabled={!currentItem.name || currentItem.price <= 0}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item to Menu
                  </Button>
                </CardContent>
              </Card>

              {/* Items List */}
              {formData.items.length > 0 && (
                <Card className="border-gray-200 shadow-sm overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100 py-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-indigo-500" />
                      Menu Items ({formData.items.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {formData.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <h4 className="font-semibold text-gray-900">{item.name}</h4>
                              <Badge variant="secondary" className="text-xs font-medium bg-gray-200 text-gray-700">{item.category}</Badge>
                              {item.available ? (
                                <Badge className="text-xs bg-emerald-100 text-emerald-700 border-0">Available</Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs bg-red-100 text-red-700 border-0">Unavailable</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mb-1.5 line-clamp-1">{item.description || 'No description'}</p>
                            <p className="text-base font-bold text-emerald-600">${item.price.toFixed(2)}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                            className="ml-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {formData.items.length === 0 && (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Utensils className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No items yet</h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto">
                    Add your first menu item using the form above. You can always add more items later.
                  </p>
                </div>
              )}
            </div>
          )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className={`flex-shrink-0 bg-gray-50 border-t border-gray-100 ${
          isMobile ? 'p-4' : 'px-6 py-4'
        }`}>
          <div className="flex justify-between items-center">
            <div>
              {currentStep > 1 && (
                <Button variant="ghost" onClick={() => setCurrentStep(currentStep - 1)} className="text-gray-600">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="border-gray-200">
                Cancel
              </Button>
              {currentStep < 2 ? (
                <Button 
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!isStepValid(currentStep)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md"
                >
                  Continue to Items
                </Button>
              ) : (
                <Button 
                  onClick={handleSave} 
                  disabled={!isStepValid(1)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md"
                >
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