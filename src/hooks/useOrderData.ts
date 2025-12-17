import { useState, useCallback } from 'react';

export interface Order {
  id: string;
  items: string;
  type: string;
  time: string;
  deliverTime: string;
  icon: string;
  iconBg: string;
  status?: string;
  customer?: string;
  estimatedTime?: string;
  priority?: 'normal' | 'high' | 'urgent';
  platformFee?: string;
  storeId?: string;
  storeName?: string;
  courier?: string;
  scheduledFor?: string;
  isVisible?: boolean; // Add visibility control
}

export interface OrderData {
  new: Order[];
  progress: Order[];
  ready: Order[];
  fulfillment: Order[];
  fulfilled: Order[];
  scheduled: Order[];
}

const staticOrderData: OrderData = {
  new: [], // Start with empty new orders
  progress: [
    {
      id: '6789988',
      items: '3 items, $78.00',
      type: 'Delivery',
      time: '1m ago',
      deliverTime: 'Deliver today, at 6:50PM',
      icon: '🚚',
      iconBg: 'bg-purple-500',
      customer: 'John Doe',
      estimatedTime: '15 min',
      priority: 'high',
      platformFee: '$2.50',
      storeId: '1',
      storeName: 'Brother Fox'
    },
    {
      id: '9210943',
      items: '4 items, $56.00',
      type: 'Pick Up',
      time: '1m ago',
      deliverTime: 'Pickup today, at 7:30PM',
      icon: '🏪',
      iconBg: 'bg-green-600',
      customer: 'Jane Smith',
      estimatedTime: '10 min',
      priority: 'normal',  
      platformFee: '$1.25',
      storeId: '2',
      storeName: 'Sister Hen'
    },
    {
      id: '3456789',
      items: '2 items, $18.50',
      type: 'Pick Up',
      time: '5m ago',
      deliverTime: 'Pickup today, at 8:30AM',
      icon: '🏪',
      iconBg: 'bg-green-600',
      customer: 'Emma Wilson',
      estimatedTime: '8 min',
      priority: 'normal',
      platformFee: '$1.75',
      storeId: '3',
      storeName: 'Cousin Wolf'
    }
  ],
  ready: [
    {
      id: '6789989',
      items: '2 items, $64.00',
      type: 'Delivery',
      time: '1m ago',
      deliverTime: 'Deliver today, at 7:15PM',
      icon: '🚚',
      iconBg: 'bg-purple-500',
      customer: 'Marcus Chen',
      estimatedTime: '5 min',
      priority: 'urgent',
      platformFee: '$2.50',
      storeId: '1',
      storeName: 'Brother Fox',
      courier: 'Antonio T.'
    },
    {
      id: '9210944',
      items: '5 items, $72.00',
      type: 'Pick Up',
      time: '1m ago',
      deliverTime: 'Pickup today, at 8:45PM',
      icon: '🏪',
      iconBg: 'bg-green-600',
      customer: 'Rachel Green',
      estimatedTime: 'Ready',
      priority: 'normal',
      platformFee: '$1.25',
      storeId: '2',
      storeName: 'Sister Hen'
    },
    {
      id: '4567890',
      items: '3 items, $24.50',
      type: 'Pick Up',
      time: '8m ago',
      deliverTime: 'Pickup today, at 9:00AM',
      icon: '🏪',
      iconBg: 'bg-green-600',
      customer: 'David Brown',
      estimatedTime: 'Ready',
      priority: 'normal',
      platformFee: '$0.75',
      storeId: '3',
      storeName: 'Cousin Wolf'
    }
  ],
  fulfillment: [
    {
      id: '8765432',
      items: '4 items, $92.00',
      type: 'Delivery',
      time: '15m ago',
      deliverTime: 'Delivered today, at 6:30PM',
      icon: '✅',
      iconBg: 'bg-green-500',
      status: 'Delivered',
      customer: 'Mike Johnson',
      estimatedTime: 'Completed',
      priority: 'normal',
      platformFee: '$1.75',
      storeId: '1',
      storeName: 'Brother Fox',
      courier: 'Maria S.'
    },
    {
      id: '5432109',
      items: '3 items, $48.00',
      type: 'Pick Up',
      time: '22m ago',
      deliverTime: 'Picked up today, at 9:15PM',
      icon: '✅',
      iconBg: 'bg-blue-500',
      status: 'Picked Up',
      customer: 'Sarah Wilson',
      estimatedTime: 'Completed',
      priority: 'normal',
      platformFee: '$2.00',
      storeId: '2',
      storeName: 'Sister Hen'
    }
  ],
  fulfilled: [
    {
      id: '1111111',
      items: '5 items, $118.00',
      type: 'Delivery',
      time: '45m ago',
      deliverTime: 'Delivered today, at 5:45PM',
      icon: '✅',
      iconBg: 'bg-green-500',
      status: 'Delivered',
      customer: 'Jennifer Lee',
      estimatedTime: 'Completed',
      priority: 'normal',
      platformFee: '$2.25',
      storeId: '1',
      storeName: 'Brother Fox',
      courier: 'Carlos R.'
    },
    {
      id: '2222222',
      items: '4 items, $52.00',
      type: 'Pick Up',
      time: '1h ago',
      deliverTime: 'Picked up today, at 10:30PM',
      icon: '✅',
      iconBg: 'bg-blue-500',
      status: 'Picked Up',
      customer: 'Michael Brown',
      estimatedTime: 'Completed',
      priority: 'normal',
      platformFee: '$1.50',
      storeId: '2',
      storeName: 'Sister Hen'
    },
    {
      id: '3333333',
      items: '2 items, $19.50',
      type: 'Pick Up',
      time: '1h 15m ago',
      deliverTime: 'Picked up today, at 10:15AM',
      icon: '✅',
      iconBg: 'bg-blue-500',
      status: 'Picked Up',
      customer: 'Amanda Davis',
      estimatedTime: 'Completed',
      priority: 'normal',
      platformFee: '$1.00',
      storeId: '3',
      storeName: 'Cousin Wolf'
    }
  ],
  scheduled: [
    {
      id: '7777777',
      items: '3 items, $86.00',
      type: 'Delivery',
      time: '30m ago',
      deliverTime: 'Scheduled for tomorrow, at 7:00PM',
      icon: '📅',
      iconBg: 'bg-purple-600',
      customer: 'Rachel Green',
      estimatedTime: 'Tomorrow 7:00PM',
      priority: 'normal',
      platformFee: '$2.25',
      storeId: '1',
      storeName: 'Brother Fox',
      scheduledFor: 'Tomorrow, 7:00PM'
    },
    {
      id: '8888888',
      items: '6 items, $84.00',
      type: 'Pick Up',
      time: '1h ago',
      deliverTime: 'Scheduled for today, at 9:30PM',
      icon: '📅',
      iconBg: 'bg-purple-600',
      customer: 'Kevin Martinez',
      estimatedTime: 'Today 9:30PM',
      priority: 'normal',
      platformFee: '$1.75',
      storeId: '2',
      storeName: 'Sister Hen',
      scheduledFor: 'Today, 9:30PM'
    },
    {
      id: '9999999',
      items: '2 items, $22.00',
      type: 'Pick Up',
      time: '2h ago',
      deliverTime: 'Scheduled for Saturday, at 9:00AM',
      icon: '📅',
      iconBg: 'bg-purple-600',
      customer: 'Lisa Thompson',
      estimatedTime: 'Saturday 9:00AM',
      priority: 'high',
      platformFee: '$1.25',
      storeId: '3',
      storeName: 'Cousin Wolf',
      scheduledFor: 'Saturday, 9:00AM'
    }
  ]
};

