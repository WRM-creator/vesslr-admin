export interface MerchantDetails {
  id: string;

  // Overview
  overview: {
    companyName: string;
    logo?: string;
    merchantType: "seller" | "buyer" | "both";
    shortDescription: string;
    yearEstablished: number;
  };

  // Trust & Verification
  trust: {
    verificationStatus: "verified" | "pending" | "unverified";
    trustScore: number; // 0-100
    badges: string[];
    warnings: {
      id: string;
      message: string;
      severity: "info" | "warning" | "critical";
    }[];
  };

  // Business Information
  business: {
    registeredName: string;
    country: string;
    countryCode: string;
    city: string;
    contactEnabled: boolean;
  };

  // Compliance
  compliance: {
    documents: {
      name: string;
      status: "submitted" | "approved" | "missing" | "expired";
      expiryDate?: string;
    }[];
    approvedCategories: string[];
    lastReviewDate: string;
  };

  // Products & Capabilities
  products: {
    activeListings: number;
    categories: string[];
    typicalOrderSize: "small" | "medium" | "large" | "enterprise";
    availability: "available" | "limited" | "unavailable";
  };

  // Transaction History
  transactions: {
    completed: number;
    ongoing: number;
    completionRate: number; // 0-100
    disputeCount: number;
  };

  // Logistics & Fulfillment
  logistics?: {
    deliveryMethods: string[];
    regionsServed: string[];
    reliabilityScore: number; // 0-100
  };

  // Activity & Signals
  activity: {
    lastActive: string; // ISO date
    avgResponseTime: string; // e.g., "< 4 hours"
    activityLevel: "low" | "medium" | "high";
  };

  // Admin / System (Internal Only)
  admin: {
    riskScore: number; // 0-100
    notes: {
      id: string;
      date: string;
      author: string;
      content: string;
    }[];
    overrides: {
      field: string;
      originalValue: string;
      overrideValue: string;
      reason: string;
    }[];
    auditTrailUrl: string;
  };
}

export const MOCK_MERCHANT_DETAILS: MerchantDetails = {
  id: "mer_01",
  overview: {
    companyName: "Acme Industries Ltd",
    logo: "/merchants/acme-logo.png",
    merchantType: "both",
    shortDescription:
      "Leading industrial chemicals supplier serving West Africa and Europe since 2018.",
    yearEstablished: 2018,
  },
  trust: {
    verificationStatus: "verified",
    trustScore: 85,
    badges: ["KYC Completed", "Compliance-Ready", "Preferred Seller"],
    warnings: [],
  },
  business: {
    registeredName: "Acme Industries Limited",
    country: "Nigeria",
    countryCode: "NG",
    city: "Lagos",
    contactEnabled: true,
  },
  compliance: {
    documents: [
      { name: "Business Registration", status: "approved" },
      { name: "Tax Certificate", status: "approved" },
      { name: "Export License", status: "submitted" },
    ],
    approvedCategories: ["Industrial Chemicals", "Plastics"],
    lastReviewDate: "2026-01-15T10:00:00Z",
  },
  products: {
    activeListings: 47,
    categories: ["Industrial Chemicals", "Plastics", "Machinery Parts"],
    typicalOrderSize: "large",
    availability: "available",
  },
  transactions: {
    completed: 342,
    ongoing: 8,
    completionRate: 96.2,
    disputeCount: 3,
  },
  logistics: {
    deliveryMethods: ["Vessel", "Truck"],
    regionsServed: ["West Africa", "Europe", "North America"],
    reliabilityScore: 94,
  },
  activity: {
    lastActive: "2026-01-21T12:30:00Z",
    avgResponseTime: "< 4 hours",
    activityLevel: "high",
  },
  admin: {
    riskScore: 28,
    notes: [
      {
        id: "note_1",
        date: "2026-01-15T10:00:00Z",
        author: "Admin User",
        content: "Merchant passed enhanced due diligence review.",
      },
    ],
    overrides: [],
    auditTrailUrl: "/admin/audit/mer_01",
  },
};
