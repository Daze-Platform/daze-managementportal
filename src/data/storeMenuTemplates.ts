export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  modifierGroups: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface StoreMenuTemplate {
  storeId: string;
  storeName: string;
  menuName: string;
  description: string;
  categories: MenuCategory[];
}

// Italian Restaurant Menu (for Piazza)
const piazzaMenu: StoreMenuTemplate = {
  storeId: '1',
  storeName: 'Piazza',
  menuName: 'Authentic Italian Cuisine',
  description: 'Traditional Italian dishes made with imported ingredients and family recipes passed down through generations.',
  categories: [
    {
      id: 'antipasti',
      name: 'Antipasti',
      items: [
        {
          id: 'bruschetta',
          name: 'Bruschetta Classica',
          description: 'Toasted Tuscan bread with fresh tomatoes, basil, garlic, and extra virgin olive oil',
          price: 12.99,
          modifierGroups: ['italian-sides']
        },
        {
          id: 'antipasto-platter',
          name: 'Antipasto della Casa',
          description: 'Selection of Italian cured meats, aged cheeses, olives, and roasted vegetables',
          price: 18.99,
          modifierGroups: ['pizza-sizes', 'italian-cheeses']
        },
        {
          id: 'carpaccio',
          name: 'Carpaccio di Manzo',
          description: 'Thinly sliced raw beef with arugula, capers, and lemon-parmesan dressing',
          price: 16.99,
          modifierGroups: []
        }
      ]
    },
    {
      id: 'pasta',
      name: 'Pasta Fresca',
      items: [
        {
          id: 'carbonara',
          name: 'Spaghetti alla Carbonara',
          description: 'House-made spaghetti with pancetta, egg yolk, pecorino romano, and black pepper',
          price: 19.99,
          modifierGroups: ['pasta-types', 'italian-cheeses', 'italian-proteins']
        },
        {
          id: 'bolognese',
          name: 'Tagliatelle Bolognese',
          description: 'Fresh ribbon pasta with traditional meat sauce simmered for 4 hours',
          price: 22.99,
          modifierGroups: ['pasta-types', 'italian-cheeses']
        },
        {
          id: 'pesto',
          name: 'Linguine al Pesto',
          description: 'Fresh linguine with basil pesto, pine nuts, and parmigiano-reggiano',
          price: 18.99,
          modifierGroups: ['pasta-types', 'italian-cheeses']
        },
        {
          id: 'seafood-pasta',
          name: 'Spaghetti alle Vongole',
          description: 'Spaghetti with fresh clams, white wine, garlic, and parsley',
          price: 26.99,
          modifierGroups: ['pasta-types', 'italian-sides']
        }
      ]
    },
    {
      id: 'pizza',
      name: 'Pizza Napoletana',
      items: [
        {
          id: 'margherita',
          name: 'Pizza Margherita',
          description: 'San Marzano tomatoes, buffalo mozzarella, fresh basil, and extra virgin olive oil',
          price: 18.99,
          modifierGroups: ['pizza-sizes', 'italian-cheeses', 'italian-sides']
        },
        {
          id: 'quattro-stagioni',
          name: 'Pizza Quattro Stagioni',
          description: 'Artichokes, mushrooms, prosciutto, and olives representing the four seasons',
          price: 24.99,
          modifierGroups: ['pizza-sizes', 'italian-cheeses']
        },
        {
          id: 'diavola',
          name: 'Pizza Diavola',
          description: 'Spicy salami, mozzarella, tomato sauce, and hot peppers',
          price: 21.99,
          modifierGroups: ['pizza-sizes', 'spice-levels']
        }
      ]
    },
    {
      id: 'secondi',
      name: 'Secondi Piatti',
      items: [
        {
          id: 'osso-buco',
          name: 'Osso Buco alla Milanese',
          description: 'Braised veal shanks with saffron risotto and gremolata',
          price: 34.99,
          modifierGroups: ['italian-sides']
        },
        {
          id: 'saltimbocca',
          name: 'Saltimbocca alla Romana',
          description: 'Veal medallions with prosciutto and sage in white wine sauce',
          price: 28.99,
          modifierGroups: ['italian-sides']
        }
      ]
    },
    {
      id: 'dolci',
      name: 'Dolci',
      items: [
        {
          id: 'tiramisu',
          name: 'Tiramisù della Casa',
          description: 'Traditional mascarpone dessert with espresso-soaked ladyfingers and cocoa',
          price: 9.99,
          modifierGroups: []
        },
        {
          id: 'panna-cotta',
          name: 'Panna Cotta ai Frutti di Bosco',
          description: 'Vanilla bean panna cotta with mixed berry compote',
          price: 8.99,
          modifierGroups: []
        }
      ]
    }
  ]
};

