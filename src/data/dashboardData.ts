// Resort-specific dashboard data
export const resortDashboardData = {
  'hilton-pensacola-beach': {
    all: {
      name: 'All Stores',
      stats: {
        revenue: 32450,
        orders: 3847,
        customers: 2341,
        avgOrder: 42.30,
        trends: { revenue: 15.2, orders: 12.8, customers: 8.7, avgOrder: 3.5 }
      },
      revenueData: [
        { name: 'Mon', value: 8200 },
        { name: 'Tue', value: 7100 },
        { name: 'Wed', value: 9800 },
        { name: 'Thu', value: 8500 },
        { name: 'Fri', value: 11200 },
        { name: 'Sat', value: 13800 },
        { name: 'Sun', value: 10200 },
      ],
      orderData: [
        { name: '6AM', orders: 32 },
        { name: '9AM', orders: 89 },
        { name: '12PM', orders: 156 },
        { name: '3PM', orders: 134 },
        { name: '6PM', orders: 187 },
        { name: '9PM', orders: 98 },
      ],
      topItems: [
        { name: "Classic Burger", orders: 423, revenue: "$5,922", image: "🍔", change: "+15%" },
        { name: "Margherita Pizza", orders: 387, revenue: "$5,418", image: "🍕", change: "+12%" },
        { name: "Fish & Chips", orders: 298, revenue: "$3,872", image: "🐟", change: "+8%" },
        { name: "Caesar Salad", orders: 267, revenue: "$3,471", image: "🥗", change: "+18%" },
        { name: "Chicken Wings", orders: 234, revenue: "$3,042", image: "🍗", change: "+6%" }
      ],
      performanceAlerts: [
        { metric: "Beachside Service Time", currentValue: 18.5, targetValue: 15.0, urgency: "medium" as const, impact: "Guest experience at beach/pool" },
        { metric: "Food Cost Percentage", currentValue: 31.2, targetValue: 28.0, urgency: "high" as const, impact: "Resort profit margins" },
        { metric: "Guest Satisfaction Score", currentValue: 4.3, targetValue: 4.6, urgency: "medium" as const, impact: "Resort reviews & reputation" },
        { metric: "Peak Hour Coverage", currentValue: 78.0, targetValue: 85.0, urgency: "critical" as const, impact: "Service delays during rush" }
      ],
      customerSatisfaction: {
        overall: 4.2,
        foodQuality: 4.5,
        serviceSpeed: 3.8,
        cleanliness: 4.1,
        value: 4.0,
        totalReviews: 1847
      },
      operationalMetrics: {
        avgOrderPrepTime: 12.5,
        kitchenEfficiency: 87,
        wastagePercentage: 4.2,
        staffUtilization: 78,
        peakHourCapacity: 92
      }
    },
    '12': { // Piazza ID
      name: 'Piazza',
      stats: {
        revenue: 12426,
        orders: 1429,
        customers: 892,
        avgOrder: 28.50,
        trends: { revenue: 12.5, orders: 8.2, customers: -2.1, avgOrder: 5.7 }
      },
      revenueData: [
        { name: 'Mon', value: 4000 },
        { name: 'Tue', value: 3000 },
        { name: 'Wed', value: 5000 },
        { name: 'Thu', value: 4500 },
        { name: 'Fri', value: 6000 },
        { name: 'Sat', value: 7000 },
        { name: 'Sun', value: 5500 },
      ],
      orderData: [
        { name: '6AM', orders: 12 },
        { name: '9AM', orders: 45 },
        { name: '12PM', orders: 78 },
        { name: '3PM', orders: 52 },
        { name: '6PM', orders: 89 },
        { name: '9PM', orders: 34 },
      ],
      topItems: [
        { name: "Classic Burger", orders: 156, revenue: "$2,184", image: "🍔", change: "+12%" },
        { name: "Margherita Pizza", orders: 134, revenue: "$1,876", image: "🍕", change: "+8%" },
        { name: "Caesar Salad", orders: 98, revenue: "$1,274", image: "🥗", change: "+15%" },
        { name: "Chicken Wings", orders: 87, revenue: "$1,131", image: "🍗", change: "+5%" },
        { name: "Fish & Chips", orders: 76, revenue: "$988", image: "🐟", change: "-3%" }
      ],
      performanceAlerts: [
        { metric: "Beachside Service Time", currentValue: 16.5, targetValue: 15.0, urgency: "low" as const, impact: "Poolside dining experience" },
        { metric: "Food Cost Percentage", currentValue: 29.8, targetValue: 28.0, urgency: "medium" as const, impact: "Location profitability" }
      ],
      customerSatisfaction: {
        overall: 4.1,
        foodQuality: 4.3,
        serviceSpeed: 3.7,
        cleanliness: 4.0,
        value: 3.9,
        totalReviews: 567
      },
      operationalMetrics: {
        avgOrderPrepTime: 14.2,
        kitchenEfficiency: 82,
        wastagePercentage: 5.1,
        staffUtilization: 75,
        peakHourCapacity: 88
      }
    },
    '13': { // Red Fish Blue Fish ID
      name: 'Red Fish Blue Fish',
      stats: {
        revenue: 18750,
        orders: 2156,
        customers: 1234,
        avgOrder: 35.80,
        trends: { revenue: 18.7, orders: 14.3, customers: 11.2, avgOrder: 7.8 }
      },
      revenueData: [
        { name: 'Mon', value: 3200 },
        { name: 'Tue', value: 2800 },
        { name: 'Wed', value: 3600 },
        { name: 'Thu', value: 4100 },
        { name: 'Fri', value: 4800 },
        { name: 'Sat', value: 5200 },
        { name: 'Sun', value: 4400 },
      ],
      orderData: [
        { name: '6AM', orders: 8 },
        { name: '9AM', orders: 34 },
        { name: '12PM', orders: 67 },
        { name: '3PM', orders: 89 },
        { name: '6PM', orders: 112 },
        { name: '9PM', orders: 78 },
      ],
      topItems: [
        { name: "Fish Tacos", orders: 198, revenue: "$3,564", image: "🌮", change: "+22%" },
        { name: "Clam Chowder", orders: 156, revenue: "$2,808", image: "🍲", change: "+18%" },
        { name: "Grilled Salmon", orders: 134, revenue: "$4,020", image: "🐟", change: "+14%" },
        { name: "Seafood Platter", orders: 89, revenue: "$3,115", image: "🦐", change: "+25%" },
        { name: "Calamari Rings", orders: 76, revenue: "$1,520", image: "🦑", change: "+9%" }
      ],
      performanceAlerts: [
        { metric: "Guest Satisfaction Score", currentValue: 4.6, targetValue: 4.6, urgency: "low" as const, impact: "Excellent beachfront dining" },
        { metric: "Seafood Freshness Score", currentValue: 96.2, targetValue: 95.0, urgency: "low" as const, impact: "Premium dining standards" },
        { metric: "Beach Service Coverage", currentValue: 88.0, targetValue: 90.0, urgency: "medium" as const, impact: "Beachside order capacity" }
      ],
      customerSatisfaction: {
        overall: 4.4,
        foodQuality: 4.6,
        serviceSpeed: 4.0,
        cleanliness: 4.3,
        value: 4.2,
        totalReviews: 892
      },
      operationalMetrics: {
        avgOrderPrepTime: 11.8,
        kitchenEfficiency: 91,
        wastagePercentage: 3.5,
        staffUtilization: 83,
        peakHourCapacity: 95
      }
    },
    '8': { // Sal De Mar ID
      name: 'Sal De Mar',
      stats: {
        revenue: 9875,
        orders: 987,
        customers: 645,
        avgOrder: 31.20,
        trends: { revenue: 9.3, orders: 6.7, customers: -1.8, avgOrder: 4.2 }
      },
      revenueData: [
        { name: 'Mon', value: 1800 },
        { name: 'Tue', value: 1600 },
        { name: 'Wed', value: 2100 },
        { name: 'Thu', value: 1900 },
        { name: 'Fri', value: 2400 },
        { name: 'Sat', value: 2800 },
        { name: 'Sun', value: 2200 },
      ],
      orderData: [
        { name: '6AM', orders: 5 },
        { name: '9AM', orders: 23 },
        { name: '12PM', orders: 45 },
        { name: '3PM', orders: 38 },
        { name: '6PM', orders: 67 },
        { name: '9PM', orders: 42 },
      ],
      topItems: [
        { name: "Paella Valenciana", orders: 89, revenue: "$2,225", image: "🥘", change: "+16%" },
        { name: "Gazpacho", orders: 76, revenue: "$912", image: "🍅", change: "+11%" },
        { name: "Jamón Ibérico", orders: 65, revenue: "$1,950", image: "🥓", change: "+8%" },
        { name: "Patatas Bravas", orders: 54, revenue: "$648", image: "🥔", change: "+13%" },
        { name: "Churros", orders: 43, revenue: "$430", image: "🍩", change: "+5%" }
      ],
      performanceAlerts: [
        { metric: "Beachside Service Time", currentValue: 22.0, targetValue: 15.0, urgency: "critical" as const, impact: "Poor guest experience at beach tables" },
        { metric: "Spanish Menu Authenticity", currentValue: 85.0, targetValue: 90.0, urgency: "medium" as const, impact: "Brand positioning & guest expectations" }
      ],
      customerSatisfaction: {
        overall: 4.0,
        foodQuality: 4.2,
        serviceSpeed: 3.6,
        cleanliness: 3.9,
        value: 3.8,
        totalReviews: 388
      },
      operationalMetrics: {
        avgOrderPrepTime: 16.5,
        kitchenEfficiency: 79,
        wastagePercentage: 6.2,
        staffUtilization: 72,
        peakHourCapacity: 85
      }
    }
  },
  'hampton-inn-pensacola-beach': {
    all: {
      name: 'All Stores',
      stats: {
        revenue: 28950,
        orders: 2847,
        customers: 1941,
        avgOrder: 38.70,
        trends: { revenue: 18.2, orders: 15.8, customers: 12.7, avgOrder: 6.5 }
      },
      revenueData: [
        { name: 'Mon', value: 7200 },
        { name: 'Tue', value: 6100 },
        { name: 'Wed', value: 8800 },
        { name: 'Thu', value: 7500 },
        { name: 'Fri', value: 10200 },
        { name: 'Sat', value: 12800 },
        { name: 'Sun', value: 9200 },
      ],
      orderData: [
        { name: '6AM', orders: 28 },
        { name: '9AM', orders: 75 },
        { name: '12PM', orders: 145 },
        { name: '3PM', orders: 125 },
        { name: '6PM', orders: 178 },
        { name: '9PM', orders: 89 },
      ],
      topItems: [
        { name: "Gourmet Breakfast", orders: 398, revenue: "$6,922", image: "🍳", change: "+18%" },
        { name: "Club Sandwich", orders: 334, revenue: "$4,918", image: "🥪", change: "+14%" },
        { name: "Shrimp Cocktail", orders: 287, revenue: "$4,872", image: "🍤", change: "+11%" },
        { name: "Greek Salad", orders: 256, revenue: "$3,271", image: "🥗", change: "+22%" },
        { name: "Beef Tenderloin", orders: 198, revenue: "$5,842", image: "🥩", change: "+9%" }
      ],
      performanceAlerts: [
        { metric: "Room Service Time", currentValue: 22.5, targetValue: 20.0, urgency: "medium" as const, impact: "Guest room dining experience" },
        { metric: "Food Cost Percentage", currentValue: 29.8, targetValue: 28.0, urgency: "medium" as const, impact: "Hotel profit margins" },
        { metric: "Guest Satisfaction Score", currentValue: 4.5, targetValue: 4.6, urgency: "low" as const, impact: "Hotel reviews & reputation" }
      ],
      customerSatisfaction: {
        overall: 4.4,
        foodQuality: 4.6,
        serviceSpeed: 4.1,
        cleanliness: 4.3,
        value: 4.2,
        totalReviews: 1456
      },
      operationalMetrics: {
        avgOrderPrepTime: 11.8,
        kitchenEfficiency: 89,
        wastagePercentage: 3.8,
        staffUtilization: 82,
        peakHourCapacity: 94
      }
    },
    '1': {
      name: 'Hampton Café',
      stats: {
        revenue: 15426,
        orders: 1529,
        customers: 992,
        avgOrder: 32.50,
        trends: { revenue: 15.5, orders: 12.2, customers: 8.1, avgOrder: 4.7 }
      },
      revenueData: [
        { name: 'Mon', value: 3800 },
        { name: 'Tue', value: 3200 },
        { name: 'Wed', value: 4500 },
        { name: 'Thu', value: 3900 },
        { name: 'Fri', value: 5100 },
        { name: 'Sat', value: 6400 },
        { name: 'Sun', value: 4600 },
      ],
      orderData: [
        { name: '6AM', orders: 15 },
        { name: '9AM', orders: 42 },
        { name: '12PM', orders: 76 },
        { name: '3PM', orders: 58 },
        { name: '6PM', orders: 89 },
        { name: '9PM', orders: 45 },
      ],
      topItems: [
        { name: "Gourmet Breakfast", orders: 189, revenue: "$3,281", image: "🍳", change: "+16%" },
        { name: "Club Sandwich", orders: 145, revenue: "$2,175", image: "🥪", change: "+12%" },
        { name: "Greek Salad", orders: 112, revenue: "$1,456", image: "🥗", change: "+19%" },
        { name: "Beef Tenderloin", orders: 89, revenue: "$2,627", image: "🥩", change: "+8%" },
        { name: "Shrimp Cocktail", orders: 76, revenue: "$1,292", image: "🍤", change: "+7%" }
      ],
      performanceAlerts: [
        { metric: "Room Service Time", currentValue: 20.5, targetValue: 20.0, urgency: "low" as const, impact: "Guest room dining experience" },
        { metric: "Food Cost Percentage", currentValue: 28.8, targetValue: 28.0, urgency: "low" as const, impact: "Hotel profit margins" }
      ],
      customerSatisfaction: {
        overall: 4.3,
        foodQuality: 4.5,
        serviceSpeed: 4.0,
        cleanliness: 4.2,
        value: 4.1,
        totalReviews: 687
      },
      operationalMetrics: {
        avgOrderPrepTime: 12.2,
        kitchenEfficiency: 87,
        wastagePercentage: 4.1,
        staffUtilization: 80,
        peakHourCapacity: 92
      }
    },
    '2': {
      name: 'Poolside Grill',
      stats: {
        revenue: 13524,
        orders: 1318,
        customers: 949,
        avgOrder: 44.90,
        trends: { revenue: 21.2, orders: 16.8, customers: 14.7, avgOrder: 12.5 }
      },
      revenueData: [
        { name: 'Mon', value: 3400 },
        { name: 'Tue', value: 2900 },
        { name: 'Wed', value: 4300 },
        { name: 'Thu', value: 3600 },
        { name: 'Fri', value: 5100 },
        { name: 'Sat', value: 6400 },
        { name: 'Sun', value: 4600 },
      ],
      orderData: [
        { name: '6AM', orders: 13 },
        { name: '9AM', orders: 33 },
        { name: '12PM', orders: 69 },
        { name: '3PM', orders: 67 },
        { name: '6PM', orders: 89 },
        { name: '9PM', orders: 44 },
      ],
      topItems: [
        { name: "Poolside Burger", orders: 156, revenue: "$2,496", image: "🍔", change: "+20%" },
        { name: "Fish Tacos", orders: 134, revenue: "$2,278", image: "🌮", change: "+18%" },
        { name: "Caesar Salad", orders: 98, revenue: "$1,274", image: "🥗", change: "+15%" },
        { name: "Grilled Chicken", orders: 87, revenue: "$1,566", image: "🍗", change: "+11%" },
        { name: "Tropical Smoothie", orders: 76, revenue: "$988", image: "🥤", change: "+25%" }
      ],
      performanceAlerts: [
        { metric: "Pool Service Time", currentValue: 18.5, targetValue: 15.0, urgency: "medium" as const, impact: "Poolside guest experience" },
        { metric: "Guest Satisfaction Score", currentValue: 4.6, targetValue: 4.6, urgency: "low" as const, impact: "Pool area reputation" }
      ],
      customerSatisfaction: {
        overall: 4.5,
        foodQuality: 4.7,
        serviceSpeed: 4.2,
        cleanliness: 4.4,
        value: 4.3,
        totalReviews: 769
      },
      operationalMetrics: {
        avgOrderPrepTime: 11.5,
        kitchenEfficiency: 91,
        wastagePercentage: 3.7,
        staffUtilization: 84,
        peakHourCapacity: 96
      }
    }
  },
  'holiday-inn-resort-pensacola-beach': {
    all: {
      name: 'All Stores',
      stats: {
        revenue: 45850,
        orders: 4247,
        customers: 2841,
        avgOrder: 48.90,
        trends: { revenue: 22.2, orders: 18.8, customers: 15.7, avgOrder: 8.5 }
      },
      revenueData: [
        { name: 'Mon', value: 9200 },
        { name: 'Tue', value: 8100 },
        { name: 'Wed', value: 11800 },
        { name: 'Thu', value: 10500 },
        { name: 'Fri', value: 13200 },
        { name: 'Sat', value: 15800 },
        { name: 'Sun', value: 12200 },
      ],
      orderData: [
        { name: '6AM', orders: 45 },
        { name: '9AM', orders: 112 },
        { name: '12PM', orders: 198 },
        { name: '3PM', orders: 167 },
        { name: '6PM', orders: 234 },
        { name: '9PM', orders: 145 },
      ],
      topItems: [
        { name: "Resort Breakfast Buffet", orders: 512, revenue: "$12,922", image: "🍽️", change: "+25%" },
        { name: "Poolside Nachos", orders: 423, revenue: "$8,918", image: "🧀", change: "+19%" },
        { name: "Tropical Smoothie", orders: 398, revenue: "$4,872", image: "🥤", change: "+16%" },
        { name: "Beach BBQ Platter", orders: 287, revenue: "$8,271", image: "🍖", change: "+28%" },
        { name: "Key Lime Pie", orders: 234, revenue: "$3,842", image: "🥧", change: "+12%" }
      ],
      performanceAlerts: [
        { metric: "Poolside Service Time", currentValue: 15.5, targetValue: 15.0, urgency: "low" as const, impact: "Pool guest experience" },
        { metric: "Buffet Restocking", currentValue: 85.0, targetValue: 90.0, urgency: "medium" as const, impact: "Breakfast service quality" },
        { metric: "Resort Guest Satisfaction", currentValue: 4.7, targetValue: 4.8, urgency: "low" as const, impact: "Resort reputation & bookings" }
      ],
      customerSatisfaction: {
        overall: 4.6,
        foodQuality: 4.8,
        serviceSpeed: 4.3,
        cleanliness: 4.5,
        value: 4.4,
        totalReviews: 2156
      },
      operationalMetrics: {
        avgOrderPrepTime: 10.2,
        kitchenEfficiency: 93,
        wastagePercentage: 2.8,
        staffUtilization: 87,
        peakHourCapacity: 97
      }
    },
    '1': {
      name: 'Beachside Buffet',
      stats: {
        revenue: 23850,
        orders: 2247,
        customers: 1541,
        avgOrder: 52.90,
        trends: { revenue: 28.2, orders: 22.8, customers: 18.7, avgOrder: 12.5 }
      },
      revenueData: [
        { name: 'Mon', value: 4800 },
        { name: 'Tue', value: 4200 },
        { name: 'Wed', value: 6100 },
        { name: 'Thu', value: 5400 },
        { name: 'Fri', value: 6800 },
        { name: 'Sat', value: 8200 },
        { name: 'Sun', value: 6300 },
      ],
      orderData: [
        { name: '6AM', orders: 25 },
        { name: '9AM', orders: 67 },
        { name: '12PM', orders: 112 },
        { name: '3PM', orders: 89 },
        { name: '6PM', orders: 134 },
        { name: '9PM', orders: 78 },
      ],
      topItems: [
        { name: "Resort Breakfast Buffet", orders: 287, revenue: "$7,248", image: "🍽️", change: "+27%" },
        { name: "Beach BBQ Platter", orders: 156, revenue: "$4,524", image: "🍖", change: "+31%" },
        { name: "Key Lime Pie", orders: 134, revenue: "$2,278", image: "🥧", change: "+15%" },
        { name: "Tropical Smoothie", orders: 112, revenue: "$1,456", image: "🥤", change: "+18%" },
        { name: "Seafood Tower", orders: 89, revenue: "$3,115", image: "🦐", change: "+22%" }
      ],
      performanceAlerts: [
        { metric: "Buffet Restocking", currentValue: 82.0, targetValue: 90.0, urgency: "medium" as const, impact: "Breakfast service quality" },
        { metric: "Resort Guest Satisfaction", currentValue: 4.8, targetValue: 4.8, urgency: "low" as const, impact: "Resort reputation & bookings" }
      ],
      customerSatisfaction: {
        overall: 4.7,
        foodQuality: 4.9,
        serviceSpeed: 4.4,
        cleanliness: 4.6,
        value: 4.5,
        totalReviews: 1287
      },
      operationalMetrics: {
        avgOrderPrepTime: 8.5,
        kitchenEfficiency: 95,
        wastagePercentage: 2.1,
        staffUtilization: 89,
        peakHourCapacity: 98
      }
    },
    '2': {
      name: 'Tiki Bar & Grill',
      stats: {
        revenue: 22000,
        orders: 2000,
        customers: 1300,
        avgOrder: 44.90,
        trends: { revenue: 16.2, orders: 14.8, customers: 12.7, avgOrder: 4.5 }
      },
      revenueData: [
        { name: 'Mon', value: 4400 },
        { name: 'Tue', value: 3900 },
        { name: 'Wed', value: 5700 },
        { name: 'Thu', value: 5100 },
        { name: 'Fri', value: 6400 },
        { name: 'Sat', value: 7600 },
        { name: 'Sun', value: 5900 },
      ],
      orderData: [
        { name: '6AM', orders: 20 },
        { name: '9AM', orders: 45 },
        { name: '12PM', orders: 86 },
        { name: '3PM', orders: 78 },
        { name: '6PM', orders: 100 },
        { name: '9PM', orders: 67 },
      ],
      topItems: [
        { name: "Poolside Nachos", orders: 225, revenue: "$4,725", image: "🧀", change: "+17%" },
        { name: "Tropical Cocktail", orders: 198, revenue: "$2,970", image: "🍹", change: "+14%" },
        { name: "Fish Tacos", orders: 167, revenue: "$3,340", image: "🌮", change: "+21%" },
        { name: "Coconut Shrimp", orders: 134, revenue: "$2,814", image: "🍤", change: "+19%" },
        { name: "Paradise Burger", orders: 112, revenue: "$2,240", image: "🍔", change: "+12%" }
      ],
      performanceAlerts: [
        { metric: "Poolside Service Time", currentValue: 16.5, targetValue: 15.0, urgency: "medium" as const, impact: "Pool guest experience" },
        { metric: "Drink Quality Score", currentValue: 4.5, targetValue: 4.7, urgency: "medium" as const, impact: "Tiki bar reputation" }
      ],
      customerSatisfaction: {
        overall: 4.5,
        foodQuality: 4.6,
        serviceSpeed: 4.2,
        cleanliness: 4.4,
        value: 4.3,
        totalReviews: 869
      },
      operationalMetrics: {
        avgOrderPrepTime: 12.8,
        kitchenEfficiency: 88,
        wastagePercentage: 3.5,
        staffUtilization: 85,
        peakHourCapacity: 94
      }
    }
  },
  'fairfield-inn-pensacola-beach': {
    all: {
      name: 'All Stores',
      stats: {
        revenue: 15850,
        orders: 1547,
        customers: 1041,
        avgOrder: 32.40,
        trends: { revenue: 8.2, orders: 6.8, customers: 4.7, avgOrder: 2.5 }
      },
      revenueData: [
        { name: 'Mon', value: 2200 },
        { name: 'Tue', value: 1900 },
        { name: 'Wed', value: 2800 },
        { name: 'Thu', value: 2500 },
        { name: 'Fri', value: 3200 },
        { name: 'Sat', value: 3800 },
        { name: 'Sun', value: 2900 },
      ],
      orderData: [
        { name: '6AM', orders: 15 },
        { name: '9AM', orders: 42 },
        { name: '12PM', orders: 78 },
        { name: '3PM', orders: 65 },
        { name: '6PM', orders: 89 },
        { name: '9PM', orders: 48 },
      ],
      topItems: [
        { name: "Continental Breakfast", orders: 234, revenue: "$2,922", image: "🥐", change: "+12%" },
        { name: "Coffee & Pastries", orders: 198, revenue: "$1,918", image: "☕", change: "+8%" },
        { name: "Grab & Go Salad", orders: 167, revenue: "$2,172", image: "🥗", change: "+15%" },
        { name: "Express Sandwich", orders: 145, revenue: "$1,971", image: "🥪", change: "+6%" },
        { name: "Fresh Fruit Bowl", orders: 123, revenue: "$1,542", image: "🍓", change: "+9%" }
      ],
      performanceAlerts: [
        { metric: "Breakfast Service Speed", currentValue: 8.5, targetValue: 8.0, urgency: "low" as const, impact: "Business traveler satisfaction" },
        { metric: "Coffee Quality Score", currentValue: 4.2, targetValue: 4.5, urgency: "medium" as const, impact: "Guest morning experience" }
      ],
      customerSatisfaction: {
        overall: 4.1,
        foodQuality: 4.3,
        serviceSpeed: 3.9,
        cleanliness: 4.0,
        value: 4.2,
        totalReviews: 756
      },
      operationalMetrics: {
        avgOrderPrepTime: 6.8,
        kitchenEfficiency: 85,
        wastagePercentage: 4.2,
        staffUtilization: 78,
        peakHourCapacity: 88
      }
    },
    '1': {
      name: 'Express Café',
      stats: {
        revenue: 8850,
        orders: 847,
        customers: 641,
        avgOrder: 28.40,
        trends: { revenue: 6.2, orders: 4.8, customers: 2.7, avgOrder: 1.5 }
      },
      revenueData: [
        { name: 'Mon', value: 1200 },
        { name: 'Tue', value: 1000 },
        { name: 'Wed', value: 1500 },
        { name: 'Thu', value: 1300 },
        { name: 'Fri', value: 1700 },
        { name: 'Sat', value: 2000 },
        { name: 'Sun', value: 1550 },
      ],
      orderData: [
        { name: '6AM', orders: 8 },
        { name: '9AM', orders: 25 },
        { name: '12PM', orders: 45 },
        { name: '3PM', orders: 38 },
        { name: '6PM', orders: 52 },
        { name: '9PM', orders: 28 },
      ],
      topItems: [
        { name: "Continental Breakfast", orders: 134, revenue: "$1,676", image: "🥐", change: "+10%" },
        { name: "Coffee & Pastries", orders: 112, revenue: "$1,085", image: "☕", change: "+6%" },
        { name: "Express Sandwich", orders: 89, revenue: "$1,207", image: "🥪", change: "+4%" },
        { name: "Fresh Fruit Bowl", orders: 76, revenue: "$950", image: "🍓", change: "+8%" },
        { name: "Yogurt Parfait", orders: 65, revenue: "$715", image: "🥛", change: "+12%" }
      ],
      performanceAlerts: [
        { metric: "Breakfast Service Speed", currentValue: 7.5, targetValue: 8.0, urgency: "low" as const, impact: "Business traveler satisfaction" },
        { metric: "Coffee Quality Score", currentValue: 4.3, targetValue: 4.5, urgency: "low" as const, impact: "Guest morning experience" }
      ],
      customerSatisfaction: {
        overall: 4.2,
        foodQuality: 4.4,
        serviceSpeed: 4.0,
        cleanliness: 4.1,
        value: 4.3,
        totalReviews: 456
      },
      operationalMetrics: {
        avgOrderPrepTime: 5.8,
        kitchenEfficiency: 88,
        wastagePercentage: 3.8,
        staffUtilization: 82,
        peakHourCapacity: 92
      }
    },
    '2': {
      name: 'Market Deli',
      stats: {
        revenue: 7000,
        orders: 700,
        customers: 400,
        avgOrder: 36.40,
        trends: { revenue: 10.2, orders: 8.8, customers: 6.7, avgOrder: 3.5 }
      },
      revenueData: [
        { name: 'Mon', value: 1000 },
        { name: 'Tue', value: 900 },
        { name: 'Wed', value: 1300 },
        { name: 'Thu', value: 1200 },
        { name: 'Fri', value: 1500 },
        { name: 'Sat', value: 1800 },
        { name: 'Sun', value: 1350 },
      ],
      orderData: [
        { name: '6AM', orders: 7 },
        { name: '9AM', orders: 17 },
        { name: '12PM', orders: 33 },
        { name: '3PM', orders: 27 },
        { name: '6PM', orders: 37 },
        { name: '9PM', orders: 20 },
      ],
      topItems: [
        { name: "Grab & Go Salad", orders: 89, revenue: "$1,157", image: "🥗", change: "+18%" },
        { name: "Deli Sandwich", orders: 76, revenue: "$1,064", image: "🥪", change: "+8%" },
        { name: "Soup & Bread", orders: 65, revenue: "$845", image: "🍲", change: "+14%" },
        { name: "Protein Box", orders: 54, revenue: "$756", image: "🥙", change: "+11%" },
        { name: "Smoothie Bowl", orders: 43, revenue: "$602", image: "🍓", change: "+15%" }
      ],
      performanceAlerts: [
        { metric: "Deli Freshness Score", currentValue: 4.1, targetValue: 4.3, urgency: "medium" as const, impact: "Food quality reputation" },
        { metric: "Service Efficiency", currentValue: 85.0, targetValue: 88.0, urgency: "low" as const, impact: "Guest wait times" }
      ],
      customerSatisfaction: {
        overall: 4.0,
        foodQuality: 4.2,
        serviceSpeed: 3.8,
        cleanliness: 3.9,
        value: 4.1,
        totalReviews: 300
      },
      operationalMetrics: {
        avgOrderPrepTime: 8.2,
        kitchenEfficiency: 82,
        wastagePercentage: 4.8,
        staffUtilization: 74,
        peakHourCapacity: 84
      }
    }
  }
};

