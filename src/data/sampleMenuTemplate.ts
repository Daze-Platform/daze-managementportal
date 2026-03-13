export interface SampleMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  modifierGroups: string[];
}

export interface SampleMenuCategory {
  id: string;
  name: string;
  items: SampleMenuItem[];
}

export const sampleMenuTemplate: SampleMenuCategory[] = [
  {
    id: "appetizers",
    name: "Appetizers",
    items: [
      {
        id: "wings",
        name: "Buffalo Wings",
        description:
          "Crispy chicken wings tossed in our signature buffalo sauce, served with celery sticks and ranch dressing",
        price: 12.99,
        modifierGroups: ["sauces", "spice-level"],
      },
      {
        id: "nachos",
        name: "Loaded Nachos",
        description:
          "House-made tortilla chips topped with melted cheese, jalapeños, diced tomatoes, and sour cream",
        price: 10.99,
        modifierGroups: ["toppings"],
      },
      {
        id: "calamari",
        name: "Crispy Calamari",
        description:
          "Fresh squid rings lightly breaded and fried, served with marinara sauce and lemon wedges",
        price: 13.99,
        modifierGroups: ["sauces"],
      },
      {
        id: "bruschetta",
        name: "Classic Bruschetta",
        description:
          "Toasted artisan bread topped with fresh tomatoes, basil, garlic, and balsamic glaze",
        price: 8.99,
        modifierGroups: [],
      },
    ],
  },
  {
    id: "salads",
    name: "Fresh Salads",
    items: [
      {
        id: "caesar",
        name: "Caesar Salad",
        description:
          "Crisp romaine lettuce, house-made croutons, parmesan cheese, and our signature Caesar dressing",
        price: 11.99,
        modifierGroups: ["toppings"],
      },
      {
        id: "garden",
        name: "Garden Salad",
        description:
          "Mixed greens, cherry tomatoes, cucumbers, red onions, and your choice of dressing",
        price: 9.99,
        modifierGroups: ["sauces", "toppings"],
      },
      {
        id: "greek",
        name: "Greek Salad",
        description:
          "Fresh vegetables, olives, feta cheese, and oregano with olive oil and lemon dressing",
        price: 12.99,
        modifierGroups: ["toppings"],
      },
    ],
  },
  {
    id: "mains",
    name: "Main Courses",
    items: [
      {
        id: "burger",
        name: "Classic Cheeseburger",
        description:
          "Juicy beef patty with melted cheese, lettuce, tomato, onion, and pickles on a brioche bun",
        price: 15.99,
        modifierGroups: ["sizes", "toppings", "sauces"],
      },
      {
        id: "salmon",
        name: "Grilled Salmon",
        description:
          "Fresh Atlantic salmon grilled to perfection, served with seasonal vegetables and rice pilaf",
        price: 24.99,
        modifierGroups: ["sauces"],
      },
      {
        id: "pasta",
        name: "Spaghetti Carbonara",
        description:
          "Classic Italian pasta with pancetta, eggs, parmesan cheese, and black pepper",
        price: 18.99,
        modifierGroups: ["toppings"],
      },
      {
        id: "steak",
        name: "Ribeye Steak",
        description:
          "12oz premium ribeye grilled to your liking, served with mashed potatoes and seasonal vegetables",
        price: 32.99,
        modifierGroups: ["sauces", "toppings"],
      },
      {
        id: "chicken",
        name: "Herb Roasted Chicken",
        description:
          "Half chicken seasoned with fresh herbs, roasted and served with garlic mashed potatoes",
        price: 19.99,
        modifierGroups: ["sauces"],
      },
      {
        id: "fish-tacos",
        name: "Fish Tacos",
        description:
          "Three soft tacos with grilled fish, cabbage slaw, pico de gallo, and lime crema",
        price: 16.99,
        modifierGroups: ["spice-level", "sauces"],
      },
    ],
  },
  {
    id: "pizza",
    name: "Wood-Fired Pizza",
    items: [
      {
        id: "margherita",
        name: "Margherita Pizza",
        description:
          "San Marzano tomatoes, fresh mozzarella, basil, and extra virgin olive oil",
        price: 16.99,
        modifierGroups: ["sizes", "toppings"],
      },
      {
        id: "pepperoni",
        name: "Pepperoni Pizza",
        description:
          "Classic pepperoni with mozzarella cheese and our signature tomato sauce",
        price: 18.99,
        modifierGroups: ["sizes", "toppings"],
      },
      {
        id: "quattro-stagioni",
        name: "Quattro Stagioni",
        description:
          "Four seasons pizza with artichokes, mushrooms, ham, and olives",
        price: 21.99,
        modifierGroups: ["sizes", "toppings"],
      },
    ],
  },
  {
    id: "desserts",
    name: "Sweet Endings",
    items: [
      {
        id: "tiramisu",
        name: "Classic Tiramisu",
        description:
          "Traditional Italian dessert with coffee-soaked ladyfingers, mascarpone, and cocoa",
        price: 8.99,
        modifierGroups: [],
      },
      {
        id: "cheesecake",
        name: "New York Cheesecake",
        description:
          "Rich and creamy cheesecake with graham cracker crust and berry compote",
        price: 7.99,
        modifierGroups: ["toppings"],
      },
      {
        id: "chocolate-lava",
        name: "Chocolate Lava Cake",
        description:
          "Warm chocolate cake with a molten center, served with vanilla ice cream",
        price: 9.99,
        modifierGroups: ["toppings"],
      },
      {
        id: "gelato",
        name: "Artisan Gelato",
        description:
          "House-made gelato available in vanilla, chocolate, strawberry, and pistachio",
        price: 5.99,
        modifierGroups: [],
      },
    ],
  },
  {
    id: "beverages",
    name: "Beverages",
    items: [
      {
        id: "soft-drinks",
        name: "Soft Drinks",
        description:
          "Coca-Cola, Sprite, Orange Fanta, Diet Coke, and other refreshing sodas",
        price: 3.99,
        modifierGroups: ["sizes"],
      },
      {
        id: "fresh-juice",
        name: "Fresh Squeezed Juice",
        description:
          "Orange, apple, cranberry, or pineapple juice made fresh daily",
        price: 4.99,
        modifierGroups: ["sizes"],
      },
      {
        id: "coffee",
        name: "Premium Coffee",
        description:
          "Freshly brewed coffee, espresso, cappuccino, or latte made with premium beans",
        price: 3.99,
        modifierGroups: ["sizes", "toppings"],
      },
      {
        id: "tea",
        name: "Specialty Tea",
        description:
          "Selection of premium teas including Earl Grey, Chamomile, Green Tea, and Peppermint",
        price: 3.49,
        modifierGroups: ["toppings"],
      },
      {
        id: "milkshake",
        name: "Premium Milkshake",
        description:
          "Thick and creamy milkshakes in vanilla, chocolate, strawberry, or cookies & cream",
        price: 6.99,
        modifierGroups: ["sizes", "toppings"],
      },
    ],
  },
];

export const sampleMenuInfo = {
  name: "Sample Restaurant Menu",
  description:
    "A complete menu template featuring appetizers, salads, main courses, pizza, desserts, and beverages. Perfect starting point for any restaurant.",
  totalItems: sampleMenuTemplate.reduce(
    (acc, category) => acc + category.items.length,
    0,
  ),
};