// Seafood Restaurant Menu (for Sal de Mar)
const salDeMarMenu: StoreMenuTemplate = {
  storeId: '2',
  storeName: 'Sal de Mar',
  menuName: 'Fresh Coastal Seafood',
  description: 'Ocean-to-table dining featuring the freshest catch and coastal-inspired dishes.',
  categories: [
    {
      id: 'raw-bar',
      name: 'Raw Bar',
      items: [
        {
          id: 'oysters',
          name: 'Fresh Oysters',
          description: 'Daily selection of East and West Coast oysters served with mignonette',
          price: 3.50,
          modifierGroups: ['seafood-sauces']
        },
        {
          id: 'shrimp-cocktail',
          name: 'Jumbo Shrimp Cocktail',
          description: 'Chilled jumbo shrimp with house-made cocktail sauce and lemon',
          price: 16.99,
          modifierGroups: ['italian-sides']
        },
        {
          id: 'ceviche',
          name: 'Citrus Ceviche',
          description: 'Fresh fish cured in lime juice with red onion, cilantro, and jalapeño',
          price: 14.99,
          modifierGroups: ['spice-levels', 'seafood-sauces']
        }
      ]
    },
    {
      id: 'soups-salads',
      name: 'Soups & Salads',
      items: [
        {
          id: 'clam-chowder',
          name: 'New England Clam Chowder',
          description: 'Creamy chowder with tender clams, potatoes, and smoky bacon',
          price: 9.99,
          modifierGroups: ['portion-sizes']
        },
        {
          id: 'seafood-salad',
          name: 'Grilled Seafood Salad',
          description: 'Mixed greens with grilled shrimp, scallops, and citrus vinaigrette',
          price: 22.99,
          modifierGroups: ['seafood-sauces', 'seafood-sides']
        }
      ]
    },
    {
      id: 'mains',
      name: 'Fresh Catch',
      items: [
        {
          id: 'lobster',
          name: 'Maine Lobster',
          description: 'Whole steamed lobster with drawn butter and lemon',
          price: 42.99,
          modifierGroups: ['lobster-sizes', 'seafood-sauces', 'seafood-sides']
        },
        {
          id: 'salmon',
          name: 'Atlantic Salmon',
          description: 'Grilled salmon with herb butter and seasonal vegetables',
          price: 26.99,
          modifierGroups: ['cooking-styles', 'seafood-sauces', 'seafood-sides']
        },
        {
          id: 'sea-bass',
          name: 'Chilean Sea Bass',
          description: 'Pan-seared with miso glaze and jasmine rice',
          price: 32.99,
          modifierGroups: ['cooking-styles', 'seafood-sauces', 'seafood-sides']
        },
        {
          id: 'fish-chips',
          name: 'Fish & Chips',
          description: 'Beer-battered cod with hand-cut fries and mushy peas',
          price: 18.99,
          modifierGroups: ['seafood-sauces', 'seafood-sides']
        },
        {
          id: 'paella',
          name: 'Seafood Paella',
          description: 'Traditional Spanish rice dish with mussels, clams, shrimp, and saffron',
          price: 28.99,
          modifierGroups: ['seafood-sides']
        }
      ]
    },
    {
      id: 'desserts',
      name: 'Sweet Endings',
      items: [
        {
          id: 'key-lime-pie',
          name: 'Key Lime Pie',
          description: 'Traditional Florida key lime pie with graham cracker crust',
          price: 8.99,
          modifierGroups: ['toppings']
        },
        {
          id: 'bread-pudding',
          name: 'Rum Bread Pudding',
          description: 'Warm bread pudding with rum sauce and vanilla ice cream',
          price: 9.99,
          modifierGroups: ['toppings']
        }
      ]
    }
  ]
};

