export interface ModifierOption {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
}

export interface ModifierGroup {
  id: string;
  name: string;
  description?: string;
  required: boolean;
  multipleSelection: boolean;
  minSelections?: number;
  maxSelections?: number;
  options: ModifierOption[];
}

// Italian Restaurant Modifier Groups (Piazza)
export const piazzaModifierGroups: ModifierGroup[] = [
  {
    id: 'pasta-types',
    name: 'Pasta Type',
    description: 'Choose your preferred pasta',
    required: false,
    multipleSelection: false,
    options: [
      { id: 'spaghetti', name: 'Spaghetti', price: 0, isDefault: true },
      { id: 'linguine', name: 'Linguine', price: 0 },
      { id: 'penne', name: 'Penne', price: 0 },
      { id: 'fettuccine', name: 'Fettuccine', price: 1.00 },
      { id: 'ravioli', name: 'Ravioli', price: 3.00 },
      { id: 'gnocchi', name: 'Gnocchi', price: 2.50 }
    ]
  },
  {
    id: 'italian-cheeses',
    name: 'Extra Cheese',
    description: 'Add authentic Italian cheeses',
    required: false,
    multipleSelection: true,
    maxSelections: 3,
    options: [
      { id: 'parmigiano', name: 'Parmigiano-Reggiano', price: 2.50 },
      { id: 'pecorino', name: 'Pecorino Romano', price: 2.00 },
      { id: 'gorgonzola', name: 'Gorgonzola', price: 3.00 },
      { id: 'mozzarella-bufala', name: 'Buffalo Mozzarella', price: 4.00 },
      { id: 'ricotta', name: 'Fresh Ricotta', price: 2.00 }
    ]
  },
  {
    id: 'pizza-sizes',
    name: 'Pizza Size',
    description: 'Traditional Neapolitan sizes',
    required: true,
    multipleSelection: false,
    options: [
      { id: 'individual', name: 'Individual (10")', price: 0, isDefault: true },
      { id: 'medium', name: 'Medium (12")', price: 4.00 },
      { id: 'large', name: 'Large (14")', price: 8.00 }
    ]
  },
  {
    id: 'italian-proteins',
    name: 'Add Protein',
    description: 'Traditional Italian meats',
    required: false,
    multipleSelection: true,
    maxSelections: 2,
    options: [
      { id: 'prosciutto', name: 'Prosciutto di Parma', price: 5.00 },
      { id: 'pancetta', name: 'Pancetta', price: 3.50 },
      { id: 'salsiccia', name: 'Italian Sausage', price: 4.00 },
      { id: 'speck', name: 'Speck Alto Adige', price: 4.50 },
      { id: 'bresaola', name: 'Bresaola', price: 5.50 }
    ]
  },
  {
    id: 'italian-sides',
    name: 'Contorni (Sides)',
    description: 'Traditional Italian sides',
    required: false,
    multipleSelection: true,
    maxSelections: 2,
    options: [
      { id: 'bruschetta', name: 'Bruschetta', price: 6.00 },
      { id: 'antipasto', name: 'Mixed Antipasto', price: 8.00 },
      { id: 'olive-tapenade', name: 'Olive Tapenade', price: 4.00 },
      { id: 'focaccia', name: 'Rosemary Focaccia', price: 5.00 }
    ]
  }
];

