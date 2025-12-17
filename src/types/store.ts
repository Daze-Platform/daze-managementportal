export interface StoreHours {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
}

export interface Store {
  id: number;
  name: string;
  address: string;
  locationDescription?: string;
  logo: string;
  customLogo?: string;
  bgColor: string;
  activeOrders: number;
  hours: StoreHours[];
  resortId: string; // Associate store with resort
}