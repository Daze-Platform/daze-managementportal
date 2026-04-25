import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Globe, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStores } from "@/contexts/StoresContext";
import { useMenus, MenuItem } from "@/contexts/MenusContext";
import {
  ProgressDisplay,
  SuccessDisplay,
  ErrorDisplay,
  PDFUploadSection,
  WebLinkImportSection,
  POSImportSection,
} from "./MenuImportSubcomponents";

// Sample menu item templates for mock generation
const sampleMenuItems = {
  Appetizers: [
    {
      name: "Bruschetta",
      description: "Toasted bread with tomatoes, garlic, and fresh basil",
      priceRange: [8, 12],
      image: "/images/menu/salad.jpg",
    },
    {
      name: "Calamari Fritti",
      description: "Crispy fried calamari with lemon aioli",
      priceRange: [12, 16],
      image: "/images/menu/fish-tacos.jpg",
    },
    {
      name: "Soup of the Day",
      description: "Chef's daily selection of seasonal soup",
      priceRange: [6, 9],
      image: null,
    },
    {
      name: "Charcuterie Board",
      description: "Selection of cured meats, cheeses, and accompaniments",
      priceRange: [18, 24],
      image: null,
    },
    {
      name: "Shrimp Cocktail",
      description: "Chilled jumbo shrimp with cocktail sauce",
      priceRange: [14, 18],
      image: "/images/menu/grilled-salmon.jpg",
    },
  ],
  "Main Course": [
    {
      name: "Grilled Salmon",
      description: "Atlantic salmon with herb butter and seasonal vegetables",
      priceRange: [24, 32],
      image: "/images/menu/grilled-salmon.jpg",
    },
    {
      name: "Ribeye Steak",
      description: "12oz ribeye with garlic mashed potatoes and asparagus",
      priceRange: [32, 42],
      image: null,
    },
    {
      name: "Pasta Primavera",
      description: "Seasonal vegetables tossed with penne in light cream sauce",
      priceRange: [16, 22],
      image: null,
    },
    {
      name: "Chicken Parmesan",
      description: "Breaded chicken breast with marinara and melted mozzarella",
      priceRange: [18, 24],
      image: null,
    },
    {
      name: "Pan-Seared Duck",
      description:
        "Duck breast with cherry reduction and roasted root vegetables",
      priceRange: [28, 36],
      image: null,
    },
    {
      name: "Lobster Risotto",
      description: "Creamy arborio rice with fresh lobster and truffle oil",
      priceRange: [34, 42],
      image: null,
    },
  ],
  Sides: [
    {
      name: "Garlic Mashed Potatoes",
      description: "Creamy potatoes with roasted garlic",
      priceRange: [6, 9],
      image: null,
    },
    {
      name: "Grilled Asparagus",
      description: "Fresh asparagus with lemon and parmesan",
      priceRange: [7, 10],
      image: null,
    },
    {
      name: "House Salad",
      description: "Mixed greens with balsamic vinaigrette",
      priceRange: [6, 9],
      image: "/images/menu/house-salad.jpg",
    },
    {
      name: "Truffle Fries",
      description: "Crispy fries with truffle oil and parmesan",
      priceRange: [8, 12],
      image: null,
    },
  ],
  Desserts: [
    {
      name: "Tiramisu",
      description: "Classic Italian dessert with espresso and mascarpone",
      priceRange: [9, 12],
      image: null,
    },
    {
      name: "Chocolate Lava Cake",
      description:
        "Warm chocolate cake with molten center and vanilla ice cream",
      priceRange: [10, 14],
      image: null,
    },
    {
      name: "Crème Brûlée",
      description: "Vanilla custard with caramelized sugar crust",
      priceRange: [8, 11],
      image: null,
    },
    {
      name: "New York Cheesecake",
      description: "Classic cheesecake with berry compote",
      priceRange: [9, 12],
      image: "/images/menu/cheesecake.jpg",
    },
  ],
  Beverages: [
    {
      name: "Fresh Squeezed Juice",
      description: "Orange, grapefruit, or seasonal selection",
      priceRange: [5, 7],
      image: null,
    },
    {
      name: "Espresso",
      description: "Double shot of premium espresso",
      priceRange: [3, 5],
      image: null,
    },
    {
      name: "Craft Lemonade",
      description: "House-made lemonade with fresh mint",
      priceRange: [4, 6],
      image: null,
    },
    {
      name: "Iced Tea",
      description: "Fresh brewed black or green tea",
      priceRange: [3, 5],
      image: "/images/menu/iced-tea.jpg",
    },
  ],
  Cocktails: [
    {
      name: "Old Fashioned",
      description: "Bourbon, bitters, sugar, and orange peel",
      priceRange: [12, 16],
      image: "/images/menu/margarita-cocktail.jpg",
    },
    {
      name: "Margarita",
      description: "Tequila, lime juice, and triple sec",
      priceRange: [11, 15],
      image: "/images/menu/margarita-cocktail.jpg",
    },
    {
      name: "Espresso Martini",
      description: "Vodka, espresso, coffee liqueur",
      priceRange: [13, 17],
      image: null,
    },
    {
      name: "Mojito",
      description: "White rum, mint, lime, sugar, soda",
      priceRange: [11, 14],
      image: null,
    },
  ],
  Breakfast: [
    {
      name: "Eggs Benedict",
      description: "Poached eggs with hollandaise on English muffin",
      priceRange: [14, 18],
      image: null,
    },
    {
      name: "Avocado Toast",
      description: "Smashed avocado on sourdough with poached eggs",
      priceRange: [12, 16],
      image: null,
    },
    {
      name: "Belgian Waffles",
      description: "Fresh waffles with berries and maple syrup",
      priceRange: [11, 15],
      image: null,
    },
    {
      name: "Breakfast Burrito",
      description: "Scrambled eggs, cheese, chorizo, and salsa",
      priceRange: [13, 17],
      image: "/images/menu/tacos.jpg",
    },
  ],
};