// Fast Casual Menu (for Red Fish Blue Fish)
const redFishBlueFishMenu: StoreMenuTemplate = {
  storeId: '3',
  storeName: 'Red Fish Blue Fish',
  menuName: 'Fresh Fast Casual',
  description: 'Quick and healthy options featuring fresh fish, bowls, and grab-and-go items.',
  categories: [
    {
      id: 'bowls',
      name: 'Signature Bowls',
      items: [
        {
          id: 'poke-bowl',
          name: 'Ahi Tuna Poke Bowl',
          description: 'Fresh ahi tuna over sushi rice with avocado, cucumber, and spicy mayo',
          price: 16.99,
          modifierGroups: ['bowl-bases', 'fresh-toppings', 'healthy-sauces', 'spice-levels']
        },
        {
          id: 'salmon-bowl',
          name: 'Teriyaki Salmon Bowl',
          description: 'Grilled salmon with teriyaki glaze, steamed rice, and Asian vegetables',
          price: 15.99,
          modifierGroups: ['bowl-bases', 'fresh-toppings', 'healthy-sauces']
        },
        {
          id: 'quinoa-bowl',
          name: 'Mediterranean Quinoa Bowl',
          description: 'Quinoa with grilled vegetables, feta cheese, and lemon-herb dressing',
          price: 13.99,
          modifierGroups: ['bowl-bases', 'fresh-toppings', 'healthy-sauces']
        }
      ]
    },
    {
      id: 'tacos',
      name: 'Fish Tacos',
      items: [
        {
          id: 'fish-tacos',
          name: 'Baja Fish Tacos',
          description: 'Beer-battered fish with cabbage slaw and chipotle crema',
          price: 12.99,
          modifierGroups: ['spice-levels', 'healthy-sauces', 'fresh-toppings']
        },
        {
          id: 'shrimp-tacos',
          name: 'Grilled Shrimp Tacos',
          description: 'Seasoned shrimp with pico de gallo and avocado',
          price: 13.99,
          modifierGroups: ['spice-levels', 'healthy-sauces', 'fresh-toppings']
        }
      ]
    },
    {
      id: 'sandwiches',
      name: 'Sandwiches & Wraps',
      items: [
        {
          id: 'fish-sandwich',
          name: 'Crispy Fish Sandwich',
          description: 'Fried fish fillet with lettuce, tomato, and tartar sauce',
          price: 11.99,
          modifierGroups: ['healthy-sauces', 'fresh-toppings']
        },
        {
          id: 'tuna-wrap',
          name: 'Seared Tuna Wrap',
          description: 'Seared tuna with mixed greens and wasabi mayo in a spinach tortilla',
          price: 14.99,
          modifierGroups: ['healthy-sauces', 'fresh-toppings']
        }
      ]
    },
    {
      id: 'sides',
      name: 'Sides & Snacks',
      items: [
        {
          id: 'sweet-potato-fries',
          name: 'Sweet Potato Fries',
          description: 'Crispy sweet potato fries with sea salt',
          price: 6.99,
          modifierGroups: ['healthy-sauces']
        },
        {
          id: 'coleslaw',
          name: 'Fresh Coleslaw',
          description: 'Crisp cabbage and carrots with tangy dressing',
          price: 4.99,
          modifierGroups: []
        }
      ]
    }
  ]
};

// Default menu for new stores
const defaultMenu: StoreMenuTemplate = {
  storeId: 'default',
  storeName: 'Default Store',
  menuName: 'Sample Menu',
  description: 'A starter menu template with popular items to get you started.',
  categories: [
    {
      id: 'appetizers',
      name: 'Appetizers',
      items: [
        {
          id: 'wings',
          name: 'Buffalo Wings',
          description: 'Crispy wings with buffalo sauce and ranch dressing',
          price: 12.99,
          modifierGroups: ['sauces', 'spice-levels']
        },
        {
          id: 'nachos',
          name: 'Loaded Nachos',
          description: 'Tortilla chips with cheese, jalapeños, and sour cream',
          price: 10.99,
          modifierGroups: ['toppings']
        }
      ]
    },
    {
      id: 'mains',
      name: 'Main Courses',
      items: [
        {
          id: 'burger',
          name: 'Classic Burger',
          description: 'Beef patty with lettuce, tomato, and cheese',
          price: 15.99,
          modifierGroups: ['sizes', 'toppings', 'sauces']
        },
        {
          id: 'chicken',
          name: 'Grilled Chicken',
          description: 'Seasoned chicken breast with vegetables',
          price: 18.99,
          modifierGroups: ['sauces']
        }
      ]
    },
    {
      id: 'desserts',
      name: 'Desserts',
      items: [
        {
          id: 'cheesecake',
          name: 'Cheesecake',
          description: 'Creamy cheesecake with berry compote',
          price: 7.99,
          modifierGroups: ['toppings']
        }
      ]
    }
  ]
};

export const storeMenuTemplates: Record<string, StoreMenuTemplate> = {
  '1': piazzaMenu,
  '2': salDeMarMenu,
  '3': redFishBlueFishMenu,
  default: defaultMenu
};

export const getMenuForStore = (storeId: string): StoreMenuTemplate => {
  return storeMenuTemplates[storeId] || storeMenuTemplates.default;
};

export const getAllStoreMenus = (): StoreMenuTemplate[] => {
  return Object.values(storeMenuTemplates).filter(menu => menu.storeId !== 'default');
};