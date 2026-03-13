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

// Windrose Restaurant - Wood-fired hearth cooking, Spanish-inspired
export const brotherFoxModifierGroups: ModifierGroup[] = [
  {
    id: "cooking-styles",
    name: "Cooking Style",
    description: "How would you like it prepared?",
    required: false,
    multipleSelection: false,
    options: [
      { id: "wood-fired", name: "Wood-Fired", price: 0, isDefault: true },
      { id: "charbroiled", name: "Charbroiled", price: 0 },
      { id: "pan-seared", name: "Pan-Seared", price: 0 },
      { id: "grilled", name: "Open Flame Grilled", price: 1.0 },
    ],
  },
  {
    id: "proteins",
    name: "Add Protein",
    description: "Premium wood-fired proteins",
    required: false,
    multipleSelection: true,
    maxSelections: 2,
    options: [
      { id: "chorizo", name: "Spanish Chorizo", price: 5.0 },
      { id: "prawns", name: "Gulf Prawns", price: 8.0 },
      { id: "chicken", name: "Free-Range Chicken", price: 6.0 },
      { id: "steak", name: "Ribeye Steak", price: 12.0 },
      { id: "oysters", name: "Wood-Fired Oysters (6)", price: 15.0 },
    ],
  },
  {
    id: "spanish-sides",
    name: "Spanish Sides",
    description: "Traditional accompaniments",
    required: false,
    multipleSelection: true,
    maxSelections: 3,
    options: [
      { id: "patatas-bravas", name: "Patatas Bravas", price: 6.0 },
      { id: "pimientos", name: "Pimientos de Padrón", price: 5.0 },
      { id: "manchego", name: "Manchego & Marcona Almonds", price: 8.0 },
      { id: "pan-con-tomate", name: "Pan con Tomate", price: 4.0 },
      { id: "olives", name: "Marinated Olives", price: 4.0 },
    ],
  },
  {
    id: "sauces",
    name: "House Sauces",
    description: "Made fresh daily",
    required: false,
    multipleSelection: true,
    maxSelections: 2,
    options: [
      { id: "romesco", name: "Romesco", price: 2.0 },
      { id: "aioli", name: "Garlic Aioli", price: 1.5 },
      { id: "chimichurri", name: "Chimichurri", price: 2.0 },
      { id: "salsa-verde", name: "Salsa Verde", price: 2.0 },
    ],
  },
];

// Tiki Bar - Cocktail bar focused
export const sisterHenModifierGroups: ModifierGroup[] = [
  {
    id: "spirit-upgrades",
    name: "Spirit Upgrade",
    description: "Premium spirit selections",
    required: false,
    multipleSelection: false,
    options: [
      { id: "well", name: "Well Spirit", price: 0, isDefault: true },
      { id: "call", name: "Call Spirit", price: 3.0 },
      { id: "premium", name: "Premium Spirit", price: 6.0 },
      { id: "top-shelf", name: "Top Shelf", price: 10.0 },
    ],
  },
  {
    id: "cocktail-additions",
    name: "Cocktail Additions",
    description: "Customize your drink",
    required: false,
    multipleSelection: true,
    maxSelections: 3,
    options: [
      { id: "extra-shot", name: "Extra Shot", price: 4.0 },
      { id: "egg-white", name: "Egg White Foam", price: 1.5 },
      { id: "luxardo", name: "Luxardo Cherry", price: 2.0 },
      { id: "orange-twist", name: "Flamed Orange Twist", price: 1.0 },
      { id: "smoked", name: "Smoked Glass", price: 3.0 },
    ],
  },
  {
    id: "bar-snacks",
    name: "Bar Snacks",
    description: "Perfect pairings",
    required: false,
    multipleSelection: true,
    maxSelections: 4,
    options: [
      { id: "nuts", name: "Spiced Mixed Nuts", price: 5.0 },
      { id: "olives", name: "Castelvetrano Olives", price: 4.0 },
      { id: "cheese", name: "Cheese Board", price: 14.0 },
      { id: "charcuterie", name: "Charcuterie Selection", price: 16.0 },
      { id: "oysters", name: "Oysters on Ice (6)", price: 18.0 },
    ],
  },
  {
    id: "ice-preference",
    name: "Ice Preference",
    description: "Choose your ice",
    required: false,
    multipleSelection: false,
    options: [
      { id: "regular", name: "Regular Ice", price: 0, isDefault: true },
      { id: "large-cube", name: "Large Cube", price: 0 },
      { id: "sphere", name: "Ice Sphere", price: 1.0 },
      { id: "neat", name: "Neat (No Ice)", price: 0 },
    ],
  },
];