// Toast POS integration
const toastPOS = {
  id: "toast",
  name: "Toast POS",
  logo: "/images/integrations/toast-logo.png",
  connected: true,
  lastSync: "2 hours ago",
};

// Generate a random price within range
const getRandomPrice = (range: number[]): number => {
  return (
    Math.round((range[0] + Math.random() * (range[1] - range[0])) * 100) / 100
  );
};

// Generate mock menu items from a "PDF"
const generateMockMenuItems = (
  fileName: string,
): { menuName: string; items: MenuItem[] } => {
  const menuName = fileName
    .replace(/\.pdf$/i, "")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const items: MenuItem[] = [];
  const categories = Object.keys(sampleMenuItems);

  const numCategories = 3 + Math.floor(Math.random() * 3);
  const selectedCategories = categories
    .sort(() => Math.random() - 0.5)
    .slice(0, numCategories);

  selectedCategories.forEach((category) => {
    const categoryItems =
      sampleMenuItems[category as keyof typeof sampleMenuItems];
    const numItems = 2 + Math.floor(Math.random() * 3);
    const selectedItems = categoryItems
      .sort(() => Math.random() - 0.5)
      .slice(0, numItems);

    selectedItems.forEach((item) => {
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
const generateMenuFromWebLink = (
  url: string,
): { menuName: string; items: MenuItem[]; categories: number } => {
  // Extract restaurant name from URL
  const urlParts = url.replace(/^https?:\/\//, "").split("/");
  const domain = urlParts[0].replace(/^www\./, "").split(".")[0];
  const menuName = domain.charAt(0).toUpperCase() + domain.slice(1) + " Menu";

  // Determine menu type based on URL patterns
  const urlLower = url.toLowerCase();
  let relevantCategories: string[] = [];

  if (urlLower.includes("breakfast") || urlLower.includes("brunch")) {
    relevantCategories = ["Breakfast", "Beverages"];
  } else if (
    urlLower.includes("bar") ||
    urlLower.includes("cocktail") ||
    urlLower.includes("drinks")
  ) {
    relevantCategories = ["Cocktails", "Beverages", "Appetizers"];
  } else if (urlLower.includes("italian") || urlLower.includes("pizza")) {
    relevantCategories = ["Appetizers", "Main Course", "Desserts"];
  } else {
    // Default: varied menu
    relevantCategories = [
      "Appetizers",
      "Main Course",
      "Sides",
      "Desserts",
      "Beverages",
    ];
  }

  const items: MenuItem[] = [];
  const numCategories = Math.min(
    relevantCategories.length,
    3 + Math.floor(Math.random() * 2),
  );
  const selectedCategories = relevantCategories.slice(0, numCategories);

  selectedCategories.forEach((category) => {
    const categoryItems =
      sampleMenuItems[category as keyof typeof sampleMenuItems];
    if (!categoryItems) return;

    const numItems = 3 + Math.floor(Math.random() * 3);
    const selectedItems = categoryItems
      .sort(() => Math.random() - 0.5)
      .slice(0, numItems);

    selectedItems.forEach((item) => {
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
const generateMenuFromPOS = (
  posId: string,
): { menuName: string; items: MenuItem[]; categories: number } => {
  const posNames: Record<string, string> = {
    toast: "Toast POS Menu",
    square: "Square Menu",
    clover: "Clover Menu",
    lightspeed: "Lightspeed Menu",
  };

  const menuName = posNames[posId] || "POS Menu";
  const items: MenuItem[] = [];

  // POS menus typically have more complete data
  const allCategories = [
    "Appetizers",
    "Main Course",
    "Sides",
    "Desserts",
    "Beverages",
  ];
  const numCategories = 4 + Math.floor(Math.random() * 2);
  const selectedCategories = allCategories.slice(0, numCategories);

  selectedCategories.forEach((category) => {
    const categoryItems =
      sampleMenuItems[category as keyof typeof sampleMenuItems];
    const numItems = 3 + Math.floor(Math.random() * 3);
    const selectedItems = categoryItems
      .sort(() => Math.random() - 0.5)
      .slice(0, numItems);

    selectedItems.forEach((item) => {
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

type ImportStatus = "idle" | "uploading" | "success" | "error";
type ImportTab = "pdf" | "weblink" | "pos";

export const MenuImport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ImportTab>("pdf");
  const [uploadStatus, setUploadStatus] = useState<ImportStatus>("idle");
  const [uploadResult, setUploadResult] = useState<{
    menuName?: string;
    itemCount?: number;
    categories?: number;
    error?: string;
  } | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [webUrl, setWebUrl] = useState("");
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([]);
  const [syncingPOS, setSyncingPOS] = useState<string | null>(null);

  const { toast } = useToast();
  const { stores } = useStores();
  const { addMenu } = useMenus();

  const resetState = () => {
    setUploadStatus("idle");
    setUploadResult(null);
    setProgressSteps([]);
    setSyncingPOS(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      resetState();
      setWebUrl("");
    }, 300);
  };

  // PDF Upload Handler
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    setUploadStatus("uploading");
    setProgressSteps([
      { label: "Reading PDF file...", completed: false, active: true },
      {
        label: "Extracting menu structure...",
        completed: false,
        active: false,
      },
      {
        label: "Processing items & prices...",
        completed: false,
        active: false,
      },
    ]);

    // Simulate processing with progress updates
    setTimeout(
      () =>
        setProgressSteps((prev) =>
          prev.map((s, i) =>
            i === 0
              ? { ...s, completed: true, active: false }
              : i === 1
                ? { ...s, active: true }
                : s,
          ),
        ),
      600,
    );
    setTimeout(
      () =>
        setProgressSteps((prev) =>
          prev.map((s, i) =>
            i === 1
              ? { ...s, completed: true, active: false }
              : i === 2
                ? { ...s, active: true }
                : s,
          ),
        ),
      1200,
    );

    setTimeout(async () => {
      try {
        const { menuName, items } = generateMockMenuItems(file.name);
        const storeId = selectedStoreId
          ? parseInt(selectedStoreId)
          : stores[0]?.id;

        await addMenu({
          name: menuName,
          description: `Imported from ${file.name}`,
          category: "restaurant",
          is_active: true,
          store_id: storeId,
          items: items,
        });

        setProgressSteps((prev) =>
          prev.map((s) => ({ ...s, completed: true, active: false })),
        );
        setUploadStatus("success");
        setUploadResult({ menuName, itemCount: items.length });

        toast({
          title: "Menu imported successfully!",
          description: `Imported "${menuName}" with ${items.length} items.`,
        });
      } catch (error: any) {
        setUploadStatus("error");
        setUploadResult({ error: error.message || "Failed to process PDF" });
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

    setUploadStatus("uploading");
    setProgressSteps([
      { label: "Connecting to website...", completed: false, active: true },
      { label: "Analyzing menu structure...", completed: false, active: false },
      {
        label: "Extracting categories & items...",
        completed: false,
        active: false,
      },
      {
        label: "Processing images & prices...",
        completed: false,
        active: false,
      },
    ]);

    // Simulate AI processing with progress updates
    setTimeout(
      () =>
        setProgressSteps((prev) =>
          prev.map((s, i) =>
            i === 0
              ? { ...s, completed: true, active: false }
              : i === 1
                ? { ...s, active: true }
                : s,
          ),
        ),
      800,
    );
    setTimeout(
      () =>
        setProgressSteps((prev) =>
          prev.map((s, i) =>
            i === 1
              ? { ...s, completed: true, active: false }
              : i === 2
                ? { ...s, active: true }
                : s,
          ),
        ),
      1600,
    );
    setTimeout(
      () =>
        setProgressSteps((prev) =>
          prev.map((s, i) =>
            i === 2
              ? { ...s, completed: true, active: false }
              : i === 3
                ? { ...s, active: true }
                : s,
          ),
        ),
      2400,
    );

    setTimeout(async () => {
      try {
        const { menuName, items, categories } = generateMenuFromWebLink(webUrl);
        const storeId = selectedStoreId
          ? parseInt(selectedStoreId)
          : stores[0]?.id;

        await addMenu({
          name: menuName,
          description: `Imported from ${webUrl}`,
          category: "restaurant",
          is_active: true,
          store_id: storeId,
          items: items,
        });

        setProgressSteps((prev) =>
          prev.map((s) => ({ ...s, completed: true, active: false })),
        );
        setUploadStatus("success");
        setUploadResult({ menuName, itemCount: items.length, categories });

        toast({
          title: "Menu imported successfully!",
          description: `Imported "${menuName}" with ${items.length} items from ${categories} categories.`,
        });
      } catch (error: any) {
        setUploadStatus("error");
        setUploadResult({ error: error.message || "Failed to scrape menu" });
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
    setUploadStatus("uploading");
    setProgressSteps([
      { label: "Connecting to POS...", completed: false, active: true },
      { label: "Fetching menu categories...", completed: false, active: false },
      {
        label: "Downloading items & modifiers...",
        completed: false,
        active: false,
      },
      { label: "Syncing pricing data...", completed: false, active: false },
    ]);

    // Simulate POS sync with progress updates
    setTimeout(
      () =>
        setProgressSteps((prev) =>
          prev.map((s, i) =>
            i === 0
              ? { ...s, completed: true, active: false }
              : i === 1
                ? { ...s, active: true }
                : s,
          ),
        ),
      700,
    );
    setTimeout(
      () =>
        setProgressSteps((prev) =>
          prev.map((s, i) =>
            i === 1
              ? { ...s, completed: true, active: false }
              : i === 2
                ? { ...s, active: true }
                : s,
          ),
        ),
      1400,
    );
    setTimeout(
      () =>
        setProgressSteps((prev) =>
          prev.map((s, i) =>
            i === 2
              ? { ...s, completed: true, active: false }
              : i === 3
                ? { ...s, active: true }
                : s,
          ),
        ),
      2100,
    );

    setTimeout(async () => {
      try {
        const { menuName, items, categories } = generateMenuFromPOS(posId);
        const storeId = selectedStoreId
          ? parseInt(selectedStoreId)
          : stores[0]?.id;

        await addMenu({
          name: menuName,
          description: `Synced from ${toastPOS.name}`,
          category: "restaurant",
          is_active: true,
          store_id: storeId,
          items: items,
        });

        setProgressSteps((prev) =>
          prev.map((s) => ({ ...s, completed: true, active: false })),
        );
        setUploadStatus("success");
        setUploadResult({ menuName, itemCount: items.length, categories });
        setSyncingPOS(null);

        toast({
          title: "POS menu synced!",
          description: `Imported "${menuName}" with ${items.length} items from ${toastPOS.name}.`,
        });
      } catch (error: any) {
        setUploadStatus("error");
        setUploadResult({ error: error.message || "Failed to sync POS" });
        setSyncingPOS(null);
        toast({
          title: "Sync failed",
          description: error.message || "Failed to sync menu from POS.",
          variant: "destructive",
        });
      }
    }, 2800);
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-10 flex-1 xs:flex-none relative">
          <FileText className="w-4 h-4 xs:mr-2" />
          <span className="hidden xs:inline">Import Menu</span>
          <span className="xs:hidden">Import</span>
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            BETA
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Menu</DialogTitle>
          <DialogDescription>
            Import menus from multiple sources - PDF files, web links, or your
            POS system.
          </DialogDescription>
        </DialogHeader>

        {uploadStatus === "uploading" && (
          <ProgressDisplay
            title={
              activeTab === "pdf"
                ? "Processing PDF..."
                : activeTab === "weblink"
                  ? "Analyzing Website..."
                  : `Syncing with ${toastPOS.name}...`
            }
            steps={progressSteps}
          />
        )}

        {uploadStatus === "success" && (
          <SuccessDisplay
            result={uploadResult}
            onImportAnother={resetState}
            onDone={handleClose}
          />
        )}
        {uploadStatus === "error" && (
          <ErrorDisplay
            result={uploadResult}
            onRetry={resetState}
            onCancel={handleClose}
          />
        )}

        {uploadStatus === "idle" && (
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as ImportTab)}
            className="w-full"
          >
            <TabsList
              variant="solid"
              size="lg"
              className="grid w-full grid-cols-3 gap-1"
            >
              <TabsTrigger value="pdf" variant="default" className="gap-2">
                <FileText className="w-4 h-4" />
                PDF
              </TabsTrigger>
              <TabsTrigger value="weblink" variant="default" className="gap-2">
                <Globe className="w-4 h-4" />
                Web Link
              </TabsTrigger>
              <TabsTrigger value="pos" variant="default" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                POS
              </TabsTrigger>
            </TabsList>

            {/* PDF Upload Tab */}
            <TabsContent value="pdf" className="mt-4">
              <PDFUploadSection
                selectedStoreId={selectedStoreId}
                onStoreChange={setSelectedStoreId}
                onFileUpload={handleFileUpload}
              />
            </TabsContent>

            {/* Web Link Tab */}
            <TabsContent value="weblink" className="mt-4">
              <WebLinkImportSection
                selectedStoreId={selectedStoreId}
                onStoreChange={setSelectedStoreId}
                webUrl={webUrl}
                onUrlChange={setWebUrl}
                onImport={handleWebLinkImport}
              />
            </TabsContent>

            {/* POS Import Tab */}
            <TabsContent value="pos" className="mt-4">
              <POSImportSection
                selectedStoreId={selectedStoreId}
                onStoreChange={setSelectedStoreId}
                syncingPOS={syncingPOS}
                onPOSSync={handlePOSSync}
                toastPOS={toastPOS}
              />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};
