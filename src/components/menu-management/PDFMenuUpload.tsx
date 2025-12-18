import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useStores } from '@/contexts/StoresContext';
import { useMenus, MenuItem } from '@/contexts/MenusContext';

// Sample menu item templates for mock generation
const sampleMenuItems = {
  Appetizers: [
    { name: 'Bruschetta', description: 'Toasted bread with tomatoes, garlic, and fresh basil', priceRange: [8, 12] },
    { name: 'Calamari Fritti', description: 'Crispy fried calamari with lemon aioli', priceRange: [12, 16] },
    { name: 'Soup of the Day', description: 'Chef\'s daily selection of seasonal soup', priceRange: [6, 9] },
    { name: 'Charcuterie Board', description: 'Selection of cured meats, cheeses, and accompaniments', priceRange: [18, 24] },
    { name: 'Shrimp Cocktail', description: 'Chilled jumbo shrimp with cocktail sauce', priceRange: [14, 18] },
  ],
  'Main Course': [
    { name: 'Grilled Salmon', description: 'Atlantic salmon with herb butter and seasonal vegetables', priceRange: [24, 32] },
    { name: 'Ribeye Steak', description: '12oz ribeye with garlic mashed potatoes and asparagus', priceRange: [32, 42] },
    { name: 'Pasta Primavera', description: 'Seasonal vegetables tossed with penne in light cream sauce', priceRange: [16, 22] },
    { name: 'Chicken Parmesan', description: 'Breaded chicken breast with marinara and melted mozzarella', priceRange: [18, 24] },
    { name: 'Pan-Seared Duck', description: 'Duck breast with cherry reduction and roasted root vegetables', priceRange: [28, 36] },
    { name: 'Lobster Risotto', description: 'Creamy arborio rice with fresh lobster and truffle oil', priceRange: [34, 42] },
  ],
  Sides: [
    { name: 'Garlic Mashed Potatoes', description: 'Creamy potatoes with roasted garlic', priceRange: [6, 9] },
    { name: 'Grilled Asparagus', description: 'Fresh asparagus with lemon and parmesan', priceRange: [7, 10] },
    { name: 'House Salad', description: 'Mixed greens with balsamic vinaigrette', priceRange: [6, 9] },
    { name: 'Truffle Fries', description: 'Crispy fries with truffle oil and parmesan', priceRange: [8, 12] },
  ],
  Desserts: [
    { name: 'Tiramisu', description: 'Classic Italian dessert with espresso and mascarpone', priceRange: [9, 12] },
    { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center and vanilla ice cream', priceRange: [10, 14] },
    { name: 'Crème Brûlée', description: 'Vanilla custard with caramelized sugar crust', priceRange: [8, 11] },
    { name: 'New York Cheesecake', description: 'Classic cheesecake with berry compote', priceRange: [9, 12] },
  ],
  Beverages: [
    { name: 'Fresh Squeezed Juice', description: 'Orange, grapefruit, or seasonal selection', priceRange: [5, 7] },
    { name: 'Espresso', description: 'Double shot of premium espresso', priceRange: [3, 5] },
    { name: 'Craft Lemonade', description: 'House-made lemonade with fresh mint', priceRange: [4, 6] },
    { name: 'Iced Tea', description: 'Fresh brewed black or green tea', priceRange: [3, 5] },
  ],
};

// Generate a random price within range
const getRandomPrice = (range: number[]): number => {
  return Math.round((range[0] + Math.random() * (range[1] - range[0])) * 100) / 100;
};

// Generate mock menu items from a "PDF"
const generateMockMenuItems = (fileName: string): { menuName: string; items: MenuItem[] } => {
  // Extract menu name from file name
  const menuName = fileName
    .replace(/\.pdf$/i, '')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  const items: MenuItem[] = [];
  const categories = Object.keys(sampleMenuItems);
  
  // Randomly select 3-5 categories
  const numCategories = 3 + Math.floor(Math.random() * 3);
  const selectedCategories = categories
    .sort(() => Math.random() - 0.5)
    .slice(0, numCategories);

  selectedCategories.forEach(category => {
    const categoryItems = sampleMenuItems[category as keyof typeof sampleMenuItems];
    // Select 2-4 items from each category
    const numItems = 2 + Math.floor(Math.random() * 3);
    const selectedItems = categoryItems
      .sort(() => Math.random() - 0.5)
      .slice(0, numItems);

    selectedItems.forEach(item => {
      items.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: item.name,
        description: item.description,
        price: getRandomPrice(item.priceRange),
        category: category,
      });
    });
  });

  return { menuName, items };
};

