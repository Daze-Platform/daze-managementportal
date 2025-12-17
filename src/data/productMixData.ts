import { DateRange } from "react-day-picker";

export type SalesChannel = "Dine-in" | "Takeout" | "Delivery";
export type Daypart = "Breakfast" | "Lunch" | "Dinner" | "Late Night";

export interface ProductMixItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  grossSales: number;
  netSales: number;
  avgPrice: number;
  salesChannel: SalesChannel;
  daypart: Daypart;
  isModifier?: boolean;
  imageUrl?: string;
}

// Simple deterministic hash to vary sample data per store
function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) hash = (hash << 5) - hash + input.charCodeAt(i);
  return Math.abs(hash);
}

const BASE_ITEMS: Array<Omit<ProductMixItem, "quantity" | "grossSales" | "netSales" | "avgPrice">> = [
  { id: "1", name: "Margherita Pizza", category: "Pizza", salesChannel: "Dine-in", daypart: "Lunch" },
  { id: "2", name: "Pepperoni Pizza", category: "Pizza", salesChannel: "Dine-in", daypart: "Dinner" },
  { id: "3", name: "Grilled Salmon", category: "Seafood", salesChannel: "Dine-in", daypart: "Dinner" },
  { id: "4", name: "Fish Tacos", category: "Seafood", salesChannel: "Takeout", daypart: "Lunch" },
  { id: "5", name: "Caesar Salad", category: "Salads", salesChannel: "Dine-in", daypart: "Lunch" },
  { id: "6", name: "House Salad", category: "Salads", salesChannel: "Delivery", daypart: "Dinner" },
  { id: "7", name: "Margarita", category: "Drinks", salesChannel: "Dine-in", daypart: "Dinner" },
  { id: "8", name: "Iced Tea", category: "Drinks", salesChannel: "Takeout", daypart: "Lunch" },
  { id: "9", name: "Cheesecake", category: "Desserts", salesChannel: "Dine-in", daypart: "Dinner" },
  { id: "10", name: "Gelato", category: "Desserts", salesChannel: "Delivery", daypart: "Late Night" },
];

const MODIFIERS: Array<Omit<ProductMixItem, "quantity" | "grossSales" | "netSales" | "avgPrice">> = [
  { id: "m1", name: "+ Extra Cheese", category: "Modifiers", salesChannel: "Dine-in", daypart: "Dinner", isModifier: true },
  { id: "m2", name: "+ Guacamole", category: "Modifiers", salesChannel: "Takeout", daypart: "Lunch", isModifier: true },
];

function imageFor(name: string, category: string): string {
  const n = name.toLowerCase();
  const map: Record<string, string> = {
    "margherita pizza": "/images/menu/margherita-pizza.jpg",
    "pepperoni pizza": "/images/menu/pepperoni-pizza.jpg",
    "grilled salmon": "/images/menu/grilled-salmon.jpg",
    "fish tacos": "/images/menu/fish-tacos.jpg",
    "caesar salad": "/images/menu/caesar-salad.jpg",
    "house salad": "/images/menu/house-salad.jpg",
    "margarita": "/images/menu/margarita-cocktail.jpg",
    "iced tea": "/images/menu/iced-tea.jpg",
    "cheesecake": "/images/menu/cheesecake.jpg",
    "gelato": "/images/menu/gelato.jpg",
  };
  if (map[n]) return map[n];
  const c = category.toLowerCase();
  if (c.includes("pizza")) return "/images/menu/pizza.jpg";
  if (c.includes("salad")) return "/images/menu/salad.jpg";
  if (c.includes("seafood")) return "/images/menu/grilled-salmon.jpg";
  if (c.includes("dessert")) return "/images/menu/cheesecake.jpg";
  if (c.includes("drink")) return "/images/menu/iced-tea.jpg";
  if (n.includes("taco")) return "/images/menu/fish-tacos.jpg";
  return "/images/menu/pizza.jpg";
}

export function getProductMixData(storeId: string, dateRange?: DateRange, includeModifiers = false): ProductMixItem[] {
  // Tie data generation to both store and selected date window
  const MS_DAY = 24 * 60 * 60 * 1000;
  const fromTs = dateRange?.from
    ? Date.UTC(dateRange.from.getFullYear(), dateRange.from.getMonth(), dateRange.from.getDate())
    : 0;
  const toTs = dateRange?.to
    ? Date.UTC(dateRange.to.getFullYear(), dateRange.to.getMonth(), dateRange.to.getDate())
    : fromTs;
  const days = dateRange?.from ? Math.max(1, Math.floor((toTs - fromTs) / MS_DAY) + 1) : 7; // default 7 days if none selected

  const seed = hashString(`${storeId || "all"}|${fromTs}|${toTs}|${includeModifiers ? "1" : "0"}`);
  const items = [...BASE_ITEMS, ...(includeModifiers ? MODIFIERS : [])];

  return items.map((base, idx) => {
    // Per-item deterministic variance using the combined seed and item identity
    const itemSeed = hashString(`${seed}|${base.id}|${idx}`);

    // Base sales per day scaled lightly by item position/category pattern
    const basePerDay = ((itemSeed % 7) + 3) * (idx % 4 === 0 ? 2 : idx % 3 === 0 ? 1.5 : 1.0);

    // Small variance (±10%) to avoid flat scaling across items
    const variance = 0.9 + ((itemSeed % 21) / 100); // 0.90 - 1.10

    const quantity = Math.max(1, Math.round(basePerDay * days * variance));
    const price = base.category === "Drinks" ? 8 : base.category === "Desserts" ? 7 : base.category === "Salads" ? 10 : base.category === "Seafood" ? 22 : 16;
    const grossSales = quantity * price;
    const discounts = base.category === "Drinks" ? grossSales * 0.05 : 0;
    const netSales = grossSales - discounts;

    return {
      ...base,
      quantity,
      grossSales,
      netSales,
      avgPrice: price,
      imageUrl: imageFor(base.name, base.category),
    };
  });
}

export function groupByCategory(items: ProductMixItem[]) {
  const map = new Map<string, { category: string; quantity: number; grossSales: number; netSales: number }>();
  items.forEach((it) => {
    const key = it.category;
    const curr = map.get(key) || { category: key, quantity: 0, grossSales: 0, netSales: 0 };
    curr.quantity += it.quantity;
    curr.grossSales += it.grossSales;
    curr.netSales += it.netSales;
    map.set(key, curr);
  });
  return Array.from(map.values());
}
