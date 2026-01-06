import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PriceInput } from '@/components/ui/price-input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { Settings, Check, Plus, ChefHat, Upload, X } from 'lucide-react';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';

interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

interface ModifierGroup {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: ModifierOption[];
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  modifierGroups: string[];
}

interface MenuItemFormProps {
  item?: MenuItem | null;
  availableModifierGroups: ModifierGroup[];
  onSave: (item: MenuItem) => void;
  onCancel: () => void;
}

export const MenuItemForm: React.FC<MenuItemFormProps> = ({ 
  item, 
  availableModifierGroups, 
  onSave, 
  onCancel 
}) => {
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>(item?.modifierGroups || []);
  const [imagePreview, setImagePreview] = useState<string | null>(item?.image || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isMobileOrTablet = isMobile || isTablet;
  
  const form = useForm({
    defaultValues: {
      name: item?.name || '',
      description: item?.description || '',
      price: item?.price || 0,
    }
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    // Reset the file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = (data: any) => {
    const menuItem: MenuItem = {
      id: item?.id || Date.now().toString(),
      name: data.name,
      description: data.description,
      price: typeof data.price === 'number' ? data.price : parseFloat(data.price) || 0,
      modifierGroups: selectedModifiers,
      image: imagePreview || item?.image
    };
    onSave(menuItem);
  };

  const toggleModifier = (modifierId: string) => {
    setSelectedModifiers(prev => 
      prev.includes(modifierId) 
        ? prev.filter(id => id !== modifierId)
        : [...prev, modifierId]
    );
  };

  const getModifierGroupById = (id: string) => {
    return availableModifierGroups.find(group => group.id === id);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className={`${
        isMobileOrTablet 
          ? 'w-[98vw] max-w-none h-[95vh] max-h-none m-2 rounded-xl' 
          : 'sm:max-w-2xl w-[95vw] max-h-[90vh]'
      } bg-white/95 backdrop-blur-lg border border-gray-200/50 shadow-xl overflow-hidden flex flex-col`}>
        <DialogHeader className={`flex-shrink-0 ${isMobileOrTablet ? 'pb-3' : 'pb-4'}`}>
          <DialogTitle className={`${isMobileOrTablet ? 'text-lg' : 'text-xl sm:text-2xl'} font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent flex items-center gap-2`}>
            <ChefHat className="w-5 h-5 text-blue-600" />
            {item ? 'Edit Menu Item' : 'Add Menu Item'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className={`space-y-4 ${isMobileOrTablet ? 'px-1' : 'sm:space-y-6 px-1'}`}>
              
              {/* Image Upload Section */}
              <div className="space-y-3">
                <FormLabel className={`text-gray-800 font-medium ${isMobileOrTablet ? 'text-base' : 'text-sm sm:text-base'}`}>
                  Item Image
                </FormLabel>
                
                {imagePreview ? (
                  <div className="relative">
                    <div className={`relative ${isMobileOrTablet ? 'h-40' : 'h-48'} w-full rounded-lg overflow-hidden bg-gray-100`}>
                      <img
                        src={imagePreview}
                        alt="Menu item preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={`border-2 border-dashed border-gray-300 rounded-lg ${isMobileOrTablet ? 'p-6' : 'p-8'} text-center hover:border-gray-400 transition-colors`}>
                    <Upload className={`${isMobileOrTablet ? 'w-8 h-8' : 'w-10 h-10'} text-gray-400 mx-auto mb-3`} />
                    <p className={`${isMobileOrTablet ? 'text-sm' : 'text-base'} text-gray-600 mb-2`}>
                      Upload an image for this menu item
                    </p>
                    <p className={`${isMobileOrTablet ? 'text-xs' : 'text-sm'} text-gray-500 mb-4`}>
                      PNG, JPG up to 10MB
                    </p>
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Button
                        type="button"
                        variant="outline"
                        className={`${isMobileOrTablet ? 'h-10 text-sm' : 'h-10 text-sm'}`}
                        asChild
                      >
                        <span>Choose File</span>
                      </Button>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
                
                {!imagePreview && (
                  <div className="flex justify-center">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Button
                        type="button"
                        variant="outline"
                        className={`${isMobileOrTablet ? 'h-10 text-sm' : 'h-10 text-sm'}`}
                        asChild
                      >
                        <span className="flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Upload Image
                        </span>
                      </Button>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={`text-gray-800 font-medium ${isMobileOrTablet ? 'text-base' : 'text-sm sm:text-base'}`}>
                      Item Name
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter item name" 
                        {...field}
                        className={`input-modern ${isMobileOrTablet ? 'h-12 text-base' : 'text-sm sm:text-base h-10 sm:h-12'}`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={`text-gray-800 font-medium ${isMobileOrTablet ? 'text-base' : 'text-sm sm:text-base'}`}>
                      Description
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter item description" 
                        {...field}
                        className={`input-modern ${isMobileOrTablet ? 'h-12 text-base' : 'text-sm sm:text-base h-10 sm:h-12'}`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={`text-gray-800 font-medium ${isMobileOrTablet ? 'text-base' : 'text-sm sm:text-base'}`}>
                      Price ($)
                    </FormLabel>
                    <FormControl>
                      <PriceInput 
                        placeholder="0.00" 
                        value={field.value}
                        onChange={field.onChange}
                        className={`input-modern ${isMobileOrTablet ? 'h-12 text-base' : 'text-sm sm:text-base h-10 sm:h-12'}`}
                        inputMode="decimal"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  <FormLabel className={`text-gray-800 font-medium ${isMobileOrTablet ? 'text-base' : 'text-sm sm:text-base'}`}>
                    Option Sets (Modifier Groups)
                  </FormLabel>
                </div>
                
                {availableModifierGroups.length === 0 ? (
                  <div className={`text-center ${isMobileOrTablet ? 'py-6' : 'py-8'} bg-gray-50 rounded-xl border border-gray-200`}>
                    <Settings className={`${isMobileOrTablet ? 'w-10 h-10' : 'w-12 h-12'} text-gray-400 mx-auto mb-3`} />
                    <p className="text-gray-600 mb-4">No modifier groups available</p>
                    <p className={`${isMobileOrTablet ? 'text-xs' : 'text-sm'} text-gray-500 px-4`}>
                      Create modifier groups in the main menu management to add customizable options to your items.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className={`${isMobileOrTablet ? 'text-xs' : 'text-xs'} text-gray-600 mb-4`}>
                      Select which option sets customers can customize for this item. Option sets allow customers to choose sizes, add toppings, select preferences, etc.
                    </p>
                    
                    <div className="grid gap-3">
                      {availableModifierGroups.map((group) => {
                        const isSelected = selectedModifiers.includes(group.id);
                        return (
                          <div 
                            key={group.id} 
                            className={`relative ${isMobileOrTablet ? 'p-3' : 'p-4'} rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                              isSelected 
                                ? 'border-blue-500 bg-blue-50 shadow-md' 
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                            }`}
                            onClick={() => toggleModifier(group.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className={`flex items-center space-x-3 ${isMobileOrTablet ? 'mb-2' : 'mb-2'}`}>
                                  <div className={`${isMobileOrTablet ? 'w-5 h-5' : 'w-6 h-6'} rounded-lg flex items-center justify-center ${
                                    isSelected ? 'bg-blue-600' : 'bg-gray-200'
                                  }`}>
                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                    {!isSelected && <Plus className="w-3 h-3 text-gray-500" />}
                                  </div>
                                  <h4 className={`font-semibold text-gray-900 ${isMobileOrTablet ? 'text-sm' : ''}`}>
                                    {group.name}
                                  </h4>
                                </div>
                                
                                <div className={`flex items-center space-x-3 mb-3 ${isMobileOrTablet ? 'ml-8' : 'ml-9'}`}>
                                  <Badge 
                                    variant="secondary" 
                                    className={`text-xs ${
                                      group.type === 'single' 
                                        ? 'bg-blue-100 text-blue-700' 
                                        : 'bg-purple-100 text-purple-700'
                                    }`}
                                  >
                                    {group.type === 'single' ? 'Single choice' : 'Multiple choice'}
                                  </Badge>
                                  {group.required && (
                                    <Badge variant="outline" className="text-xs border-orange-200 text-orange-700 bg-orange-50">
                                      Required
                                    </Badge>
                                  )}
                                  <span className="text-xs text-gray-500">
                                    {group.options.length} option{group.options.length !== 1 ? 's' : ''}
                                  </span>
                                </div>

                                <div className={`${isMobileOrTablet ? 'ml-8' : 'ml-9'} space-y-1`}>
                                  <p className="text-xs text-gray-600 font-medium">Options:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {group.options.slice(0, isMobileOrTablet ? 3 : 4).map((option) => (
                                      <span 
                                        key={option.id} 
                                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                      >
                                        {option.name}
                                        {option.price > 0 && (
                                          <span className="text-green-600 ml-1">+${option.price.toFixed(2)}</span>
                                        )}
                                      </span>
                                    ))}
                                    {group.options.length > (isMobileOrTablet ? 3 : 4) && (
                                      <span className="text-xs text-gray-500 px-2 py-1">
                                        +{group.options.length - (isMobileOrTablet ? 3 : 4)} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {selectedModifiers.length > 0 && (
                      <div className={`mt-4 ${isMobileOrTablet ? 'p-3' : 'p-3'} bg-blue-50 rounded-xl border border-blue-200`}>
                        <p className={`${isMobileOrTablet ? 'text-sm' : 'text-sm'} font-medium text-blue-900 mb-2`}>
                          Selected Option Sets ({selectedModifiers.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedModifiers.map(modifierId => {
                            const group = getModifierGroupById(modifierId);
                            return group ? (
                              <Badge key={modifierId} className="bg-blue-100 text-blue-800 border-blue-300">
                                {group.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className={`flex ${isMobileOrTablet ? 'flex-col' : 'flex-col sm:flex-row'} justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6 border-t border-gray-100 sticky bottom-0 bg-white/95 backdrop-blur -mx-1 px-1 pb-2`}>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  className={`border-gray-200 hover:bg-gray-50 ${isMobileOrTablet ? 'h-12 text-base' : 'h-10 sm:h-12 text-sm sm:text-base'} touch-manipulation`}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className={`bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow hover:shadow-lg transition-all duration-200 ${isMobileOrTablet ? 'h-12 text-base font-semibold' : 'h-10 sm:h-12 text-sm sm:text-base'} touch-manipulation`}
                >
                  {item ? 'Update Item' : 'Add Item'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
