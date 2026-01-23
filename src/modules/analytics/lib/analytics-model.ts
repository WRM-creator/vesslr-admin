export interface TransactionVolumeData {
  date: string;
  count: number;
  value: number;
}

export interface CategoryDemandData {
  category: string;
  itemCount: number;
  revenue: number;
  growth: number;
}

export interface SellerReliabilityData {
  sellerName: string;
  fulfillmentRate: number;
  responseTime: number; // in hours
  rating: number; // out of 5
  disputeRate: number; // percentage
}

export interface BuyerBehaviourData {
  period: string;
  newBuyers: number;
  repeatBuyers: number;
  avgOrderValue: number;
}

export interface FraudSignalData {
  id: string;
  signalType:
    | "Suspicious IP"
    | "Velocity Check"
    | "Document Mismatch"
    | "High Value Anomaly"
    | "Identity Verification";
  severity: "critical" | "high" | "medium" | "low";
  timestamp: string;
  description: string;
  relatedEntity: string; // e.g., "TX-1234" or "User-567"
  status: "Open" | "Investigating" | "Resolved";
}

// Mock Data Generators

export const generateTransactionVolumeData = (
  days = 30,
): TransactionVolumeData[] => {
  const data: TransactionVolumeData[] = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Simulate some randomness with a trend
    const baseCount = 50 + Math.random() * 100; // 50-150 base
    const trendFactor = 1 + ((days - i) / days) * 0.5; // Up to 50% growth over period
    const count = Math.round(baseCount * trendFactor);
    const value = Math.round(count * (500 + Math.random() * 1000)); // Avg transaction $500-$1500

    data.push({
      date: date.toISOString().split("T")[0],
      count,
      value,
    });
  }
  return data;
};

export const MOCK_CATEGORY_DEMAND: CategoryDemandData[] = [
  {
    category: "Petroleum Products",
    itemCount: 1250,
    revenue: 5200000,
    growth: 12.5,
  },
  {
    category: "Heavy Machinery",
    itemCount: 450,
    revenue: 8900000,
    growth: 5.2,
  },
  {
    category: "Safety Equipment",
    itemCount: 2800,
    revenue: 450000,
    growth: 18.7,
  },
  {
    category: "Construction Materials",
    itemCount: 1800,
    revenue: 2100000,
    growth: -2.4,
  },
  {
    category: "Industrial Chemicals",
    itemCount: 950,
    revenue: 3400000,
    growth: 8.9,
  },
  {
    category: "Logistics Services",
    itemCount: 620,
    revenue: 1200000,
    growth: 15.1,
  },
];

export const MOCK_SELLER_RELIABILITY: SellerReliabilityData[] = [
  {
    sellerName: "Global Energy Corp",
    fulfillmentRate: 98.5,
    responseTime: 2.1,
    rating: 4.8,
    disputeRate: 0.5,
  },
  {
    sellerName: "Atlas Machinery",
    fulfillmentRate: 92.0,
    responseTime: 8.5,
    rating: 4.2,
    disputeRate: 2.1,
  },
  {
    sellerName: "SafeGuard Supplies",
    fulfillmentRate: 99.1,
    responseTime: 1.5,
    rating: 4.9,
    disputeRate: 0.2,
  },
  {
    sellerName: "BuildRight Mat.",
    fulfillmentRate: 85.4,
    responseTime: 12.2,
    rating: 3.8,
    disputeRate: 4.5,
  },
  {
    sellerName: "ChemTech Intl",
    fulfillmentRate: 94.8,
    responseTime: 4.0,
    rating: 4.6,
    disputeRate: 1.2,
  },
];

export const generateBuyerBehaviourData = (
  weeks = 12,
): BuyerBehaviourData[] => {
  const data: BuyerBehaviourData[] = [];
  const now = new Date();

  for (let i = weeks; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i * 7);

    const newBuyers = Math.round(20 + Math.random() * 30);
    const repeatBuyers = Math.round(40 + Math.random() * 50 + (weeks - i) * 2); // Growing base

    data.push({
      period: `Week ${weeks - i + 1}`,
      newBuyers,
      repeatBuyers,
      avgOrderValue: Math.round(800 + Math.random() * 400),
    });
  }
  return data;
};

export const MOCK_FRAUD_SIGNALS: FraudSignalData[] = [
  {
    id: "SIG-001",
    signalType: "Velocity Check",
    severity: "high",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    description: "Multiple high-value transactions from same IP within 1 hour.",
    relatedEntity: "User-8821",
    status: "Open",
  },
  {
    id: "SIG-002",
    signalType: "Document Mismatch",
    severity: "medium",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    description: "Business license expiry date does not match OCR output.",
    relatedEntity: "Merch-412",
    status: "Investigating",
  },
  {
    id: "SIG-003",
    signalType: "Suspicious IP",
    severity: "critical",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    description: "Login attempt from sanctioned region (North Korea).",
    relatedEntity: "User-Admin-02",
    status: "Resolved", // False positive potentially
  },
  {
    id: "SIG-004",
    signalType: "Identity Verification",
    severity: "low",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    description: "Passport photo quality below threshold.",
    relatedEntity: "User-9912",
    status: "Open",
  },
  {
    id: "SIG-005",
    signalType: "High Value Anomaly",
    severity: "medium",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    description: "Transaction value 500% above user average.",
    relatedEntity: "TX-55102",
    status: "Resolved",
  },
];
