import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, Globe, RefreshCw, Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useStores } from '@/contexts/StoresContext';
import { useMenus, MenuItem } from '@/contexts/MenusContext';

// Sample menu item templates for mock generation
const sampleMenuItems = {
  Appetizers: [
    { name: 'Bruschetta', description: 'Toasted bread with tomatoes, garlic, and fresh basil', priceRange: [8, 12], image: '/images/menu/salad.jpg' },
    { name: 'Calamari Fritti', description: 'Crispy fried calamari with lemon aioli', priceRange: [12, 16], image: '/images/menu/fish-tacos.jpg' },
    { name: 'Soup of the Day', description: 'Chef\'s daily selection of seasonal soup', priceRange: [6, 9], image: null },
    { name: 'Charcuterie Board', description: 'Selection of cured meats, cheeses, and accompaniments', priceRange: [18, 24], image: null },
    { name: 'Shrimp Cocktail', description: 'Chilled jumbo shrimp with cocktail sauce', priceRange: [14, 18], image: '/images/menu/grilled-salmon.jpg' },
  ],
  'Main Course': [
    { name: 'Grilled Salmon', description: 'Atlantic salmon with herb butter and seasonal vegetables', priceRange: [24, 32], image: '/images/menu/grilled-salmon.jpg' },
    { name: 'Ribeye Steak', description: '12oz ribeye with garlic mashed potatoes and asparagus', priceRange: [32, 42], image: null },
    { name: 'Pasta Primavera', description: 'Seasonal vegetables tossed with penne in light cream sauce', priceRange: [16, 22], image: null },
    { name: 'Chicken Parmesan', description: 'Breaded chicken breast with marinara and melted mozzarella', priceRange: [18, 24], image: null },
    { name: 'Pan-Seared Duck', description: 'Duck breast with cherry reduction and roasted root vegetables', priceRange: [28, 36], image: null },
    { name: 'Lobster Risotto', description: 'Creamy arborio rice with fresh lobster and truffle oil', priceRange: [34, 42], image: null },
  ],
  Sides: [
    { name: 'Garlic Mashed Potatoes', description: 'Creamy potatoes with roasted garlic', priceRange: [6, 9], image: null },
    { name: 'Grilled Asparagus', description: 'Fresh asparagus with lemon and parmesan', priceRange: [7, 10], image: null },
    { name: 'House Salad', description: 'Mixed greens with balsamic vinaigrette', priceRange: [6, 9], image: '/images/menu/house-salad.jpg' },
    { name: 'Truffle Fries', description: 'Crispy fries with truffle oil and parmesan', priceRange: [8, 12], image: null },
  ],
  Desserts: [
    { name: 'Tiramisu', description: 'Classic Italian dessert with espresso and mascarpone', priceRange: [9, 12], image: null },
    { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center and vanilla ice cream', priceRange: [10, 14], image: null },
    { name: 'Crème Brûlée', description: 'Vanilla custard with caramelized sugar crust', priceRange: [8, 11], image: null },
    { name: 'New York Cheesecake', description: 'Classic cheesecake with berry compote', priceRange: [9, 12], image: '/images/menu/cheesecake.jpg' },
  ],
  Beverages: [
    { name: 'Fresh Squeezed Juice', description: 'Orange, grapefruit, or seasonal selection', priceRange: [5, 7], image: null },
    { name: 'Espresso', description: 'Double shot of premium espresso', priceRange: [3, 5], image: null },
    { name: 'Craft Lemonade', description: 'House-made lemonade with fresh mint', priceRange: [4, 6], image: null },
    { name: 'Iced Tea', description: 'Fresh brewed black or green tea', priceRange: [3, 5], image: '/images/menu/iced-tea.jpg' },
  ],
  Cocktails: [
    { name: 'Old Fashioned', description: 'Bourbon, bitters, sugar, and orange peel', priceRange: [12, 16], image: '/images/menu/margarita-cocktail.jpg' },
    { name: 'Margarita', description: 'Tequila, lime juice, and triple sec', priceRange: [11, 15], image: '/images/menu/margarita-cocktail.jpg' },
    { name: 'Espresso Martini', description: 'Vodka, espresso, coffee liqueur', priceRange: [13, 17], image: null },
    { name: 'Mojito', description: 'White rum, mint, lime, sugar, soda', priceRange: [11, 14], image: null },
  ],
  Breakfast: [
    { name: 'Eggs Benedict', description: 'Poached eggs with hollandaise on English muffin', priceRange: [14, 18], image: null },
    { name: 'Avocado Toast', description: 'Smashed avocado on sourdough with poached eggs', priceRange: [12, 16], image: null },
    { name: 'Belgian Waffles', description: 'Fresh waffles with berries and maple syrup', priceRange: [11, 15], image: null },
    { name: 'Breakfast Burrito', description: 'Scrambled eggs, cheese, chorizo, and salsa', priceRange: [13, 17], image: '/images/menu/tacos.jpg' },
  ],
};

// Toast POS integration
const toastPOS = { id: 'toast', name: 'Toast POS', logo: '/images/integrations/toast-logo.png', connected: true, lastSync: '2 hours ago' };

// Generate a random price within range
const getRandomPrice = (range: number[]): number => {
  return Math.round((range[0] + Math.random() * (range[1] - range[0])) * 100) / 100;
};

// Generate mock menu items from a "PDF"
const generateMockMenuItems = (fileName: string): { menuName: string; items: MenuItem[] } => {
  const menuName = fileName
    .replace(/\.pdf$/i, '')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  const items: MenuItem[] = [];
  const categories = Object.keys(sampleMenuItems);
  
  const numCategories = 3 + Math.floor(Math.random() * 3);
  const selectedCategories = categories
    .sort(() => Math.random() - 0.5)
    .slice(0, numCategories);

  selectedCategories.forEach(category => {
    const categoryItems = sampleMenuItems[category as keyof typeof sampleMenuItems];
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
        image: item.image || undefined,
      });
    });
  });

  return { menuName, items };
};

