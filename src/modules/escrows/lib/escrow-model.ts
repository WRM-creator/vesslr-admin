export interface Escrow {
  id: string;
  transactionReference: string;
  merchantName: string;
  customerName: string;
  amount: number;
  currency: string;
  status: "held" | "released" | "disputed" | "refunded";
  createdAt: string; // ISO date string
  riskFlags: ("high_value" | "new_account" | "velocity_check" | "mismatch")[];
}

export const MOCK_ESCROWS: Escrow[] = [
  {
    id: "esc_01",
    transactionReference: "txn_88s9d7",
    merchantName: "TechWorld Inc.",
    customerName: "Alice Johnson",
    amount: 1299.0,
    currency: "USD",
    status: "held",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    riskFlags: [],
  },
  {
    id: "esc_02",
    transactionReference: "txn_99d1a2",
    merchantName: "Global Imports",
    customerName: "Bob Smith",
    amount: 5400.0,
    currency: "USD",
    status: "disputed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    riskFlags: ["high_value", "mismatch"],
  },
  {
    id: "esc_03",
    transactionReference: "txn_77c3b4",
    merchantName: "Vintage Collectibles",
    customerName: "Charlie Brown",
    amount: 450.0,
    currency: "USD",
    status: "released",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    riskFlags: ["new_account"],
  },
  {
    id: "esc_04",
    transactionReference: "txn_66e4f5",
    merchantName: "Fast Fashion",
    customerName: "Diana Prince",
    amount: 89.99,
    currency: "USD",
    status: "refunded",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
    riskFlags: [],
  },
  {
    id: "esc_05",
    transactionReference: "txn_55g6h7",
    merchantName: "Luxury Watches",
    customerName: "Edward Elric",
    amount: 15000.0,
    currency: "USD",
    status: "held",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    riskFlags: ["high_value", "velocity_check"],
  },
];
