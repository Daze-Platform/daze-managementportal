import { Store, StoreHours } from "@/types/store";

const defaultHours: StoreHours[] = [
  { day: "Monday", isOpen: false, open: "09:00", close: "17:00" },
  { day: "Tuesday", isOpen: true, open: "09:00", close: "17:00" },
  { day: "Wednesday", isOpen: true, open: "09:00", close: "17:00" },
  { day: "Thursday", isOpen: true, open: "09:00", close: "17:00" },
  { day: "Friday", isOpen: true, open: "09:00", close: "17:00" },
  { day: "Saturday", isOpen: true, open: "09:00", close: "17:00" },
  { day: "Sunday", isOpen: true, open: "09:00", close: "17:00" },
];

const brotherFoxHours: StoreHours[] = [
  { day: "Monday", isOpen: false, open: "17:00", close: "21:00" },
  { day: "Tuesday", isOpen: true, open: "17:00", close: "21:00" },
  { day: "Wednesday", isOpen: true, open: "17:00", close: "21:00" },
  { day: "Thursday", isOpen: true, open: "17:00", close: "22:00" },
  { day: "Friday", isOpen: true, open: "17:00", close: "22:00" },
  { day: "Saturday", isOpen: true, open: "17:00", close: "22:00" },
  { day: "Sunday", isOpen: true, open: "17:00", close: "21:00" },
];

const sisterHenHours: StoreHours[] = [
  { day: "Monday", isOpen: false, open: "17:00", close: "00:00" },
  { day: "Tuesday", isOpen: true, open: "17:00", close: "00:00" },
  { day: "Wednesday", isOpen: true, open: "17:00", close: "00:00" },
  { day: "Thursday", isOpen: true, open: "17:00", close: "01:00" },
  { day: "Friday", isOpen: true, open: "17:00", close: "02:00" },
  { day: "Saturday", isOpen: true, open: "17:00", close: "02:00" },
  { day: "Sunday", isOpen: true, open: "17:00", close: "00:00" },
];

const cousinWolfHours: StoreHours[] = [
  { day: "Monday", isOpen: true, open: "07:00", close: "14:00" },
  { day: "Tuesday", isOpen: true, open: "07:00", close: "14:00" },
  { day: "Wednesday", isOpen: true, open: "07:00", close: "14:00" },
  { day: "Thursday", isOpen: true, open: "07:00", close: "14:00" },
  { day: "Friday", isOpen: true, open: "07:00", close: "14:00" },
  { day: "Saturday", isOpen: true, open: "08:00", close: "15:00" },
  { day: "Sunday", isOpen: true, open: "08:00", close: "15:00" },
];

// Pensacola Beach Resort venues
const destinationStores: Record<string, Store[]> = {
  "pensacola-beach-resort": [
    {
      id: 1,
      name: "Windrose Restaurant",
      address: "1105 E Cervantes St, Pensacola, FL 32501",
      locationDescription:
        "Wood-fired hearth restaurant featuring shared plates, charbroiled oysters, and seasonal dishes",
      logo: "/images/stores/windrose-restaurant-logo.jpg",
      bgColor: "#8B4513",
      activeOrders: 8,
      hours: brotherFoxHours,
      destinationId: "pensacola-beach-resort",
      resortId: "pensacola-beach-resort",
    },
    {
      id: 2,
      name: "Tiki Bar",
      address: "1105 E Cervantes St, Pensacola, FL 32501 (Basement)",
      locationDescription:
        "Hidden speakeasy bar in the basement serving craft cocktails and small bites",
      logo: "/images/stores/tiki-bar-logo.jpg",
      bgColor: "#4A1A2C",
      activeOrders: 12,
      hours: sisterHenHours,
      destinationId: "pensacola-beach-resort",
      resortId: "pensacola-beach-resort",
    },
    {
      id: 3,
      name: "Salty Rose Beach Bar",
      address: "1105 E Cervantes St, Pensacola, FL 32501 (Courtyard)",
      locationDescription:
        "Food truck serving breakfast and brunch favorites with Southern flair",
      logo: "/images/stores/salty-rose-beach-bar-logo.webp",
      bgColor: "#2D4A3E",
      activeOrders: 5,
      hours: cousinWolfHours,
      destinationId: "pensacola-beach-resort",
      resortId: "pensacola-beach-resort",
    },
  ],
};

// Legacy alias
const resortStores = destinationStores;

// Default stores for Pensacola Beach Resort
export const defaultStores: Store[] =
  destinationStores["pensacola-beach-resort"] || [];

export {
  defaultHours,
  brotherFoxHours,
  sisterHenHours,
  cousinWolfHours,
  resortStores,
  destinationStores,
};