// Available couriers for assignment
const availableCouriers = [
  'Antonio T.',
  'Maria S.',
  'Carlos R.',
  'Diego M.',
  'Sofia L.',
  'Miguel P.',
  'Ana R.',
  'Luis F.'
];

// Function to generate random order IDs
const generateRandomOrderId = () => {
  return Math.floor(Math.random() * 9000000) + 1000000; // 7-digit random number
};

// Orders to add with randomized IDs - Added more orders per store
const initialNewOrders: Order[] = [
  // Brother Fox orders (dinner restaurant)
  {
    id: generateRandomOrderId().toString(),
    items: '2 items, $68.00',
    type: 'Delivery',
    time: 'Just now',
    deliverTime: 'Deliver today, at 7:15PM',
    icon: '🚚',
    iconBg: 'bg-purple-500',
    customer: 'Alice Johnson',
    estimatedTime: '25 min',
    priority: 'normal',
    platformFee: '$2.00',
    storeId: '1',
    storeName: 'Brother Fox',
    isVisible: false
  },
  {
    id: generateRandomOrderId().toString(),
    items: '4 items, $124.00',
    type: 'Pick Up',
    time: 'Just now',
    deliverTime: 'Pickup today, at 7:30PM',
    icon: '🏪',
    iconBg: 'bg-green-600',
    customer: 'David Wilson',
    estimatedTime: '12 min',
    priority: 'normal',
    platformFee: '$1.50',
    storeId: '1',
    storeName: 'Brother Fox',
    isVisible: false
  },
  {
    id: generateRandomOrderId().toString(),
    items: '3 items, $86.00',
    type: 'Delivery',
    time: 'Just now',
    deliverTime: 'Deliver today, at 7:45PM',
    icon: '🚚',
    iconBg: 'bg-purple-500',
    customer: 'Sarah Connor',
    estimatedTime: '20 min',
    priority: 'high',
    platformFee: '$1.25',
    storeId: '1',
    storeName: 'Brother Fox',
    isVisible: false
  },
  
  // Sister Hen orders (speakeasy bar)
  {
    id: generateRandomOrderId().toString(),
    items: '3 items, $42.00',
    type: 'Pick Up',
    time: 'Just now',
    deliverTime: 'Pickup today, at 8:20PM',
    icon: '🏪',
    iconBg: 'bg-green-600',
    customer: 'Bob Smith',
    estimatedTime: '15 min',
    priority: 'normal',
    platformFee: '$1.00',
    storeId: '2',
    storeName: 'Sister Hen',
    isVisible: false
  },
  {
    id: generateRandomOrderId().toString(),
    items: '5 items, $68.00',
    type: 'Pick Up',
    time: 'Just now',
    deliverTime: 'Pickup today, at 9:35PM',
    icon: '🏪',
    iconBg: 'bg-green-600',
    customer: 'Eva Martinez',
    estimatedTime: '22 min',
    priority: 'urgent',
    platformFee: '$1.90',
    storeId: '2',
    storeName: 'Sister Hen',
    isVisible: false
  },
  {
    id: generateRandomOrderId().toString(),
    items: '4 items, $56.00',
    type: 'Pick Up',
    time: 'Just now',
    deliverTime: 'Pickup today, at 10:00PM',
    icon: '🏪',
    iconBg: 'bg-green-600',
    customer: 'Mike Johnson',
    estimatedTime: '18 min',
    priority: 'normal',
    platformFee: '$2.25',
    storeId: '2',
    storeName: 'Sister Hen',
    isVisible: false
  },
  
  // Cousin Wolf orders (breakfast food truck)
  {
    id: generateRandomOrderId().toString(),
    items: '2 items, $15.00',
    type: 'Pick Up',
    time: 'Just now',
    deliverTime: 'Pickup today, at 8:25AM',
    icon: '🏪',
    iconBg: 'bg-green-600',
    customer: 'Carol Davis',
    estimatedTime: '8 min',
    priority: 'normal',
    platformFee: '$0.75',
    storeId: '3',
    storeName: 'Cousin Wolf',
    isVisible: false
  },
  {
    id: generateRandomOrderId().toString(),
    items: '3 items, $22.50',
    type: 'Pick Up',
    time: 'Just now',
    deliverTime: 'Pickup today, at 9:50AM',
    icon: '🏪',
    iconBg: 'bg-green-600',
    customer: 'James Rodriguez',
    estimatedTime: '10 min',
    priority: 'normal',
    platformFee: '$1.00',
    storeId: '3',
    storeName: 'Cousin Wolf',
    isVisible: false
  },
  {
    id: generateRandomOrderId().toString(),
    items: '4 items, $28.00',
    type: 'Pick Up',
    time: 'Just now',
    deliverTime: 'Pickup today, at 10:30AM',
    icon: '🏪',
    iconBg: 'bg-green-600',
    customer: 'Lisa Thompson',
    estimatedTime: '12 min',
    priority: 'high',
    platformFee: '$1.25',
    storeId: '3',
    storeName: 'Cousin Wolf',
    isVisible: false
  }
];

