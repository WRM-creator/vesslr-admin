export type TransactionState =
  | "initiated"
  | "docs_submitted"
  | "compliance_review"
  | "escrow_funded"
  | "logistics_assigned"
  | "in_transit"
  | "delivery_confirmed"
  | "settlement_released"
  | "closed";

export interface PartyInfo {
  id: string;
  name: string;
  companyName: string;
  avatar?: string;
  trustScore: number;
  verificationStatus: "verified" | "pending" | "unverified";
  profileUrl: string;
}

export interface ProductInfo {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  thumbnail?: string;
  quantity: number;
  unit: string;
}

export interface FinancialsInfo {
  currency: string;
  unitPrice: number;
  subtotal: number;
  platformFee: number;
  escrowFee: number;
  tax: number;
  totalValue: number;
}

export interface EscrowInfo {
  status:
    | "pending"
    | "funded"
    | "ready_for_release"
    | "released"
    | "dispute_hold";
  amountSecured: number;
  currency: string;
  releaseConditions: string[];
  depositDate?: string;
}

export interface ComplianceInfo {
  requiredDocuments: {
    id: string;
    name: string;
    description: string;
    status: "pending" | "submitted" | "approved" | "rejected";
    submittedDate?: string;
    submittedBy?: "buyer" | "seller";
    url?: string;
  }[];
  overallStatus: "pending" | "approved" | "rejected";
  reviewer?: string;
}

export interface LogisticsInfo {
  carrier: string;
  carrierLogo?: string;
  trackingId: string;
  status:
    | "pending"
    | "processing"
    | "in_transit"
    | "out_for_delivery"
    | "delivered"
    | "exception";
  eta?: string;
  checkpoints: {
    date: string;
    location: string;
    status: string;
    description: string;
  }[];
}

export interface TimelineEvent {
  id: string;
  type: "system" | "user" | "admin" | "financial" | "logistic";
  title: string;
  description?: string;
  timestamp: string;
  actor?: string; // Name of person/system acting
}

export interface AdminInfo {
  riskScore: number; // 0-100
  notes: {
    id: string;
    author: string;
    date: string;
    content: string;
  }[];
  overrides: {
    date: string;
    admin: string;
    action: string;
    reason: string;
  }[];
}

export interface TransactionDetails {
  id: string;
  type: "purchase" | "lease" | "charter" | "bulk_supply" | "spot_trade";
  state: TransactionState;
  createdAt: string;
  updatedAt: string;

  // Parties
  buyer: PartyInfo;
  seller: PartyInfo;

  // Product & Value
  product: ProductInfo;
  financials: FinancialsInfo;

  // Escrow
  escrow: EscrowInfo;

  // Compliance
  compliance: ComplianceInfo;

  // Logistics
  logistics?: LogisticsInfo;

  // Audit & Admin
  timeline: TimelineEvent[];
  admin: AdminInfo;
}

