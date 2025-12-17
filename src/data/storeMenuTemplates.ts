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

// Brother Fox - Wood-fired hearth restaurant
const brotherFoxMenu: StoreMenuTemplate = {
  storeId: '1',
  storeName: 'Brother Fox',
  menuName: 'Wood-Fired American Cuisine',
  description: 'Contemporary shared plates and seafood from our wood-fired hearth.',
  categories: [
    {
      id: 'snacks',
      name: 'Snacks & Small Plates',
      items: [
        {
          id: 'pan-con-tomate',
          name: 'Pan Con Tomate',
          description: 'Grilled bread with fresh tomato, olive oil, and sea salt',
          price: 8.00,
          modifierGroups: []
        },
        {
          id: 'shishito-peppers',
          name: 'Shishito Peppers',
          description: 'Blistered peppers with sea salt and citrus aioli',
          price: 13.00,
          modifierGroups: ['spice-levels']
        },
        {
          id: 'charbroiled-oysters',
          name: 'Charbroiled Oysters',
          description: 'Half dozen Gulf oysters with herb butter and parmesan',
          price: 18.00,
          modifierGroups: []
        },
        {
          id: 'snapper-ceviche',
          name: 'Snapper Ceviche',
          description: 'Fresh Gulf snapper with citrus, jalapeño, and tortilla chips',
          price: 16.00,
          modifierGroups: ['spice-levels']
        },
        {
          id: 'drunken-goat-cheese',
          name: 'Drunken Goat Cheese',
          description: 'Wine-soaked goat cheese with honey, marcona almonds, and crostini',
          price: 14.00,
          modifierGroups: []
        }
      ]
    },
    {
      id: 'charcuterie',
      name: 'Charcuterie & Boards',
      items: [
        {
          id: 'charcuterie-board',
          name: 'Charcuterie Board',
          description: 'Selection of cured meats, aged cheeses, pickled vegetables, and accompaniments',
          price: 32.00,
          modifierGroups: []
        },
        {
          id: 'smoked-mushroom-tartare',
          name: 'Smoked Mushroom Tartare',
          description: 'Hearth-smoked mushrooms with capers, shallots, and toast points',
          price: 15.00,
          modifierGroups: []
        }
      ]
    },
    {
      id: 'salads',
      name: 'Salads',
      items: [
        {
          id: 'elote-salad',
          name: 'Elote Salad',
          description: 'Grilled corn, cotija cheese, lime crema, and cilantro',
          price: 12.00,
          modifierGroups: []
        },
        {
          id: 'the-wedge',
          name: 'The Wedge',
          description: 'Iceberg lettuce, blue cheese crumbles, bacon, and cherry tomatoes',
          price: 14.00,
          modifierGroups: []
        }
      ]
    },
    {
      id: 'wood-fired-mains',
      name: 'Wood-Fired Mains',
      items: [
        {
          id: 'grilled-octopus',
          name: 'Grilled Octopus',
          description: 'Tender octopus with romesco sauce, fingerling potatoes, and charred lemon',
          price: 26.00,
          modifierGroups: []
        },
        {
          id: 'skirt-steak-asada',
          name: 'Prime Skirt Steak Asada',
          description: 'Wood-fired skirt steak with chimichurri and roasted vegetables',
          price: 38.00,
          modifierGroups: ['cooking-styles']
        },
        {
          id: 'seafood-paella',
          name: 'Seafood Paella',
          description: 'Saffron rice with mussels, clams, shrimp, and chorizo (serves 2)',
          price: 56.00,
          modifierGroups: []
        },
        {
          id: 'wood-fired-pork-chop',
          name: 'Wood-Fired Pork Chop',
          description: 'Bone-in pork chop with apple mostarda and roasted root vegetables',
          price: 34.00,
          modifierGroups: ['cooking-styles']
        },
        {
          id: 'whole-grilled-fish',
          name: 'Whole Grilled Fish',
          description: 'Daily catch, wood-fired with herbs, lemon, and olive oil',
          price: 42.00,
          modifierGroups: []
        }
      ]
    },
    {
      id: 'desserts',
      name: 'Desserts',
      items: [
        {
          id: 'mocha-torte',
          name: 'Mocha Torte',
          description: 'Rich chocolate and espresso torte with whipped cream',
          price: 12.00,
          modifierGroups: []
        },
        {
          id: 'churros',
          name: 'Churros',
          description: 'Warm churros with chocolate sauce and dulce de leche',
          price: 10.00,
          modifierGroups: []
        }
      ]
    }
  ]
};