// Legacy export for backward compatibility
export const storeData = resortDashboardData['hilton-pensacola-beach'];

export const stores = [
  { id: 'all', name: 'All Stores', count: 8 },
  { id: '1', name: 'Piazza', count: 3 },
  { id: '2', name: 'Red Fish Blue Fish', count: 2 },
  { id: '3', name: 'Sal De Mar', count: 1 },
];

export const employeeDeliveries = [
  {
    id: 1,
    name: 'Sarah M.',
    avatar: 'SM',
    deliveries: 23,
    onTime: 21,
    rating: 4.8,
    earnings: '$184',
    status: 'active',
    color: 'bg-blue-500'
  },
  {
    id: 2,
    name: 'Mike R.',
    avatar: 'MR',
    deliveries: 18,
    onTime: 17,
    rating: 4.6,
    earnings: '$144',
    status: 'active',
    color: 'bg-green-500'
  },
  {
    id: 3,
    name: 'Emma K.',
    avatar: 'EK',
    deliveries: 15,
    onTime: 14,
    rating: 4.9,
    earnings: '$120',
    status: 'break',
    color: 'bg-purple-500'
  },
  {
    id: 4,
    name: 'James L.',
    avatar: 'JL',
    deliveries: 12,
    onTime: 11,
    rating: 4.5,
    earnings: '$96',
    status: 'active',
    color: 'bg-orange-500'
  },
  {
    id: 5,
    name: 'Lisa P.',
    avatar: 'LP',
    deliveries: 9,
    onTime: 8,
    rating: 4.7,
    earnings: '$72',
    status: 'offline',
    color: 'bg-pink-500'
  },
  {
    id: 6,
    name: 'Alex T.',
    avatar: 'AT',
    deliveries: 16,
    onTime: 15,
    rating: 4.4,
    earnings: '$128',
    status: 'active',
    color: 'bg-indigo-500'
  },
  {
    id: 7,
    name: 'Sofia H.',
    avatar: 'SH',
    deliveries: 11,
    onTime: 10,
    rating: 4.6,
    earnings: '$88',
    status: 'break',
    color: 'bg-teal-500'
  }
];

export const staffPerformance = [
  {
    id: 1,
    name: 'Carlos M.',
    role: 'Head Chef',
    shift: 'Morning',
    efficiency: 94,
    ordersCompleted: 127,
    avgPrepTime: 8.5,
    rating: 4.9,
    store: 'Red Fish Blue Fish'
  },
  {
    id: 2,
    name: 'Maria G.',
    role: 'Line Cook',
    shift: 'Evening',
    efficiency: 87,
    ordersCompleted: 98,
    avgPrepTime: 11.2,
    rating: 4.6,
    store: 'Piazza'
  },
  {
    id: 3,
    name: 'Ahmed K.',
    role: 'Prep Cook',
    shift: 'Morning',
    efficiency: 91,
    ordersCompleted: 156,
    avgPrepTime: 6.8,
    rating: 4.7,
    store: 'Sal De Mar'
  }
];

export const costAnalysis = {
  foodCost: {
    current: 28.5,
    target: 30.0,
    trend: -1.2
  },
  laborCost: {
    current: 32.8,
    target: 30.0,
    trend: +2.1
  },
  overheadCost: {
    current: 15.7,
    target: 18.0,
    trend: -0.8
  }
};