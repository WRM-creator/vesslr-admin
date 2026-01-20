export interface Category {
  id: string;
  identity: {
    name: string;
    description: string;
    parentId?: string;
    status: "active" | "deprecated" | "draft";
    tags: string[];
  };
  eligibility: {
    allowedSellerTypes: string[];
    allowedBuyerTypes: string[];
    minTrustScore: number;
    geographicConstraints: {
      allowedSellerCountries: string[];
      allowedBuyerCountries: string[];
      restrictedDeliveryCountries: string[];
    };
  };
  transactionConfig: {
    allowedTransactionTypes: string[];
    escrow: {
      required: boolean;
      structure: "full" | "milestone" | "partial";
    };
    minValue: number;
    maxValue: number;
    tradingType: "spot" | "contract" | "both";
  };
  compliance: {
    documents: {
      level: "product" | "seller" | "buyer";
      name: string;
      required: boolean;
    }[];
    validation: {
      expiryEnforced: boolean;
      requiredIssuer?: string;
    };
    reviewFlow: "automated" | "manual" | "hybrid";
  };
  logistics: {
    required: boolean;
    allowedModes: string[];
    trackingMethod: string[];
    deliveryConfirmation: string[];
  };
  risk: {
    baseRiskScore: number;
    manualReviewTriggers: string[];
    escalationRules: string[];
    disputeHandling: "standard" | "strict" | "expedited";
  };
  runtime: {
    blockedActions: string[];
    requiredSteps: string[];
    exampleFlow: string;
  };
  audit: {
    changes: {
      id: string;
      timestamp: string;
      actor: string;
      change: string;
      reason: string;
    }[];
  };
}

export const MOCK_CATEGORY_DATA: Category = {
  id: "cat_123",
  identity: {
    name: "Industrial Chemicals",
    description: "Raw chemical materials for industrial manufacturing processes.",
    parentId: "Chemicals & Plastics",
    status: "active",
    tags: ["hazardous", "industrial", "regulated"],
  },
  eligibility: {
    allowedSellerTypes: ["Verified Manufacturer", "Authorized Distributor"],
    allowedBuyerTypes: ["Industrial Enterprise", "Verified Processor"],
    minTrustScore: 85,
    geographicConstraints: {
      allowedSellerCountries: ["US", "DE", "CN", "JP"],
      allowedBuyerCountries: ["Global"],
      restrictedDeliveryCountries: ["KP", "IR", "SY"],
    },
  },
  transactionConfig: {
    allowedTransactionTypes: ["purchase", "bulk supply"],
    escrow: {
      required: true,
      structure: "milestone",
    },
    minValue: 5000,
    maxValue: 1000000,
    tradingType: "contract",
  },
  compliance: {
    documents: [
      { level: "product", name: "Safety Data Sheet (SDS)", required: true },
      { level: "product", name: "Certificate of Analysis", required: true },
      { level: "seller", name: "Export License", required: true },
    ],
    validation: {
      expiryEnforced: true,
      requiredIssuer: "ISO Accredited Body",
    },
    reviewFlow: "hybrid",
  },
  logistics: {
    required: true,
    allowedModes: ["vessel", "truck", "rail"],
    trackingMethod: ["GPS Real-time", "Checkpoint Scanning"],
    deliveryConfirmation: ["Bill of Lading", "Proof of Delivery (Digital)"],
  },
  risk: {
    baseRiskScore: 75,
    manualReviewTriggers: ["Value > $500k", "New Route"],
    escalationRules: ["Compliance mismatch triggers immediate block"],
    disputeHandling: "strict",
  },
  runtime: {
    blockedActions: ["Instant Checkout", "Unverified Address"],
    requiredSteps: ["Compliance Check -> Escrow Fund -> Logistics Book"],
    exampleFlow: "Seller lists -> Buyer Requests -> Auto Compliance Check -> Manual Review -> Approved",
  },
  audit: {
    changes: [
      {
        id: "evt_1",
        timestamp: "2024-01-15T10:00:00Z",
        actor: "Admin User",
        change: "Increased min trust score to 85",
        reason: "Compliance policy update Q1",
      },
      {
        id: "evt_2",
        timestamp: "2024-01-10T14:30:00Z",
        actor: "System",
        change: "Category Activated",
        reason: "Initial setup complete",
      },
    ],
  },
};