// Generate mock menu items from a web URL
const generateMenuFromWebLink = (url: string): { menuName: string; items: MenuItem[]; categories: number } => {
  // Extract restaurant name from URL
  const urlParts = url.replace(/^https?:\/\//, '').split('/');
  const domain = urlParts[0].replace(/^www\./, '').split('.')[0];
  const menuName = domain.charAt(0).toUpperCase() + domain.slice(1) + ' Menu';

  // Determine menu type based on URL patterns
  const urlLower = url.toLowerCase();
  let relevantCategories: string[] = [];

  if (urlLower.includes('breakfast') || urlLower.includes('brunch')) {
    relevantCategories = ['Breakfast', 'Beverages'];
  } else if (urlLower.includes('bar') || urlLower.includes('cocktail') || urlLower.includes('drinks')) {
    relevantCategories = ['Cocktails', 'Beverages', 'Appetizers'];
  } else if (urlLower.includes('italian') || urlLower.includes('pizza')) {
    relevantCategories = ['Appetizers', 'Main Course', 'Desserts'];
  } else {
    // Default: varied menu
    relevantCategories = ['Appetizers', 'Main Course', 'Sides', 'Desserts', 'Beverages'];
  }

  const items: MenuItem[] = [];
  const numCategories = Math.min(relevantCategories.length, 3 + Math.floor(Math.random() * 2));
  const selectedCategories = relevantCategories.slice(0, numCategories);

  selectedCategories.forEach(category => {
    const categoryItems = sampleMenuItems[category as keyof typeof sampleMenuItems];
    if (!categoryItems) return;
    
    const numItems = 3 + Math.floor(Math.random() * 3);
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
        image: item.image || undefined,
      });
    });
  });

  return { menuName, items, categories: selectedCategories.length };
};

