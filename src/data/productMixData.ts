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

// Brother Fox menu items
const BASE_ITEMS: Array<Omit<ProductMixItem, "quantity" | "grossSales" | "netSales" | "avgPrice">> = [
  // Snacks & Small Plates
  { id: "1", name: "Pan Con Tomate", category: "Snacks & Small Plates", salesChannel: "Dine-in", daypart: "Dinner" },
  { id: "2", name: "Shishito Peppers", category: "Snacks & Small Plates", salesChannel: "Dine-in", daypart: "Dinner" },
  { id: "3", name: "Charbroiled Oysters", category: "Snacks & Small Plates", salesChannel: "Dine-in", daypart: "Dinner" },
  { id: "4", name: "Snapper Ceviche", category: "Snacks & Small Plates", salesChannel: "Takeout", daypart: "Lunch" },
  { id: "5", name: "Drunken Goat Cheese", category: "Snacks & Small Plates", salesChannel: "Dine-in", daypart: "Dinner" },
  // Charcuterie & Boards
  { id: "6", name: "Charcuterie Board", category: "Charcuterie & Boards", salesChannel: "Dine-in", daypart: "Dinner" },
  { id: "7", name: "Smoked Mushroom Tartare", category: "Charcuterie & Boards", salesChannel: "Dine-in", daypart: "Dinner" },
  // Salads
  { id: "8", name: "Elote Salad", category: "Salads", salesChannel: "Dine-in", daypart: "Lunch" },
  { id: "9", name: "The Wedge", category: "Salads", salesChannel: "Takeout", daypart: "Lunch" },
  // Wood-Fired Mains
  { id: "10", name: "Grilled Octopus", category: "Wood-Fired Mains", salesChannel: "Dine-in", daypart: "Dinner" },
  { id: "11", name: "Prime Skirt Steak Asada", category: "Wood-Fired Mains", salesChannel: "Dine-in", daypart: "Dinner" },
  { id: "12", name: "Seafood Paella", category: "Wood-Fired Mains", salesChannel: "Dine-in", daypart: "Dinner" },
  { id: "13", name: "Wood-Fired Pork Chop", category: "Wood-Fired Mains", salesChannel: "Dine-in", daypart: "Dinner" },
  { id: "14", name: "Whole Grilled Fish", category: "Wood-Fired Mains", salesChannel: "Dine-in", daypart: "Dinner" },
  // Desserts
  { id: "15", name: "Mocha Torte", category: "Desserts", salesChannel: "Dine-in", daypart: "Late Night" },
  { id: "16", name: "Churros", category: "Desserts", salesChannel: "Takeout", daypart: "Late Night" },
];

const MODIFIERS: Array<Omit<ProductMixItem, "quantity" | "grossSales" | "netSales" | "avgPrice">> = [
  { id: "m1", name: "+ Extra Chimichurri", category: "Modifiers", salesChannel: "Dine-in", daypart: "Dinner", isModifier: true },
  { id: "m2", name: "+ Spice Level Upgrade", category: "Modifiers", salesChannel: "Takeout", daypart: "Lunch", isModifier: true },
];

// Price mapping for Brother Fox items
const PRICE_MAP: Record<string, number> = {
  "Pan Con Tomate": 8,
  "Shishito Peppers": 13,
  "Charbroiled Oysters": 18,
  "Snapper Ceviche": 16,
  "Drunken Goat Cheese": 14,
  "Charcuterie Board": 32,
  "Smoked Mushroom Tartare": 15,
  "Elote Salad": 12,
  "The Wedge": 14,
  "Grilled Octopus": 26,
  "Prime Skirt Steak Asada": 38,
  "Seafood Paella": 56,
  "Wood-Fired Pork Chop": 34,
  "Whole Grilled Fish": 42,
  "Mocha Torte": 12,
  "Churros": 10,
};

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
    const price = PRICE_MAP[base.name] || 15; // Use actual Brother Fox pricing
    const grossSales = quantity * price;
    const discounts = base.category === "Desserts" ? grossSales * 0.05 : 0;
    const netSales = grossSales - discounts;

    return {
      ...base,
      quantity,
      grossSales,
      netSales,
      avgPrice: price,
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