// Salty Rose Beach Bar - Breakfast/brunch focused
export const cousinWolfModifierGroups: ModifierGroup[] = [
  {
    id: "egg-styles",
    name: "Egg Style",
    description: "How would you like your eggs?",
    required: true,
    multipleSelection: false,
    options: [
      { id: "scrambled", name: "Scrambled", price: 0, isDefault: true },
      { id: "over-easy", name: "Over Easy", price: 0 },
      { id: "over-medium", name: "Over Medium", price: 0 },
      { id: "over-hard", name: "Over Hard", price: 0 },
      { id: "sunny", name: "Sunny Side Up", price: 0 },
      { id: "poached", name: "Poached", price: 0 },
    ],
  },
  {
    id: "breakfast-proteins",
    name: "Breakfast Proteins",
    description: "Add your favorite protein",
    required: false,
    multipleSelection: true,
    maxSelections: 3,
    options: [
      { id: "bacon", name: "Applewood Bacon", price: 4.0 },
      { id: "sausage", name: "House Sausage", price: 4.0 },
      { id: "ham", name: "Country Ham", price: 5.0 },
      { id: "salmon", name: "Smoked Salmon", price: 8.0 },
      { id: "chorizo", name: "Breakfast Chorizo", price: 5.0 },
    ],
  },
  {
    id: "brunch-sides",
    name: "Brunch Sides",
    description: "Complete your meal",
    required: false,
    multipleSelection: true,
    maxSelections: 3,
    options: [
      { id: "hash-browns", name: "Crispy Hash Browns", price: 4.0 },
      { id: "grits", name: "Stone-Ground Grits", price: 3.5 },
      { id: "toast", name: "Sourdough Toast", price: 2.5 },
      { id: "fruit", name: "Fresh Fruit", price: 5.0 },
      { id: "biscuit", name: "Buttermilk Biscuit", price: 3.0 },
    ],
  },
  {
    id: "coffee-options",
    name: "Coffee & Beverages",
    description: "Start your morning right",
    required: false,
    multipleSelection: true,
    maxSelections: 2,
    options: [
      { id: "drip-coffee", name: "Drip Coffee", price: 3.0 },
      { id: "espresso", name: "Espresso", price: 3.5 },
      { id: "latte", name: "Café Latte", price: 5.0 },
      { id: "cold-brew", name: "Cold Brew", price: 4.5 },
      { id: "mimosa", name: "Mimosa", price: 8.0 },
      { id: "bloody-mary", name: "Bloody Mary", price: 10.0 },
    ],
  },
];

// Default modifier groups for other stores
export const defaultModifierGroups: ModifierGroup[] = [
  {
    id: "sizes",
    name: "Size",
    description: "Choose your size",
    required: true,
    multipleSelection: false,
    options: [
      { id: "small", name: "Small", price: -2.0 },
      { id: "regular", name: "Regular", price: 0, isDefault: true },
      { id: "large", name: "Large", price: 3.0 },
    ],
  },
  {
    id: "toppings",
    name: "Extra Toppings",
    description: "Add extra toppings",
    required: false,
    multipleSelection: true,
    maxSelections: 5,
    options: [
      { id: "cheese", name: "Extra Cheese", price: 1.5 },
      { id: "bacon", name: "Bacon", price: 2.5 },
      { id: "mushrooms", name: "Mushrooms", price: 1.0 },
      { id: "onions", name: "Onions", price: 0.5 },
      { id: "pickles", name: "Pickles", price: 0.5 },
    ],
  },
  {
    id: "sauces",
    name: "Sauces",
    description: "Choose your sauce",
    required: false,
    multipleSelection: true,
    maxSelections: 2,
    options: [
      { id: "ketchup", name: "Ketchup", price: 0 },
      { id: "mustard", name: "Mustard", price: 0 },
      { id: "mayo", name: "Mayo", price: 0 },
      { id: "bbq", name: "BBQ Sauce", price: 0.5 },
      { id: "hot-sauce", name: "Hot Sauce", price: 0.5 },
    ],
  },
];

// Export modifier groups by store - Pensacola Beach Resort venues
export const storeModifierGroups: Record<string, ModifierGroup[]> = {
  "1": brotherFoxModifierGroups,
  "2": sisterHenModifierGroups,
  "3": cousinWolfModifierGroups,
  default: defaultModifierGroups,
};

export const getModifierGroupsForStore = (storeId: string): ModifierGroup[] => {
  return storeModifierGroups[storeId] || storeModifierGroups.default;
};
