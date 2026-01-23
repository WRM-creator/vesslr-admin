export interface CustomerDetails {
  id: string;

  // Overview
  overview: {
    name: string;
    avatar?: string;
    customerType: "business" | "individual";
    email: string;
    phone: string;
    memberSince: string; // ISO date
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

  // Business Information (If Type=Business)
  business?: {
    companyName: string;
    registrationNumber: string;
    taxId: string;
    country: string;
    countryCode: string; // e.g., "NG", "US"
    addresses: {
      type: "billing" | "shipping";
      line1: string;
      line2?: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    }[];
  };

  // Financials & Wallet (Buyer Specific)
  financials: {
    escrowBalance: number;
    currency: string;
    totalSpend: number;
    activePaymentMethods: {
      type: "card" | "bank_transfer" | "crypto";
      last4?: string;
      bankName?: string;
      isDefault: boolean;
    }[];
    lastPaymentDate: string;
  };

  // Compliance (KYC/KYB)
  compliance: {
    documents: {
      name: string;
      type: "id_card" | "passport" | "incorporation" | "utility_bill";
      status: "submitted" | "approved" | "missing" | "expired" | "rejected";
      submittedAt?: string;
      expiryDate?: string;
    }[];
    status: "compliant" | "review_needed" | "non_compliant";
  };

  // Transaction History (Buyer Perspective)
  transactions: {
    totalRequests: number;
    activeOrders: number;
    completedOrders: number;
    lastOrderDate: string;
    disputeCount: number;
  };

  // Activity & Signals
  activity: {
    lastLogin: string; // ISO date
    lastIp: string;
    deviceAttributes: string;
    riskSignals: {
      type: "ip_mismatch" | "velocity" | "new_device";
      detectedAt: string;
    }[];
  };

  // Admin / System (Internal Only)
  admin: {
    riskScore: number; // 0-100 (Higher is riskier)
    status: "active" | "suspended" | "banned";
    notes: {
      id: string;
      date: string;
      author: string;
      content: string;
    }[];
  };
}

export const MOCK_CUSTOMER_DETAILS: CustomerDetails = {
  id: "cus_01",
  overview: {
    name: "Michael Scott",
    customerType: "business",
    email: "michael.scott@dunder-mifflin.com",
    phone: "+1 (555) 0199-2831",
    memberSince: "2024-03-12T09:00:00Z",
  },
  trust: {
    verificationStatus: "verified",
    trustScore: 88,
    badges: ["Top Buyer", "kyb_verified"],
    warnings: [],
  },
  business: {
    companyName: "Dunder Mifflin Paper Company",
    registrationNumber: "RC-998877",
    taxId: "TIN-55443322",
    country: "United States",
    countryCode: "US",
    addresses: [
      {
        type: "billing",
        line1: "1725 Slough Avenue",
        city: "Scranton",
        state: "PA",
        country: "United States",
        postalCode: "18503",
      },
      {
        type: "shipping",
        line1: "1725 Slough Avenue",
        city: "Scranton",
        state: "PA",
        country: "United States",
        postalCode: "18503",
      },
    ],
  },
  financials: {
    escrowBalance: 25000.0,
    currency: "USD",
    totalSpend: 145000.0,
    activePaymentMethods: [
      {
        type: "bank_transfer",
        bankName: "Chase Business",
        last4: "9876",
        isDefault: true,
      },
      {
        type: "card",
        last4: "4242",
        isDefault: false,
      },
    ],
    lastPaymentDate: "2026-01-18T14:22:00Z",
  },
  compliance: {
    status: "compliant",
    documents: [
      {
        name: "Certificate of Incorporation",
        type: "incorporation",
        status: "approved",
        submittedAt: "2024-03-12T10:00:00Z",
      },
      {
        name: "Director ID (Michael Scott)",
        type: "passport",
        status: "approved",
        expiryDate: "2030-05-20T00:00:00Z",
      },
    ],
  },
  transactions: {
    totalRequests: 12,
    activeOrders: 2,
    completedOrders: 9,
    lastOrderDate: "2026-01-15T11:45:00Z",
    disputeCount: 0,
  },
  activity: {
    lastLogin: "2026-01-21T08:30:00Z",
    lastIp: "192.168.1.1",
    deviceAttributes: "MacBook Pro / Chrome 120",
    riskSignals: [],
  },
  admin: {
    riskScore: 12,
    status: "active",
    notes: [
      {
        id: "note_1",
        date: "2025-11-05T14:30:00Z",
        author: "Dwight Schrute",
        content:
          "Customer requested specific paper grade. Approved for bulk discount.",
      },
    ],
  },
};
