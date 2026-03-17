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
  destinationId: string; // Associate store with destination
  // Legacy alias for backwards compatibility
  resortId?: string;
  slug?: string;
}
