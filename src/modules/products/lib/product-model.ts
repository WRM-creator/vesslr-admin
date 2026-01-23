export interface Product {
  id: string;
  name: string;
  category: string;
  merchant: string;
  status: "draft" | "active" | "reserved" | "in_transaction" | "fulfilled";
  created: string; // ISO date string
  price: number;
  transactionType:
    | "purchase"
    | "lease"
    | "charter"
    | "bulk_supply"
    | "spot_trade";
  currency: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod_001",
    name: "Brent Crude Oil (1000 bbl)",
    category: "Commodities",
    merchant: "North Sea Energy",
    status: "active",
    created: "2024-03-15T10:00:00Z",
    price: 85000.0,
    transactionType: "spot_trade",
    currency: "USD",
  },
  {
    id: "prod_002",
    name: "Offshore Drilling Rig - Type A",
    category: "Equipment",
    merchant: "Global Maritime Services",
    status: "in_transaction",
    created: "2024-02-20T14:30:00Z",
    price: 150000.0, // Daily rate
    transactionType: "lease",
    currency: "USD",
  },
  {
    id: "prod_003",
    name: "LNG Tanker 'Ocean Spirit'",
    category: "Logistics",
    merchant: "Pacific Shipping Lines",
    status: "reserved",
    created: "2024-04-01T09:15:00Z",
    price: 4500000.0,
    transactionType: "charter",
    currency: "USD",
  },
  {
    id: "prod_004",
    name: "Refined Diesel (500 MT)",
    category: "Commodities",
    merchant: "Gulf Refineries Ltd",
    status: "active",
    created: "2023-12-10T11:45:00Z",
    price: 425000.0,
    transactionType: "bulk_supply",
    currency: "USD",
  },
  {
    id: "prod_005",
    name: "Pipeline Inspection Drone",
    category: "Technology",
    merchant: "AeroTech Solutions",
    status: "draft",
    created: "2024-01-05T16:20:00Z",
    price: 25000.0,
    transactionType: "purchase",
    currency: "USD",
  },
  {
    id: "prod_006",
    name: "Seismic Survey Data - Block 4",
    category: "Data & Intelligence",
    merchant: "GeoServices Corp",
    status: "active",
    created: "2024-03-25T13:10:00Z",
    price: 120000.0,
    transactionType: "purchase",
    currency: "USD",
  },
  {
    id: "prod_007",
    name: "Platform Support Vessel",
    category: "Logistics",
    merchant: "Maritime Support Co",
    status: "fulfilled",
    created: "2024-01-20T08:00:00Z",
    price: 5500000.0,
    transactionType: "charter",
    currency: "USD",
  },
  {
    id: "prod_008",
    name: "Heavy Duty Pump Set",
    category: "Equipment",
    merchant: "Industrial Flow Systems",
    status: "active",
    created: "2024-04-05T11:00:00Z",
    price: 45000.0,
    transactionType: "purchase",
    currency: "USD",
  },
  {
    id: "prod_009",
    name: "Safety Equipment Batch (ISO 9001)",
    category: "Safety",
    merchant: "SecureSite Supplies",
    status: "active",
    created: "2024-04-10T09:30:00Z",
    price: 12500.0,
    transactionType: "bulk_supply",
    currency: "USD",
  },
  {
    id: "prod_010",
    name: "Mobile Refining Unit",
    category: "Equipment",
    merchant: "Process Engineering Inc",
    status: "reserved",
    created: "2024-03-01T15:45:00Z",
    price: 850000.0,
    transactionType: "lease",
    currency: "USD",
  },
];
