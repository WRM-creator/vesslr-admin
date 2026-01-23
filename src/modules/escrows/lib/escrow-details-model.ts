export interface PartyInfo {
  id: string;
  name: string;
  companyName: string;
  avatar?: string;
  trustScore: number;
  verificationStatus: "verified" | "pending" | "unverified";
  profileUrl: string;
}

export interface TransactionReference {
  id: string;
  type: string;
  state: string;
}

export interface ReleaseCondition {
  id: string;
  description: string;
  status: "pending" | "met" | "waived";
  metAt?: string;
}

export interface DisputeReference {
  id: string;
  status: "open" | "resolved" | "escalated" | "closed";
  category: string;
  raisedBy: "merchant" | "customer";
  reason: string;
}

export interface TimelineEvent {
  id: string;
  type: "system" | "user" | "admin" | "financial";
  title: string;
  description?: string;
  timestamp: string;
  actor?: string;
}

export interface AdminNote {
  id: string;
  author: string;
  date: string;
  content: string;
}

export interface AdminOverride {
  date: string;
  admin: string;
  action: string;
  reason: string;
}

export interface EscrowDetails {
  id: string;
  status:
    | "pending"
    | "funded"
    | "ready_for_release"
    | "released"
    | "disputed"
    | "dispute_hold"
    | "refunded";
  createdAt: string;

  // Financial
  amountSecured: number;
  currency: string;
  subtotal: number;
  platformFee: number;
  escrowFee: number;
  tax: number;
  depositDate?: string;
  releaseDate?: string;

  // Linked entities
  transaction: TransactionReference;
  merchant: PartyInfo;
  customer: PartyInfo;

  // Conditions
  releaseConditions: ReleaseCondition[];

  // Dispute (if any)
  dispute?: DisputeReference;

  // Risk & Admin
  riskFlags: string[];
  riskScore: number;
  timeline: TimelineEvent[];
  adminNotes: AdminNote[];
  overrides: AdminOverride[];
}

export const MOCK_ESCROW_DETAILS: EscrowDetails = {
  id: "ESC-9928-1102",
  status: "ready_for_release",
  createdAt: "2026-01-15T08:30:00Z",

  amountSecured: 61800,
  currency: "USD",
  subtotal: 60000,
  platformFee: 1200,
  escrowFee: 600,
  tax: 0,
  depositDate: "2026-01-16T10:45:00Z",
  releaseDate: "2026-01-25T18:00:00Z",

  transaction: {
    id: "TRX-7829-4412",
    type: "purchase",
    state: "in_transit",
  },

  merchant: {
    id: "usr_seller_01",
    name: "Elena Rodriguez",
    companyName: "Acme Industries",
    trustScore: 88,
    verificationStatus: "verified",
    profileUrl: "/merchants/usr_seller_01",
    avatar: "https://ui.shadcn.com/avatars/04.png",
  },

  customer: {
    id: "usr_buyer_01",
    name: "James Wilson",
    companyName: "Global Imports Ltd",
    trustScore: 92,
    verificationStatus: "verified",
    profileUrl: "/customers/usr_buyer_01",
    avatar: "https://ui.shadcn.com/avatars/01.png",
  },

  releaseConditions: [
    {
      id: "cond_1",
      description: "Delivery confirmation by carrier",
      status: "met",
      metAt: "2026-01-20T14:15:00Z",
    },
    {
      id: "cond_2",
      description: "Buyer inspection period (48h) elapsed",
      status: "pending",
    },
    {
      id: "cond_3",
      description: "No active disputes",
      status: "met",
      metAt: "2026-01-15T08:30:00Z",
    },
  ],

  riskFlags: ["high_value"],
  riskScore: 25,

  timeline: [
    {
      id: "evt_3",
      type: "system",
      title: "Release Condition Met",
      description: "Carrier confirmed delivery to port",
      timestamp: "2026-01-20T14:15:00Z",
      actor: "System",
    },
    {
      id: "evt_2",
      type: "financial",
      title: "Funds Secured",
      description: "Buyer deposit of $61,800.00 confirmed",
      timestamp: "2026-01-16T10:45:00Z",
      actor: "Stripe Connect",
    },
    {
      id: "evt_1",
      type: "system",
      title: "Escrow Created",
      description: "Escrow container initialized for transaction",
      timestamp: "2026-01-15T08:30:00Z",
      actor: "System",
    },
  ],

  adminNotes: [
    {
      id: "note_1",
      author: "Sarah Admin",
      date: "2026-01-16T09:00:00Z",
      content:
        "High value transaction verified. Funds source confirmed via bank wire.",
    },
  ],

  overrides: [],
};
