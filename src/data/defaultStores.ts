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

const saltyRoseHours: StoreHours[] = [
  { day: 'Monday', isOpen: true, open: '10:00', close: '20:00' },
  { day: 'Tuesday', isOpen: true, open: '10:00', close: '20:00' },
  { day: 'Wednesday', isOpen: true, open: '10:00', close: '20:00' },
  { day: 'Thursday', isOpen: true, open: '10:00', close: '21:00' },
  { day: 'Friday', isOpen: true, open: '10:00', close: '21:00' },
  { day: 'Saturday', isOpen: true, open: '10:00', close: '21:00' },
  { day: 'Sunday', isOpen: true, open: '10:00', close: '20:00' },
];

// Lily Hall Pensacola venues
const destinationStores: Record<string, Store[]> = {
  'pensacola-beach-resort': [
    {
      id: 1,
      name: 'Salty Rose',
      address: '165 Fort Pickens Rd, Pensacola Beach, FL 32561',
      locationDescription: 'Beach bar and grill serving cocktails, frozen drinks, seafood, and American favorites poolside',
      logo: '/images/stores/salty-rose-logo.png',
      bgColor: '#122346',
      activeOrders: 14,
      hours: saltyRoseHours,
      destinationId: 'pensacola-beach-resort',
      resortId: 'pensacola-beach-resort',
    },
  ],
  'lily-hall-pensacola': [
    {
      id: 2,
      name: 'Brother Fox',
      address: '1105 E Cervantes St, Pensacola, FL 32501',
      locationDescription: 'Wood-fired hearth restaurant featuring shared plates, charbroiled oysters, and seasonal dishes',
      logo: '/images/stores/brother-fox-logo.jpg',
      bgColor: '#8B4513',
      activeOrders: 8,
      hours: brotherFoxHours,
      destinationId: 'lily-hall-pensacola',
      resortId: 'lily-hall-pensacola',
    },
    {
      id: 3,
      name: 'Sister Hen',
      address: '1105 E Cervantes St, Pensacola, FL 32501 (Basement)',
      locationDescription: 'Hidden speakeasy bar in the basement serving craft cocktails and small bites',
      logo: '/images/stores/sister-hen-logo.jpg',
      bgColor: '#4A1A2C',
      activeOrders: 12,
      hours: sisterHenHours,
      destinationId: 'lily-hall-pensacola',
      resortId: 'lily-hall-pensacola',
    },
    {
      id: 4,
      name: 'Cousin Wolf',
      address: '1105 E Cervantes St, Pensacola, FL 32501 (Courtyard)',
      locationDescription: 'Food truck serving breakfast and brunch favorites with Southern flair',
      logo: '/images/stores/cousin-wolf-logo.webp',
      bgColor: '#2D4A3E',
      activeOrders: 5,
      hours: cousinWolfHours,
      destinationId: 'lily-hall-pensacola',
      resortId: 'lily-hall-pensacola',
    },
  ],
};

// Legacy alias
const resortStores = destinationStores;

// Default stores for PBR (primary pilot)
export const defaultStores: Store[] = destinationStores['pensacola-beach-resort'] || [];

export { defaultHours, brotherFoxHours, sisterHenHours, cousinWolfHours, resortStores, destinationStores };
