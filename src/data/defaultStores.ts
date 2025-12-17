import { Store, StoreHours } from '@/types/store';

const defaultHours: StoreHours[] = [
  { day: 'Monday', isOpen: false, open: '09:00', close: '17:00' },
  { day: 'Tuesday', isOpen: true, open: '09:00', close: '17:00' },
  { day: 'Wednesday', isOpen: true, open: '09:00', close: '17:00' },
  { day: 'Thursday', isOpen: true, open: '09:00', close: '17:00' },
  { day: 'Friday', isOpen: true, open: '09:00', close: '17:00' },
  { day: 'Saturday', isOpen: true, open: '09:00', close: '17:00' },
  { day: 'Sunday', isOpen: true, open: '09:00', close: '17:00' },
];

const brotherFoxHours: StoreHours[] = [
  { day: 'Monday', isOpen: false, open: '17:00', close: '21:00' },
  { day: 'Tuesday', isOpen: true, open: '17:00', close: '21:00' },
  { day: 'Wednesday', isOpen: true, open: '17:00', close: '21:00' },
  { day: 'Thursday', isOpen: true, open: '17:00', close: '22:00' },
  { day: 'Friday', isOpen: true, open: '17:00', close: '22:00' },
  { day: 'Saturday', isOpen: true, open: '17:00', close: '22:00' },
  { day: 'Sunday', isOpen: true, open: '17:00', close: '21:00' },
];

const sisterHenHours: StoreHours[] = [
  { day: 'Monday', isOpen: false, open: '17:00', close: '00:00' },
  { day: 'Tuesday', isOpen: true, open: '17:00', close: '00:00' },
  { day: 'Wednesday', isOpen: true, open: '17:00', close: '00:00' },
  { day: 'Thursday', isOpen: true, open: '17:00', close: '01:00' },
  { day: 'Friday', isOpen: true, open: '17:00', close: '02:00' },
  { day: 'Saturday', isOpen: true, open: '17:00', close: '02:00' },
  { day: 'Sunday', isOpen: true, open: '17:00', close: '00:00' },
];

const cousinWolfHours: StoreHours[] = [
  { day: 'Monday', isOpen: true, open: '07:00', close: '14:00' },
  { day: 'Tuesday', isOpen: true, open: '07:00', close: '14:00' },
  { day: 'Wednesday', isOpen: true, open: '07:00', close: '14:00' },
  { day: 'Thursday', isOpen: true, open: '07:00', close: '14:00' },
  { day: 'Friday', isOpen: true, open: '07:00', close: '14:00' },
  { day: 'Saturday', isOpen: true, open: '08:00', close: '15:00' },
  { day: 'Sunday', isOpen: true, open: '08:00', close: '15:00' },
];

// Lily Hall Pensacola venues
const resortStores: Record<string, Store[]> = {
  'lily-hall-pensacola': [
    {
      id: 1,
      name: 'Brother Fox',
      address: '1105 E Cervantes St, Pensacola, FL 32501',
      locationDescription: 'Wood-fired hearth restaurant featuring shared plates, charbroiled oysters, and seasonal dishes',
      logo: '/images/stores/brother-fox-logo.jpg',
      bgColor: '#8B4513',
      activeOrders: 8,
      hours: brotherFoxHours,
      resortId: 'lily-hall-pensacola',
    },
    {
      id: 2,
      name: 'Sister Hen',
      address: '1105 E Cervantes St, Pensacola, FL 32501 (Basement)',
      locationDescription: 'Hidden speakeasy bar in the basement serving craft cocktails and small bites',
      logo: '/images/stores/sister-hen-logo.jpg',
      bgColor: '#4A1A2C',
      activeOrders: 12,
      hours: sisterHenHours,
      resortId: 'lily-hall-pensacola',
    },
    {
      id: 3,
      name: 'Cousin Wolf',
      address: '1105 E Cervantes St, Pensacola, FL 32501 (Courtyard)',
      locationDescription: 'Food truck serving breakfast and brunch favorites with Southern flair',
      logo: '/lovable-uploads/4670af0c-ac52-4ff7-95cc-4b34973c1a4e.png',
      bgColor: '#2D4A3E',
      activeOrders: 5,
      hours: cousinWolfHours,
      resortId: 'lily-hall-pensacola',
    },
  ],
};

// Default stores for Lily Hall
export const defaultStores: Store[] = resortStores['lily-hall-pensacola'] || [];

export { defaultHours, brotherFoxHours, sisterHenHours, cousinWolfHours, resortStores };
