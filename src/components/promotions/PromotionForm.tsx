import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { useStores } from '@/contexts/StoresContext';
import { useResort } from '@/contexts/DestinationContext';
import { Upload, X, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface PromotionFormData {
  name: string;
  description: string;
  promoCode: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  discount: string;
  minimumOrder: string;
  targetType: string;
  store: string;
  acceptTerms: boolean;
  image?: string; // Add image field
}

interface PromotionFormProps {
  onSave: (data: Omit<PromotionFormData, 'acceptTerms'>) => void;
  initialData?: any; // For editing existing promotions
}

export const PromotionForm: React.FC<PromotionFormProps> = ({ onSave, initialData }) => {
  const { toast } = useToast();
  const { stores: allStores } = useStores();
  const { currentResort } = useResort();

  // Get all stores regardless of resort assignment and remove duplicates
  // This ensures all stores are available in dropdowns without duplicates
  const availableStores = allStores.filter((store, index, self) => 
    index === self.findIndex(s => s.id === store.id)
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<PromotionFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    promoCode: initialData?.promoCode || '',
    startDate: initialData?.startDate || undefined,
    endDate: initialData?.endDate || undefined,
    discount: initialData?.discount || '',
    minimumOrder: initialData?.minimumOrder || '',
    targetType: initialData?.targetType || 'everyone',
    store: initialData?.store || '',
    acceptTerms: false,
    image: initialData?.image || undefined
  });

  // Set image preview if editing existing promotion with image
  useEffect(() => {
    if (initialData?.image) {
      setImagePreview(initialData.image);
    }
  }, [initialData]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleImageUpload called');
    const file = event.target.files?.[0];
    console.log('Selected file:', file);
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.log('Invalid file type:', file.type);
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (JPEG, PNG, or GIF).",
          variant: "destructive"
        });
        // Reset input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        console.log('File too large:', file.size);
        toast({
          title: "File Too Large",
          description: "Image cannot exceed 10MB.",
          variant: "destructive"
        });
        // Reset input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      console.log('Setting selected image:', file.name);
      setSelectedImage(file);
      
      // Create preview with proper compression for better performance
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log('FileReader result received, length:', result ? result.length : 0);
        
        // Create an image element to check dimensions and compress if needed
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set optimal dimensions (2:1 ratio, max 800x400)
          const maxWidth = 800;
          const maxHeight = 400;
          let { width, height } = img;
          
          // Maintain aspect ratio while fitting within bounds
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress the image
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          
          console.log('Image compressed, new length:', compressedDataUrl.length);
          setImagePreview(compressedDataUrl);
          // Update form data with compressed image
          setFormData(prev => ({ ...prev, image: compressedDataUrl }));
          
          toast({
            title: "Image Uploaded",
            description: `${file.name} has been optimized and uploaded successfully.`,
          });
        };
        img.src = result;
      };
      reader.onerror = (e) => {
        console.error('FileReader error:', e);
        toast({
          title: "Upload Error",
          description: "Failed to read the image file.",
          variant: "destructive"
        });
      };
      reader.readAsDataURL(file);
    } else {
      console.log('No file selected');
    }
  };

  const removeImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedImage(null);
    setImagePreview(null);
    // Update form data to remove image
    setFormData(prev => ({ ...prev, image: undefined }));
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.store) {
      toast({
        title: "Store Required",
        description: "Please select a store for this promotion.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.promoCode.trim()) {
      toast({
        title: "Promo Code Required",
        description: "Please enter a promo code for this promotion.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast({
        title: "Date Range Required",
        description: "Please select both start and end dates for this promotion.",
        variant: "destructive"
      });
      return;
    }

    if (formData.startDate >= formData.endDate) {
      toast({
        title: "Invalid Date Range",
        description: "End date must be after start date.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.acceptTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the Terms & Conditions to continue.",
        variant: "destructive"
      });
      return;
    }

    const { acceptTerms, ...promotionData } = formData;
    onSave(promotionData);
  };

  const handleTargetTypeChange = (value: string) => {
    setFormData({ ...formData, targetType: value });
  };

  const handleUploadAreaClick = () => {
    console.log('Upload area clicked');
    fileInputRef.current?.click();
  };

  return (
    <div className="h-full">
      <form onSubmit={handleSubmit} className="space-y-6 p-1">
        {/* Store Selection */}
        <div>
          <Label htmlFor="store">Store *</Label>
          <Select value={formData.store} onValueChange={(value) => setFormData({ ...formData, store: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select a store" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
              {availableStores.map((store) => (
                <SelectItem key={store.id} value={store.name}>
                  <div className="flex items-center gap-2">
                    <span>{store.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            Choose which store this promotion will be available for
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="promotionName">Promotion name</Label>
              <Input
                id="promotionName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="promoCode">Promo Code *</Label>
              <Input
                id="promoCode"
                value={formData.promoCode}
                onChange={(e) => setFormData({ ...formData, promoCode: e.target.value.toUpperCase() })}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Customers will use this code to apply the discount
              </p>
            </div>

            <div className="space-y-3">
              <Label>Date Range *</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-600">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-medium bg-white border-gray-300 hover:border-gray-400 focus:border-gray-500 hover:bg-gray-50 shadow-sm transition-all duration-200",
                          !formData.startDate && "text-gray-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-600" />
                        {formData.startDate ? format(formData.startDate, "MMM dd, yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white border-gray-300 shadow-xl" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => setFormData({ ...formData, startDate: date })}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-4 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-medium bg-white border-gray-300 hover:border-gray-400 focus:border-gray-500 hover:bg-gray-50 shadow-sm transition-all duration-200",
                          !formData.endDate && "text-gray-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-600" />
                        {formData.endDate ? format(formData.endDate, "MMM dd, yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white border-gray-300 shadow-xl" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => setFormData({ ...formData, endDate: date })}
                        disabled={(date) => {
                          const today = new Date();
                          const startDate = formData.startDate;
                          return date < today || (startDate && date <= startDate);
                        }}
                        initialFocus
                        className="p-4 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Select the period when this promotion will be active
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discount">Discount</Label>
                <div className="flex">
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="rounded-r-none"
                    required
                  />
                  <div className="bg-gray-100 border border-l-0 rounded-r px-3 flex items-center text-sm">
                    %
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="minimumOrder">Minimum order</Label>
                <div className="flex">
                  <div className="bg-gray-100 border border-r-0 rounded-l px-3 flex items-center text-sm">
                    $
                  </div>
                  <Input
                    id="minimumOrder"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.minimumOrder}
                    onChange={(e) => setFormData({ ...formData, minimumOrder: e.target.value })}
                    className="rounded-l-none"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label>Upload image</Label>
            <p className="text-xs text-gray-500 mb-2">Recommended: 2:1 ratio (e.g., 800x400px) for best results</p>
            {!imagePreview ? (
              <Card 
                className="border-2 border-dashed border-gray-300 h-40 hover:border-gray-400 transition-colors cursor-pointer relative"
                onClick={handleUploadAreaClick}
              >
                <CardContent className="flex flex-col items-center justify-center h-full p-0 relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="text-center pointer-events-none">
                    <Upload className="h-8 w-8 text-gray-600 mb-2 mx-auto" />
                    <p className="text-sm font-medium">Click to upload your promotion image</p>
                    <p className="text-xs text-gray-500">JPEG, PNG or GIF • Max 10MB • Auto-optimized</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border h-40 overflow-hidden relative">
                <CardContent className="p-0 h-full">
                  <img
                    src={imagePreview}
                    alt="Promotion Preview"
                    className="w-full h-full object-cover"
                    style={{ imageRendering: 'auto' }}
                    onLoad={() => console.log('Image preview loaded successfully')}
                    onError={(e) => {
                      console.error('Image preview failed to load');
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNzUgMTc1SDQyNVYyMjVIMzc1VjE3NVoiIGZpbGw9IiM5QjlDQTEiLz4KPHBhdGggZD0iTTM4NSAxOTVMMzk1IDIwNUw0MTUgMTg1VjIxNUgzOTVWMjA1TDM4NSAxOTVaIiBmaWxsPSIjRjlGQUZCIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iMjYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjM2MzYzIiBmb250LXNpemU9IjE0cHgiPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPgo=';
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0 z-20 shadow-lg"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}
            <div className="mt-2 text-xs text-gray-500">
              {selectedImage ? (
                <p className="text-green-600 font-medium">
                  ✓ {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              ) : (
                <p>Upload a custom image for your promotion</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <Label className="text-base font-medium">Target</Label>
          <p className="text-sm text-gray-500 mb-4">
            Allow all customers to receive this promotion or target specific groups.
          </p>
          
          <RadioGroup
            value={formData.targetType}
            onValueChange={handleTargetTypeChange}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Card className="border relative hover:border-gray-400 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="pt-0.5">
                    <RadioGroupItem value="everyone" id="everyone" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="everyone" className="font-medium cursor-pointer">Available to everyone</Label>
                    <p className="text-sm text-gray-500 mt-1">All customers can receive this promotion</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border relative hover:border-gray-400 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="pt-0.5">
                    <RadioGroupItem value="exclusive" id="exclusive" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="exclusive" className="font-medium cursor-pointer">Exclusive to some</Label>
                    <p className="text-sm text-gray-500 mt-1">Available only for returning clients</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>
        </div>

        <div className="flex items-center space-x-1">
          <Checkbox
            id="terms"
            checked={formData.acceptTerms}
            onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
            className="h-4 w-4"
          />
          <Label htmlFor="terms" className="text-sm">
            I accept the{' '}
            <a href="#" className="text-gray-700 underline hover:text-gray-900">
              Terms & Conditions
            </a>
          </Label>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};