// Seafood Restaurant Modifier Groups (Sal de Mar)
export const salDeMarModifierGroups: ModifierGroup[] = [
  {
    id: 'cooking-styles',
    name: 'Cooking Style',
    description: 'How would you like your seafood prepared?',
    required: true,
    multipleSelection: false,
    options: [
      { id: 'grilled', name: 'Grilled', price: 0, isDefault: true },
      { id: 'blackened', name: 'Blackened Cajun', price: 1.00 },
      { id: 'pan-seared', name: 'Pan-Seared', price: 0 },
      { id: 'broiled', name: 'Broiled with Herbs', price: 0 },
      { id: 'fried', name: 'Beer Battered & Fried', price: 1.50 },
      { id: 'steamed', name: 'Steamed', price: 0 }
    ]
  },
  {
    id: 'seafood-sauces',
    name: 'Signature Sauces',
    description: 'House-made sauces to complement your dish',
    required: false,
    multipleSelection: true,
    maxSelections: 2,
    options: [
      { id: 'lemon-butter', name: 'Lemon Herb Butter', price: 2.00 },
      { id: 'garlic-white-wine', name: 'Garlic White Wine', price: 2.50 },
      { id: 'mango-salsa', name: 'Fresh Mango Salsa', price: 3.00 },
      { id: 'cocktail-sauce', name: 'House Cocktail Sauce', price: 1.50 },
      { id: 'remoulade', name: 'Creole Remoulade', price: 2.00 },
      { id: 'mignonette', name: 'Classic Mignonette', price: 1.50 },
      { id: 'tartar', name: 'House Tartar Sauce', price: 1.50 }
    ]
  },
  {
    id: 'lobster-sizes',
    name: 'Lobster Size',
    description: 'Fresh Maine lobster by weight',
    required: true,
    multipleSelection: false,
    options: [
      { id: '1-1.25lb', name: '1 - 1.25 lbs', price: 0, isDefault: true },
      { id: '1.25-1.5lb', name: '1.25 - 1.5 lbs', price: 8.00 },
      { id: '1.5-2lb', name: '1.5 - 2 lbs', price: 15.00 },
      { id: '2lb-plus', name: '2+ lbs (Market Price)', price: 25.00 }
    ]
  },
  {
    id: 'seafood-sides',
    name: 'Coastal Sides',
    description: 'Perfect accompaniments to your seafood',
    required: false,
    multipleSelection: true,
    maxSelections: 3,
    options: [
      { id: 'garlic-mashed', name: 'Garlic Mashed Potatoes', price: 4.00 },
      { id: 'wild-rice', name: 'Wild Rice Pilaf', price: 3.50 },
      { id: 'grilled-asparagus', name: 'Grilled Asparagus', price: 5.00 },
      { id: 'coleslaw', name: 'Fresh Coleslaw', price: 3.00 },
      { id: 'corn-on-cob', name: 'Corn on the Cob', price: 4.00 },
      { id: 'seasonal-vegetables', name: 'Seasonal Vegetables', price: 4.50 }
    ]
  },
  {
    id: 'spice-levels',
    name: 'Spice Level',
    description: 'How spicy would you like it?',
    required: false,
    multipleSelection: false,
    options: [
      { id: 'mild', name: 'Mild', price: 0, isDefault: true },
      { id: 'medium', name: 'Medium', price: 0 },
      { id: 'hot', name: 'Hot', price: 0 },
      { id: 'fire', name: 'Carolina Reaper (Fire!)', price: 1.00 }
    ]
  }
];

