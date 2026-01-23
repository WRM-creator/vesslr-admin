export interface PartyInfo {
  id: string;
  name: string;
  role: "buyer" | "seller";
  companyName: string;
  avatar?: string;
  trustScore: number;
  verificationStatus: "verified" | "pending" | "unverified";
  profileUrl: string;
}

export interface EvidenceItem {
  id: string;
  submittedBy: "claimant" | "respondent";
  title: string;
  description: string;
  fileUrl?: string; // Image or PDF
  fileType?: "image" | "document" | "video";
  submittedAt: string;
}

export interface TimelineEvent {
  id: string;
  type: "system" | "message" | "evidence" | "admin";
  title: string;
  description?: string;
  timestamp: string;
  actor?: string;
  actorRole?: "claimant" | "respondent" | "admin" | "system";
}

export interface Resolution {
  outcome: "favor_claimant" | "favor_respondent" | "split" | "dismissed";
  adminNotes: string;
  resolvedAt: string;
  resolvedBy: string;
  refundAmount?: number;
}

export interface DisputeDetails {
  id: string;
  status: "open" | "under_review" | "resolved" | "escalated" | "closed";
  reason: string;
  description: string;
  amountInDispute: number;
  currency: string;
  createdAt: string;
  updatedAt: string;

  // Linked Entities
  transactionId: string;
  transactionType: string;
  escrowId?: string; // If funds are held
  escrowStatus?: string;
  productId: string;
  productName: string;
  productThumbnail?: string;

  // Parties
  claimant: PartyInfo; // The one complaining
  respondent: PartyInfo; // The one defending

  // Evidence
  evidence: EvidenceItem[];

  // Timeline/Chat
  timeline: TimelineEvent[];

  // Resolution
  resolution?: Resolution;
}

export const MOCK_DISPUTE_DETAILS: DisputeDetails = {
  id: "DSP-3921-8842",
  status: "under_review",
  reason: "Item Significantly Not As Described",
  description:
    "The industrial pumps delivered are Model X-400s, but the contract explicitly specified Model X-500s. The flow rate is insufficient for our facility, rendering them useless for the intended purpose.",
  amountInDispute: 61800,
  currency: "USD",
  createdAt: "2026-01-20T09:30:00Z",
  updatedAt: "2026-01-21T14:15:00Z",

  transactionId: "TRX-7829-4412",
  transactionType: "Purchase",
  escrowId: "ESC-9928-1102",
  escrowStatus: "dispute_hold",

  productId: "prod_123",
  productName: "Industrial Hydraulic Pumps (Model X-500)",
  productThumbnail: "https://ui.shadcn.com/placeholder.svg", // Placeholder

  claimant: {
    id: "usr_buyer_01",
    name: "James Wilson",
    role: "buyer",
    companyName: "Global Imports Ltd",
    trustScore: 92,
    verificationStatus: "verified",
    profileUrl: "/customers/usr_buyer_01",
    avatar: "https://ui.shadcn.com/avatars/01.png",
  },

  respondent: {
    id: "usr_seller_01",
    name: "Elena Rodriguez",
    role: "seller",
    companyName: "Acme Industries",
    trustScore: 88,
    verificationStatus: "verified",
    profileUrl: "/merchants/usr_seller_01",
    avatar: "https://ui.shadcn.com/avatars/04.png",
  },

  evidence: [
    {
      id: "ev_1",
      submittedBy: "claimant",
      title: "Photo of Delivered Item Nameplate",
      description: "Clearly shows 'Model X-400' stamped on the serial plate.",
      fileUrl: "https://ui.shadcn.com/placeholder.svg",
      fileType: "image",
      submittedAt: "2026-01-20T09:35:00Z",
    },
    {
      id: "ev_2",
      submittedBy: "claimant",
      title: "Original Purchase Order",
      description: "PDF copy of the signed PO specifying Model X-500.",
      fileUrl: "#",
      fileType: "document",
      submittedAt: "2026-01-20T09:35:00Z",
    },
    {
      id: "ev_3",
      submittedBy: "respondent",
      title: "Warehouse Picking Log",
      description:
        "Our internal logs show X-500s were picked. We believe the wrong nameplates might have been attached by the manufacturer.",
      fileUrl: "#",
      fileType: "document",
      submittedAt: "2026-01-20T14:30:00Z",
    },
  ],

  timeline: [
    {
      id: "evt_3",
      type: "message",
      title: "Respondent Replied",
      description:
        "We are investigating this with our warehouse team immediately.",
      timestamp: "2026-01-20T14:30:00Z",
      actor: "Elena Rodriguez",
      actorRole: "respondent",
    },
    {
      id: "evt_2",
      type: "admin",
      title: "Dispute Escalated",
      description: "Escalated to admin review due to high value (> $50k).",
      timestamp: "2026-01-20T10:00:00Z",
      actor: "System Rule #12",
      actorRole: "system",
    },
    {
      id: "evt_1",
      type: "system",
      title: "Dispute Opened",
      description:
        "James Wilson opened a dispute for 'Item Significantly Not As Described'.",
      timestamp: "2026-01-20T09:30:00Z",
      actor: "James Wilson",
      actorRole: "claimant",
    },
  ],
};
