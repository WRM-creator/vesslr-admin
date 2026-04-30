/**
 * Trade term system.
 *
 * The canonical values come from the backend TradeTerm enum.
 * All metadata — labels, descriptions — lives in the TRADE_TERMS map below.
 */

export const TradeTerm = {
  FOB: "FOB",
  CIF: "CIF",
  CFR: "CFR",
  EX_WORKS: "EX_WORKS",
  DELIVERED: "DELIVERED",
  TTO: "TTO",
  TTT: "TTT",
  FOT: "FOT",
  FCA: "FCA",
  DAP: "DAP",
  DDP: "DDP",
  NA: "NA",
} as const;

export type TradeTermType = (typeof TradeTerm)[keyof typeof TradeTerm];

export const ALL_TRADE_TERM_VALUES = Object.values(TradeTerm);

interface TradeTermMeta {
  label: string;
  description: string;
}

export const TRADE_TERMS: Record<TradeTermType, TradeTermMeta> = {
  FOB: {
    label: "FOB (Free on Board)",
    description: "Seller delivers goods on board the vessel at the named port",
  },
  CIF: {
    label: "CIF (Cost, Insurance & Freight)",
    description: "Seller pays cost, insurance, and freight to destination port",
  },
  CFR: {
    label: "CFR (Cost & Freight)",
    description: "Seller pays cost and freight to destination port",
  },
  EX_WORKS: {
    label: "Ex Works",
    description: "Buyer assumes all risks from seller's premises",
  },
  DELIVERED: {
    label: "Delivered",
    description: "Seller delivers to agreed destination",
  },
  TTO: {
    label: "TTO (Tanker Take Over)",
    description: "Transfer at tanker",
  },
  TTT: {
    label: "TTT (Tanker to Tanker)",
    description: "Transfer between tankers",
  },
  FOT: {
    label: "FOT (Free on Truck)",
    description: "Seller delivers goods loaded on truck",
  },
  FCA: {
    label: "FCA (Free Carrier)",
    description: "Seller delivers to carrier at named place",
  },
  DAP: {
    label: "DAP (Delivered at Place)",
    description: "Seller delivers at destination, unloading by buyer",
  },
  DDP: {
    label: "DDP (Delivered Duty Paid)",
    description: "Seller delivers with all duties paid",
  },
  NA: {
    label: "N/A",
    description: "Not applicable (services, consultancy, IT, etc.)",
  },
};

export function getTradeTermLabel(
  term: string | null | undefined,
): string {
  if (!term) return "";
  return TRADE_TERMS[term as TradeTermType]?.label ?? term;
}
