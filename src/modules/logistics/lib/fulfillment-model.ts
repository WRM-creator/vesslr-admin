export type LogisticsState =
  | "pending"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed";

export type EscrowState =
  | "held"
  | "pending_release"
  | "released"
  | "refunded"
  | "disputed";

export type ComplianceStatus = "compliant" | "review_required" | "flagged";

export type AlertType =
  | "delay"
  | "damage_reported"
  | "customs_hold"
  | "address_issue"
  | "high_value";

export interface Fulfillment {
  transactionId: string;
  buyer: {
    name: string;
    id: string;
  };
  seller: {
    name: string;
    id: string;
  };
  category: {
    name: string;
    riskLevel: "low" | "medium" | "high";
  };
  logisticsState: LogisticsState;
  carrier: string;
  eta: string; // ISO date string
  actualDelivery: string | null; // ISO date string or null if not delivered
  escrowState: EscrowState;
  complianceStatus: ComplianceStatus;
  alerts: AlertType[];
}

export const MOCK_FULFILLMENTS: Fulfillment[] = [
  {
    transactionId: "txn_88s9d7",
    buyer: { name: "Dangote Refinery", id: "cust_001" },
    seller: { name: "Shell Nigeria Ltd", id: "merch_101" },
    category: { name: "Crude Oil", riskLevel: "high" },
    logisticsState: "in_transit",
    carrier: "Maersk Tankers",
    eta: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days from now
    actualDelivery: null,
    escrowState: "held",
    complianceStatus: "compliant",
    alerts: [],
  },
  {
    transactionId: "txn_99d1a2",
    buyer: { name: "NNPC Trading", id: "cust_002" },
    seller: { name: "TotalEnergies Nigeria", id: "merch_102" },
    category: { name: "Refined Petroleum", riskLevel: "high" },
    logisticsState: "delivered",
    carrier: "Stena Bulk",
    eta: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
    actualDelivery: new Date(
      Date.now() - 1000 * 60 * 60 * 24 * 2,
    ).toISOString(), // 2 days ago (early)
    escrowState: "pending_release",
    complianceStatus: "compliant",
    alerts: [],
  },
  {
    transactionId: "txn_77c3b4",
    buyer: { name: "Petrolex Oil & Gas", id: "cust_003" },
    seller: { name: "Chevron Nigeria", id: "merch_103" },
    category: { name: "Natural Gas", riskLevel: "high" },
    logisticsState: "out_for_delivery",
    carrier: "Teekay LNG",
    eta: new Date(Date.now()).toISOString(), // today
    actualDelivery: null,
    escrowState: "held",
    complianceStatus: "review_required",
    alerts: ["high_value"],
  },
  {
    transactionId: "txn_66e4f5",
    buyer: { name: "Oando Energy", id: "cust_004" },
    seller: { name: "ExxonMobil Nigeria", id: "merch_104" },
    category: { name: "Lubricants", riskLevel: "medium" },
    logisticsState: "failed",
    carrier: "Hapag-Lloyd",
    eta: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    actualDelivery: null,
    escrowState: "disputed",
    complianceStatus: "flagged",
    alerts: ["address_issue", "delay"],
  },
  {
    transactionId: "txn_55g6h7",
    buyer: { name: "MRS Oil Nigeria", id: "cust_005" },
    seller: { name: "Seplat Energy", id: "merch_105" },
    category: { name: "Drilling Equipment", riskLevel: "medium" },
    logisticsState: "picked_up",
    carrier: "MSC Shipping",
    eta: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days from now
    actualDelivery: null,
    escrowState: "held",
    complianceStatus: "compliant",
    alerts: [],
  },
  {
    transactionId: "txn_44h8i9",
    buyer: { name: "Conoil Producing", id: "cust_006" },
    seller: { name: "Addax Petroleum", id: "merch_106" },
    category: { name: "Petrochemicals", riskLevel: "high" },
    logisticsState: "in_transit",
    carrier: "Euronav Tankers",
    eta: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days from now
    actualDelivery: null,
    escrowState: "held",
    complianceStatus: "review_required",
    alerts: ["customs_hold", "high_value"],
  },
  {
    transactionId: "txn_33j0k1",
    buyer: { name: "Niger Delta Petroleum", id: "cust_007" },
    seller: { name: "Agip Oil Company", id: "merch_107" },
    category: { name: "Marine Fuel", riskLevel: "medium" },
    logisticsState: "delivered",
    carrier: "BW Group",
    eta: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
    actualDelivery: new Date(
      Date.now() - 1000 * 60 * 60 * 24 * 3,
    ).toISOString(), // 3 days ago (late)
    escrowState: "released",
    complianceStatus: "compliant",
    alerts: ["delay"],
  },
  {
    transactionId: "txn_22l2m3",
    buyer: { name: "Sahara Energy", id: "cust_008" },
    seller: { name: "Pan Ocean Oil", id: "merch_108" },
    category: { name: "Aviation Fuel", riskLevel: "high" },
    logisticsState: "pending",
    carrier: "Frontline Tankers",
    eta: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days from now
    actualDelivery: null,
    escrowState: "held",
    complianceStatus: "compliant",
    alerts: [],
  },
];
