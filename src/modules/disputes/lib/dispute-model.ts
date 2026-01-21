export interface Dispute {
  id: string;
  transactionReference: string;
  productName: string;
  category: string;
  raisedBy: {
    name: string;
    type: "merchant" | "customer";
  };
  status: "open" | "resolved" | "escalated" | "closed";
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export const MOCK_DISPUTES: Dispute[] = [
  {
    id: "dsp_01",
    transactionReference: "txn_88s9d7",
    productName: "Wireless Headphones",
    category: "Electronics",
    raisedBy: {
      name: "Alice Johnson",
      type: "customer",
    },
    status: "open",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: "dsp_02",
    transactionReference: "txn_99d1a2",
    productName: "Office Chair",
    category: "Furniture",
    raisedBy: {
      name: "Office Supplies Co.",
      type: "merchant",
    },
    status: "escalated",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: "dsp_03",
    transactionReference: "txn_77c3b4",
    productName: "Vintage Camera",
    category: "Photography",
    raisedBy: {
      name: "Charlie Brown",
      type: "customer",
    },
    status: "resolved",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(), // 8 days ago
  },
  {
    id: "dsp_04",
    transactionReference: "txn_66e4f5",
    productName: "Silk Scarf",
    category: "Fashion",
    raisedBy: {
      name: "Diana Prince",
      type: "customer",
    },
    status: "closed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 days ago
  },
  {
    id: "dsp_05",
    transactionReference: "txn_55g6h7",
    productName: "Coffee Maker",
    category: "Appliances",
    raisedBy: {
      name: "Brew Masters",
      type: "merchant",
    },
    status: "open",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
  },
];