// Sister Hen - Speakeasy bar
const sisterHenMenu: StoreMenuTemplate = {
  storeId: '2',
  storeName: 'Sister Hen',
  menuName: 'Craft Cocktails & Small Bites',
  description: 'Prohibition-era inspired cocktails and elevated bar snacks.',
  categories: [
    {
      id: 'signature-cocktails',
      name: 'Signature Cocktails',
      items: [
        {
          id: 'sister-hen-old-fashioned',
          name: 'Sister Hen Old Fashioned',
          description: 'Bourbon, orange bitters, demerara, and smoked cherry',
          price: 14.00,
          modifierGroups: []
        },
        {
          id: 'lavender-bee',
          name: 'The Lavender Bee',
          description: 'Gin, lavender honey, lemon, and egg white',
          price: 15.00,
          modifierGroups: []
        },
        {
          id: 'midnight-garden',
          name: 'Midnight Garden',
          description: 'Mezcal, cucumber, jalapeño, and elderflower',
          price: 16.00,
          modifierGroups: ['spice-levels']
        },
        {
          id: 'paper-plane',
          name: 'Paper Plane',
          description: 'Bourbon, Aperol, Amaro Nonino, and fresh lemon',
          price: 14.00,
          modifierGroups: []
        }
      ]
    },
    {
      id: 'classics',
      name: 'Classic Cocktails',
      items: [
        {
          id: 'manhattan',
          name: 'Manhattan',
          description: 'Rye whiskey, sweet vermouth, and Angostura bitters',
          price: 13.00,
          modifierGroups: []
        },
        {
          id: 'martini',
          name: 'Classic Martini',
          description: 'Gin or vodka with dry vermouth and olive or twist',
          price: 13.00,
          modifierGroups: []
        },
        {
          id: 'negroni',
          name: 'Negroni',
          description: 'Gin, Campari, and sweet vermouth',
          price: 13.00,
          modifierGroups: []
        }
      ]
    },
    {
      id: 'bar-snacks',
      name: 'Bar Snacks',
      items: [
        {
          id: 'deviled-eggs',
          name: 'Deviled Eggs',
          description: 'Classic preparation with smoked paprika and chives',
          price: 9.00,
          modifierGroups: []
        },
        {
          id: 'spiced-nuts',
          name: 'Spiced Nuts',
          description: 'House-roasted mixed nuts with rosemary and sea salt',
          price: 7.00,
          modifierGroups: []
        },
        {
          id: 'olives-pickles',
          name: 'Olives & Pickles',
          description: 'House-marinated olives and pickled vegetables',
          price: 8.00,
          modifierGroups: []
        },
        {
          id: 'cheese-plate',
          name: 'Cheese Plate',
          description: 'Selection of artisan cheeses with honeycomb and crackers',
          price: 18.00,
          modifierGroups: []
        }
      ]
    }
  ]
};

// Cousin Wolf - Breakfast food truck
const cousinWolfMenu: StoreMenuTemplate = {
  storeId: '3',
  storeName: 'Cousin Wolf',
  menuName: 'Breakfast & Brunch',
  description: 'Grab-and-go breakfast from our food truck, open mornings only.',
  categories: [
    {
      id: 'breakfast-sandwiches',
      name: 'Breakfast Sandwiches',
      items: [
        {
          id: 'wolf-sandwich',
          name: 'The Wolf',
          description: 'Scrambled eggs, bacon, cheddar, and chipotle aioli on brioche',
          price: 10.00,
          modifierGroups: ['egg-styles']
        },
        {
          id: 'veggie-wolf',
          name: 'Veggie Wolf',
          description: 'Scrambled eggs, avocado, tomato, and swiss on sourdough',
          price: 9.00,
          modifierGroups: ['egg-styles']
        },
        {
          id: 'sausage-biscuit',
          name: 'Sausage Biscuit',
          description: 'House-made sausage patty with egg and cheese on buttermilk biscuit',
          price: 8.00,
          modifierGroups: ['egg-styles']
        }
      ]
    },
    {
      id: 'breakfast-tacos',
      name: 'Breakfast Tacos',
      items: [
        {
          id: 'chorizo-taco',
          name: 'Chorizo & Egg Taco',
          description: 'Scrambled eggs with chorizo, queso fresco, and salsa verde',
          price: 5.00,
          modifierGroups: ['spice-levels']
        },
        {
          id: 'bacon-potato-taco',
          name: 'Bacon & Potato Taco',
          description: 'Crispy bacon, breakfast potatoes, egg, and cheddar',
          price: 5.00,
          modifierGroups: []
        },
        {
          id: 'migas-taco',
          name: 'Migas Taco',
          description: 'Eggs scrambled with tortilla strips, peppers, and pico de gallo',
          price: 5.00,
          modifierGroups: ['spice-levels']
        }
      ]
    },
    {
      id: 'sweet-treats',
      name: 'Sweet Treats',
      items: [
        {
          id: 'french-toast-sticks',
          name: 'French Toast Sticks',
          description: 'Cinnamon-dusted with maple syrup for dipping',
          price: 7.00,
          modifierGroups: []
        },
        {
          id: 'banana-bread',
          name: 'House Banana Bread',
          description: 'Toasted slice with honey butter',
          price: 4.00,
          modifierGroups: []
        },
        {
          id: 'muffin',
          name: 'Daily Muffin',
          description: 'Ask about today\'s flavor',
          price: 3.50,
          modifierGroups: []
        }
      ]
    },
    {
      id: 'drinks',
      name: 'Drinks',
      items: [
        {
          id: 'drip-coffee',
          name: 'Drip Coffee',
          description: 'Locally roasted, served hot or iced',
          price: 3.00,
          modifierGroups: []
        },
        {
          id: 'cold-brew',
          name: 'Cold Brew',
          description: '16-hour steeped cold brew coffee',
          price: 4.50,
          modifierGroups: []
        },
        {
          id: 'fresh-oj',
          name: 'Fresh Orange Juice',
          description: 'Freshly squeezed Florida oranges',
          price: 5.00,
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
  '1': brotherFoxMenu,
  '2': sisterHenMenu,
  '3': cousinWolfMenu,
  default: defaultMenu
};

export const getMenuForStore = (storeId: string): StoreMenuTemplate => {
  return storeMenuTemplates[storeId] || storeMenuTemplates.default;
};

export const getAllStoreMenus = (): StoreMenuTemplate[] => {
  return Object.values(storeMenuTemplates).filter(menu => menu.storeId !== 'default');
};
