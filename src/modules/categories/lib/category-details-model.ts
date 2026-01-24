export interface Category {
  id: string;
  type: "equipment-and-products" | "services";
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
    minSellerTrustScore: number;
    minBuyerTrustScore: number;
    geographicConstraints: {
      allowedSellerCountries: string[];
      allowedBuyerCountries: string[];
      restrictedDeliveryCountries: string[];
    };
  };
  transactionConfig: {
    allowedTransactionTypes: string[];
    minValue: number;
    maxValue: number;
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
    allowedProviders: string[];
  };
  risk: {
    baseRiskScore: number;
    manualReviewTriggers: string[];
    escalationRules: string[];
    disputeHandling: "standard" | "strict" | "expedited";
    minMerchantRiskScore: number;
    minCustomerRiskScore: number;
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
  id: "cat_commodities_001",
  type: "equipment-and-products",
  identity: {
    name: "Crude Oil & Petroleum Products",
    description:
      "Raw crude oil, refined petroleum products, and petrochemical feedstocks.",
    parentId: "Commodities",
    status: "active",
    tags: ["commodities", "hazardous", "regulated", "high-volume"],
  },
  eligibility: {
    allowedSellerTypes: [
      "Verified Producer",
      "National Oil Company",
      "Major Trader",
    ],
    allowedBuyerTypes: ["Refinery", "Distributor", "Strategic Reserve"],
    minSellerTrustScore: 90,
    minBuyerTrustScore: 85,
    geographicConstraints: {
      allowedSellerCountries: ["US", "SA", "AE", "NO", "NG", "BR"],
      allowedBuyerCountries: ["Global"],
      restrictedDeliveryCountries: ["KP", "IR", "SY"],
    },
  },
  transactionConfig: {
    allowedTransactionTypes: ["spot_trade", "bulk_supply", "contract"],
    minValue: 100000,
    maxValue: 500000000,
  },
  compliance: {
    documents: [
      { level: "product", name: "Safety Data Sheet (SDS)", required: true },
      { level: "product", name: "Certificate of Origin", required: true },
      {
        level: "product",
        name: "Quality Analysis Report (Assay)",
        required: true,
      },
      { level: "seller", name: "Export License", required: true },
      { level: "buyer", name: "Import License", required: true },
    ],
    validation: {
      expiryEnforced: true,
      requiredIssuer: "SGS / Intertek / BV",
    },
    reviewFlow: "hybrid",
  },
  logistics: {
    required: true,
    allowedProviders: [
      "Maersk",
      "DHL Global Forwarding",
      "Kuehne+Nagel",
      "MSC",
    ],
  },
  risk: {
    baseRiskScore: 65,
    manualReviewTriggers: ["Value > $5M", "New Route", "Sanctioned Proximity"],
    escalationRules: ["Compliance mismatch triggers immediate block"],
    disputeHandling: "strict",
    minMerchantRiskScore: 80,
    minCustomerRiskScore: 70,
  },
  runtime: {
    blockedActions: [
      "Instant Checkout",
      "Unverified Address",
      "Crypto Payment (above threshold)",
    ],
    requiredSteps: [
      "Compliance Check -> Contract Sign -> Escrow Fund -> Logistics Nominate",
    ],
    exampleFlow:
      "Seller Lists -> Buyer Bids -> KYC/AML Check -> Deal Agreed -> Operations",
  },
  audit: {
    changes: [
      {
        id: "evt_1",
        timestamp: "2024-01-15T10:00:00Z",
        actor: "Admin User",
        change: "Updated restricted countries list",
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
