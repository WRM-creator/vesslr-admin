export interface DisputeParty {
  id: string;
  name: string;
  subtext: string; // Company name or "Buyer"
  role: "claimant" | "respondent";
  side: "buyer" | "seller";
  trustScore: number;
  avatar?: string;
}

export interface DisputeAttachment {
  id: string;
  name: string;
  url: string;
  type: "image" | "document";
  size?: string;
}

export interface DisputeEvent {
  id: string;
  type: "evidence" | "comment" | "system";
  actor: string; // Name of person or "System"
  content: string; // Text content or file description
  timestamp: Date;
  attachments?: DisputeAttachment[];
  metadata?: {
    fileType?: "image" | "document";
    fileUrl?: string; // In real app, this would be a URL
  };
}

export interface Dispute {
  id: string;
  transactionId: string;
  status: "open" | "escalated" | "resolved";
  category: string;
  amount: number;
  currency: string;
  openedAt: Date;
  claimant: DisputeParty;
  respondent: DisputeParty;
  timeline: DisputeEvent[];
}

export const MOCK_DISPUTE: Dispute = {
  id: "DSP-2026-X92",
  transactionId: "TRX-7829-4412",
  status: "open",
  category: "Quality Mismatch",
  amount: 61800,
  currency: "USD",
  openedAt: new Date(Date.now() - 1000 * 60 * 60 * 52), // 52 hours ago
  claimant: {
    id: "usr_buyer_01",
    name: "James Wilson",
    subtext: "Dangote Refinery",
    role: "claimant",
    side: "buyer",
    trustScore: 92,
    avatar: "https://ui.shadcn.com/avatars/01.png",
  },
  respondent: {
    id: "usr_seller_01",
    name: "Elena Rodriguez",
    subtext: "Total Energies",
    role: "respondent",
    side: "seller",
    trustScore: 88,
    avatar: "https://ui.shadcn.com/avatars/04.png",
  },
  timeline: [
    {
      id: "evt_1",
      type: "system",
      actor: "System",
      content: "Dispute raised by Buyer: Quality Mismatch",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 52),
    },
    {
      id: "evt_2",
      type: "comment",
      actor: "James Wilson",
      content:
        "The shipment arrived this morning, but upon inspection, 30% of the crates show signs of water damage. The product inside is compromised.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 51.5),
    },
    {
      id: "evt_3",
      type: "evidence",
      actor: "James Wilson",
      content: "Photo of water damaged crates.jpg",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 51.4),
      metadata: { fileType: "image" },
      attachments: [
        {
          id: "att_1",
          name: "water-damage-01.jpg",
          url: "#",
          type: "image",
          size: "2.4 MB",
        },
        {
          id: "att_2",
          name: "water-damage-02.jpg",
          url: "#",
          type: "image",
          size: "3.1 MB",
        },
      ],
    },
    {
      id: "evt_4",
      type: "comment",
      actor: "Elena Rodriguez",
      content:
        "We inspected all crates before loading and they were in perfect condition. The Bill of Lading shows clean on board. This damage must have happened during transit.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      attachments: [
        {
          id: "att_3",
          name: "bill-of-lading.pdf",
          url: "#",
          type: "document",
          size: "156 KB",
        },
      ],
    },
  ],
};
