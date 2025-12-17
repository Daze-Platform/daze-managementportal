// Store-specific reports data
export const reportsData = {
  all: {
    name: 'All Stores',
    revenue: {
      total: 4220.50,
      growth: 4.07,
      breakdown: [
        { label: 'Net Revenue', amount: 1928, color: 'bg-emerald-500', percentage: 45.7 },
        { label: 'Tax', amount: 1060, color: 'bg-blue-500', percentage: 25.1 },
        { label: 'Commission', amount: 844, color: 'bg-orange-500', percentage: 20.0 },
        { label: 'Tips', amount: 388, color: 'bg-purple-500', percentage: 9.2 }
      ]
    },
    customerAnalytics: {
      totalCustomers: 1247,
      customerGrowth: 12,
      lifetimeValue: 186,
      lifetimeValueGrowth: 8.5,
      retentionRate: 73.2,
      retentionGrowth: 2.1,
      satisfaction: 4.7,
      totalReviews: 892
    },
    paymentTypes: [
      { name: 'Credit Card', value: 45, color: '#3B82F6' },
      { name: 'Cash', value: 25, color: '#10B981' },
      { name: 'Digital Wallet', value: 20, color: '#F59E0B' },
      { name: 'Gift Card', value: 10, color: '#8B5CF6' }
    ],
    cancellations: {
      rate: 3.2,
      totalCancelled: 24,
      reasons: [
        { reason: 'Long wait time', count: 8, percentage: 33.3 },
        { reason: 'Wrong order', count: 6, percentage: 25.0 },
        { reason: 'Payment issues', count: 4, percentage: 16.7 },
        { reason: 'Customer changed mind', count: 6, percentage: 25.0 }
      ]
    }
  },
  '12': { // Piazza
    name: 'Piazza',
    revenue: {
      total: 1580.25,
      growth: 3.2,
      breakdown: [
        { label: 'Net Revenue', amount: 725, color: 'bg-emerald-500', percentage: 45.9 },
        { label: 'Tax', amount: 395, color: 'bg-blue-500', percentage: 25.0 },
        { label: 'Commission', amount: 316, color: 'bg-orange-500', percentage: 20.0 },
        { label: 'Tips', amount: 144, color: 'bg-purple-500', percentage: 9.1 }
      ]
    },
    customerAnalytics: {
      totalCustomers: 432,
      customerGrowth: 8,
      lifetimeValue: 156,
      lifetimeValueGrowth: 5.2,
      retentionRate: 68.5,
      retentionGrowth: 1.8,
      satisfaction: 4.3,
      totalReviews: 298
    },
    paymentTypes: [
      { name: 'Credit Card', value: 50, color: '#3B82F6' },
      { name: 'Cash', value: 30, color: '#10B981' },
      { name: 'Digital Wallet', value: 15, color: '#F59E0B' },
      { name: 'Gift Card', value: 5, color: '#8B5CF6' }
    ],
    cancellations: {
      rate: 2.8,
      totalCancelled: 8,
      reasons: [
        { reason: 'Long wait time', count: 3, percentage: 37.5 },
        { reason: 'Wrong order', count: 2, percentage: 25.0 },
        { reason: 'Payment issues', count: 1, percentage: 12.5 },
        { reason: 'Customer changed mind', count: 2, percentage: 25.0 }
      ]
    }
  },
  '13': { // Red Fish Blue Fish
    name: 'Red Fish Blue Fish',
    revenue: {
      total: 2140.75,
      growth: 6.8,
      breakdown: [
        { label: 'Net Revenue', amount: 978, color: 'bg-emerald-500', percentage: 45.7 },
        { label: 'Tax', amount: 535, color: 'bg-blue-500', percentage: 25.0 },
        { label: 'Commission', amount: 428, color: 'bg-orange-500', percentage: 20.0 },
        { label: 'Tips', amount: 200, color: 'bg-purple-500', percentage: 9.3 }
      ]
    },
    customerAnalytics: {
      totalCustomers: 567,
      customerGrowth: 15,
      lifetimeValue: 198,
      lifetimeValueGrowth: 12.3,
      retentionRate: 76.8,
      retentionGrowth: 3.2,
      satisfaction: 4.6,
      totalReviews: 423
    },
    paymentTypes: [
      { name: 'Credit Card', value: 42, color: '#3B82F6' },
      { name: 'Cash', value: 22, color: '#10B981' },
      { name: 'Digital Wallet', value: 28, color: '#F59E0B' },
      { name: 'Gift Card', value: 8, color: '#8B5CF6' }
    ],
    cancellations: {
      rate: 2.1,
      totalCancelled: 9,
      reasons: [
        { reason: 'Long wait time', count: 2, percentage: 22.2 },
        { reason: 'Wrong order', count: 3, percentage: 33.3 },
        { reason: 'Payment issues', count: 1, percentage: 11.1 },
        { reason: 'Customer changed mind', count: 3, percentage: 33.3 }
      ]
    }
  },
  '8': { // Sal De Mar
    name: 'Sal De Mar',
    revenue: {
      total: 1320.50,
      growth: 2.1,
      breakdown: [
        { label: 'Net Revenue', amount: 605, color: 'bg-emerald-500', percentage: 45.8 },
        { label: 'Tax', amount: 330, color: 'bg-blue-500', percentage: 25.0 },
        { label: 'Commission', amount: 264, color: 'bg-orange-500', percentage: 20.0 },
        { label: 'Tips', amount: 121, color: 'bg-purple-500', percentage: 9.2 }
      ]
    },
    customerAnalytics: {
      totalCustomers: 248,
      customerGrowth: 6,
      lifetimeValue: 142,
      lifetimeValueGrowth: 3.8,
      retentionRate: 65.2,
      retentionGrowth: 0.9,
      satisfaction: 4.0,
      totalReviews: 171
    },
    paymentTypes: [
      { name: 'Credit Card', value: 38, color: '#3B82F6' },
      { name: 'Cash', value: 35, color: '#10B981' },
      { name: 'Digital Wallet', value: 18, color: '#F59E0B' },
      { name: 'Gift Card', value: 9, color: '#8B5CF6' }
    ],
    cancellations: {
      rate: 4.5,
      totalCancelled: 7,
      reasons: [
        { reason: 'Long wait time', count: 3, percentage: 42.9 },
        { reason: 'Wrong order', count: 1, percentage: 14.3 },
        { reason: 'Payment issues', count: 2, percentage: 28.6 },
        { reason: 'Customer changed mind', count: 1, percentage: 14.3 }
      ]
    }
  }
};