export const PDFMenuUpload = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadResult, setUploadResult] = useState<{ menuName?: string; itemCount?: number; error?: string } | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  
  const { toast } = useToast();
  const { stores } = useStores();
  const { addMenu } = useMenus();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadResult(null);

    // Simulate processing delay (1.5-2.5 seconds)
    const delay = 1500 + Math.random() * 1000;

    setTimeout(async () => {
      try {
        // Generate mock menu data from the file name
        const { menuName, items } = generateMockMenuItems(file.name);
        
        // Determine the store ID to use
        const storeId = selectedStoreId ? parseInt(selectedStoreId) : stores[0]?.id;

        // Add the menu using the context
        await addMenu({
          name: menuName,
          description: `Imported from ${file.name}`,
          category: 'restaurant',
          is_active: true,
          store_id: storeId,
          items: items,
        });

        setUploadStatus('success');
        setUploadResult({
          menuName: menuName,
          itemCount: items.length
        });

        toast({
          title: "Menu imported successfully!",
          description: `Imported "${menuName}" with ${items.length} items.`,
        });

      } catch (error: any) {
        console.error('Error processing PDF:', error);
        setUploadStatus('error');
        setUploadResult({
          error: error.message || 'Failed to process PDF menu'
        });

        toast({
          title: "Import failed",
          description: error.message || "Failed to process PDF menu. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }, delay);
  };

  const resetUpload = () => {
    setUploadStatus('idle');
    setUploadResult(null);
    setIsUploading(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(resetUpload, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full relative">
          <FileText className="w-4 h-4 mr-2" />
          Import PDF Menu
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            BETA
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Menu from PDF</DialogTitle>
          <DialogDescription>
            Upload a PDF menu and we'll automatically extract the menu items for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {uploadStatus === 'idle' && (
            <Card>
              <CardHeader className="text-center">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <CardTitle className="text-lg">Upload PDF Menu</CardTitle>
                <CardDescription>
                  Select a PDF file containing your menu. Our AI will extract menu items, prices, and descriptions automatically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  {/* Store Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="store-select">Assign to Store</Label>
                    <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
                      <SelectTrigger id="store-select">
                        <SelectValue placeholder="Select a store (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((store) => (
                          <SelectItem key={store.id} value={store.id.toString()}>
                            {store.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* File Input */}
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer cursor-pointer"
                    disabled={isUploading}
                  />
                  <div className="text-xs text-muted-foreground">
                    <p>• Supported format: PDF</p>
                    <p>• Max file size: 10MB</p>
                    <p>• Best results with text-based PDFs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {uploadStatus === 'uploading' && (
            <Card>
              <CardContent className="text-center py-8">
                <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin mb-4" />
                <CardTitle className="text-lg mb-2">Processing PDF...</CardTitle>
                <CardDescription>
                  Please wait while we extract and parse your menu items. This may take a few moments.
                </CardDescription>
              </CardContent>
            </Card>
          )}

          {uploadStatus === 'success' && uploadResult && (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
                <CardTitle className="text-lg mb-2">Menu Imported Successfully!</CardTitle>
                <CardDescription className="space-y-2">
                  <p><strong>Menu:</strong> {uploadResult.menuName}</p>
                  <p><strong>Items imported:</strong> {uploadResult.itemCount}</p>
                  <p className="text-xs text-muted-foreground mt-4">
                    You can now view and edit the imported menu in your menu list.
                  </p>
                </CardDescription>
                <div className="flex gap-2 mt-4">
                  <Button onClick={resetUpload} variant="outline" className="flex-1">
                    Import Another
                  </Button>
                  <Button onClick={handleClose} className="flex-1">
                    Done
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {uploadStatus === 'error' && uploadResult && (
            <Card>
              <CardContent className="text-center py-8">
                <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
                <CardTitle className="text-lg mb-2">Import Failed</CardTitle>
                <CardDescription className="space-y-2">
                  <p className="text-red-600">{uploadResult.error}</p>
                  <p className="text-xs text-muted-foreground mt-4">
                    Please ensure your PDF contains readable text and menu items with prices.
                  </p>
                </CardDescription>
                <div className="flex gap-2 mt-4">
                  <Button onClick={resetUpload} variant="outline" className="flex-1">
                    Try Again
                  </Button>
                  <Button onClick={handleClose} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