export const MOCK_TRANSACTION_DETAILS: TransactionDetails = {
  id: "TRX-7829-4412",
  type: "purchase",
  state: "in_transit",
  createdAt: "2026-01-15T08:30:00Z",
  updatedAt: "2026-01-20T14:15:00Z",

  buyer: {
    id: "usr_buyer_01",
    name: "James Wilson",
    companyName: "Global Imports Ltd",
    trustScore: 92,
    verificationStatus: "verified",
    profileUrl: "/customers/usr_buyer_01",
    avatar: "https://ui.shadcn.com/avatars/01.png",
  },

  seller: {
    id: "usr_seller_01",
    name: "Elena Rodriguez",
    companyName: "Acme Industries",
    trustScore: 88,
    verificationStatus: "verified",
    profileUrl: "/merchants/usr_seller_01",
    avatar: "https://ui.shadcn.com/avatars/04.png",
  },

  product: {
    id: "prod_123",
    name: "Industrial Hydraulic Pumps (Model X-500)",
    category: "Industrial Machinery",
    categoryId: "cat_machinery",
    quantity: 50,
    unit: "units",
    thumbnail: "/placeholder-product.jpg", // In reality would be a real image
  },

  financials: {
    currency: "USD",
    unitPrice: 1200,
    subtotal: 60000,
    platformFee: 1200, // 2%
    escrowFee: 600, // 1%
    tax: 0, // International trade
    totalValue: 61800,
  },

  escrow: {
    status: "funded",
    amountSecured: 61800,
    currency: "USD",
    releaseConditions: [
      "Delivery confirmation by carrier",
      "Buyer inspection period (48h) elapsed",
      "No active disputes",
    ],
    depositDate: "2026-01-16T10:45:00Z",
  },

  compliance: {
    overallStatus: "approved",
    requiredDocuments: [
      {
        id: "doc_1",
        name: "Purchase Agreement",
        description: "Signed contract between buyer and seller",
        status: "approved",
        submittedDate: "2026-01-15T14:30:00Z",
        submittedBy: "buyer",
      },
      {
        id: "doc_2",
        name: "Commercial Invoice",
        description: "Standard commercial invoice",
        status: "approved",
        submittedDate: "2026-01-15T15:00:00Z",
        submittedBy: "seller",
      },
      {
        id: "doc_3",
        name: "Bill of Lading",
        description: "Proof of shipment from carrier",
        status: "submitted",
        submittedDate: "2026-01-18T09:00:00Z",
        submittedBy: "seller",
      },
      {
        id: "doc_4",
        name: "Certificate of Origin",
        description: "Proof of manufacturing location",
        status: "pending",
        submittedBy: "seller",
      },
    ],
  },

  logistics: {
    carrier: "Maersk Logistics",
    trackingId: "MSK882910392",
    status: "in_transit",
    eta: "2026-01-25T18:00:00Z",
    checkpoints: [
      {
        date: "2026-01-20T14:15:00Z",
        location: "Port of Singapore",
        status: "Departed",
        description: "Vessel has departed from transshipment hub",
      },
      {
        date: "2026-01-19T08:30:00Z",
        location: "Port of Singapore",
        status: "Arrived",
        description: "Arrived at transshipment hub",
      },
      {
        date: "2026-01-18T10:00:00Z",
        location: "Shenzhen, CN",
        status: "Departed",
        description: "Departed from origin port",
      },
      {
        date: "2026-01-17T16:20:00Z",
        location: "Shenzhen, CN",
        status: "Pickup",
        description: "Cargo picked up from merchant warehouse",
      },
    ],
  },

  timeline: [
    {
      id: "evt_7",
      type: "logistic",
      title: "Shipment Departed Singapore",
      description: "Vessel departed from transshipment hub",
      timestamp: "2026-01-20T14:15:00Z",
      actor: "Maersk API",
    },
    {
      id: "evt_6",
      type: "financial",
      title: "Escrow Funds Secured",
      description: "Buyer deposit of $61,800.00 confirmed",
      timestamp: "2026-01-16T10:45:00Z",
      actor: "Stripe Connect",
    },
    {
      id: "evt_5",
      type: "system",
      title: "Compliance Check Passed",
      description: "Initial automated document scan passed",
      timestamp: "2026-01-15T15:05:00Z",
      actor: "System",
    },
    {
      id: "evt_4",
      type: "user",
      title: "Documents Submitted",
      description: "Seller uploaded Commercial Invoice",
      timestamp: "2026-01-15T15:00:00Z",
      actor: "Elena Rodriguez",
    },
    {
      id: "evt_3",
      type: "user",
      title: "Documents Submitted",
      description: "Buyer uploaded Purchase Agreement",
      timestamp: "2026-01-15T14:30:00Z",
      actor: "James Wilson",
    },
    {
      id: "evt_2",
      type: "admin",
      title: "Transaction Flagged",
      description: "Flagged for manual review (High Value > $50k)",
      timestamp: "2026-01-15T08:35:00Z",
      actor: "System Rule #42",
    },
    {
      id: "evt_1",
      type: "user",
      title: "Transaction Initiated",
      description: "Buyer started purchase process",
      timestamp: "2026-01-15T08:30:00Z",
      actor: "James Wilson",
    },
  ],

  admin: {
    riskScore: 25,
    notes: [
      {
        id: "note_1",
        author: "Sarah Admin",
        date: "2026-01-15T09:00:00Z",
        content:
          "Verified buyer identity manually. High value transaction approved for processing.",
      },
    ],
    overrides: [],
  },
};