export const useOrderData = () => {
  const [orderData, setOrderData] = useState<OrderData>(staticOrderData);

  const generateInitialOrders = useCallback(() => {
    console.log('Generating initial orders for ALL stores - immediately visible');
    
    // Generate orders for ALL stores and make them immediately visible
    const ordersWithFreshIds = initialNewOrders.map(order => ({
      ...order,
      id: generateRandomOrderId().toString(),
      isVisible: true // All orders immediately visible for filtering
    }));
    
    console.log('Generated orders:', ordersWithFreshIds.map(o => ({ 
      id: o.id, 
      storeId: o.storeId, 
      storeName: o.storeName, 
      customer: o.customer 
    })));
    
    setOrderData(prevData => ({
      ...prevData,
      new: [...ordersWithFreshIds, ...prevData.new]
    }));
    
    console.log(`Successfully generated ${ordersWithFreshIds.length} orders for all stores`);
  }, []);

  const moveOrder = (orderId: string, fromTab: keyof OrderData, toTab: keyof OrderData) => {
    console.log(`Moving order ${orderId} from ${fromTab} to ${toTab}`);
    
    setOrderData(prevData => {
      const newData = { ...prevData };
      const orderIndex = newData[fromTab].findIndex(order => order.id === orderId);
      
      if (orderIndex !== -1) {
        const order = { ...newData[fromTab][orderIndex] };
        
        console.log(`Found order to move:`, order);
        console.log(`Order storeId: ${order.storeId}, storeName: ${order.storeName}`);
        
        // Assign courier for delivery orders when moving to ready or fulfillment
        if ((toTab === 'ready' || toTab === 'fulfillment' || toTab === 'fulfilled') && order.type === 'Delivery' && !order.courier) {
          const randomCourier = availableCouriers[Math.floor(Math.random() * availableCouriers.length)];
          order.courier = randomCourier;
        }
        
        // Update order status when moving to fulfillment or fulfilled
        if (toTab === 'fulfillment' || toTab === 'fulfilled') {
          order.status = order.type === 'Delivery' ? 'Delivered' : 'Picked Up';
          order.icon = '✅';
          order.iconBg = order.type === 'Delivery' ? 'bg-green-500' : 'bg-blue-500';
          order.estimatedTime = 'Completed';
        }

        // Handle scheduling - move from scheduled to new orders
        if (toTab === 'new' && fromTab === 'scheduled') {
          order.icon = order.type === 'Delivery' ? '🚚' : '🏪';
          order.iconBg = order.type === 'Delivery' ? 'bg-purple-500' : 'bg-green-600';
          order.estimatedTime = order.type === 'Delivery' ? '25 min' : '15 min';
          order.deliverTime = order.type === 'Delivery' 
            ? `Deliver today, at ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` 
            : `Pickup today, at ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
          delete order.scheduledFor;
        }

        // Handle moving to scheduled
        if (toTab === 'scheduled') {
          order.icon = '📅';
          order.iconBg = 'bg-purple-600';
          order.scheduledFor = 'Tomorrow, 2:00PM'; // Default scheduling
          order.estimatedTime = 'Tomorrow 2:00PM';
          order.deliverTime = 'Scheduled for tomorrow, at 2:00PM';
        }
        
        // Remove from source tab
        newData[fromTab].splice(orderIndex, 1);
        
        // Add to destination tab
        newData[toTab].unshift(order);
        
        console.log(`Order moved successfully. New ${toTab} count: ${newData[toTab].length}`);
      } else {
        console.log(`Order ${orderId} not found in ${fromTab} tab`);
      }
      
      return newData;
    });
  };

  const removeOrder = (orderId: string, fromTab: keyof OrderData) => {
    setOrderData(prevData => {
      const newData = { ...prevData };
      const orderIndex = newData[fromTab].findIndex(order => order.id === orderId);
      
      if (orderIndex !== -1) {
        newData[fromTab].splice(orderIndex, 1);
      }
      
      return newData;
    });
  };

  const scheduleOrder = (orderId: string, fromTab: keyof OrderData, scheduledTime: string) => {
    setOrderData(prevData => {
      const newData = { ...prevData };
      const orderIndex = newData[fromTab].findIndex(order => order.id === orderId);
      
      if (orderIndex !== -1) {
        const order = { ...newData[fromTab][orderIndex] };
        
        // Update order for scheduling
        order.icon = '📅';
        order.iconBg = 'bg-purple-600';
        order.scheduledFor = scheduledTime;
        order.estimatedTime = scheduledTime;
        order.deliverTime = `Scheduled for ${scheduledTime}`;
        
        // Remove from source tab
        newData[fromTab].splice(orderIndex, 1);
        
        // Add to scheduled tab
        newData.scheduled.unshift(order);
      }
      
      return newData;
    });
  };

  return { orderData, moveOrder, removeOrder, scheduleOrder, generateInitialOrders };
};
