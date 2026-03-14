// Store-specific reports data for Pensacola Beach Resort venues
export const reportsData = {
  all: {
    name: "All Stores",
    revenue: {
      total: 4220.5,
      growth: 4.07,
      breakdown: [
        {
          label: "Net Revenue",
          amount: 1928,
          color: "bg-emerald-500",
          percentage: 45.7,
        },
        { label: "Tax", amount: 1060, color: "bg-blue-500", percentage: 25.1 },
        {
          label: "Commission",
          amount: 844,
          color: "bg-orange-500",
          percentage: 20.0,
        },
        { label: "Tips", amount: 388, color: "bg-purple-500", percentage: 9.2 },
      ],
    },
    customerAnalytics: {
      totalCustomers: 1247,
      customerGrowth: 12,
      lifetimeValue: 186,
      lifetimeValueGrowth: 8.5,
      retentionRate: 73.2,
      retentionGrowth: 2.1,
      satisfaction: 4.7,
      totalReviews: 892,
    },
    paymentTypes: [
      { name: "Credit Card", value: 45, color: "#3B82F6" },
      { name: "Cash", value: 25, color: "#10B981" },
      { name: "Digital Wallet", value: 20, color: "#F59E0B" },
      { name: "Gift Card", value: 10, color: "#8B5CF6" },
    ],
    cancellations: {
      rate: 3.2,
      totalCancelled: 24,
      reasons: [
        { reason: "Long wait time", count: 8, percentage: 33.3 },
        { reason: "Wrong order", count: 6, percentage: 25.0 },
        { reason: "Payment issues", count: 4, percentage: 16.7 },
        { reason: "Customer changed mind", count: 6, percentage: 25.0 },
      ],
    },
  },
  "1": {
    // Windrose Restaurant
    name: "Windrose Restaurant",
    revenue: {
      total: 1850.25,
      growth: 5.8,
      breakdown: [
        {
          label: "Net Revenue",
          amount: 845,
          color: "bg-emerald-500",
          percentage: 45.7,
        },
        { label: "Tax", amount: 462, color: "bg-blue-500", percentage: 25.0 },
        {
          label: "Commission",
          amount: 370,
          color: "bg-orange-500",
          percentage: 20.0,
        },
        { label: "Tips", amount: 173, color: "bg-purple-500", percentage: 9.3 },
      ],
    },
    customerAnalytics: {
      totalCustomers: 523,
      customerGrowth: 14,
      lifetimeValue: 198,
      lifetimeValueGrowth: 9.2,
      retentionRate: 78.5,
      retentionGrowth: 2.8,
      satisfaction: 4.8,
      totalReviews: 412,
    },
    paymentTypes: [
      { name: "Credit Card", value: 52, color: "#3B82F6" },
      { name: "Cash", value: 18, color: "#10B981" },
      { name: "Digital Wallet", value: 22, color: "#F59E0B" },
      { name: "Gift Card", value: 8, color: "#8B5CF6" },
    ],
    cancellations: {
      rate: 2.4,
      totalCancelled: 9,
      reasons: [
        { reason: "Long wait time", count: 3, percentage: 33.3 },
        { reason: "Wrong order", count: 2, percentage: 22.2 },
        { reason: "Payment issues", count: 1, percentage: 11.1 },
        { reason: "Customer changed mind", count: 3, percentage: 33.3 },
      ],
    },
  },
  "2": {
    // Tiki Bar
    name: "Tiki Bar",
    revenue: {
      total: 1420.75,
      growth: 3.2,
      breakdown: [
        {
          label: "Net Revenue",
          amount: 650,
          color: "bg-emerald-500",
          percentage: 45.8,
        },
        { label: "Tax", amount: 355, color: "bg-blue-500", percentage: 25.0 },
        {
          label: "Commission",
          amount: 284,
          color: "bg-orange-500",
          percentage: 20.0,
        },
        { label: "Tips", amount: 132, color: "bg-purple-500", percentage: 9.3 },
      ],
    },
    customerAnalytics: {
      totalCustomers: 398,
      customerGrowth: 11,
      lifetimeValue: 165,
      lifetimeValueGrowth: 7.8,
      retentionRate: 71.2,
      retentionGrowth: 1.9,
      satisfaction: 4.6,
      totalReviews: 289,
    },
    paymentTypes: [
      { name: "Credit Card", value: 48, color: "#3B82F6" },
      { name: "Cash", value: 28, color: "#10B981" },
      { name: "Digital Wallet", value: 18, color: "#F59E0B" },
      { name: "Gift Card", value: 6, color: "#8B5CF6" },
    ],
    cancellations: {
      rate: 3.1,
      totalCancelled: 8,
      reasons: [
        { reason: "Long wait time", count: 2, percentage: 25.0 },
        { reason: "Wrong order", count: 3, percentage: 37.5 },
        { reason: "Payment issues", count: 1, percentage: 12.5 },
        { reason: "Customer changed mind", count: 2, percentage: 25.0 },
      ],
    },
  },
  "3": {
    // Salty Rose Beach Bar
    name: "Salty Rose Beach Bar",
    revenue: {
      total: 949.5,
      growth: 2.9,
      breakdown: [
        {
          label: "Net Revenue",
          amount: 433,
          color: "bg-emerald-500",
          percentage: 45.6,
        },
        { label: "Tax", amount: 243, color: "bg-blue-500", percentage: 25.6 },
        {
          label: "Commission",
          amount: 190,
          color: "bg-orange-500",
          percentage: 20.0,
        },
        { label: "Tips", amount: 83, color: "bg-purple-500", percentage: 8.7 },
      ],
    },
    customerAnalytics: {
      totalCustomers: 326,
      customerGrowth: 9,
      lifetimeValue: 128,
      lifetimeValueGrowth: 5.4,
      retentionRate: 68.8,
      retentionGrowth: 1.5,
      satisfaction: 4.5,
      totalReviews: 191,
    },
    paymentTypes: [
      { name: "Credit Card", value: 35, color: "#3B82F6" },
      { name: "Cash", value: 40, color: "#10B981" },
      { name: "Digital Wallet", value: 18, color: "#F59E0B" },
      { name: "Gift Card", value: 7, color: "#8B5CF6" },
    ],
    cancellations: {
      rate: 4.2,
      totalCancelled: 7,
      reasons: [
        { reason: "Long wait time", count: 3, percentage: 42.9 },
        { reason: "Wrong order", count: 1, percentage: 14.3 },
        { reason: "Payment issues", count: 2, percentage: 28.6 },
        { reason: "Customer changed mind", count: 1, percentage: 14.3 },
      ],
    },
  },
};