// Fast Casual Modifier Groups (Red Fish Blue Fish)
export const redFishBlueFishModifierGroups: ModifierGroup[] = [
  {
    id: 'bowl-bases',
    name: 'Bowl Base',
    description: 'Choose your healthy base',
    required: true,
    multipleSelection: false,
    options: [
      { id: 'sushi-rice', name: 'Sushi Rice', price: 0, isDefault: true },
      { id: 'brown-rice', name: 'Brown Rice', price: 0 },
      { id: 'quinoa', name: 'Quinoa', price: 1.50 },
      { id: 'mixed-greens', name: 'Mixed Greens', price: 0 },
      { id: 'cauliflower-rice', name: 'Cauliflower Rice', price: 2.00 },
      { id: 'half-rice-greens', name: 'Half Rice, Half Greens', price: 0 }
    ]
  },
  {
    id: 'fresh-proteins',
    name: 'Additional Protein',
    description: 'Add more protein to your bowl',
    required: false,
    multipleSelection: true,
    maxSelections: 2,
    options: [
      { id: 'extra-tuna', name: 'Extra Ahi Tuna', price: 6.00 },
      { id: 'grilled-shrimp', name: 'Grilled Shrimp', price: 5.00 },
      { id: 'tofu', name: 'Marinated Tofu', price: 3.00 },
      { id: 'edamame', name: 'Edamame', price: 2.50 },
      { id: 'hard-boiled-egg', name: 'Hard-Boiled Egg', price: 2.00 }
    ]
  },
  {
    id: 'fresh-toppings',
    name: 'Fresh Toppings',
    description: 'Build your perfect bowl',
    required: false,
    multipleSelection: true,
    maxSelections: 5,
    options: [
      { id: 'avocado', name: 'Fresh Avocado', price: 2.00 },
      { id: 'cucumber', name: 'Cucumber', price: 1.00 },
      { id: 'pickled-ginger', name: 'Pickled Ginger', price: 0.50 },
      { id: 'seaweed-salad', name: 'Seaweed Salad', price: 2.50 },
      { id: 'mango', name: 'Fresh Mango', price: 2.00 },
      { id: 'radish', name: 'Pickled Radish', price: 1.00 },
      { id: 'sesame-seeds', name: 'Sesame Seeds', price: 0.50 },
      { id: 'nori', name: 'Nori Sheets', price: 1.00 }
    ]
  },
  {
    id: 'healthy-sauces',
    name: 'Signature Sauces',
    description: 'House-made healthy sauces',
    required: false,
    multipleSelection: true,
    maxSelections: 2,
    options: [
      { id: 'spicy-mayo', name: 'Spicy Mayo', price: 0.50 },
      { id: 'ponzu', name: 'Citrus Ponzu', price: 0.50 },
      { id: 'sesame-ginger', name: 'Sesame Ginger', price: 0.50 },
      { id: 'sriracha-aioli', name: 'Sriracha Aioli', price: 0.75 },
      { id: 'wasabi-cream', name: 'Wasabi Cream', price: 1.00 },
      { id: 'tahini', name: 'Lemon Tahini', price: 0.75 }
    ]
  },
  {
    id: 'portion-sizes',
    name: 'Portion Size',
    description: 'Choose your portion',
    required: false,
    multipleSelection: false,
    options: [
      { id: 'regular', name: 'Regular', price: 0, isDefault: true },
      { id: 'large', name: 'Large (+50% more)', price: 4.00 },
      { id: 'small', name: 'Small Bowl', price: -3.00 }
    ]
  }
];

// Default modifier groups for other stores
export const defaultModifierGroups: ModifierGroup[] = [
  {
    id: 'sizes',
    name: 'Size',
    description: 'Choose your size',
    required: true,
    multipleSelection: false,
    options: [
      { id: 'small', name: 'Small', price: -2.00 },
      { id: 'regular', name: 'Regular', price: 0, isDefault: true },
      { id: 'large', name: 'Large', price: 3.00 }
    ]
  },
  {
    id: 'toppings',
    name: 'Extra Toppings',
    description: 'Add extra toppings',
    required: false,
    multipleSelection: true,
    maxSelections: 5,
    options: [
      { id: 'cheese', name: 'Extra Cheese', price: 1.50 },
      { id: 'bacon', name: 'Bacon', price: 2.50 },
      { id: 'mushrooms', name: 'Mushrooms', price: 1.00 },
      { id: 'onions', name: 'Onions', price: 0.50 },
      { id: 'pickles', name: 'Pickles', price: 0.50 }
    ]
  },
  {
    id: 'sauces',
    name: 'Sauces',
    description: 'Choose your sauce',
    required: false,
    multipleSelection: true,
    maxSelections: 2,
    options: [
      { id: 'ketchup', name: 'Ketchup', price: 0 },
      { id: 'mustard', name: 'Mustard', price: 0 },
      { id: 'mayo', name: 'Mayo', price: 0 },
      { id: 'bbq', name: 'BBQ Sauce', price: 0.50 },
      { id: 'hot-sauce', name: 'Hot Sauce', price: 0.50 }
    ]
  }
];

// Export modifier groups by store
export const storeModifierGroups: Record<string, ModifierGroup[]> = {
  '1': piazzaModifierGroups,
  '2': salDeMarModifierGroups,
  '3': redFishBlueFishModifierGroups,
  default: defaultModifierGroups
};

export const getModifierGroupsForStore = (storeId: string): ModifierGroup[] => {
  return storeModifierGroups[storeId] || storeModifierGroups.default;
};