// Generate mock menu from POS system
const generateMenuFromPOS = (posId: string): { menuName: string; items: MenuItem[]; categories: number } => {
  const posNames: Record<string, string> = {
    toast: 'Toast POS Menu',
    square: 'Square Menu',
    clover: 'Clover Menu',
    lightspeed: 'Lightspeed Menu',
  };

  const menuName = posNames[posId] || 'POS Menu';
  const items: MenuItem[] = [];
  
  // POS menus typically have more complete data
  const allCategories = ['Appetizers', 'Main Course', 'Sides', 'Desserts', 'Beverages'];
  const numCategories = 4 + Math.floor(Math.random() * 2);
  const selectedCategories = allCategories.slice(0, numCategories);

  selectedCategories.forEach(category => {
    const categoryItems = sampleMenuItems[category as keyof typeof sampleMenuItems];
    const numItems = 3 + Math.floor(Math.random() * 3);
    const selectedItems = categoryItems
      .sort(() => Math.random() - 0.5)
      .slice(0, numItems);

    selectedItems.forEach(item => {
      items.push({
        id: `pos-${posId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: item.name,
        description: item.description,
        price: getRandomPrice(item.priceRange),
        category: category,
        image: item.image || undefined,
      });
    });
  });

  return { menuName, items, categories: selectedCategories.length };
};

type ImportStatus = 'idle' | 'uploading' | 'success' | 'error';
type ImportTab = 'pdf' | 'weblink' | 'pos';

interface ProgressStep {
  label: string;
  completed: boolean;
  active: boolean;
}

export const MenuImport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ImportTab>('pdf');
  const [uploadStatus, setUploadStatus] = useState<ImportStatus>('idle');
  const [uploadResult, setUploadResult] = useState<{ menuName?: string; itemCount?: number; categories?: number; error?: string } | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [webUrl, setWebUrl] = useState('');
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([]);
  const [syncingPOS, setSyncingPOS] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { stores } = useStores();
  const { addMenu } = useMenus();

  const resetState = () => {
    setUploadStatus('idle');
    setUploadResult(null);
    setProgressSteps([]);
    setSyncingPOS(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      resetState();
      setWebUrl('');
    }, 300);
  };

  // PDF Upload Handler
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

    setUploadStatus('uploading');
    setProgressSteps([
      { label: 'Reading PDF file...', completed: false, active: true },
      { label: 'Extracting menu structure...', completed: false, active: false },
      { label: 'Processing items & prices...', completed: false, active: false },
    ]);

    // Simulate processing with progress updates
    setTimeout(() => setProgressSteps(prev => prev.map((s, i) => i === 0 ? { ...s, completed: true, active: false } : i === 1 ? { ...s, active: true } : s)), 600);
    setTimeout(() => setProgressSteps(prev => prev.map((s, i) => i === 1 ? { ...s, completed: true, active: false } : i === 2 ? { ...s, active: true } : s)), 1200);

    setTimeout(async () => {
      try {
        const { menuName, items } = generateMockMenuItems(file.name);
        const storeId = selectedStoreId ? parseInt(selectedStoreId) : stores[0]?.id;

        await addMenu({
          name: menuName,
          description: `Imported from ${file.name}`,
          category: 'restaurant',
          is_active: true,
          store_id: storeId,
          items: items,
        });

        setProgressSteps(prev => prev.map(s => ({ ...s, completed: true, active: false })));
        setUploadStatus('success');
        setUploadResult({ menuName, itemCount: items.length });

        toast({
          title: "Menu imported successfully!",
          description: `Imported "${menuName}" with ${items.length} items.`,
        });
      } catch (error: any) {
        setUploadStatus('error');
        setUploadResult({ error: error.message || 'Failed to process PDF' });
        toast({
          title: "Import failed",
          description: error.message || "Failed to process PDF menu.",
          variant: "destructive",
        });
      }
    }, 1800);
  };

  // Web Link Import Handler
  const handleWebLinkImport = async () => {
    if (!webUrl.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a valid menu URL.",
        variant: "destructive",
      });
      return;
    }

    setUploadStatus('uploading');
    setProgressSteps([
      { label: 'Connecting to website...', completed: false, active: true },
      { label: 'Analyzing menu structure...', completed: false, active: false },
      { label: 'Extracting categories & items...', completed: false, active: false },
      { label: 'Processing images & prices...', completed: false, active: false },
    ]);

    // Simulate AI processing with progress updates
    setTimeout(() => setProgressSteps(prev => prev.map((s, i) => i === 0 ? { ...s, completed: true, active: false } : i === 1 ? { ...s, active: true } : s)), 800);
    setTimeout(() => setProgressSteps(prev => prev.map((s, i) => i === 1 ? { ...s, completed: true, active: false } : i === 2 ? { ...s, active: true } : s)), 1600);
    setTimeout(() => setProgressSteps(prev => prev.map((s, i) => i === 2 ? { ...s, completed: true, active: false } : i === 3 ? { ...s, active: true } : s)), 2400);

    setTimeout(async () => {
      try {
        const { menuName, items, categories } = generateMenuFromWebLink(webUrl);
        const storeId = selectedStoreId ? parseInt(selectedStoreId) : stores[0]?.id;

        await addMenu({
          name: menuName,
          description: `Imported from ${webUrl}`,
          category: 'restaurant',
          is_active: true,
          store_id: storeId,
          items: items,
        });

        setProgressSteps(prev => prev.map(s => ({ ...s, completed: true, active: false })));
        setUploadStatus('success');
        setUploadResult({ menuName, itemCount: items.length, categories });

        toast({
          title: "Menu imported successfully!",
          description: `Imported "${menuName}" with ${items.length} items from ${categories} categories.`,
        });
      } catch (error: any) {
        setUploadStatus('error');
        setUploadResult({ error: error.message || 'Failed to scrape menu' });
        toast({
          title: "Import failed",
          description: error.message || "Failed to import menu from URL.",
          variant: "destructive",
        });
      }
    }, 3200);
  };

  // POS Sync Handler
  const handlePOSSync = async (posId: string) => {
    setSyncingPOS(posId);
    setUploadStatus('uploading');
    setProgressSteps([
      { label: 'Connecting to POS...', completed: false, active: true },
      { label: 'Fetching menu categories...', completed: false, active: false },
      { label: 'Downloading items & modifiers...', completed: false, active: false },
      { label: 'Syncing pricing data...', completed: false, active: false },
    ]);

    // Simulate POS sync with progress updates
    setTimeout(() => setProgressSteps(prev => prev.map((s, i) => i === 0 ? { ...s, completed: true, active: false } : i === 1 ? { ...s, active: true } : s)), 700);
    setTimeout(() => setProgressSteps(prev => prev.map((s, i) => i === 1 ? { ...s, completed: true, active: false } : i === 2 ? { ...s, active: true } : s)), 1400);
    setTimeout(() => setProgressSteps(prev => prev.map((s, i) => i === 2 ? { ...s, completed: true, active: false } : i === 3 ? { ...s, active: true } : s)), 2100);

    setTimeout(async () => {
      try {
        const { menuName, items, categories } = generateMenuFromPOS(posId);
        const storeId = selectedStoreId ? parseInt(selectedStoreId) : stores[0]?.id;

        await addMenu({
          name: menuName,
          description: `Synced from ${toastPOS.name}`,
          category: 'restaurant',
          is_active: true,
          store_id: storeId,
          items: items,
        });

        setProgressSteps(prev => prev.map(s => ({ ...s, completed: true, active: false })));
        setUploadStatus('success');
        setUploadResult({ menuName, itemCount: items.length, categories });
        setSyncingPOS(null);

        toast({
          title: "POS menu synced!",
          description: `Imported "${menuName}" with ${items.length} items from ${toastPOS.name}.`,
        });
      } catch (error: any) {
        setUploadStatus('error');
        setUploadResult({ error: error.message || 'Failed to sync POS' });
        setSyncingPOS(null);
        toast({
          title: "Sync failed",
          description: error.message || "Failed to sync menu from POS.",
          variant: "destructive",
        });
      }
    }, 2800);
  };

  // Store selector component
  const StoreSelector = () => (
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
  );

  // Progress display component
  const ProgressDisplay = ({ title }: { title: string }) => (
    <Card>
      <CardContent className="text-center py-8">
        <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin mb-4" />
        <CardTitle className="text-lg mb-4">{title}</CardTitle>
        <div className="space-y-2 text-left max-w-xs mx-auto">
          {progressSteps.map((step, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              {step.completed ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : step.active ? (
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-muted" />
              )}
              <span className={step.completed ? 'text-muted-foreground' : step.active ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Success display component
  const SuccessDisplay = () => (
    <Card>
      <CardContent className="text-center py-8">
        <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
        <CardTitle className="text-lg mb-2">Menu Imported Successfully!</CardTitle>
        <CardDescription className="space-y-2">
          <p><strong>Menu:</strong> {uploadResult?.menuName}</p>
          <p><strong>Items imported:</strong> {uploadResult?.itemCount}</p>
          {uploadResult?.categories && (
            <p><strong>Categories:</strong> {uploadResult.categories}</p>
          )}
          <p className="text-xs text-muted-foreground mt-4">
            You can now view and edit the imported menu in your menu list.
          </p>
        </CardDescription>
        <div className="flex gap-2 mt-4">
          <Button onClick={resetState} variant="outline" className="flex-1">
            Import Another
          </Button>
          <Button onClick={handleClose} className="flex-1">
            Done
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Error display component
  const ErrorDisplay = () => (
    <Card>
      <CardContent className="text-center py-8">
        <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
        <CardTitle className="text-lg mb-2">Import Failed</CardTitle>
        <CardDescription className="space-y-2">
          <p className="text-red-600">{uploadResult?.error}</p>
          <p className="text-xs text-muted-foreground mt-4">
            Please try again or contact support if the issue persists.
          </p>
        </CardDescription>
        <div className="flex gap-2 mt-4">
          <Button onClick={resetState} variant="outline" className="flex-1">
            Try Again
          </Button>
          <Button onClick={handleClose} variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full relative">
          <FileText className="w-4 h-4 mr-2" />
          Import Menu
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            BETA
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Menu</DialogTitle>
          <DialogDescription>
            Import menus from multiple sources - PDF files, web links, or your POS system.
          </DialogDescription>
        </DialogHeader>

        {uploadStatus === 'uploading' && (
          <ProgressDisplay title={
            activeTab === 'pdf' ? 'Processing PDF...' :
            activeTab === 'weblink' ? 'Analyzing Website...' :
            `Syncing with ${toastPOS.name}...`
          } />
        )}

        {uploadStatus === 'success' && <SuccessDisplay />}
        {uploadStatus === 'error' && <ErrorDisplay />}

        {uploadStatus === 'idle' && (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ImportTab)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-12 p-1.5 bg-muted/80 rounded-xl gap-1">
              <TabsTrigger 
                value="pdf" 
                className="text-xs sm:text-sm rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <FileText className="w-4 h-4 mr-1 sm:mr-2" />
                PDF
              </TabsTrigger>
              <TabsTrigger 
                value="weblink" 
                className="text-xs sm:text-sm rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Globe className="w-4 h-4 mr-1 sm:mr-2" />
                Web Link
              </TabsTrigger>
              <TabsTrigger 
                value="pos" 
                className="text-xs sm:text-sm rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <RefreshCw className="w-4 h-4 mr-1 sm:mr-2" />
                POS
              </TabsTrigger>
            </TabsList>

            {/* PDF Upload Tab */}
            <TabsContent value="pdf" className="mt-4">
              <Card>
                <CardHeader className="text-center pb-2">
                  <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                  <CardTitle className="text-base">Upload PDF Menu</CardTitle>
                  <CardDescription className="text-xs">
                    Our AI will extract menu items, prices, and descriptions automatically.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <StoreSelector />
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer cursor-pointer text-sm"
                  />
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Supported format: PDF (max 10MB)</p>
                    <p>• Best results with text-based PDFs</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Web Link Tab */}
            <TabsContent value="weblink" className="mt-4">
              <Card>
                <CardHeader className="text-center pb-2">
                  <Globe className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                  <CardTitle className="text-base">Import from Website</CardTitle>
                  <CardDescription className="text-xs">
                    Enter a URL and our AI will scrape the menu structure, items, and images.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="menu-url">Menu URL</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="menu-url"
                          type="url"
                          placeholder="https://restaurant.com/menu"
                          value={webUrl}
                          onChange={(e) => setWebUrl(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                  <StoreSelector />
                  <Button onClick={handleWebLinkImport} className="w-full">
                    <Globe className="w-4 h-4 mr-2" />
                    Analyze & Import Menu
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* POS Import Tab */}
            <TabsContent value="pos" className="mt-4">
              <Card>
                <CardHeader className="text-center pb-2">
                  <RefreshCw className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                  <CardTitle className="text-base">POS Import</CardTitle>
                  <CardDescription className="text-xs">
                    Sync your menu directly from connected POS systems.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <StoreSelector />
                  
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                    <div className="flex items-center gap-3">
                      <img 
                        src={toastPOS.logo} 
                        alt="Toast POS" 
                        className="h-8 w-auto object-contain"
                      />
                      <div>
                        <p className="font-medium text-sm">{toastPOS.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Last synced: {toastPOS.lastSync}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                        Connected
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePOSSync(toastPOS.id)}
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Sync
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="font-medium text-blue-700 mb-1">💡 Note</p>
                    <p className="text-blue-600">
                      POS import requires full read/write integration with your POS provider. Contact support to set up new integrations.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};
