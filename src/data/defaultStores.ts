import { Store, StoreHours } from '@/types/store';

const defaultHours: StoreHours[] = [
  { day: 'Monday', isOpen: true, open: '09:00', close: '17:00' },
  { day: 'Tuesday', isOpen: true, open: '09:00', close: '17:00' },
  { day: 'Wednesday', isOpen: true, open: '09:00', close: '17:00' },
  { day: 'Thursday', isOpen: true, open: '09:00', close: '17:00' },
  { day: 'Friday', isOpen: true, open: '09:00', close: '17:00' },
  { day: 'Saturday', isOpen: false, open: '09:00', close: '17:00' },
  { day: 'Sunday', isOpen: false, open: '09:00', close: '17:00' },
];

// Empty store data - user will create fresh stores
const resortStores: Record<string, Store[]> = {};

// No default stores - user will create fresh
export const defaultStores: Store[] = [];

export { defaultHours, resortStores };