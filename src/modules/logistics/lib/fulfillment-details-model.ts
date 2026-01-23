export interface PartyInfo {
  id: string;
  name: string;
  role: "sender" | "recipient";
  companyName: string;
  email: string;
  phone: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Checkpoint {
  id: string;
  status: string; // "Departed Facility", "Arrived at Hub", etc.
  location: string;
  timestamp: string;
  description: string;
  icon?: "truck" | "plane" | "warehouse" | "package" | "alert";
}

export interface FulfillmentDetails {
  id: string; // Usually just the transaction ID for 1:1 mapping
  trackingNumber: string;
  carrier: string;
  carrierLogo?: string;
  serviceLevel: string; // "Express", "Standard", "Freight"

  status:
    | "pending"
    | "picked_up"
    | "in_transit"
    | "out_for_delivery"
    | "delivered"
    | "failed";
  eta: string;
  actualDelivery?: string;

  origin: Address;
  destination: Address;

  // Linked Entities
  transactionId: string;
  productId: string;
  productName: string;
  productThumbnail?: string;
  quantity: number;
  weight: string;
  dimensions?: string;

  // Parties
  sender: PartyInfo;
  recipient: PartyInfo;

  // Tracking
  checkpoints: Checkpoint[];
  currentLocation?: { lat: number; lng: number }; // For map placeholder

  // Risk/Alerts
  alerts: {
    type: "delay" | "damage" | "customs" | "address";
    message: string;
    severity: "low" | "medium" | "high";
    createdAt: string;
  }[];
}

export const MOCK_FULFILLMENT_DETAILS: FulfillmentDetails = {
  id: "LOG-5529-1102",
  trackingNumber: "DHL-9928371923",
  carrier: "DHL Express",
  carrierLogo: "https://logo.clearbit.com/dhl.com",
  serviceLevel: "Express Worldwide",
  status: "in_transit",
  eta: "2026-02-15T10:00:00Z",

  origin: {
    street: "123 Industrial Park",
    city: "Shenzhen",
    state: "Guangdong",
    zip: "518000",
    country: "China",
  },
  destination: {
    street: "456 Commerce Blvd",
    city: "Los Angeles",
    state: "CA",
    zip: "90001",
    country: "USA",
  },

  transactionId: "TRX-7829-4412",
  productId: "prod_123",
  productName: "Industrial Hydraulic Pumps (Model X-500)",
  productThumbnail: "https://ui.shadcn.com/placeholder.svg",
  quantity: 5,
  weight: "450 kg",
  dimensions: "120x80x100 cm",

  sender: {
    id: "merch_101",
    name: "Elena Rodriguez",
    role: "sender",
    companyName: "Acme Industries",
    email: "shipping@acme.com",
    phone: "+86 138 0000 0000",
  },
  recipient: {
    id: "cust_001",
    name: "James Wilson",
    role: "recipient",
    companyName: "Global Imports Ltd",
    email: "logistics@globalimports.com",
    phone: "+1 202 555 0123",
  },

  checkpoints: [
    {
      id: "cp_1",
      status: "Departed Facility",
      location: "Shenzhen, CN",
      timestamp: "2026-02-10T08:30:00Z",
      description: "Shipment has departed the origin facility.",
      icon: "truck",
    },
    {
      id: "cp_2",
      status: "Arrived at Hub",
      location: "Hong Kong, HK",
      timestamp: "2026-02-10T14:15:00Z",
      description: "Processed at export facility.",
      icon: "warehouse",
    },
    {
      id: "cp_3",
      status: "Customs Clearance",
      location: "Hong Kong, HK",
      timestamp: "2026-02-11T09:00:00Z",
      description: "International shipment release - Customs cleared.",
      icon: "package",
    },
    {
      id: "cp_4",
      status: "Departed Facility",
      location: "Hong Kong, HK",
      timestamp: "2026-02-11T12:00:00Z",
      description: "Departed transit hub.",
      icon: "plane",
    },
  ],

  alerts: [
    {
      type: "delay",
      message: "Weather delay at transit hub: Hong Kong",
      severity: "medium",
      createdAt: "2026-02-11T10:00:00Z",
    },
  ],
};
