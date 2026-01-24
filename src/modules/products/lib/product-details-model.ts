export interface ProductDetails {
  id: string;

  // Overview
  overview: {
    name: string;
    images: string[];
    thumbnail: string;
    status:
      | "active"
      | "draft"
      | "reserved"
      | "in_transaction"
      | "fulfilled"
      | "suspended"
      | "pending_approval";
    transactionType: "buy" | "lease" | "rental" | "auction" | "charter";
    price: number;
    currency: string;
    created: string; // ISO date
    lastUpdated: string; // ISO date
  };

  // Specifications
  specs: {
    description: string;
    sku?: string;
    condition: "new" | "used" | "refurbished";
    brand?: string;
    model?: string;
    inventory: {
      total: number;
      available: number;
      reserved: number;
      sold: number;
    };
    attributes: {
      key: string;
      value: string;
    }[];
  };

  // Merchant Information
  merchant: {
    id: string;
    name: string;
    logo?: string;
    trustScore: number;
    verificationStatus: "verified" | "pending" | "unverified";
  };

  // Category & Compliance
  compliance: {
    categoryId: string;
    categoryName: string;
    categoryPath: string[]; // e.g. ["Electronics", "Computers"]
    rules: {
      name: string;
      description: string;
      criticality: "high" | "medium" | "low";
    }[];
    documents: {
      name: string;
      status: "submitted" | "approved" | "missing" | "expired" | "rejected";
      required: boolean;
      expiryDate?: string;
    }[];
  };

  // Transaction History
  transactions: {
    totalCount: number;
    completedCount: number;
    activeCount: number;
    history: {
      id: string;
      type: string;
      buyer: string;
      status: string;
      date: string;
      value: number;
      currency: string;
    }[];
  };

  // Logistics (If currently active/in-transit related)
  logistics?: {
    shippingStatus: "processing" | "shipped" | "delivered" | "returned";
    carrier?: string;
    trackingId?: string;
    estimatedDelivery?: string;
    origin: string;
    destination?: string; // If assigned to a transaction
  };

  // Activity & Signals
  activity: {
    views: number;
    inquiries: number;
    lastViewed: string; // ISO date
    riskSignals: {
      type: "price_anomaly" | "velocity" | "description_match";
      detectedAt: string;
      severity: "low" | "medium" | "high";
    }[];
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
    flags: {
      id: string;
      reason: string;
      raisedBy: string;
      status: "open" | "resolved";
      date: string;
    }[];
  };
}

export const MOCK_PRODUCT_DETAILS: ProductDetails = {
  id: "prod_01",
  overview: {
    name: "Industrial Generator 500kVA",
    thumbnail: "/products/gen-thumb.png",
    images: ["/products/gen-1.png", "/products/gen-2.png"],
    status: "active",
    transactionType: "buy",
    price: 45000.0,
    currency: "USD",
    created: "2024-02-15T10:00:00Z",
    lastUpdated: "2024-03-20T14:30:00Z",
  },
  specs: {
    description:
      "Heavy-duty diesel generator suitable for industrial applications. Low hours, regularly serviced.",
    sku: "GEN-500-CAT",
    condition: "used",
    brand: "Caterpillar",
    model: "C15",
    inventory: {
      total: 5,
      available: 3,
      reserved: 1,
      sold: 1,
    },
    attributes: [
      { key: "Power Output", value: "500 kVA" },
      { key: "Fuel Type", value: "Diesel" },
      { key: "Year", value: "2019" },
      { key: "Hours", value: "1250" },
    ],
  },
  merchant: {
    id: "mer_01",
    name: "Acme Heavy Machinery",
    trustScore: 88,
    verificationStatus: "verified",
  },
  compliance: {
    categoryId: "cat_heavy_machinery",
    categoryName: "Heavy Machinery",
    categoryPath: ["Industrial", "Heavy Machinery", "Power Generation"],
    rules: [
      {
        name: "Export Control",
        description: "Requires export license for international sales",
        criticality: "high",
      },
    ],
    documents: [
      {
        name: "Ownership Certificate",
        status: "approved",
        required: true,
      },
      {
        name: "Service History Log",
        status: "submitted",
        required: true,
      },
      {
        name: "Emissions Certificate",
        status: "missing",
        required: false,
      },
    ],
  },
  transactions: {
    totalCount: 3,
    completedCount: 1,
    activeCount: 1,
    history: [
      {
        id: "tx_123",
        type: "Purchase",
        buyer: "Global Construction Ltd",
        status: "completed",
        date: "2024-01-10",
        value: 44000.0,
        currency: "USD",
      },
      {
        id: "tx_124",
        type: "Lease",
        buyer: "BuildRight Inc",
        status: "active",
        date: "2024-03-15",
        value: 2500.0,
        currency: "USD",
      },
    ],
  },
  activity: {
    views: 1250,
    inquiries: 12,
    lastViewed: "2026-01-21T13:45:00Z",
    riskSignals: [
      {
        type: "price_anomaly",
        detectedAt: "2024-02-16T10:00:00Z",
        severity: "low",
      },
    ],
  },
  admin: {
    riskScore: 15,
    notes: [
      {
        id: "note_1",
        date: "2024-02-18T09:00:00Z",
        author: "Admin User",
        content: "Verified serial numbers against manufacturer database.",
      },
    ],
    flags: [],
  },
};
